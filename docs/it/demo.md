# Demo dal vivo

Scorri **dentro il riquadro**. Questa demo usa l'opzione [`scroller`](./api/README.md#scroller) per poter funzionare all'interno della pagina.

- Con **Sidebar alta** attiva, la sidebar è più alta del riquadro. Scorrendo verso il basso si muove finché non è visibile il suo ultimo elemento, poi si blocca in fondo. Scorrendo verso l'alto torna indietro e si blocca sotto l'header.
- Con **Sub-nav a scomparsa** attiva, la seconda riga dell'header scorre via quando scorri verso il basso e ricompare quando scorri verso l'alto. La sidebar la segue.
- Disattiva **Sidebar alta** per vedere una sidebar corta semplicemente bloccata sotto l'header.
- Il contatore mostra la distanza della sidebar dalla cima e dal fondo del riquadro.
- **Espandi** apre la demo in una finestra grande sopra questa pagina. Chiudila con <kbd>Esc</kbd>, con il pulsante Chiudi o con un clic all'esterno.
- **Apri in una nuova scheda** mostra la demo in una pagina a sé. Lì scorre la finestra del browser, senza l'opzione `scroller`, esattamente come in un sito reale.

<StickyDemo :height="620" />

## Sorgente {#source}

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

Nel repository c'è anche una demo a pagina intera in HTML puro, in `demo/index.html`. Esegui `pnpm build` e aprila in un browser.
