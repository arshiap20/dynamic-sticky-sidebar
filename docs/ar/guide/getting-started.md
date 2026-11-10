# البدء

## التثبيت {#install}

::: code-tabs#pm

@tab npm

```bash
npm i dynamic-sticky-sidebar
```

@tab pnpm

```bash
pnpm add dynamic-sticky-sidebar
```

@tab yarn

```bash
yarn add dynamic-sticky-sidebar
```

@tab CDN

```html
<script src="https://unpkg.com/dynamic-sticky-sidebar"></script>
<!-- exposes window.StickySidebar.stickySidebar -->
```

:::

## 1. تخطيط الصفحة {#_1-lay-out-the-page}

ضع الشريط الجانبي بجانب المحتوى داخل **شبكة (grid)** (أو flex باتجاه صفّي)، وامنعه من التمدد إلى ارتفاع الصف كاملًا:

```html
<header class="site-header">…</header>

<div class="layout">
    <aside id="sidebar">…</aside>
    <main>…</main>
</div>
```

```css
.site-header {
    position: sticky;
    top: 0;
    z-index: 10;
}

.layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 32px;
    align-items: start; /* important: the sidebar keeps its own height */
}
```

::: tip لماذا الشبكة؟
يتيح الأب من نوع grid أو flex صفّي للمكتبة أن تستخدم سلوك التثبيت **الأصلي** في الاتجاهين. التخطيطات الكتلية تعمل أيضًا، لكن التمرير لأعلى يعتمد حينها على حل بديل بـ JS. راجع [متطلبات التخطيط](./layout.md).
:::

## 2. ربط الشريط الجانبي {#_2-attach-the-sidebar}

::: code-tabs#fw

@tab Vanilla

```js
import { stickySidebar } from 'dynamic-sticky-sidebar';

const sidebar = stickySidebar('#sidebar', {
    header: '.site-header',
    gap: 16,
    media: '(min-width: 768px)',
});

// later, e.g. when the page unmounts
sidebar.destroy();
```

@tab React

```tsx
import { StickySidebar } from 'dynamic-sticky-sidebar/react';

export function Layout({ children }) {
    return (
        <div className="layout">
            <StickySidebar header=".site-header" gap={16} media="(min-width: 768px)">
                …
            </StickySidebar>
            <main>{children}</main>
        </div>
    );
}
```

@tab Vue

```vue
<script setup>
import { vStickySidebar } from 'dynamic-sticky-sidebar/vue';

const sticky = { header: '.site-header', gap: 16, media: '(min-width: 768px)' };
</script>

<template>
    <div class="layout">
        <aside v-sticky-sidebar="sticky">…</aside>
        <main><slot /></main>
    </div>
</template>
```

:::

هذا كل شيء. مرّر لأسفل، وسيتبع الشريط الجانبي المحتوى حتى نهايته ثم يلتصق. مرّر لأعلى، وسيعود ويلتصق تحت الترويسة أينما كانت في تلك اللحظة.

## 3. جرّبها {#_3-try-it}

مرّر داخل المربع أدناه. تنزلق القائمة الفرعية بعيدًا عند التمرير لأسفل وتعود عند التمرير لأعلى، والشريط الجانبي يتبعها.

<StickyDemo />

## الخطوات التالية {#next-steps}

- [متطلبات التخطيط](./layout.md): grid مقابل flex مقابل التخطيط الكتلي، والأخطاء الشائعة
- [الترويسات الديناميكية](./headers.md): ترويسات متعددة، وترويسات تحرّكها JS، وإزاحات مستمدة من الحالة
- [مرجع API](../api/README.md): كل الخيارات ودوال النسخة
