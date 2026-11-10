# React

```tsx
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

Nécessite React 16.8 ou une version ultérieure. L'entrée est marquée `"use client"` : elle fonctionne donc telle quelle avec l'App Router de Next.js.

## Le composant `<StickySidebar>` {#stickysidebar-component}

Rend un `<aside>` (modifiable avec `as`) et lui attache le comportement de barre latérale :

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

- Accepte chaque [option](../api/README.md#options) sous forme de prop.
- `as` définit l'élément rendu, `'aside'` par défaut.
- Toutes les autres props (`className`, `id`, `aria-*`, gestionnaires d'événements…) sont transmises à l'élément.
- `ref` est transmise à l'élément DOM.

## Le hook `useStickySidebar` {#usestickysidebar-hook}

Renvoie une **callback ref** à placer sur votre propre élément :

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

L'instance est créée au montage de l'élément et détruite à son démontage.

### Des refs comme options {#refs-as-options}

`header` et `scroller` acceptent un `RefObject` en plus des valeurs habituelles (élément ou sélecteur). La ref est lue au moment où les options sont appliquées.

### Options réactives {#reactive-options}

Les changements de `header`, `scroller`, `media`, `gap` et des valeurs **numériques** de `offsetTop` / `offsetBottom` sont appliqués au re-rendu. Pour des décalages pilotés par l'état, préférez de simples nombres :

```tsx
const [bannerOpen, setBannerOpen] = useState(true);

<StickySidebar header=".site-header" offsetTop={bannerOpen ? 48 : 0}>
```

Les options de type fonction (`offsetTop`, `offsetBottom`, `subscribe`) sont **toujours lues depuis le dernier rendu** : des fonctions fléchées inline ne redémarrent donc jamais l'instance. Un getter est lu à chaque recalcul (défilement, redimensionnement, changement d'en-tête). Modifier l'état sur lequel il s'appuie ne déclenche pas de recalcul à lui seul : utilisez un nombre ou `subscribe` lorsque c'est important.

### En-têtes pilotés par l'état {#state-driven-headers}

Si le décalage de l'en-tête vit dans un store, connectez-le avec `subscribe` :

```tsx
<StickySidebar
    header=".site-header"
    subscribe={(update) => useHeaderStore.subscribe(update)}
>
```

`subscribe` reçoit la fonction de mise à jour et doit renvoyer une fonction de désabonnement. Elle est toujours lue depuis le dernier rendu, si bien qu'une fonction inline ne redémarre pas l'instance à chaque rendu.

## Types {#types}

```ts
import type {
    StickySidebarProps,
    UseStickySidebarOptions,
    StickySidebarOptions,
    HeaderInput,
    Px,
} from 'dynamic-sticky-sidebar/react';
```
