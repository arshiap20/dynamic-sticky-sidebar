---
home: true
title: Sidebar sticky bidirezionale
pageClass: landing
heroText: null
tagline: null
footer: Licenza MIT
---

<LandingHero />

<LandingProblems />

<section class="landing-section landing-setup">
<div>

<p class="landing-eyebrow">Configurazione</p>

## Una chiamata di funzione, una regola CSS {#one-function-call-one-css-rule}

Indica la sidebar e l'header. Metti le due colonne in una grid che non allunga la sidebar. Alla gestione dello scroll, al tracciamento dell'header e alla pulizia finale ci pensa la libreria.

Il `position: sticky` nativo del browser sposta la sidebar a ogni frame. La libreria cambia le regole sticky solo quando si inverte la direzione di scroll o quando l'header si muove.

[Come funziona →](/it/guide/how-it-works.md)

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

<p class="landing-eyebrow">Documentazione</p>
<h2 class="landing-section-title">Da leggere dopo</h2>

<nav class="landing-links" aria-label="Documentazione">
    <RouteLink to="/it/guide/layout.html"><strong>Layout</strong><span>Grid, flex o block, e la trappola dell'overflow.</span></RouteLink>
    <RouteLink to="/it/guide/headers.html"><strong>Header dinamici</strong><span>Più righe, animazioni e store.</span></RouteLink>
    <RouteLink to="/it/api/"><strong>Riferimento API</strong><span>Tutte le opzioni e i metodi dell'istanza.</span></RouteLink>
    <RouteLink to="/it/demo.html"><strong>Demo dal vivo</strong><span>Attiva una sidebar alta e una nav a scomparsa.</span></RouteLink>
</nav>

</section>
