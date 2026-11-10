export type Px = number | (() => number);
export type HeaderInput =
  | string
  | Element
  | ArrayLike<Element>
  | null
  | undefined;

export interface StickySidebarOptions {
  /**
   * Sticky/fixed header element(s), or a selector (all matches are used).
   * The sidebar sits under the lowest visible bottom edge among them and
   * follows them live while they slide, collapse or resize.
   */
  header?: HeaderInput;
  /** Extra space under the header (or viewport top). px or getter. Default 0. */
  offsetTop?: Px;
  /** Extra space above the viewport bottom. px or getter. Default 0. */
  offsetBottom?: Px;
  /** Gap on both edges, px. Default 16. */
  gap?: number;
  /** Only active while this media query matches, e.g. `(min-width: 768px)`. */
  media?: string;
  /** Scrolling element (default: the window). */
  scroller?: Element | string | null;
  /**
   * Hook into an external store that drives the header offset.
   * Call `update` whenever it changes; return an unsubscribe function.
   */
  subscribe?: (update: () => void) => void | (() => void);
}

export interface StickySidebar {
  readonly element: HTMLElement;
  /** Recalculate now (sync). */
  update(): void;
  /** Re-query header selectors / scroller and restart. */
  refresh(): void;
  /** Replace options. */
  setOptions(options: StickySidebarOptions): void;
  /** Remove listeners and restore inline styles. */
  destroy(): void;
}

const TOP = 0;
const DOWN = 1;
const BOTTOM = 2;
const UP = 3;
const EPS = 0.5;
const SETTLE_FRAMES = 3;
const STRUCTURAL = ["header", "media", "scroller", "subscribe"] as const;
const PROPS = [
  "position",
  "top",
  "bottom",
  "marginTop",
  "marginBottom",
  "alignSelf",
  "overflowAnchor",
] as const;

export const px = (v: Px | undefined): number =>
  (typeof v === "function" ? v() : v) || 0;
const fmt = (v: number) => `${Math.round(v * 100) / 100}px`;

function query<T extends Element>(v: T | string | null | undefined): T | null {
  return typeof v === "string"
    ? document.querySelector<T>(v as string)
    : (v ?? null);
}

function toElements(h: HeaderInput): Element[] {
  if (!h) return [];
  if (typeof h === "string") return [...document.querySelectorAll(h)];
  return h instanceof Element ? [h] : Array.from(h);
}

const warn = (msg: string, ...rest: unknown[]) =>
  console.warn(`[dynamic-sticky-sidebar] ${msg}`, ...rest);
const rect = (e: Element) => e.getBoundingClientRect();

const finiteRunning = (a: Animation) =>
  a.playState === "running" && a.effect?.getTiming().iterations !== Infinity;

/**
 * Makes `target` a two-way sticky sidebar.
 *
 * @example
 * const sidebar = stickySidebar('#sidebar', { header: '.site-header', media: '(min-width: 768px)' });
 * sidebar.destroy();
 */
