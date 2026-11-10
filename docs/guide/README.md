# Introduction

**dynamic-sticky-sidebar** keeps a sidebar in view while the page scrolls, even when the sidebar is taller than the screen and the header above it keeps changing size.

## The problem

Plain `position: sticky; top: 80px` works well until one of these happens:

- **The sidebar is taller than the viewport.** It pins to the top and its lower part can never be reached until the end of the page.
- **The header hides and shows.** Many sites slide the header (or a second nav row) away on scroll down and bring it back on scroll up. A fixed `top` either leaves a gap or slips under the header.
- **The header changes height.** Banners close, search bars expand and headers collapse into a compact mode.

The usual fixes either listen to `scroll` and set `transform` or `top` on every frame, which causes jitter and lag, or need hand-tuned offsets for every header state.

## What this library does

- **Two-way sticky.** Scrolling down, a tall sidebar moves with the content until its **bottom** reaches the viewport, then sticks. Scrolling up, it moves back until its **top** reaches the header, then sticks. A short sidebar simply stays pinned under the header.
- **Live header tracking.** You pass the header element(s) and the sidebar sits under the lowest visible header edge. It follows the header frame by frame while the header slides, collapses or resizes.
- **Native first.** The browser's `position: sticky` handles each scroll frame. JS only changes the sticky constraints (`top`, `bottom`, a margin) when the scroll direction flips or the header moves. See [How it works](./how-it-works.md).

## Packages

There is one npm package with three entry points:

| Import | Use it for |
| --- | --- |
| `dynamic-sticky-sidebar` | Framework-free core: [`stickySidebar()`](../frameworks/vanilla.md) |
| `dynamic-sticky-sidebar/react` | [`useStickySidebar` hook and `<StickySidebar>` component](../frameworks/react.md) |
| `dynamic-sticky-sidebar/vue` | [Composable, `v-sticky-sidebar` directive and plugin](../frameworks/vue.md) |

React (≥ 16.8) and Vue (≥ 3.3) are optional peer dependencies. Install only what you use.

Types ship with the package and resolve for both `moduleResolution: "bundler"` / `"node16"` and the older `"node"` setting.

## Bundle size

Measured on the published build, minified with `NODE_ENV=production` as your bundler would. The React and Vue entries include the core.

| Entry | Minified | gzip | brotli |
| --- | --- | --- | --- |
| `dynamic-sticky-sidebar` | 3.4 kB | 1.8 kB | 1.6 kB |
| `dynamic-sticky-sidebar/react` | 4.6 kB | 2.2 kB | 2.0 kB |
| `dynamic-sticky-sidebar/vue` | 4.2 kB | 2.1 kB | 1.9 kB |
| CDN `<script>` build | 3.8 kB | 2.0 kB | 1.8 kB |

- **No dependencies.** React and Vue are only used by their own entry points.
- **Development warnings are stripped in production.** The console hints from [Troubleshooting](./troubleshooting.md) are wrapped in `process.env.NODE_ENV !== 'production'`, so Vite, webpack, Next.js and Nuxt remove them from production bundles. The development build of the core is about 0.2 kB larger (gzip).
- **Tree-shakeable.** The package is marked `sideEffects: false`, and the React component is annotated as pure, so unused exports are dropped.

Run `pnpm size` in the repository to reproduce these numbers.

## Browser support

Any browser with `position: sticky`, `ResizeObserver` and `MutationObserver`, which covers every current evergreen browser. Both the ESM/CJS builds and the CDN `<script>` build target ES2020.
