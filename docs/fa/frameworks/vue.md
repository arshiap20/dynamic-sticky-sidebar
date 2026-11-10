# Vue

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

به Vue نسخه‌ی 3.3 یا جدیدتر نیاز دارد. سه روش برای استفاده وجود دارد: یک **دایرکتیو** برای تمپلیت‌ها، یک **composable** برای کنترل کامل، و یک **پلاگین** که دایرکتیو را به‌صورت global ثبت می‌کند.

## دایرکتیو `v-sticky-sidebar` {#v-sticky-sidebar-directive}

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

دایرکتیو هنگام mount نمونه را می‌سازد، هر بار که آبجکت bind‌شده تغییر کند آپشن‌ها را دوباره اعمال می‌کند، و هنگام unmount نمونه را destroy می‌کند.

::: tip آبجکت آپشن‌ها را ثابت نگه دارید
دایرکتیو آپشن‌ها را بر اساس identity مقایسه می‌کند. یک object literal اینلاین (`v-sticky-sidebar="{ header: '.x' }"`) در هر render یک آبجکت جدید است، پس آپشن‌ها هر بار دوباره اعمال می‌شوند. این کار هزینه‌ی کمی دارد، اما یک تابع `subscribe` اینلاین در هر render نمونه را از نو راه‌اندازی می‌کند. آپشن‌ها را در `<script setup>` تعریف کنید یا از `computed` استفاده کنید.
:::

### ثبت global {#global-registration}

```ts
import { createApp } from 'vue';
import { StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';

createApp(App).use(StickySidebarPlugin).mount('#app');
```

بعد از آن، `v-sticky-sidebar` در همه‌ی کامپوننت‌ها در دسترس است.

## composable `useStickySidebar` {#usestickysidebar-composable}

یک template ref برای سایدبار و آپشن‌ها را پاس بدهید:

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

- **`target`**: یک ref یا getter که یک المنت **یا یک نمونه‌ی کامپوننت** را نگه می‌دارد؛ در حالت دوم از `$el` آن استفاده می‌شود. وقتی target تغییر کند (`v-if`، یک المنت دیگر)، نمونه‌ی قبلی destroy و نمونه‌ی جدید ساخته می‌شود.
- **`header` / `scroller`**: یک مقدار، یک ref یا یک getter؛ نمونه‌های کامپوننت هم unwrap می‌شوند.
- **`options`**: یک آبجکت ساده، یک آبجکت `ref` / `reactive` یا یک getter. تغییرات reactive خودکار اعمال می‌شوند.
- `{ update, refresh }` را برمی‌گرداند که تا وقتی نمونه ساخته نشده کاری انجام نمی‌دهند.
- آن را داخل `setup()` / `<script setup>` صدا بزنید؛ هنگام unmount خودش پاک‌سازی می‌کند.

### آپشن‌های reactive {#reactive-options}

```ts
const gap = ref(16);

useStickySidebar(sidebar, () => ({
    header: '.site-header',
    gap: gap.value,
}));

gap.value = 24; // applied automatically after the next render
```

### چند هدر {#several-headers}

```ts
const topBar = ref<HTMLElement | null>(null);
const subNav = ref<HTMLElement | null>(null);

useStickySidebar(sidebar, () => ({
    header: [topBar.value, subNav.value].filter(Boolean) as HTMLElement[],
}));
```

### هدرهای وابسته به Pinia / store {#pinia-store-driven-headers}

```ts
const ui = useUiStore();

useStickySidebar(sidebar, {
    header: '.site-header',
    subscribe: (update) => ui.$subscribe(update),
});
```

## Nuxt و VuePress {#nuxt-vuepress}

هم دایرکتیو و هم composable فقط بعد از mount به DOM دست می‌زنند، پس برای SSR امن هستند. در Nuxt، پلاگین را در یک client plugin ثبت کنید یا دایرکتیو را در هر کامپوننت جداگانه import کنید. دموی زنده‌ی همین مستندات یک صفحه‌ی VuePress است که از `useStickySidebar` استفاده می‌کند.

## تایپ‌ها {#types}

```ts
import type { VueStickySidebarOptions, StickySidebarOptions, HeaderInput, Px } from 'dynamic-sticky-sidebar/vue';
```
