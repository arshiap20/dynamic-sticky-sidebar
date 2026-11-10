# Live-Demo

Scrolle **innerhalb der Box**. Diese Demo verwendet die Option [`scroller`](./api/README.md#scroller), damit sie innerhalb der Seite laufen kann.

- **Hohe Sidebar** an: Die Sidebar ist höher als die Box. Beim Runterscrollen wandert sie, bis ihr letzter Eintrag sichtbar ist, und bleibt dann unten stehen. Beim Hochscrollen kommt sie zurück und bleibt unter dem Header stehen.
- **Sub-Nav automatisch ausblenden** an: Die zweite Header-Zeile rutscht beim Runterscrollen weg und kommt beim Hochscrollen zurück. Die Sidebar folgt ihr.
- Schalte **Hohe Sidebar** aus, um eine kurze Sidebar zu sehen, die einfach unter dem Header fixiert bleibt.
- Der Zähler zeigt den Abstand der Sidebar zum oberen und unteren Rand der Box.
- **Vergrößern** öffnet die Demo in einem großen Fenster über dieser Seite. Schließen kannst du es mit <kbd>Esc</kbd>, dem Button „Schließen“ oder einem Klick daneben.
- **In neuem Tab öffnen** zeigt die Demo auf einer eigenen Seite. Dort scrollt das Browserfenster, ohne Option `scroller` – genau wie auf einer echten Website.

<StickyDemo :height="620" />

## Quellcode {#source}

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useStickySidebar } from 'dynamic-sticky-sidebar/vue';

const scroller = ref<HTMLElement | null>(null);
const sidebar = ref<HTMLElement | null>(null);
const bar = ref<HTMLElement | null>(null);
const nav = ref<HTMLElement | null>(null);

useStickySidebar(sidebar, () => ({
    scroller: scroller.value,
    header: [bar.value, nav.value].filter(Boolean) as HTMLElement[],
    gap: 12,
    media: '(min-width: 560px)',
}));
</script>

<template>
    <div ref="scroller" class="scroller">
        <header class="header">
            <div ref="bar" class="bar">…</div>
            <nav ref="nav" class="nav" :class="{ hidden: navHidden }">…</nav>
        </header>
        <div class="layout">
            <aside ref="sidebar">…</aside>
            <main>…</main>
        </div>
    </div>
</template>

<style>
.scroller { height: 620px; overflow: auto; }
.header { position: sticky; top: 0; z-index: 5; }
.nav { transition: transform 0.25s ease-out; }
.nav.hidden { transform: translateY(-100%); }
.layout {
    display: grid;
    grid-template-columns: 170px 1fr;
    align-items: start;
}
</style>
```

Im Repository gibt es außerdem eine ganzseitige Demo in reinem HTML unter `demo/index.html`. Führe `pnpm build` aus und öffne sie im Browser.
