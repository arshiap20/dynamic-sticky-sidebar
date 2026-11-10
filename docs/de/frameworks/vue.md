# Vue

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

Benötigt Vue 3.3 oder neuer. Es gibt drei Möglichkeiten: eine **Direktive** für Templates, ein **Composable** für volle Kontrolle und ein **Plugin**, das die Direktive global registriert.

## `v-sticky-sidebar`-Direktive {#v-sticky-sidebar-directive}

```vue
<script setup>
import { vStickySidebar } from 'dynamic-sticky-sidebar/vue';

const sticky = { header: '.site-header', gap: 16, media: '(min-width: 768px)' };
</script>

<template>
    <div class="layout">
        <aside v-sticky-sidebar="sticky">…</aside>
        <main>…</main>
    </div>
</template>
```

Die Direktive erstellt die Instanz beim Mounten, wendet die Optionen bei jeder Änderung des gebundenen Objekts erneut an und zerstört die Instanz beim Unmounten.

::: tip Halte das Options-Objekt stabil
Die Direktive vergleicht Optionen per Identität. Ein Inline-Objektliteral (`v-sticky-sidebar="{ header: '.x' }"`) ist bei jedem Render ein neues Objekt, daher werden die Optionen jedes Mal neu angewendet. Das ist günstig, aber eine Inline-Funktion für `subscribe` würde die Instanz bei jedem Render neu starten. Definiere die Optionen in `<script setup>` oder verwende `computed`.
:::

### Globale Registrierung {#global-registration}

```ts
import { createApp } from 'vue';
import { StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';

createApp(App).use(StickySidebarPlugin).mount('#app');
```

Danach steht `v-sticky-sidebar` in jeder Komponente zur Verfügung.

## `useStickySidebar`-Composable {#usestickysidebar-composable}

Übergib eine Template-Ref für die Sidebar und die Optionen:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useStickySidebar } from 'dynamic-sticky-sidebar/vue';

const header = ref<HTMLElement | null>(null);
const sidebar = ref<HTMLElement | null>(null);

const { update, refresh } = useStickySidebar(sidebar, {
    header,
    gap: 16,
    media: '(min-width: 768px)',
});
</script>

<template>
    <header ref="header" class="site-header">…</header>
    <div class="layout">
        <aside ref="sidebar">…</aside>
        <main>…</main>
    </div>
</template>
```

- **`target`**: eine Ref oder ein Getter mit einem Element **oder einer Komponenteninstanz**; bei Letzterer wird ihr `$el` verwendet. Ändert sich das Ziel (`v-if`, ein anderes Element), wird die alte Instanz zerstört und eine neue erstellt.
- **`header` / `scroller`**: ein Wert, eine Ref oder ein Getter; auch hier werden Komponenteninstanzen ausgepackt.
- **`options`**: ein einfaches Objekt, ein `ref`- / `reactive`-Objekt oder ein Getter. Reaktive Änderungen werden automatisch übernommen.
- Gibt `{ update, refresh }` zurück. Beide tun nichts, solange die Instanz noch nicht existiert.
- Rufe es innerhalb von `setup()` / `<script setup>` auf; beim Unmounten räumt es selbst auf.

### Reaktive Optionen {#reactive-options}

```ts
const gap = ref(16);

useStickySidebar(sidebar, () => ({
    header: '.site-header',
    gap: gap.value,
}));

gap.value = 24; // applied automatically after the next render
```

### Mehrere Header {#several-headers}

```ts
const topBar = ref<HTMLElement | null>(null);
const subNav = ref<HTMLElement | null>(null);

useStickySidebar(sidebar, () => ({
    header: [topBar.value, subNav.value].filter(Boolean) as HTMLElement[],
}));
```

### Header über Pinia / Store steuern {#pinia-store-driven-headers}

```ts
const ui = useUiStore();

useStickySidebar(sidebar, {
    header: '.site-header',
    subscribe: (update) => ui.$subscribe(update),
});
```

## Nuxt & VuePress {#nuxt-vuepress}

Direktive und Composable greifen erst nach dem Mounten auf das DOM zu und sind daher SSR-sicher. Registriere das Plugin in Nuxt in einem Client-Plugin oder importiere die Direktive pro Komponente. Die Live-Demo in dieser Dokumentation ist eine VuePress-Seite, die `useStickySidebar` verwendet.

## Typen {#types}

```ts
import type { VueStickySidebarOptions, StickySidebarOptions, HeaderInput, Px } from 'dynamic-sticky-sidebar/vue';
```
