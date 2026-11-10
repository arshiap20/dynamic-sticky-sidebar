# Vue

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

Richiede Vue 3.3 o successivo. Puoi usarla in tre modi: una **direttiva** per i template, un **composable** per il controllo completo e un **plugin** che registra la direttiva a livello globale.

## Direttiva `v-sticky-sidebar` {#v-sticky-sidebar-directive}

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

La direttiva crea l'istanza al mount, riapplica le opzioni ogni volta che l'oggetto associato cambia e distrugge l'istanza all'unmount.

::: tip Mantieni stabile l'oggetto delle opzioni
La direttiva confronta le opzioni per identità. Un oggetto letterale inline (`v-sticky-sidebar="{ header: '.x' }"`) è un oggetto nuovo a ogni render, quindi le opzioni vengono riapplicate ogni volta. È un'operazione leggera, ma una funzione `subscribe` inline riavvierebbe l'istanza a ogni render. Definisci le opzioni in `<script setup>` oppure usa `computed`.
:::

### Registrazione globale {#global-registration}

```ts
import { createApp } from 'vue';
import { StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';

createApp(App).use(StickySidebarPlugin).mount('#app');
```

A questo punto `v-sticky-sidebar` è disponibile in ogni componente.

## Composable `useStickySidebar` {#usestickysidebar-composable}

Passa una template ref per la sidebar e le opzioni:

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

- **`target`**: una ref o un getter che contiene un elemento **o un'istanza di componente**, di cui viene usato `$el`. Quando il target cambia (`v-if`, un elemento diverso), la vecchia istanza viene distrutta e ne viene creata una nuova.
- **`header` / `scroller`**: un valore, una ref o un getter; anche le istanze di componente vengono risolte.
- **`options`**: un oggetto semplice, un oggetto `ref` / `reactive` o un getter. Le modifiche reattive vengono applicate automaticamente.
- Restituisce `{ update, refresh }`, che non fanno nulla finché l'istanza non esiste.
- Chiamalo dentro `setup()` / `<script setup>`; fa pulizia da solo all'unmount.

### Opzioni reattive {#reactive-options}

```ts
const gap = ref(16);

useStickySidebar(sidebar, () => ({
    header: '.site-header',
    gap: gap.value,
}));

gap.value = 24; // applied automatically after the next render
```

### Più header {#several-headers}

```ts
const topBar = ref<HTMLElement | null>(null);
const subNav = ref<HTMLElement | null>(null);

useStickySidebar(sidebar, () => ({
    header: [topBar.value, subNav.value].filter(Boolean) as HTMLElement[],
}));
```

### Header guidati da Pinia o da uno store {#pinia-store-driven-headers}

```ts
const ui = useUiStore();

useStickySidebar(sidebar, {
    header: '.site-header',
    subscribe: (update) => ui.$subscribe(update),
});
```

## Nuxt e VuePress {#nuxt-vuepress}

Sia la direttiva sia il composable accedono al DOM solo dopo il mount, quindi sono sicuri in SSR. Con Nuxt, registra il plugin in un plugin lato client oppure importa la direttiva nei singoli componenti. La demo dal vivo di questa documentazione è una pagina VuePress che usa `useStickySidebar`.

## Tipi {#types}

```ts
import type { VueStickySidebarOptions, StickySidebarOptions, HeaderInput, Px } from 'dynamic-sticky-sidebar/vue';
```
