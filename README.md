# dynamic-sticky-sidebar

Two-way sticky sidebar that follows **dynamic headers** (hide-on-scroll navs, collapsing bars) without jumping.
~1.8 KB gzipped, zero dependencies, fully tree-shakeable, vanilla JS + React + Vue.

**Docs and live demo:** https://arshiap20.github.io/dynamic-sticky-sidebar/

- Sidebar taller than the viewport: scrolls with the page, then pins its **bottom** while you scroll down and its **top** (under the header) while you scroll up.
- Sidebar shorter than the viewport: pins under the header and moves with it as the header slides in and out.
- Works with headers animated by CSS transitions, CSS animations, Web Animations, or JS that writes inline styles every frame (motion / framer-motion, GSAP).

## Why it doesn't jump

Most sticky-sidebar libraries move the sidebar from JS on every scroll frame. Browsers scroll on the compositor thread, so JS always runs one frame behind and the sidebar shakes, worst during fast flings.

This library never moves the sidebar per frame. The browser's native `position: sticky` does all the movement. JS only switches the sticky constraints (`top`/`bottom` plus a margin that keeps the sidebar visually still) when the scroll direction flips, and follows the header while it animates.

## Install

```bash
pnpm add dynamic-sticky-sidebar
```

## Layout requirement

The sidebar's parent should be a **grid** or **row flex** container, with the sidebar not stretched:

```css
.layout {
  display: grid;
  grid-template-columns: 290px 1fr;
  align-items: start;
}
```

If the sidebar sits in a plain block wrapper (e.g. Bootstrap `.col > aside`), add `display: grid` to that wrapper.
Without it, scrolling up falls back to JS-driven positioning (one frame of lag) and a console warning is logged.

The library manages the sidebar's inline `position`, `top`, `bottom`, `margin-top`, `margin-bottom`, `align-self` and `overflow-anchor`, and restores them on destroy.

## Vanilla JS

```js
import { stickySidebar } from "dynamic-sticky-sidebar";

const sticky = stickySidebar("#sidebar", {
  header: ".site-header, .site-header nav", // every element whose bottom edge may be the header's edge
  gap: 16,
  media: "(min-width: 768px)",
});

// sticky.update(); sticky.refresh(); sticky.setOptions({...}); sticky.destroy();
```

CDN build: `<script src="https://unpkg.com/dynamic-sticky-sidebar"></script>` exposes `StickySidebar.stickySidebar`.

Console warnings for common setup mistakes are dev-only: bundlers strip them when `process.env.NODE_ENV` is `"production"` (Vite, webpack, Next.js, Parcel and esbuild do this by default). The CDN build ships without them.

## React

```tsx
import { useStickySidebar, StickySidebar } from "dynamic-sticky-sidebar/react";

function Catalog() {
  const sidebar = useStickySidebar<HTMLElement>({
    header: "header > *",
    media: "(min-width: 768px)",
  });
  return (
    <div className="grid grid-cols-[290px_1fr] items-start gap-10">
      <aside ref={sidebar}>…</aside>
      <main>…</main>
    </div>
  );
}

// or the component (renders <aside> by default, `as` to change):
<StickySidebar header={headerRef} gap={16}>
  …
</StickySidebar>;
```

`header` and `scroller` also accept React refs. Function options always read the latest render's value.

## Vue 3

```vue
<script setup>
import { ref } from "vue";
import { useStickySidebar, vStickySidebar } from "dynamic-sticky-sidebar/vue";

const sidebar = ref();
useStickySidebar(sidebar, {
  header: ".site-header",
  media: "(min-width: 768px)",
});
</script>

<template>
  <aside ref="sidebar">…</aside>
  <!-- or: <aside v-sticky-sidebar="{ header: '.site-header' }">…</aside> -->
</template>
```

Options can be a plain object, a ref or a getter; `header`/`scroller` can be template refs.
`app.use(StickySidebarPlugin)` registers `v-sticky-sidebar` globally.

## Options

| option         | type                             | default |                                                                                                                                                                                                  |
| -------------- | -------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `header`       | selector \| Element \| Element[] | –       | Header element(s). The sidebar sits under the lowest visible bottom edge and follows it live. Pass every part that can define the edge (e.g. a bar **and** a nav that slides out from under it). |
| `gap`          | number                           | `16`    | Space at the top and bottom edges.                                                                                                                                                               |
| `offsetTop`    | number \| () => number           | `0`     | Extra space under the header.                                                                                                                                                                    |
| `offsetBottom` | number \| () => number           | `0`     | Extra space above the viewport bottom (e.g. a sticky bottom bar).                                                                                                                                |
| `media`        | string                           | –       | Active only while this media query matches. Inline styles are restored otherwise.                                                                                                                |
| `scroller`     | Element \| selector              | window  | Scroll container, if the page doesn't scroll on the window.                                                                                                                                      |
| `subscribe`    | (update) => unsubscribe          | –       | Hook an external store that drives the header offset (call `update` on change).                                                                                                                  |

### Header from a store instead of the DOM

```ts
import { headerOffset } from "@/stores/header"; // e.g. a motion value

useStickySidebar({
  offsetTop: () => headerOffset.get(),
  subscribe: (update) => headerOffset.on("change", update),
});
```

## Development

```bash
pnpm dev            # rebuild dist/ on change
pnpm build          # dist/: esm, cjs, d.ts, iife
pnpm typecheck      # src + tests
pnpm test           # every suite below
pnpm test:unit      # Vitest in real Chromium + WebKit (browser mode)
pnpm test:watch     # unit tests in watch mode
pnpm test:package   # Vitest on the built package: tree-shaking, type resolution
pnpm test:e2e       # Playwright: frame-by-frame jump test + React/Vue apps
pnpm size           # minified + gzip/brotli size per entry
pnpm demo           # opens demo/index.html
```

```
test/
├── unit/       Vitest (browser): core, React and Vue adapters
├── package/    Vitest (node): tree-shaking and type resolution of dist/
└── e2e/        Playwright Test: jump test (demo/index.html) and adapter apps (fixtures/)
scripts/
└── size.ts     bundle size report
```

The jump test samples every frame **before** the library's own rAF work (what native sticky / the compositor shows) and after it. It fails if the sidebar ever moves more than the scroll and header movement can explain, leaves a gap at the bottom, drops too low, or fails to follow the header for two frames in a row.