export function stickySidebar(
  target: HTMLElement | string,
  options: StickySidebarOptions = {},
): StickySidebar {
  const el = query<HTMLElement>(target);
  if (!el)
    throw new Error(
      `[dynamic-sticky-sidebar] sidebar element not found: ${String(target)}`,
    );

  const s = el.style;
  const saved = PROPS.map((p) => s[p]);
  const restore = (from: number, to: number) => {
    for (let i = from; i < to; i++) s[PROPS[i]] = saved[i];
  };

  let opts = options;
  let headers: Element[] = [];
  let scroller: Element | null = null;
  let mql: MediaQueryList | null = null;
  let unsubscribe: void | (() => void);
  let on = false;

  let state = TOP;
  let shifted = false;
  let native = true;
  let up = 0;
  let warned = false;
  let lastScroll = 0;
  let lastMax = NaN;
  let lastH = 0;
  let curTop = "";
  let curBottom = "";
  let frame = 0;
  let idle = 0;

  const ro = new ResizeObserver(() => schedule());
  const mo = new MutationObserver(() => sync());

  const scrollPos = () => (scroller ? scroller.scrollTop : scrollY);

  function write(top: string, bottom: string) {
    if (top !== curTop) s.top = curTop = top;
    if (bottom !== curBottom) s.bottom = curBottom = bottom;
  }

  function unshift() {
    shifted = false;
    restore(3, 6);
  }

  function settle(next: number) {
    state = next;
    if (shifted) unshift();
  }

  function release(next: number, y: number, vpTop: number) {
    state = next;
    s.top = s.bottom = curTop = curBottom = "auto";
    if (shifted) unshift();
    if (next === UP && !native) {
      up = y;
      return;
    }
    if (next === UP) s.alignSelf = "flex-end";
    const cs = getComputedStyle(el!);
    const natural = rect(el!).top - vpTop;
    const add = next === UP ? natural - y : y - natural;
    const side = next === UP ? "marginBottom" : "marginTop";
    if (add > 0.01) s[side] = `${(parseFloat(cs[side]) || 0) + add}px`;
    shifted = true;
  }

  function update(): boolean {
    if (!on) return false;
    const h = el!.offsetHeight;
    if (!h) return false;

    let vpTop = 0;
    let vh: number;
    if (scroller) {
      vpTop = rect(scroller).top + scroller.clientTop;
      vh = scroller.clientHeight;
    } else {
      vh = Math.min(innerHeight, document.documentElement.clientHeight);
    }

    const pos = scrollPos();
    const delta = pos - lastScroll;
    lastScroll = pos;

    let head = 0;
    for (const x of headers) {
      const r = rect(x);
      if (r.height && r.bottom - vpTop > head) head = r.bottom - vpTop;
    }

    const gap = opts.gap ?? 16;
    const max = head + px(opts.offsetTop) + gap; // top edge when pinned under the header
    const min = Math.min(max, vh - h - px(opts.offsetBottom) - gap); // top edge when bottom-aligned
    const moving = Math.abs(max - lastMax) > 0.01;
    const resized = h !== lastH;
    lastMax = max;
    lastH = h;

    if (max - min < 1) {
      settle(TOP);
    } else {
      const y = rect(el!).top - vpTop;
      if (delta > 0) {
        if (state === TOP || state === UP) {
          if (y <= min + EPS) settle(BOTTOM);
          else release(DOWN, y, vpTop);
        } else if (state === DOWN && y <= min + EPS) settle(BOTTOM);
      } else if (delta < 0) {
        if (state === BOTTOM || state === DOWN) {
          if (y >= max - EPS) settle(TOP);
          else release(UP, y, vpTop);
        } else if (state === UP) {
          if (!native) up = Math.min(max, up - delta);
          if ((native ? y : Math.max(y, up)) >= max - EPS) settle(TOP);
        }
      } else if (resized && (state === DOWN || state === UP)) {
        release(state, y, vpTop);
      }
    }

    if (state === UP) {
      if (native) write("auto", fmt(vh - h - max));
      else write(fmt((up = Math.min(up, max))), "auto");
    } else write(fmt(state === TOP ? max : min), "auto");
    return moving;
  }

  function animating() {
    for (const x of headers)
      if (x.getAnimations?.().some(finiteRunning)) return true;
    return false;
  }

  function tick() {
    frame = 0;
    if (update() || animating()) idle = 0;
    if (++idle < SETTLE_FRAMES) frame = requestAnimationFrame(tick);
  }

  function schedule() {
    idle = 0;
    if (on && !frame) frame = requestAnimationFrame(tick);
  }

  function sync() {
    update();
    schedule();
  }

  function listen(add: boolean) {
    const m = add ? "addEventListener" : "removeEventListener";
    (scroller ?? window)[m]("scroll", schedule, { passive: true });
    window[m]("resize", schedule);
    for (const x of headers) {
      x[m]("transitionrun", schedule);
      x[m]("animationstart", schedule);
    }
  }

  function start() {
    if (on) return;
    on = true;
    headers = toElements(opts.header);
    scroller = query(opts.scroller);
    if (process.env.NODE_ENV !== "production") {
      if (typeof opts.header === "string" && !headers.length)
        warn(`header selector "${opts.header}" matched no elements`);
      if (opts.scroller && !scroller)
        warn(`scroller "${String(opts.scroller)}" not found, using the window`);
    }
    if (getComputedStyle(el!).position !== "sticky") s.position = "sticky";
    s.overflowAnchor = "none";
    state = TOP;
    shifted = false;
    const ps = el!.parentElement && getComputedStyle(el!.parentElement);
    native =
      !!ps &&
      (ps.display.includes("grid") ||
        (ps.display.includes("flex") && ps.flexDirection.startsWith("row")));
    if (process.env.NODE_ENV !== "production" && !native && !warned) {
      warned = true;
      warn(
        "parent is not grid / row-flex, so scrolling up uses a JS fallback that can lag a frame. Add `display: grid` to the parent for fully native, jump-free behaviour.",
        el,
      );
    }
    lastMax = NaN;
    lastH = 0;
    curTop = curBottom = "";
    lastScroll = scrollPos();

    listen(true);
    ro.observe(el!);
    if (el!.parentElement) ro.observe(el!.parentElement);
    for (const x of headers) {
      ro.observe(x);
      mo.observe(x, {
        attributes: true,
        attributeFilter: ["style", "class", "hidden"],
      });
    }
    unsubscribe = opts.subscribe?.(sync);
    update();
  }

  function stop() {
    if (!on) return;
    on = false;
    cancelAnimationFrame(frame);
    frame = 0;
    listen(false);
    ro.disconnect();
    mo.disconnect();
    if (typeof unsubscribe === "function") unsubscribe();
    unsubscribe = undefined;
    restore(0, 7);
  }

  const onMedia = () => (mql!.matches ? start() : stop());

  function setup() {
    if (opts.media) {
      mql = matchMedia(opts.media);
      mql.addEventListener("change", onMedia);
      onMedia();
    } else start();
  }

  function teardown() {
    mql?.removeEventListener("change", onMedia);
    mql = null;
    stop();
  }

  setup();

  return {
    element: el,
    update: sync,
    refresh() {
      teardown();
      setup();
    },
    setOptions(next) {
      const prev = opts;
      opts = next;
      if (STRUCTURAL.some((k) => prev[k] !== next[k])) {
        teardown();
        setup();
      } else sync();
    },
    destroy: teardown,
  };
}
