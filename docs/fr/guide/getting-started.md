# Premiers pas

## Installation {#install}

::: code-tabs#pm

@tab npm

```bash
npm i dynamic-sticky-sidebar
```

@tab pnpm

```bash
pnpm add dynamic-sticky-sidebar
```

@tab yarn

```bash
yarn add dynamic-sticky-sidebar
```

@tab CDN

```html
<script src="https://unpkg.com/dynamic-sticky-sidebar"></script>
<!-- exposes window.StickySidebar.stickySidebar -->
```

:::

## 1. Mettre en page {#_1-lay-out-the-page}

Placez la barre latérale dans une **grille** (ou un flex en ligne) à côté du contenu, et empêchez-la de s'étirer sur toute la hauteur de la rangée :

```html
<header class="site-header">…</header>

<div class="layout">
    <aside id="sidebar">…</aside>
    <main>…</main>
</div>
```

```css
.site-header {
    position: sticky;
    top: 0;
    z-index: 10;
}

.layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 32px;
    align-items: start; /* important: the sidebar keeps its own height */
}
```

::: tip Pourquoi une grille ?
Un parent en grille ou en flex en ligne permet à la bibliothèque d'utiliser le comportement sticky **natif** dans les deux sens. Les mises en page en bloc fonctionnent aussi, mais la remontée passe alors par une solution de repli en JS. Voir [Contraintes de mise en page](./layout.md).
:::

## 2. Attacher la barre latérale {#_2-attach-the-sidebar}

::: code-tabs#fw

@tab Vanilla

```js
import { stickySidebar } from 'dynamic-sticky-sidebar';

const sidebar = stickySidebar('#sidebar', {
    header: '.site-header',
    gap: 16,
    media: '(min-width: 768px)',
});

// later, e.g. when the page unmounts
sidebar.destroy();
```

@tab React

```tsx
import { StickySidebar } from 'dynamic-sticky-sidebar/react';

export function Layout({ children }) {
    return (
        <div className="layout">
            <StickySidebar header=".site-header" gap={16} media="(min-width: 768px)">
                …
            </StickySidebar>
            <main>{children}</main>
        </div>
    );
}
```

@tab Vue

```vue
<script setup>
import { vStickySidebar } from 'dynamic-sticky-sidebar/vue';

const sticky = { header: '.site-header', gap: 16, media: '(min-width: 768px)' };
</script>

<template>
    <div class="layout">
        <aside v-sticky-sidebar="sticky">…</aside>
        <main><slot /></main>
    </div>
</template>
```

:::

C'est tout. Faites défiler vers le bas : la barre latérale accompagne le contenu jusqu'à sa fin, puis se fixe. Remontez : elle revient et se fixe sous l'en-tête, où qu'il se trouve à ce moment-là.

## 3. Essayer {#_3-try-it}

Faites défiler l'intérieur du cadre ci-dessous. La sous-navigation disparaît quand vous descendez et revient quand vous remontez, et la barre latérale la suit.

<StickyDemo />

## Pour aller plus loin {#next-steps}

- [Contraintes de mise en page](./layout.md) : grid, flex ou bloc, et les pièges courants
- [En-têtes dynamiques](./headers.md) : plusieurs en-têtes, en-têtes animés en JS et décalages pilotés par l'état
- [Référence de l'API](../api/README.md) : toutes les options et méthodes d'instance
