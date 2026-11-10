# Erste Schritte

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

## 1. Seite aufbauen {#_1-lay-out-the-page}

Setze die Sidebar neben den Inhalt in ein **Grid** (oder ein Flex-Layout in Zeilenrichtung) und verhindere, dass sie sich auf die volle Zeilenhöhe streckt:

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

::: tip Warum Grid?
Mit einem Grid- oder Zeilen-Flex-Container als Elternelement kann die Bibliothek in beide Richtungen **natives** Sticky-Verhalten nutzen. Block-Layouts funktionieren auch, beim Hochscrollen kommt dann aber ein JS-Fallback zum Einsatz. Siehe [Layout-Anforderungen](./layout.md).
:::

## 2. Sidebar anbinden {#_2-attach-the-sidebar}

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

Das war’s. Scrollst du nach unten, folgt die Sidebar dem Inhalt bis zu ihrem Ende und bleibt dann stehen. Scrollst du nach oben, kommt sie zurück und bleibt unter dem Header stehen – egal, wo der Header gerade ist.

## 3. Ausprobieren {#_3-try-it}

Scrolle in der Box unten. Die Sub-Navigation rutscht beim Runterscrollen weg und kommt beim Hochscrollen zurück, und die Sidebar folgt ihr.

<StickyDemo />

## Wie geht es weiter? {#next-steps}

- [Layout-Anforderungen](./layout.md): Grid, Flex oder Block und häufige Stolperfallen
- [Dynamische Header](./headers.md): mehrere Header, per JS animierte Header und zustandsabhängige Offsets
- [API-Referenz](../api/README.md): alle Optionen und Instanzmethoden
