# React

```tsx
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

Requires React 16.8 or newer. The entry is marked `"use client"`, so it works in the Next.js App Router as is.

## `<StickySidebar>` component

Renders an `<aside>` (change it with `as`) and attaches the sidebar behaviour to it:

```tsx
import { StickySidebar } from 'dynamic-sticky-sidebar/react';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="layout">
            <StickySidebar header=".site-header" gap={16} media="(min-width: 768px)" className="sidebar">
                <Filters />
            </StickySidebar>
            <main>{children}</main>
        </div>
    );
}
```

- Accepts every [option](../api/README.md#options) as a prop.
- `as` sets the rendered element, `'aside'` by default.
- Every other prop (`className`, `id`, `aria-*`, event handlers…) is passed to the element.
- `ref` is forwarded to the DOM element.

## `useStickySidebar` hook

Returns a **callback ref** to put on your own element:

```tsx
import { useRef } from 'react';
import { useStickySidebar } from 'dynamic-sticky-sidebar/react';

export function Page() {
    const headerRef = useRef<HTMLElement>(null);
    const sidebarRef = useStickySidebar({
        header: headerRef,
        gap: 16,
        media: '(min-width: 768px)',
    });

    return (
        <>
            <header ref={headerRef} className="site-header">…</header>
            <div className="layout">
                <nav ref={sidebarRef}>…</nav>
                <main>…</main>
            </div>
        </>
    );
}
```

The instance is created when the element mounts and destroyed when it unmounts.

### Refs as options

`header` and `scroller` accept a `RefObject` in addition to the usual element / selector values. The ref is read when the options are applied.

### Reactive options

Changes to `header`, `scroller`, `media`, `gap` and **numeric** `offsetTop` / `offsetBottom` are applied on re-render. Prefer plain numbers for state-driven offsets:

```tsx
const [bannerOpen, setBannerOpen] = useState(true);

<StickySidebar header=".site-header" offsetTop={bannerOpen ? 48 : 0}>
```

Function options (`offsetTop`, `offsetBottom`, `subscribe`) are **always read from the latest render**, so inline arrow functions never restart the instance. A getter is read on each recalculation (scroll, resize, header change). Changing the state behind it does not trigger a recalculation by itself, so use a number or `subscribe` when that matters.

### State-driven headers

If the header offset lives in a store, connect it with `subscribe`:

```tsx
<StickySidebar
    header=".site-header"
    subscribe={(update) => useHeaderStore.subscribe(update)}
>
```

`subscribe` receives the update function and must return an unsubscribe function. It is always read from the latest render, so an inline function does not restart the instance on each render.

## Types

```ts
import type {
    StickySidebarProps,
    UseStickySidebarOptions,
    StickySidebarOptions,
    HeaderInput,
    Px,
} from 'dynamic-sticky-sidebar/react';
```
