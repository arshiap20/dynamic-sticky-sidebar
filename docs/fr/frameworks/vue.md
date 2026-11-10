# Vue

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

Nécessite Vue 3.3 ou une version ultérieure. Il existe trois façons de l'utiliser : une **directive** pour les templates, un **composable** pour un contrôle complet, et un **plugin** qui enregistre la directive globalement.

## La directive `v-sticky-sidebar` {#v-sticky-sidebar-directive}

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

La directive crée l'instance au montage, réapplique les options chaque fois que l'objet lié change, et détruit l'instance au démontage.

::: tip Gardez un objet d'options stable
La directive compare les options par identité. Un objet littéral inline (`v-sticky-sidebar="{ header: '.x' }"`) est un nouvel objet à chaque rendu : les options sont donc réappliquées à chaque fois. C'est peu coûteux, mais une fonction `subscribe` inline redémarrerait l'instance à chaque rendu. Définissez les options dans `<script setup>` ou utilisez `computed`.
:::

### Enregistrement global {#global-registration}

```ts
import { createApp } from 'vue';
import { StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';

createApp(App).use(StickySidebarPlugin).mount('#app');
```

`v-sticky-sidebar` est alors disponible dans tous les composants.

## Le composable `useStickySidebar` {#usestickysidebar-composable}

Passez une ref de template pour la barre latérale, ainsi que les options :

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

- **`target`** : une ref ou un getter contenant un élément **ou une instance de composant** ; c'est alors son `$el` qui est utilisé. Quand la cible change (`v-if`, un autre élément), l'ancienne instance est détruite et une nouvelle est créée.
- **`header` / `scroller`** : une valeur, une ref ou un getter ; les instances de composant sont également déballées.
- **`options`** : un objet simple, un objet `ref` / `reactive` ou un getter. Les changements réactifs sont appliqués automatiquement.
- Renvoie `{ update, refresh }`, qui ne font rien tant que l'instance n'existe pas.
- Appelez-le dans `setup()` / `<script setup>` ; il fait le ménage au démontage.

### Options réactives {#reactive-options}

```ts
const gap = ref(16);

useStickySidebar(sidebar, () => ({
    header: '.site-header',
    gap: gap.value,
}));

gap.value = 24; // applied automatically after the next render
```

### Plusieurs en-têtes {#several-headers}

```ts
const topBar = ref<HTMLElement | null>(null);
const subNav = ref<HTMLElement | null>(null);

useStickySidebar(sidebar, () => ({
    header: [topBar.value, subNav.value].filter(Boolean) as HTMLElement[],
}));
```

### En-têtes pilotés par Pinia ou un store {#pinia-store-driven-headers}

```ts
const ui = useUiStore();

useStickySidebar(sidebar, {
    header: '.site-header',
    subscribe: (update) => ui.$subscribe(update),
});
```

## Nuxt et VuePress {#nuxt-vuepress}

La directive comme le composable ne touchent au DOM qu'après le montage : ils sont donc compatibles SSR. Avec Nuxt, enregistrez le plugin dans un plugin client ou importez la directive composant par composant. La démo en direct de cette documentation est une page VuePress qui utilise `useStickySidebar`.

## Types {#types}

```ts
import type { VueStickySidebarOptions, StickySidebarOptions, HeaderInput, Px } from 'dynamic-sticky-sidebar/vue';
```
