---
home: true
title: Two-way sticky sidebar
pageClass: landing
heroText: null
tagline: null
footer: MIT Licensed
---

<LandingHero />

<LandingProblems />

<section class="landing-section landing-setup">
<div>

<p class="landing-eyebrow">Setup</p>

## One function call, one CSS rule

Point it at the sidebar and the header. Put both columns in a grid that doesn't stretch the sidebar. Scroll handling, header tracking and cleanup are done for you.

The browser's own `position: sticky` moves the sidebar on every frame. The library only changes the sticky rules when the scroll direction flips or the header moves.

[How it works →](/guide/how-it-works.md)

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

<p class="landing-eyebrow">Docs</p>
<h2 class="landing-section-title">Read next</h2>

<nav class="landing-links" aria-label="Documentation">
    <RouteLink to="/guide/layout.html"><strong>Layout</strong><span>Grid, flex or block, and the overflow trap.</span></RouteLink>
    <RouteLink to="/guide/headers.html"><strong>Dynamic headers</strong><span>Multiple rows, animations and stores.</span></RouteLink>
    <RouteLink to="/api/"><strong>API reference</strong><span>Every option and instance method.</span></RouteLink>
    <RouteLink to="/demo.html"><strong>Live demo</strong><span>Toggle a tall sidebar and an auto-hiding nav.</span></RouteLink>
</nav>

</section>
