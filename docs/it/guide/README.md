# Introduzione

**dynamic-sticky-sidebar** mantiene visibile una sidebar mentre la pagina scorre, anche quando la sidebar è più alta dello schermo e l'header sopra di essa continua a cambiare dimensione.

## Il problema {#the-problem}

Un semplice `position: sticky; top: 80px` funziona bene finché non succede una di queste cose:

- **La sidebar è più alta del viewport.** Si blocca in alto e la sua parte inferiore resta irraggiungibile fino alla fine della pagina.
- **L'header si nasconde e ricompare.** Molti siti fanno scorrere via l'header (o una seconda riga di navigazione) quando scorri verso il basso e lo riportano quando scorri verso l'alto. Un `top` fisso lascia un vuoto oppure finisce sotto l'header.
- **L'header cambia altezza.** I banner si chiudono, le barre di ricerca si espandono e gli header si comprimono in una modalità compatta.

Le soluzioni abituali ascoltano l'evento `scroll` e impostano `transform` o `top` a ogni frame, causando scatti e ritardi, oppure richiedono offset regolati a mano per ogni stato dell'header.

## Cosa fa questa libreria {#what-this-library-does}

- **Sticky bidirezionale.** Quando scorri verso il basso, una sidebar alta si muove con il contenuto finché il suo **fondo** non raggiunge il viewport, poi si blocca. Quando scorri verso l'alto, torna indietro finché la sua **cima** non raggiunge l'header, poi si blocca. Una sidebar corta resta semplicemente bloccata sotto l'header.
- **Tracciamento dell'header in tempo reale.** Passi l'elemento (o gli elementi) dell'header e la sidebar si posiziona sotto il bordo visibile più basso. Segue l'header frame per frame mentre scorre via, si comprime o cambia dimensione.
- **Prima di tutto nativo.** Ogni frame di scroll è gestito dal `position: sticky` del browser. Il JS cambia solo i vincoli sticky (`top`, `bottom`, un margine) quando si inverte la direzione di scroll o quando l'header si muove. Vedi [Come funziona](./how-it-works.md).

## Pacchetti {#packages}

C'è un solo pacchetto npm con tre entry point:

| Import | Da usare per |
| --- | --- |
| `dynamic-sticky-sidebar` | Core senza framework: [`stickySidebar()`](../frameworks/vanilla.md) |
| `dynamic-sticky-sidebar/react` | [Hook `useStickySidebar` e componente `<StickySidebar>`](../frameworks/react.md) |
| `dynamic-sticky-sidebar/vue` | [Composable, direttiva `v-sticky-sidebar` e plugin](../frameworks/vue.md) |

React (≥ 16.8) e Vue (≥ 3.3) sono peer dependency opzionali. Installa solo quello che usi.

I tipi sono inclusi nel pacchetto e vengono risolti sia con `moduleResolution: "bundler"` / `"node16"` sia con la vecchia impostazione `"node"`.

## Dimensione del bundle {#bundle-size}

Misurata sulla build pubblicata, minificata con `NODE_ENV=production` come farebbe il tuo bundler. Le entry React e Vue includono il core.

| Entry | Minificato | gzip | brotli |
| --- | --- | --- | --- |
| `dynamic-sticky-sidebar` | 3.4 kB | 1.8 kB | 1.6 kB |
| `dynamic-sticky-sidebar/react` | 4.6 kB | 2.2 kB | 2.0 kB |
| `dynamic-sticky-sidebar/vue` | 4.2 kB | 2.1 kB | 1.9 kB |
| Build CDN `<script>` | 3.8 kB | 2.0 kB | 1.8 kB |

- **Nessuna dipendenza.** React e Vue sono usati solo dai rispettivi entry point.
- **Gli avvisi di sviluppo vengono rimossi in produzione.** I suggerimenti in console descritti in [Risoluzione dei problemi](./troubleshooting.md) sono racchiusi in `process.env.NODE_ENV !== 'production'`, quindi Vite, webpack, Next.js e Nuxt li eliminano dai bundle di produzione. La build di sviluppo del core è più grande di circa 0.2 kB (gzip).
- **Tree-shakeable.** Il pacchetto è marcato `sideEffects: false` e il componente React è annotato come puro, quindi gli export non usati vengono scartati.

Esegui `pnpm size` nel repository per riprodurre questi numeri.

## Supporto dei browser {#browser-support}

Qualsiasi browser con `position: sticky`, `ResizeObserver` e `MutationObserver`, cioè tutti i browser evergreen attuali. Sia le build ESM/CJS sia la build CDN `<script>` hanno come target ES2020.
