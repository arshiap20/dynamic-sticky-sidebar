---
home: true
title: سایدبار چسبان دوطرفه
pageClass: landing
heroText: null
tagline: null
footer: منتشرشده با مجوز MIT
---

<LandingHero />

<LandingProblems />

<section class="landing-section landing-setup">
<div>

<p class="landing-eyebrow">راه‌اندازی</p>

## یک فراخوانی تابع، یک قانون CSS {#one-function-call-one-css-rule}

سایدبار و هدر را به آن معرفی کنید. هر دو ستون را داخل یک grid بگذارید که سایدبار را کش نمی‌دهد. مدیریت اسکرول، دنبال کردن هدر و پاک‌سازی را خود کتابخانه انجام می‌دهد.

حرکت سایدبار در هر فریم را خود مرورگر با `position: sticky` انجام می‌دهد. کتابخانه فقط وقتی جهت اسکرول عوض می‌شود یا هدر جابه‌جا می‌شود، قوانین sticky را تغییر می‌دهد.

[چطور کار می‌کند ←](/fa/guide/how-it-works.md)

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

<p class="landing-eyebrow">مستندات</p>
<h2 class="landing-section-title">ادامه‌ی مطالعه</h2>

<nav class="landing-links" aria-label="مستندات">
    <RouteLink to="/fa/guide/layout.html"><strong>چیدمان</strong><span>grid، flex یا block، و دام overflow.</span></RouteLink>
    <RouteLink to="/fa/guide/headers.html"><strong>هدرهای پویا</strong><span>چند ردیف هدر، انیمیشن‌ها و استورها.</span></RouteLink>
    <RouteLink to="/fa/api/"><strong>مرجع API</strong><span>همه‌ی آپشن‌ها و متدهای نمونه.</span></RouteLink>
    <RouteLink to="/fa/demo.html"><strong>دموی زنده</strong><span>سایدبار بلند و منوی خودپنهان را روشن و خاموش کنید.</span></RouteLink>
</nav>

</section>
