# Troubleshooting

::: tip
The console warnings below only appear in development builds. Production builds and the CDN build strip them to save bytes.
:::

## The sidebar doesn't stick at all

- **It's stretched.** In grid/flex the sidebar defaults to the full row height. Add `align-items: start` to the parent or `align-self: start` to the sidebar. See [Layout](./layout.md#the-sidebar-must-not-stretch).
- **An ancestor has `overflow` set.** `overflow: hidden | auto | scroll` on any ancestor turns it into the sticky container. Use `overflow: clip`, or pass that element as `scroller` if it is the real scroll container.
- **`media` doesn't match.** The instance is inactive while the media query is false.
- **It starts hidden.** If the sidebar has no height at start (`display: none`, inside a closed tab), the instance waits. A `ResizeObserver` picks it up when it becomes visible, or call `update()`.

## "element not found" error

`stickySidebar('#sidebar')` throws when the selector matches nothing. Create the instance after the element is in the DOM: after `DOMContentLoaded`, in `onMounted` / `useEffect`, or use the framework adapters, which handle this for you.

## Header selector matched nothing

```
[dynamic-sticky-sidebar] header selector ".site-header" matched no elements
```

The `header` selector found nothing when the instance started, so the sidebar pins to the viewport top and may slide under your header. Check the selector, or call `refresh()` once the header is rendered.

## Scroller not found

```
[dynamic-sticky-sidebar] scroller "#app" not found, using the window
```

The `scroller` option didn't resolve to an element. Check the selector, or pass the element itself.

## Console warning about grid / row-flex

```
[dynamic-sticky-sidebar] parent is not grid / row-flex, so scrolling up uses a JS fallback …
```

The sidebar's **direct parent** is a block. Things still work, but scrolling up can lag a frame. Give the parent `display: grid; align-items: start`. See [Block layout](./layout.md#block-layout-fallback).

## The sidebar overlaps or leaves a gap under the header

- Make sure **every** header row is passed in `header`. With a selector, all matches are used.
- If the header moves because of a class on an ancestor, the library can't see it. Call `update()`, or use [`subscribe`](./headers.md#use-subscribe).
- Headers replaced in the DOM after start need [`refresh()`](../api/README.md#refresh).
- Want more room? Increase `gap` (default `16`) or add `offsetTop`.

## The sidebar content changes height

No action needed. A `ResizeObserver` watches the sidebar and its parent. When the sidebar's height changes while it is released, it is re-anchored at its current on-screen position, and the pinned positions are recomputed.

## Server-side rendering

The core only touches `document` and `window` when `stickySidebar()` is called. The React hook runs in a ref callback and the React entry is marked `"use client"`. The Vue composable and directive run after mount. All of them are safe to import in SSR apps (Next.js, Nuxt, VuePress, …).
