<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useStickySidebar } from "../../../src/vue";
import { useStrings } from "../i18n/useStrings";
import type { LocaleStrings } from "../i18n/types";

type State = "top" | "down" | "bottom" | "up";

const GAP = 10;

// Captions come from the current language (see i18n/*.ts → stage.captions).
const { t } = useStrings();
type CaptionKey = keyof LocaleStrings["stage"]["captions"];


const FILTERS = [
  {
    title: "Category",
    items: ["Tents", "Sleeping bags", "Backpacks", "Stoves", "Headlamps"],
  },
  { title: "Brand", items: ["Alder & Co.", "Northpass", "Kestrel", "Lowland"] },
  { title: "Season", items: ["3-season", "4-season"] },
  { title: "Weight", items: ["Under 1 kg", "1–2 kg", "Over 2 kg"] },
  { title: "Rating", items: ["4 stars & up", "3 stars & up"] },
];

const PRODUCTS = [
  ["Ridgeline 2P tent", "$389"],
  ["Alder 45 L pack", "$210"],
  ["Cinder –5° bag", "$265"],
  ["Pocket stove kit", "$64"],
  ["Northpass trail runner", "$148"],
  ["Lumen 400 headlamp", "$52"],
  ["Kestrel 1P bivy", "$174"],
  ["Merino base layer", "$89"],
  ["Folding trekking poles", "$118"],
  ["Lowland camp chair", "$72"],
  ["Insulated mug, 350 ml", "$28"],
  ["Repair kit", "$19"],
];

const TOUR = [
  { to: 0.42, ms: 2600, hold: 700 },
  { to: 0.3, ms: 1300, hold: 900 },
  { to: 0.92, ms: 2600, hold: 800 },
  { to: 0, ms: 2600, hold: 1400 },
];

const root = ref<HTMLElement | null>(null);
const scroller = ref<HTMLElement | null>(null);
const sidebar = ref<HTMLElement | null>(null);
const bar = ref<HTMLElement | null>(null);
const nav = ref<HTMLElement | null>(null);

useStickySidebar(sidebar, () => ({
  scroller: scroller.value,
  header: [bar.value, nav.value].filter((x): x is HTMLElement => !!x),
  gap: GAP,
}));

const navHidden = ref(false);
const state = ref<State>("top");
const pinTop = ref(0);
const pinBottom = ref(0);
const atStart = ref(true);
const columnEnd = ref(false);
const moving = ref<"down" | "up" | null>(null);
const event = ref<CaptionKey | null>(null);
const playing = ref(false);

// ---------- header auto-hide ----------
let lastY = 0;
let anchorY = 0;
let dir = 1;

function onScroll() {
  const y = scroller.value?.scrollTop ?? 0;
  if (y !== lastY) dir = y > lastY ? 1 : -1;
  lastY = y;
  lastScrollAt = performance.now();
  const moved = y - anchorY;
  if (y < 40) {
    navHidden.value = false;
    anchorY = y;
  } else if (moved > 24) {
    navHidden.value = true;
    anchorY = y;
  } else if (moved < -12) {
    navHidden.value = false;
    anchorY = y;
  } else if (Math.sign(moved) !== dir) {
    anchorY = y;
  }
}

// ---------- captions ----------
let lastScrollAt = 0;
let eventUntil = 0;

watch(navHidden, (hidden) => {
  if (state.value !== "top") return;
  event.value = hidden ? "navHidden" : "navShown";
  eventUntil = performance.now() + 2200;
});

const caption = computed(() => {
  const c = t.value.stage.captions;
  if (event.value) return c[event.value];
  if (atStart.value && state.value === "top") return c.start;
  if (columnEnd.value) return c.columnEnd;
  return c[state.value];
});

function measure() {
  const sc = scroller.value;
  const sb = sidebar.value;
  if (!sc || !sb) return;
  const c = sc.getBoundingClientRect();
  let head = 0;
  for (const h of [bar.value, nav.value]) {
    if (!h) continue;
    const r = h.getBoundingClientRect();
    if (r.height && r.bottom - c.top > head) head = r.bottom - c.top;
  }
  pinTop.value = head + GAP;
  pinBottom.value = sc.clientHeight - GAP;

  const s = sb.getBoundingClientRect();
  const top = s.top - c.top;
  const bottom = s.bottom - c.top;
  if (Math.abs(top - pinTop.value) < 1.5) state.value = "top";
  else if (Math.abs(bottom - pinBottom.value) < 1.5) state.value = "bottom";
  else state.value = dir > 0 ? "down" : "up";

  const now = performance.now();
  atStart.value = sc.scrollTop < 4;
  columnEnd.value = state.value === "down" && bottom < pinBottom.value - 2;
  moving.value = now - lastScrollAt < 250 ? (dir > 0 ? "down" : "up") : null;
  if (event.value && now > eventUntil) event.value = null;
}

