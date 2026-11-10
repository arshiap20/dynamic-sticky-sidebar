# دموی زنده

**داخل کادر** اسکرول کنید. این دمو از آپشن [`scroller`](./api/README.md#scroller) استفاده می‌کند تا بتواند داخل صفحه اجرا شود.

- با روشن بودن **سایدبار بلند**: سایدبار از کادر بلندتر است. هنگام اسکرول به پایین، حرکت می‌کند تا آخرین آیتمش دیده شود و بعد به پایین می‌چسبد. هنگام اسکرول به بالا، برمی‌گردد و زیر هدر می‌چسبد.
- با روشن بودن **پنهان شدن خودکار منوی فرعی**: ردیف دوم هدر هنگام اسکرول به پایین کنار می‌رود و هنگام اسکرول به بالا برمی‌گردد. سایدبار هم دنبالش می‌کند.
- **سایدبار بلند** را خاموش کنید تا ببینید سایدبار کوتاه به‌سادگی زیر هدر می‌چسبد.
- شمارنده، فاصله‌ی سایدبار از بالا و پایین کادر را نشان می‌دهد.
- **بزرگ کردن** دمو را در یک پنجره‌ی بزرگ روی همین صفحه باز می‌کند. با <kbd>Esc</kbd>، دکمه‌ی بستن یا کلیک بیرون از پنجره آن را ببندید.
- **باز کردن در تب جدید** دمو را در یک صفحه‌ی جداگانه نشان می‌دهد. آنجا خود پنجره‌ی مرورگر اسکرول می‌شود، بدون آپشن `scroller`، دقیقاً مثل یک سایت واقعی.

<StickyDemo :height="620" />

## سورس {#source}

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

یک دموی HTML ساده‌ی تمام‌صفحه هم در مخزن، در مسیر `demo/index.html`، وجود دارد. `pnpm build` را اجرا کنید و آن را در مرورگر باز کنید.
