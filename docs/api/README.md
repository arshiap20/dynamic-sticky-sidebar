# API Reference

## `stickySidebar(target, options?)`

```ts
function stickySidebar(target: HTMLElement | string, options?: StickySidebarOptions): StickySidebar;
```

| Parameter | Type | Description |
| --- | --- | --- |
| `target` | `HTMLElement \| string` | The sidebar element, or a selector for it. Throws `[dynamic-sticky-sidebar] sidebar element not found` if nothing matches. |
| `options` | `StickySidebarOptions` | See [Options](#options). All optional. |

## Options

```ts
type Px = number | (() => number);
type HeaderInput = string | Element | ArrayLike<Element> | null | undefined;

interface StickySidebarOptions {
    header?: HeaderInput;
    offsetTop?: Px;
    offsetBottom?: Px;
    gap?: number;
    media?: string;
    scroller?: Element | string | null;
    subscribe?: (update: () => void) => void | (() => void);
}
```

### `header`

- **Type:** `string | Element | ArrayLike<Element> | null`
- **Default:** none

Sticky or fixed header element(s). A selector uses **all** matching elements. The sidebar pins under the lowest visible bottom edge among them and follows them live while they slide, collapse or resize. See [Dynamic headers](../guide/headers.md).

### `offsetTop`

- **Type:** `number | () => number`
- **Default:** `0`

Extra space between the header (or the viewport top, without a header) and the sidebar. A function is called on every recalculation.

### `offsetBottom`

- **Type:** `number | () => number`
- **Default:** `0`

Extra space between the sidebar and the viewport bottom when the sidebar is bottom-pinned.

### `gap`

- **Type:** `number`
- **Default:** `16`

Spacing in px applied on **both** edges, on top of `offsetTop` / `offsetBottom`.

### `media`

- **Type:** `string`
- **Default:** always active

A media query. The instance only runs while it matches, e.g. `'(min-width: 768px)'`. When it stops matching, listeners are removed and inline styles restored.

### `scroller`

- **Type:** `Element | string | null`
- **Default:** the window

The scrolling element, when the sidebar lives in a scrollable container instead of the page. All positions are measured against the scroller's visible area.

### `subscribe`

- **Type:** `(update: () => void) => void | (() => void)`
- **Default:** none

Connects an external source that moves the header (a store, an event bus…). Call `update` whenever it changes and return an unsubscribe function. It is called when the instance starts and unsubscribed when it stops.

```js
subscribe: (update) => store.subscribe(update)
```

## Instance

```ts
interface StickySidebar {
    readonly element: HTMLElement;
    update(): void;
    refresh(): void;
    setOptions(options: StickySidebarOptions): void;
    destroy(): void;
}
```

### `element`

The resolved sidebar element.

### `update()`

Recalculates synchronously, then keeps following for a few frames in case something is still moving. Call it after changes the library can't observe. See [When you need to help](../guide/headers.md#when-you-need-to-help).

### `refresh()`

Fully restarts: re-queries `header` selectors and `scroller`, re-evaluates `media` and re-detects the layout mode. Use it after header elements were replaced in the DOM.

### `setOptions(options)`

**Replaces** all options; it does not merge.

- Changing `header`, `media`, `scroller` or `subscribe` (compared by identity) restarts the instance.
- Other changes (`gap`, `offsetTop`, `offsetBottom`) just recalculate.

### `destroy()`

Removes every listener and observer, cancels pending frames, calls the `subscribe` cleanup and restores the sidebar's original inline styles.

## React

```ts
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

| Export | Signature |
| --- | --- |
| `useStickySidebar` | `<T extends HTMLElement>(options?: UseStickySidebarOptions) => (node: T \| null) => void` |
| `StickySidebar` | `ForwardRefExoticComponent<StickySidebarProps>` |

```ts
interface UseStickySidebarOptions extends Omit<StickySidebarOptions, 'header' | 'scroller'> {
    header?: HeaderInput | RefObject<Element | null>;
    scroller?: Element | string | null | RefObject<Element | null>;
}

interface StickySidebarProps extends UseStickySidebarOptions, HTMLAttributes<HTMLElement> {
    as?: ElementType; // default 'aside'
    children?: ReactNode;
}
```

See [React](../frameworks/react.md).

## Vue

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

| Export | Signature |
| --- | --- |
| `useStickySidebar` | `(target: MaybeRefOrGetter<HTMLElement \| ComponentPublicInstance \| null>, options?: MaybeRefOrGetter<VueStickySidebarOptions>) => { update(): void; refresh(): void }` |
| `vStickySidebar` | `Directive<HTMLElement, VueStickySidebarOptions \| undefined>` |
| `StickySidebarPlugin` | `Plugin`, which registers `v-sticky-sidebar` |

```ts
interface VueStickySidebarOptions extends Omit<StickySidebarOptions, 'header' | 'scroller'> {
    header?: MaybeRefOrGetter<HeaderInput | ComponentPublicInstance>;
    scroller?: MaybeRefOrGetter<Element | string | null | undefined | ComponentPublicInstance>;
}
```

See [Vue](../frameworks/vue.md).