// ---------- autoplay ----------
let step = 0;
let segStart = 0;
let from = 0;
let holdUntil = 0;
let raf = 0;
let visible = true;
let io: IntersectionObserver | null = null;

const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

function advance(now: number) {
  const sc = scroller.value;
  if (!sc || !playing.value || now < holdUntil) return;
  const seg = TOUR[step];
  const max = sc.scrollHeight - sc.clientHeight;
  if (!segStart) {
    segStart = now;
    from = sc.scrollTop;
  }
  const t = Math.min(1, (now - segStart) / seg.ms);
  sc.scrollTop = from + (seg.to * max - from) * ease(t);
  if (t >= 1) {
    holdUntil = now + seg.hold;
    segStart = 0;
    step = (step + 1) % TOUR.length;
  }
}

function frame(now: number) {
  raf = 0;
  if (!visible) return;
  advance(now);
  measure();
  raf = requestAnimationFrame(frame);
}

function wake() {
  if (!raf && visible) raf = requestAnimationFrame(frame);
}

function stopTour() {
  playing.value = false;
}

function play() {
  step = 0;
  segStart = 0;
  holdUntil = 0;
  if (scroller.value) scroller.value.scrollTop = 0;
  playing.value = true;
  wake();
}

onMounted(() => {
  playing.value = !window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  holdUntil = performance.now() + 900;
  io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) wake();
  });
  if (root.value) io.observe(root.value);
  wake();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  io?.disconnect();
});
</script>

<template>
  <figure ref="root" class="hs">
    <div class="hs-frame" dir="ltr">
      <div
        ref="scroller"
        class="hs-scroller"
        tabindex="0"
        :aria-label="t.stage.ariaLabel"
        @scroll.passive="onScroll"
        @wheel.passive="stopTour"
        @touchstart.passive="stopTour"
        @pointerdown="stopTour"
        @keydown="stopTour"
      >
        <header class="hs-header" aria-hidden="true">
          <div ref="bar" class="hs-bar">
            <b>Trailhead</b>
            <span class="hs-search">Search gear</span>
            <span>Cart (2)</span>
          </div>
          <nav ref="nav" class="hs-nav" :class="{ hidden: navHidden }">
            <span>Camp</span><span>Hike</span><span>Climb</span
            ><span>Sale</span>
          </nav>
        </header>
        <div class="hs-nav-space" />

        <div class="hs-layout" aria-hidden="true">
          <aside ref="sidebar" class="hs-filters">
            <section v-for="group in FILTERS" :key="group.title">
              <h4>{{ group.title }}</h4>
              <label v-for="(item, i) in group.items" :key="item">
                <i :class="{ on: i === 0 && group.title !== 'Rating' }" />{{
                  item
                }}
              </label>
            </section>
            <span class="hs-apply">Apply filters</span>
          </aside>

          <div class="hs-grid">
            <div v-for="[name, price] in PRODUCTS" :key="name" class="hs-card">
              <div class="hs-thumb" />
              <span class="hs-name">{{ name }}</span>
              <span class="hs-price">{{ price }}</span>
            </div>
          </div>
        </div>
        <footer class="hs-footer" aria-hidden="true">
          Free returns within 60 days
        </footer>
      </div>

      <div
        class="hs-line top"
        :class="{ on: state === 'top' }"
        :style="{ transform: `translateY(${pinTop}px)` }"
        aria-hidden="true"
      >
        <span>{{ t.stage.stuckTop }}</span>
      </div>
      <div
        class="hs-line bottom"
        :class="{ on: state === 'bottom' }"
        :style="{ transform: `translateY(${pinBottom}px)` }"
        aria-hidden="true"
      >
        <span>{{ t.stage.stuckBottom }}</span>
      </div>
    </div>

    <figcaption class="hs-caption">
      <span class="hs-dir" :class="moving ?? 'still'" aria-hidden="true">
        <svg viewBox="0 0 16 16"><path d="M8 2.5v11m0 0-4-4m4 4 4-4" /></svg>
      </span>
      <p aria-live="polite">{{ caption }}</p>
      <button v-if="!playing" type="button" @click="play">{{ t.stage.replay }}</button>
    </figcaption>
  </figure>
</template>

<style scoped>
.hs {
  margin: 0;
  width: 100%;
}

/* ---------- the page being inspected ---------- */
.hs-frame {
  position: relative;
  height: 380px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  overflow: hidden;
  box-shadow: 0 24px 48px -28px rgb(20 24 38 / 30%);
}

