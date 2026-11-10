---
home: true
title: Barre latérale sticky bidirectionnelle
pageClass: landing
heroText: null
tagline: null
footer: Sous licence MIT
---

<LandingHero />

<LandingProblems />

<section class="landing-section landing-setup">
<div>

<p class="landing-eyebrow">Mise en place</p>

## Un appel de fonction, une règle CSS {#one-function-call-one-css-rule}

Indiquez la barre latérale et l'en-tête, puis placez les deux colonnes dans une grille qui n'étire pas la barre latérale. La gestion du défilement, le suivi de l'en-tête et le nettoyage sont pris en charge pour vous.

C'est le `position: sticky` natif du navigateur qui déplace la barre latérale à chaque frame. La bibliothèque ne modifie les règles sticky que lorsque le sens du défilement s'inverse ou que l'en-tête bouge.

[Comment ça marche →](/fr/guide/how-it-works.md)

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

<p class="landing-eyebrow">Documentation</p>
<h2 class="landing-section-title">À lire ensuite</h2>

<nav class="landing-links" aria-label="Documentation">
    <RouteLink to="/fr/guide/layout.html"><strong>Mise en page</strong><span>Grid, flex ou bloc, et le piège d'overflow.</span></RouteLink>
    <RouteLink to="/fr/guide/headers.html"><strong>En-têtes dynamiques</strong><span>Plusieurs rangées, animations et stores.</span></RouteLink>
    <RouteLink to="/fr/api/"><strong>Référence de l'API</strong><span>Toutes les options et méthodes d'instance.</span></RouteLink>
    <RouteLink to="/fr/demo.html"><strong>Démo en direct</strong><span>Activez une barre latérale haute et une navigation qui se masque.</span></RouteLink>
</nav>

</section>
