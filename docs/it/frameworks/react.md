# React

```tsx
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

Richiede React 16.8 o successivo. L'entry è marcata `"use client"`, quindi funziona così com'è con l'App Router di Next.js.

## Componente `<StickySidebar>` {#stickysidebar-component}

Renderizza un `<aside>` (puoi cambiarlo con `as`) e gli applica il comportamento della sidebar:

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

- Accetta ogni [opzione](../api/README.md#options) come prop.
- `as` imposta l'elemento renderizzato, `'aside'` per impostazione predefinita.
- Tutte le altre prop (`className`, `id`, `aria-*`, event handler…) vengono passate all'elemento.
- `ref` viene inoltrato all'elemento DOM.

## Hook `useStickySidebar` {#usestickysidebar-hook}

Restituisce una **callback ref** da applicare al tuo elemento:

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

L'istanza viene creata quando l'elemento viene montato e distrutta quando viene smontato.

### Ref come opzioni {#refs-as-options}

`header` e `scroller` accettano un `RefObject` oltre ai soliti valori elemento / selettore. La ref viene letta quando le opzioni vengono applicate.

### Opzioni reattive {#reactive-options}

Le modifiche a `header`, `scroller`, `media`, `gap` e ai valori **numerici** di `offsetTop` / `offsetBottom` vengono applicate al re-render. Per offset che dipendono dallo stato, preferisci numeri semplici:

```tsx
const [bannerOpen, setBannerOpen] = useState(true);

<StickySidebar header=".site-header" offsetTop={bannerOpen ? 48 : 0}>
```

Le opzioni funzione (`offsetTop`, `offsetBottom`, `subscribe`) vengono **sempre lette dall'ultimo render**, quindi le arrow function inline non riavviano mai l'istanza. Un getter viene letto a ogni ricalcolo (scroll, resize, cambiamento dell'header). Cambiare lo stato da cui dipende non provoca da solo un ricalcolo, quindi quando conta usa un numero o `subscribe`.

### Header guidati dallo stato {#state-driven-headers}

Se l'offset dell'header vive in uno store, collegalo con `subscribe`:

```tsx
<StickySidebar
    header=".site-header"
    subscribe={(update) => useHeaderStore.subscribe(update)}
>
```

`subscribe` riceve la funzione di aggiornamento e deve restituire una funzione di disiscrizione. Viene sempre letta dall'ultimo render, quindi una funzione inline non riavvia l'istanza a ogni render.

## Tipi {#types}

```ts
import type {
    StickySidebarProps,
    UseStickySidebarOptions,
    StickySidebarOptions,
    HeaderInput,
    Px,
} from 'dynamic-sticky-sidebar/react';
```
