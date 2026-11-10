---
home: true
title: Sticky-Sidebar in beide Richtungen
pageClass: landing
heroText: null
tagline: null
footer: MIT-Lizenz
---

<LandingHero />

<LandingProblems />

<section class="landing-section landing-setup">
<div>

<p class="landing-eyebrow">Einrichtung</p>

## Ein Funktionsaufruf, eine CSS-Regel {#one-function-call-one-css-rule}

Übergib die Sidebar und den Header. Setze beide Spalten in ein Grid, das die Sidebar nicht streckt. Scroll-Handling, Header-Tracking und Aufräumen übernimmt die Bibliothek.

Das browsereigene `position: sticky` bewegt die Sidebar in jedem Frame. Die Bibliothek ändert die Sticky-Regeln nur, wenn sich die Scrollrichtung umkehrt oder der Header bewegt.

[So funktioniert es →](/de/guide/how-it-works.md)

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

<p class="landing-eyebrow">Dokumentation</p>
<h2 class="landing-section-title">Weiterlesen</h2>

<nav class="landing-links" aria-label="Dokumentation">
    <RouteLink to="/de/guide/layout.html"><strong>Layout</strong><span>Grid, Flex oder Block – und die Overflow-Falle.</span></RouteLink>
    <RouteLink to="/de/guide/headers.html"><strong>Dynamische Header</strong><span>Mehrere Zeilen, Animationen und Stores.</span></RouteLink>
    <RouteLink to="/de/api/"><strong>API-Referenz</strong><span>Alle Optionen und Instanzmethoden.</span></RouteLink>
    <RouteLink to="/de/demo.html"><strong>Live-Demo</strong><span>Hohe Sidebar und automatisch ausblendende Navigation zum Ausprobieren.</span></RouteLink>
</nav>

</section>
