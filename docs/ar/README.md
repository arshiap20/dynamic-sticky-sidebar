---
home: true
title: شريط جانبي لاصق في الاتجاهين
pageClass: landing
heroText: null
tagline: null
footer: مرخّص بموجب رخصة MIT
---

<LandingHero />

<LandingProblems />

<section class="landing-section landing-setup">
<div>

<p class="landing-eyebrow">الإعداد</p>

## استدعاء دالة واحد، وقاعدة CSS واحدة {#one-function-call-one-css-rule}

وجّه المكتبة إلى الشريط الجانبي والترويسة، وضع العمودين في شبكة (grid) لا تمدّ الشريط الجانبي. أما معالجة التمرير وتتبّع الترويسة والتنظيف فتتولاها المكتبة عنك.

خاصية `position: sticky` في المتصفح هي التي تحرّك الشريط الجانبي في كل إطار. ولا تغيّر المكتبة قواعد التثبيت إلا حين ينعكس اتجاه التمرير أو تتحرك الترويسة.

[كيف تعمل ←](/ar/guide/how-it-works.md)

</div>
<div>

::: code-tabs#fw

@tab Vanilla

```js
import { stickySidebar } from 'dynamic-sticky-sidebar';

stickySidebar('#sidebar', {
    header: '.site-header',
    media: '(min-width: 768px)',
});
```

@tab React

```tsx
import { StickySidebar } from 'dynamic-sticky-sidebar/react';

<StickySidebar header=".site-header" media="(min-width: 768px)">
    <Filters />
</StickySidebar>
```

@tab Vue

```vue
<script setup>
import { vStickySidebar } from 'dynamic-sticky-sidebar/vue';
const sticky = { header: '.site-header', media: '(min-width: 768px)' };
</script>

<template>
    <aside v-sticky-sidebar="sticky"><Filters /></aside>
</template>
```

:::

```css
.layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: start; /* keep the sidebar at its own height */
}
```

</div>
</section>

<section class="landing-section">

<p class="landing-eyebrow">التوثيق</p>
<h2 class="landing-section-title">اقرأ بعد ذلك</h2>

<nav class="landing-links" aria-label="التوثيق">
    <RouteLink to="/ar/guide/layout.html"><strong>التخطيط</strong><span>شبكة أو flex أو كتلي، وفخ overflow.</span></RouteLink>
    <RouteLink to="/ar/guide/headers.html"><strong>الترويسات الديناميكية</strong><span>صفوف متعددة ورسوم متحركة ومخازن حالة.</span></RouteLink>
    <RouteLink to="/ar/api/"><strong>مرجع API</strong><span>كل خيار وكل دالة في النسخة.</span></RouteLink>
    <RouteLink to="/ar/demo.html"><strong>العرض الحي</strong><span>جرّب شريطًا جانبيًا طويلًا وقائمة تختفي تلقائيًا.</span></RouteLink>
</nav>

</section>
