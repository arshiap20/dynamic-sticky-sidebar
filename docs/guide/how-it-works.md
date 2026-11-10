# How It Works

Most sticky-sidebar scripts move the sidebar with `transform` or `top` on every scroll event. Since scroll events arrive after the browser has already scrolled, the sidebar always trails by a frame and jitters. This library takes the opposite approach: **the browser's `position: sticky` does the per-frame work, and JS only changes the rules.**

## Two pinned positions

On every update the library computes two positions for the sidebar's top edge, relative to the viewport (or scroller):

```
max = header bottom + offsetTop + gap        // pinned under the header
min = viewport height − sidebar height − offsetBottom − gap   // bottom aligned
```

If the sidebar fits (`max − min < 1px`), it is simply pinned at `top: max` and nothing else happens.

## Four states

When the sidebar is taller than the space available, it moves through four states:

<StateDiagram />

| State | Sticky constraint | What you see |
| --- | --- | --- |
| **TOP** | `top: max` | Pinned under the header |
| **DOWN** | `top: auto` + `margin-top` offset | Scrolling with the page, on its way down |
| **BOTTOM** | `top: min` | Bottom edge pinned to the viewport bottom |
| **UP** | `bottom: …` + `margin-bottom` offset | Scrolling with the page, on its way up |

Transitions happen only when the **scroll direction flips** or the sidebar reaches an edge. Scrolling down takes it from TOP through DOWN to BOTTOM. Scrolling up takes it from BOTTOM through UP and back to TOP.

Reversing direction partway (DOWN ↔ UP) releases the sidebar again from wherever it currently is, so it never jumps.

When the sidebar is "released" (DOWN / UP), the library sets `top`/`bottom` to `auto` and adds a margin equal to the sidebar's current distance from its natural position. The sidebar stays exactly where it was on screen and from then on scrolls natively with the page. When it reaches the other edge, the browser's sticky positioning takes over again and the library just records the new state.

### Why grid or flex

To release the sidebar upward, it has to be anchored to the **bottom** of its container. In a grid or row-flex parent, the library sets `align-self: flex-end` plus a bottom margin, and the sidebar scrolls up natively.

In block flow there is no way to bottom-align an item, so the library falls back to computing `top` in JS while scrolling up. See [Layout requirements](./layout.md#block-layout-fallback).

## Following the header

When the header moves, `max` changes. In the TOP state the library writes the new `top` right away, so the sidebar moves with the header.

Because a header animation can run without any scroll, the library starts a short `requestAnimationFrame` loop whenever something may be moving:

- a scroll, resize or `ResizeObserver` callback;
- a `transitionrun` / `animationstart` event or an attribute mutation on a header.

The loop recalculates every frame while `max` keeps changing or a finite animation is running on a header, and stops on its own **3 idle frames** after everything settles. Nothing runs while the page is idle.

## Small details

- **Only real changes are written.** `top` and `bottom` are compared against the last written value before touching the DOM, and values are rounded to 0.01px.
- **Scroll anchoring is disabled** on the sidebar (`overflow-anchor: none`) so the browser doesn't fight the margin adjustments.
- **Sidebar resizes** (content loaded, accordions opened) are picked up by `ResizeObserver`. A released sidebar is re-anchored at its current on-screen position.
- **Passive listeners only.** The scroll listener is passive and just schedules a frame.
