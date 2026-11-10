# Démo en direct

Faites défiler **à l'intérieur du cadre**. Cette démo utilise l'option [`scroller`](./api/README.md#scroller) pour pouvoir fonctionner au sein de la page.

- **Barre latérale haute** activée : la barre latérale est plus haute que le cadre. En descendant, elle avance jusqu'à ce que son dernier élément soit visible, puis se fixe en bas. En remontant, elle revient et se fixe sous l'en-tête.
- **Sous-navigation auto-masquée** activée : la seconde rangée de l'en-tête disparaît quand vous descendez et revient quand vous remontez. La barre latérale la suit.
- Désactivez **Barre latérale haute** pour voir une barre latérale courte simplement fixée sous l'en-tête.
- Le compteur affiche la distance entre la barre latérale et le haut et le bas du cadre.
- **Agrandir** ouvre la démo dans une grande fenêtre au-dessus de cette page. Fermez-la avec <kbd>Esc</kbd>, le bouton Fermer ou un clic à l'extérieur.
- **Ouvrir dans un nouvel onglet** affiche la démo sur sa propre page. C'est alors la fenêtre du navigateur qui défile, sans option `scroller`, exactement comme sur un vrai site.

<StickyDemo :height="620" />

## Source {#source}

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

Le dépôt contient aussi une démo pleine page en HTML pur, dans `demo/index.html`. Lancez `pnpm build` puis ouvrez-la dans un navigateur.
