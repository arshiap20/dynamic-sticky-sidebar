export const HEADER = 60;
export const GAP = 16;

const CSS = `
html, body { margin: 0; padding: 0; }
.hdr { position: sticky; top: 0; height: ${HEADER}px; background: #ddd; z-index: 1; }
.layout { display: grid; grid-template-columns: 240px 1fr; align-items: start; gap: 20px; }
.block { display: block; align-self: stretch; }
.main { height: 6000px; }
.short { height: 200px; }
.tall { height: 1600px; }
`;

let root: HTMLElement | null = null;

export interface Fixture {
  root: HTMLElement;
  header: HTMLElement;
  layout: HTMLElement;
  sidebar: HTMLElement;
}

/** Header + grid (or block) layout with a sidebar of the given height. */
export function fixture({
  size = "short",
  layout = "grid",
}: { size?: "short" | "tall"; layout?: "grid" | "block" } = {}): Fixture {
  cleanup();
  root = document.createElement("div");
  root.innerHTML = `
    <style>${CSS}</style>
    <header class="hdr" id="header"></header>
    <div class="layout" id="layout">
      ${layout === "block" ? '<div class="block">' : ""}
        <aside id="sidebar" class="${size}"></aside>
      ${layout === "block" ? "</div>" : ""}
      <main class="main"></main>
    </div>`;
  document.body.append(root);
  return {
    root,
    header: root.querySelector("#header")!,
    layout: root.querySelector("#layout")!,
    sidebar: root.querySelector("#sidebar")!,
  };
}

export function cleanup() {
  root?.remove();
  root = null;
  window.scrollTo(0, 0);
}

export const frame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export async function frames(n = 4) {
  for (let i = 0; i < n; i++) await frame();
}

/** Scroll in small steps with a frame between each, like a wheel. */
export async function scrollTo(
  y: number,
  step = 120,
  target: Element | Window = window,
) {
  const pos = () =>
    target instanceof Window ? target.scrollY : target.scrollTop;
  while (Math.abs(pos() - y) > 0.5) {
    const before = pos();
    const next =
      before + Math.sign(y - before) * Math.min(step, Math.abs(y - before));
    target.scrollTo(0, next);
    await frame();
    if (pos() === before) break;
  }
  await frames();
}

export const vh = () => document.documentElement.clientHeight;
export const top = (el: Element) => el.getBoundingClientRect().top;
export const bottomGap = (el: Element) =>
  vh() - el.getBoundingClientRect().bottom;