.hs-scroller {
  height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  font-size: 11px;
  line-height: 1.35;
  color: var(--vp-c-text);
}
.hs-scroller:focus-visible {
  outline-offset: -2px;
}

.hs-header {
  position: sticky;
  top: 0;
  z-index: 3;
}
.hs-bar {
  position: relative;
  z-index: 1;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}
.hs-bar b {
  font-family: var(--ds-font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.hs-search {
  flex: 1;
  max-width: 150px;
  margin-inline-start: auto;
  padding: 3px 8px;
  border-radius: 5px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-subtle);
}
.hs-nav {
  position: absolute;
  inset-inline: 0;
  top: 100%;
  height: 26px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 12px;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-mute);
  transition: transform 0.28s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.hs-nav.hidden {
  transform: translateY(-100%);
}
.hs-nav-space {
  height: 26px;
}

.hs-layout {
  display: grid;
  grid-template-columns: 36% 1fr;
  gap: 12px;
  padding: 10px 12px 0;
  align-items: start;
}

.hs-filters {
  position: relative;
  padding: 8px 10px 10px;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
}
/* devtools element highlight */
.hs-filters::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: color-mix(in srgb, var(--ds-signal) 9%, transparent);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--ds-signal) 70%, transparent);
  pointer-events: none;
}
.hs-filters section + section {
  margin-top: 8px;
  padding-top: 7px;
  border-top: 1px solid var(--vp-c-divider);
}
.hs-filters h4 {
  margin: 0 0 4px;
  padding: 0;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
}
.hs-filters label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  color: var(--vp-c-text-mute);
}
.hs-filters label i {
  flex: none;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  border: 1px solid var(--vp-c-border-hard);
  background: var(--vp-c-bg);
}
.hs-filters label i.on {
  border-color: var(--vp-c-text);
  background: var(--vp-c-text);
}
.hs-apply {
  display: block;
  margin-top: 10px;
  padding: 6px;
  border-radius: 5px;
  background: var(--vp-c-text);
  color: var(--vp-c-bg);
  font-weight: 600;
  text-align: center;
}

.hs-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.hs-card {
  display: grid;
  gap: 2px;
}
.hs-thumb {
  aspect-ratio: 4 / 3;
  border-radius: 5px;
  margin-bottom: 4px;
  background: var(--vp-c-bg-alt);
}
.hs-card:nth-child(4n + 1) .hs-thumb {
  background: color-mix(in srgb, #b9a88a 22%, var(--vp-c-bg-alt));
}
.hs-card:nth-child(4n + 2) .hs-thumb {
  background: color-mix(in srgb, #7f9277 22%, var(--vp-c-bg-alt));
}
.hs-card:nth-child(4n + 3) .hs-thumb {
  background: color-mix(in srgb, #7d8ea3 22%, var(--vp-c-bg-alt));
}
.hs-card:nth-child(4n + 4) .hs-thumb {
  background: color-mix(in srgb, #b08374 20%, var(--vp-c-bg-alt));
}
.hs-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hs-price {
  color: var(--vp-c-text-mute);
}

.hs-footer {
  margin-top: 16px;
  padding: 28px 12px 60px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-mute);
}

/* ---------- inspector overlay ---------- */
.hs-line {
  position: absolute;
  top: 0;
  inset-inline: 0;
  border-top: 1px dashed color-mix(in srgb, var(--ds-signal) 30%, transparent);
  pointer-events: none;
  z-index: 4;
  transition: border-color 0.2s;
}
.hs-line.on {
  border-top: 2px solid var(--ds-signal);
}
.hs-line span {
  position: absolute;
  inset-inline-end: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--ds-signal);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(var(--shift, 0)) scale(0.96);
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.hs-line.top span {
  top: 6px;
}
.hs-line.bottom span {
  bottom: 6px;
}
.hs-line.on span {
  opacity: 1;
  transform: none;
}

/* ---------- caption ---------- */
.hs-caption {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 64px;
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}
.hs-caption p {
  flex: 1;
  margin: 0 !important;
  font-size: 13.5px;
  line-height: 1.45;
  color: var(--vp-c-text);
}
.hs-dir {
  flex: none;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  transition:
    transform 0.25s,
    opacity 0.25s;
}
.hs-dir svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--vp-c-text);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.hs-dir.up {
  transform: rotate(180deg);
}
.hs-dir.still {
  opacity: 0.35;
}
.hs-caption button {
  flex: none;
  padding: 4px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  font: inherit;
  font-size: 12.5px;
  color: var(--vp-c-text);
  cursor: pointer;
}
.hs-caption button:hover {
  border-color: var(--vp-c-border-hard);
}

@media (max-width: 520px) {
  .hs-frame {
    height: 340px;
  }
  .hs-layout {
    grid-template-columns: 42% 1fr;
  }
  .hs-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
