# العرض الحي

مرّر **داخل المربع**. يستخدم هذا العرض الخيار [`scroller`](./api/README.md#scroller) ليعمل داخل الصفحة.

- مع تفعيل **شريط جانبي طويل**: يكون الشريط الجانبي أطول من المربع. عند التمرير لأسفل، يتحرك حتى يظهر آخر عنصر فيه، ثم يلتصق بالأسفل. وعند التمرير لأعلى، يعود ويلتصق تحت الترويسة.
- مع تفعيل **إخفاء القائمة الفرعية تلقائيًا**: ينزلق الصف الثاني من الترويسة بعيدًا عند التمرير لأسفل ويعود عند التمرير لأعلى. والشريط الجانبي يتبعه.
- أوقف **شريط جانبي طويل** لترى شريطًا جانبيًا قصيرًا مثبّتًا ببساطة تحت الترويسة.
- يعرض العدّاد المسافة بين الشريط الجانبي وكلٍّ من أعلى المربع وأسفله.
- يفتح زر **تكبير** العرض في نافذة كبيرة فوق هذه الصفحة. أغلقها بـ <kbd>Esc</kbd>، أو بزر **إغلاق**، أو بالنقر خارجها.
- يعرض زر **فتح في علامة تبويب جديدة** العرض في صفحة مستقلة. هناك تُمرَّر نافذة المتصفح نفسها، دون الخيار `scroller`، تمامًا كما في موقع حقيقي.

<StickyDemo :height="620" />

## الشيفرة المصدرية {#source}

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

يوجد أيضًا في المستودع عرض بصفحة كاملة بـ HTML عادي في `demo/index.html`. شغّل `pnpm build` ثم افتحه في المتصفح.
