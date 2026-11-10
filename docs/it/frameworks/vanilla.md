# Vanilla JS

```js
import { stickySidebar } from 'dynamic-sticky-sidebar';
```

## Uso di base {#basic-usage}

```js
const sidebar = stickySidebar('#sidebar', {
    header: '.site-header',
    gap: 16,
    media: '(min-width: 768px)',
});
```

Il primo argomento è un elemento o un selettore. Se non trova nulla lancia un errore, quindi crea l'istanza solo quando l'elemento esiste.

`stickySidebar()` restituisce un'[istanza](../api/README.md#instance):

```js
sidebar.update();          // recalculate now
sidebar.refresh();         // re-query header selectors / scroller and restart
sidebar.setOptions({ … }); // replace options
sidebar.destroy();         // remove listeners and restore inline styles
```

## Senza bundler {#without-a-bundler}

Il pacchetto include una build IIFE che definisce una variabile globale `StickySidebar`:

```html
<script src="https://unpkg.com/dynamic-sticky-sidebar"></script>
<script>
    StickySidebar.stickySidebar('#sidebar', { header: '.site-header' });
</script>
```

Funziona anche `https://cdn.jsdelivr.net/npm/dynamic-sticky-sidebar`. In produzione fissa una versione, per esempio `dynamic-sticky-sidebar@0.1.0`.

Il file CDN è una build di produzione minificata (circa 2 kB gzip), quindi non stampa gli avvisi di sviluppo descritti in [Risoluzione dei problemi](../guide/troubleshooting.md). Se ti servono, in sviluppo usa il pacchetto npm con un bundler.

## CommonJS {#commonjs}

```js
const { stickySidebar } = require('dynamic-sticky-sidebar');
```

## Aggiornare le opzioni {#updating-options}

`setOptions` **sostituisce** le opzioni. Non le unisce, quindi passa l'insieme completo:

```js
const base = { header: '.site-header', media: '(min-width: 768px)' };
const sidebar = stickySidebar('#sidebar', { ...base, gap: 16 });

sidebar.setOptions({ ...base, gap: 24 });
```

Cambiare `gap`, `offsetTop` o `offsetBottom` provoca solo un ricalcolo. Cambiare `header`, `media`, `scroller` o `subscribe` riavvia l'istanza.

## Dentro un pannello scorrevole {#inside-a-scrollable-panel}

Quando a scorrere non è la pagina ma un contenitore (app shell, dashboard), passa il contenitore come `scroller`. Le posizioni vengono allora misurate rispetto a quel contenitore:

```js
stickySidebar('#filters', {
    scroller: '#panel',
    header: '#panel-toolbar',
});
```

## Single-page app {#single-page-apps}

Chiama `destroy()` quando la vista viene smontata. Rimuove tutti i listener e gli observer e ripristina gli stili inline originali della sidebar. Se usi React o Vue, gli [adapter](./react.md) lo fanno al posto tuo.
