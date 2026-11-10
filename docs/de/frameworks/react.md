# React

```tsx
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

Benötigt React 16.8 oder neuer. Der Einstiegspunkt ist mit `"use client"` markiert und funktioniert daher ohne Weiteres im Next.js App Router.

## `<StickySidebar>`-Komponente {#stickysidebar-component}

Rendert ein `<aside>` (änderbar mit `as`) und versieht es mit dem Sidebar-Verhalten:

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

- Akzeptiert jede [Option](../api/README.md#options) als Prop.
- `as` legt das gerenderte Element fest, standardmäßig `'aside'`.
- Alle anderen Props (`className`, `id`, `aria-*`, Event-Handler …) werden an das Element weitergereicht.
- `ref` wird an das DOM-Element weitergeleitet.

## `useStickySidebar`-Hook {#usestickysidebar-hook}

Gibt eine **Callback-Ref** zurück, die du an dein eigenes Element hängst:

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

Die Instanz wird beim Mounten des Elements erstellt und beim Unmounten zerstört.

### Refs als Optionen {#refs-as-options}

`header` und `scroller` akzeptieren zusätzlich zu den üblichen Element- bzw. Selektorwerten auch ein `RefObject`. Die Ref wird gelesen, wenn die Optionen angewendet werden.

### Reaktive Optionen {#reactive-options}

Änderungen an `header`, `scroller`, `media`, `gap` und **numerischen** `offsetTop` / `offsetBottom` werden beim Re-Render übernommen. Für zustandsabhängige Offsets sind einfache Zahlen am besten:

```tsx
const [bannerOpen, setBannerOpen] = useState(true);

<StickySidebar header=".site-header" offsetTop={bannerOpen ? 48 : 0}>
```

Funktionsoptionen (`offsetTop`, `offsetBottom`, `subscribe`) werden **immer aus dem neuesten Render gelesen**, daher starten Inline-Arrow-Functions die Instanz nie neu. Ein Getter wird bei jeder Neuberechnung gelesen (Scroll, Resize, Header-Änderung). Ändert sich nur der State dahinter, löst das allein keine Neuberechnung aus. Verwende in diesem Fall eine Zahl oder `subscribe`.

### Zustandsgesteuerte Header {#state-driven-headers}

Liegt der Header-Offset in einem Store, verbinde ihn über `subscribe`:

```tsx
<StickySidebar
    header=".site-header"
    subscribe={(update) => useHeaderStore.subscribe(update)}
>
```

`subscribe` erhält die Update-Funktion und muss eine Unsubscribe-Funktion zurückgeben. Die Option wird immer aus dem neuesten Render gelesen, sodass eine Inline-Funktion die Instanz nicht bei jedem Render neu startet.

## Typen {#types}

```ts
import type {
    StickySidebarProps,
    UseStickySidebarOptions,
    StickySidebarOptions,
    HeaderInput,
    Px,
} from 'dynamic-sticky-sidebar/react';
```
