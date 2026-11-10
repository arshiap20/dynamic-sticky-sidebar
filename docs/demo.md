# Live Demo

Scroll **inside the box**. This demo uses the [`scroller`](./api/README.md#scroller) option so it can run inside the page.

- **Tall sidebar** on: the sidebar is taller than the box. Scrolling down, it moves until its last item is visible, then sticks to the bottom. Scrolling up, it comes back and sticks under the header.
- **Auto-hide sub-nav** on: the second header row slides away on scroll down and returns on scroll up. The sidebar follows it.
- Turn **Tall sidebar** off to see a short sidebar simply pinned under the header.
- The counter shows the sidebar's distance from the top and bottom of the box.
- **Expand** opens the demo in a large window over this page. Close it with <kbd>Esc</kbd>, the Close button or a click outside.
- **Open in new tab** shows the demo on its own page. There the browser window scrolls, with no `scroller` option, exactly like a real site.

<StickyDemo :height="620" />

## Source

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

There is also a full-page plain-HTML demo in the repository at `demo/index.html`. Run `pnpm build` and open it in a browser.
