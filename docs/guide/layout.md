# Layout Requirements

The library builds on `position: sticky`, so the usual sticky rules apply, plus one more about the sidebar's parent.

## Recommended: grid

```css
.layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: start;
}
```

With a **grid** or **row flex** parent, both scroll directions run on native sticky positioning. JS only adjusts the constraints when the direction changes, so the sidebar never lags behind the scroll.

Row flex works the same way:

```css
.layout {
    display: flex;
    flex-direction: row; /* or row-reverse */
    align-items: flex-start;
}
.layout > aside {
    flex: 0 0 280px;
}
```

## The sidebar must not stretch

Grid and flex items stretch to the row height by default. A stretched sidebar is as tall as the content column, so sticky has no room to move and nothing happens. Use one of these:

- `align-items: start` (grid) / `align-items: flex-start` (flex) on the parent, or
- `align-self: start` on the sidebar itself.

The parent itself must be as tall as the scrolling content. That is the default when the sidebar and the main content share a row.

## Block layout (fallback)

If the parent is a normal block, for example the sidebar is wrapped in a stretched column `<div>`, the library still works:

- scrolling **down** is native, like in grid mode;
- scrolling **up** uses a JS-driven `top`, which can lag one frame behind fast scrolling.

In development builds the library logs this once in the console:

```
[dynamic-sticky-sidebar] parent is not grid / row-flex, so scrolling up uses a JS fallback that can lag a frame. …
```

Fix it by giving the **direct parent** of the sidebar `display: grid` (a single-column grid is enough):

```css
.sidebar-column {
    display: grid;
    align-items: start;
}
```

## Overflow on ancestors

As with any sticky element, an ancestor between the sidebar and its scroller with `overflow: hidden | auto | scroll` becomes the sticky container and breaks sticking to the page. Common culprits are page wrappers using `overflow-x: hidden` to hide horizontal overflow.

- Use `overflow: clip` (or `overflow-x: clip`) instead of `hidden`; it clips without creating a scroll container.
- If the sidebar really lives inside a scrollable panel, pass that panel as the [`scroller`](../api/README.md#scroller) option.

## Small screens

On mobile the sidebar usually stacks above or below the content and should not be sticky. Use `media` so the library only runs while the layout has two columns:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    media: '(min-width: 768px)',
});
```

When the query stops matching, the library removes its listeners and restores the sidebar's original inline styles. It starts again when the query matches.

## Styles the library touches

While active, the library writes these inline styles on the sidebar element:

| Property | Why |
| --- | --- |
| `position` | Set to `sticky` if it isn't already |
| `top`, `bottom` | The sticky constraints |
| `margin-top`, `margin-bottom` | Hold the sidebar in place while it is "released" between pinned states |
| `align-self` | Set to `flex-end` while scrolling up in grid/flex mode |
| `overflow-anchor` | Set to `none` so scroll anchoring doesn't fight the adjustments |

The original inline values are saved when the library starts and restored on `destroy()` or when `media` stops matching. Keep your own spacing in a stylesheet or a class, not in inline styles you change while the library is running.
