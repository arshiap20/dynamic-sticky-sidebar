# Vue

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

يتطلب Vue 3.3 أو أحدث. وهناك ثلاث طرق لاستخدامها: **موجّه (directive)** للقوالب، و**دالة composable** للتحكم الكامل، و**إضافة (plugin)** تسجّل الموجّه على مستوى التطبيق.

## الموجّه `v-sticky-sidebar` {#v-sticky-sidebar-directive}

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

يُنشئ الموجّه النسخة عند التركيب (mount)، ويعيد تطبيق الخيارات كلما تغيّر الكائن المربوط، ويدمّر النسخة عند الإزالة (unmount).

::: tip حافظ على ثبات كائن الخيارات
يقارن الموجّه الخيارات بالهوية (identity). الكائن الحرفي المضمّن (`v-sticky-sidebar="{ header: '.x' }"`) كائن جديد في كل عرض، لذا يُعاد تطبيق الخيارات في كل مرة. هذا رخيص التكلفة، لكن دالة `subscribe` المضمّنة ستعيد تشغيل النسخة في كل عرض. عرّف الخيارات في `<script setup>` أو استخدم `computed`.
:::

### التسجيل العام {#global-registration}

```ts
import { createApp } from 'vue';
import { StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';

createApp(App).use(StickySidebarPlugin).mount('#app');
```

بعدها يصبح `v-sticky-sidebar` متاحًا في كل مكوّن.

## دالة composable باسم `useStickySidebar` {#usestickysidebar-composable}

مرّر مرجع قالب (template ref) للشريط الجانبي، ثم الخيارات:

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

- **`target`**: مرجع (ref) أو دالة جلب تحمل عنصرًا **أو نسخة مكوّن**، ويُستخدم حينها `$el` الخاص بها. حين يتغير الهدف (`v-if`، أو عنصر مختلف)، تُدمَّر النسخة القديمة وتُنشأ نسخة جديدة.
- **`header` / `scroller`**: قيمة، أو ref، أو دالة جلب، وتُفكّ نسخ المكوّنات أيضًا.
- **`options`**: كائن عادي، أو كائن `ref` / `reactive`، أو دالة جلب. تُطبَّق التغييرات التفاعلية تلقائيًا.
- تُعيد `{ update, refresh }`، ولا تفعلان شيئًا إلى أن توجد النسخة.
- استدعها داخل `setup()` / `<script setup>`؛ فهي تنظّف نفسها عند الإزالة.

### الخيارات التفاعلية {#reactive-options}

```ts
const gap = ref(16);

useStickySidebar(sidebar, () => ({
    header: '.site-header',
    gap: gap.value,
}));

gap.value = 24; // applied automatically after the next render
```

### عدة ترويسات {#several-headers}

```ts
const topBar = ref<HTMLElement | null>(null);
const subNav = ref<HTMLElement | null>(null);

useStickySidebar(sidebar, () => ({
    header: [topBar.value, subNav.value].filter(Boolean) as HTMLElement[],
}));
```

### ترويسات تتحكم فيها Pinia أو مخازن الحالة {#pinia-store-driven-headers}

```ts
const ui = useUiStore();

useStickySidebar(sidebar, {
    header: '.site-header',
    subscribe: (update) => ui.$subscribe(update),
});
```

## Nuxt وVuePress {#nuxt-vuepress}

لا يمسّ الموجّه ولا دالة composable شجرة DOM إلا بعد التركيب، لذا فكلاهما آمن مع SSR. في Nuxt، سجّل الإضافة داخل إضافة خاصة بالعميل (client plugin) أو استورد الموجّه في كل مكوّن على حدة. والعرض الحي في هذا التوثيق صفحة VuePress تستخدم `useStickySidebar`.

## الأنواع {#types}

```ts
import type { VueStickySidebarOptions, StickySidebarOptions, HeaderInput, Px } from 'dynamic-sticky-sidebar/vue';
```
