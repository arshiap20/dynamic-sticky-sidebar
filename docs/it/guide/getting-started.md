# Per iniziare

## Installazione {#install}

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

## 1. Imposta il layout della pagina {#_1-lay-out-the-page}

Metti la sidebar in una **grid** (o in un flex con direzione row) accanto al contenuto, e impedisci che si allunghi fino all'altezza dell'intera riga:

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

::: tip Perché la grid?
Un genitore grid o row-flex permette alla libreria di usare il comportamento sticky **nativo** in entrambe le direzioni. I layout block funzionano comunque, ma quando scorri verso l'alto entra in gioco un fallback in JS. Vedi [Requisiti di layout](./layout.md).
:::

## 2. Collega la sidebar {#_2-attach-the-sidebar}

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

Tutto qui. Scorri verso il basso e la sidebar segue il contenuto fino alla sua fine, poi si blocca. Scorri verso l'alto e torna indietro, bloccandosi sotto l'header, ovunque si trovi l'header in quel momento.

## 3. Provala {#_3-try-it}

Scorri dentro il riquadro qui sotto. La sub-nav scorre via quando scorri verso il basso e ricompare quando scorri verso l'alto, e la sidebar la segue.

<StickyDemo />

## Prossimi passi {#next-steps}

- [Requisiti di layout](./layout.md): grid, flex o block, e gli errori più comuni
- [Header dinamici](./headers.md): più header, header animati via JS e offset guidati dallo stato
- [Riferimento API](../api/README.md): tutte le opzioni e i metodi dell'istanza
