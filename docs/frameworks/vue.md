# Vue

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

Requires Vue 3.3 or newer. There are three ways to use it: a **directive** for templates, a **composable** for full control, and a **plugin** that registers the directive globally.

## `v-sticky-sidebar` directive

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

The directive creates the instance on mount, re-applies options whenever the bound object changes, and destroys the instance on unmount.

::: tip Keep the options object stable
The directive compares options by identity. An inline object literal (`v-sticky-sidebar="{ header: '.x' }"`) is a new object on every render, so options are re-applied each time. That is cheap, but an inline `subscribe` function would restart the instance on every render. Define options in `<script setup>` or use `computed`.
:::

### Global registration

```ts
import { createApp } from 'vue';
import { StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';

createApp(App).use(StickySidebarPlugin).mount('#app');
```

`v-sticky-sidebar` is then available in every component.

## `useStickySidebar` composable

Pass a template ref for the sidebar and the options:

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

- **`target`**: a ref or getter holding an element **or a component instance**; its `$el` is used. When the target changes (`v-if`, a different element), the old instance is destroyed and a new one is created.
- **`header` / `scroller`**: a value, a ref or a getter, and component instances are unwrapped too.
- **`options`**: a plain object, a `ref` / `reactive` object or a getter. Reactive changes are applied automatically.
- Returns `{ update, refresh }`, which do nothing until the instance exists.
- Call it inside `setup()` / `<script setup>`; it cleans up on unmount.

### Reactive options

```ts
const gap = ref(16);

useStickySidebar(sidebar, () => ({
    header: '.site-header',
    gap: gap.value,
}));

gap.value = 24; // applied automatically after the next render
```

### Several headers

```ts
const topBar = ref<HTMLElement | null>(null);
const subNav = ref<HTMLElement | null>(null);

useStickySidebar(sidebar, () => ({
    header: [topBar.value, subNav.value].filter(Boolean) as HTMLElement[],
}));
```

### Pinia / store-driven headers

```ts
const ui = useUiStore();

useStickySidebar(sidebar, {
    header: '.site-header',
    subscribe: (update) => ui.$subscribe(update),
});
```

## Nuxt & VuePress

Both the directive and the composable only touch the DOM after mount, so they are SSR-safe. With Nuxt, register the plugin in a client plugin or import the directive per component. The live demo in these docs is a VuePress page using `useStickySidebar`.

## Types

```ts
import type { VueStickySidebarOptions, StickySidebarOptions, HeaderInput, Px } from 'dynamic-sticky-sidebar/vue';
```
