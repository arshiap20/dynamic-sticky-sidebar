# Dynamic Headers

Pass your header and the sidebar sits right under it, wherever the header currently is.

```js
stickySidebar('#sidebar', { header: '.site-header' });
```

## Where the sidebar sits

The top edge of the sidebar, when pinned, is:

```
lowest visible header bottom + offsetTop + gap
```

- **Lowest visible bottom.** With several headers, the one reaching furthest down wins.
- **Hidden headers are ignored.** A header with zero height (`display: none`, `hidden`, collapsed) or one that has slid fully above the viewport counts as `0`.
- Measured against the viewport, or against the [`scroller`](../api/README.md#scroller) when you use one.

## Several header rows

Pass a selector that matches all of them, an array or a `NodeList`:

```js
stickySidebar('#sidebar', { header: '#top-bar, #sub-nav' });

stickySidebar('#sidebar', { header: [topBar, subNav] });

stickySidebar('#sidebar', { header: document.querySelectorAll('[data-sticky-header]') });
```

This is the typical pattern of a fixed top bar plus a sub-nav that slides away on scroll down. When the sub-nav slides up, the sidebar moves up with it. When it comes back, the sidebar moves down with it.

::: tip
Selectors are resolved once, when the instance starts. If header elements are added or replaced later, call [`refresh()`](../api/README.md#refresh).
:::

## What is tracked automatically

Nothing to wire up for any of these. The library notices the change and follows the header frame by frame until it settles.

| Change on the header element | Detected through |
| --- | --- |
| Height changes (collapse, expand, content change) | `ResizeObserver` |
| `class`, `style` or `hidden` attribute changes | `MutationObserver` |
| CSS transitions and keyframe animations | `transitionrun` / `animationstart`, then followed via `getAnimations()` until they finish |
| Web Animations API (`el.animate()`) | `getAnimations()` |
| JS-driven animation writing `style.transform` every frame | `MutationObserver` on `style` |
| Page or scroller resize | `resize` event, `ResizeObserver` on the sidebar and its parent |

## When you need to help

The library observes the **header elements themselves**. It cannot see changes that move a header without touching that element, for example:

- a class toggled on `<body>` or a wrapper, where the header has no transition of its own;
- a header whose position comes from a CSS variable set on an ancestor;
- an offset that lives in app state and isn't in the DOM yet.

For these, choose one of the three hooks below.

### Call `update()`

```js
const sidebar = stickySidebar('#sidebar', { header: '.site-header' });

document.body.classList.toggle('compact-header');
sidebar.update();
```

### Use `subscribe`

If a store drives the header, let the library subscribe to it:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    subscribe: (update) => headerStore.subscribe(update), // must return an unsubscribe function
});
```

`update` is called whenever the store changes. The library calls your unsubscribe function on `destroy()`.

### Use an `offsetTop` getter

`offsetTop` and `offsetBottom` accept a function that is read on every update:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    offsetTop: () => (cookieBanner.isOpen ? cookieBanner.height : 0),
});
```

Pair a getter with `subscribe` or `update()` so the library knows when to read it again.

## No header

Without `header`, the sidebar pins `offsetTop + gap` pixels below the top of the viewport (or scroller):

```js
stickySidebar('#sidebar', { offsetTop: 64 }); // fixed 64px header you don't want to observe
```
