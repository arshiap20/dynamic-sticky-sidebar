# Vanilla JS

```js
import { stickySidebar } from 'dynamic-sticky-sidebar';
```

## Grundlegende Verwendung {#basic-usage}

```js
const sidebar = stickySidebar('#sidebar', {
    header: '.site-header',
    gap: 16,
    media: '(min-width: 768px)',
});
```

Das erste Argument ist ein Element oder ein Selektor. Findet sich nichts, wird ein Fehler geworfen. Erstelle die Instanz also erst, wenn das Element existiert.

`stickySidebar()` gibt eine [Instanz](../api/README.md#instance) zurück:

```js
sidebar.update();          // recalculate now
sidebar.refresh();         // re-query header selectors / scroller and restart
sidebar.setOptions({ … }); // replace options
sidebar.destroy();         // remove listeners and restore inline styles
```

## Ohne Bundler {#without-a-bundler}

Das Paket enthält einen IIFE-Build, der eine globale Variable `StickySidebar` definiert:

```html
<script src="https://unpkg.com/dynamic-sticky-sidebar"></script>
<script>
    StickySidebar.stickySidebar('#sidebar', { header: '.site-header' });
</script>
```

`https://cdn.jsdelivr.net/npm/dynamic-sticky-sidebar` funktioniert ebenfalls. Lege in Produktion eine Version fest, zum Beispiel `dynamic-sticky-sidebar@0.1.0`.

Die CDN-Datei ist ein minifizierter Produktions-Build (etwa 2 kB gzip). Sie gibt daher die unter [Fehlerbehebung](../guide/troubleshooting.md) beschriebenen Entwicklungswarnungen nicht aus. Wenn du sie sehen willst, verwende während der Entwicklung das npm-Paket mit einem Bundler.

## CommonJS {#commonjs}

```js
const { stickySidebar } = require('dynamic-sticky-sidebar');
```

## Optionen aktualisieren {#updating-options}

`setOptions` **ersetzt** die Optionen. Es führt sie nicht zusammen, übergib also den vollständigen Satz:

```js
const base = { header: '.site-header', media: '(min-width: 768px)' };
const sidebar = stickySidebar('#sidebar', { ...base, gap: 16 });

sidebar.setOptions({ ...base, gap: 24 });
```

Eine Änderung an `gap`, `offsetTop` oder `offsetBottom` löst nur eine Neuberechnung aus. Eine Änderung an `header`, `media`, `scroller` oder `subscribe` startet die Instanz neu.

## In einem scrollbaren Panel {#inside-a-scrollable-panel}

Scrollt nicht die Seite selbst, sondern ein Container (App-Shells, Dashboards), übergib den Container als `scroller`. Positionen werden dann relativ zu diesem Container gemessen:

```js
stickySidebar('#filters', {
    scroller: '#panel',
    header: '#panel-toolbar',
});
```

## Single-Page-Apps {#single-page-apps}

Rufe `destroy()` auf, wenn die View entfernt wird. Das entfernt alle Listener und Observer und stellt die ursprünglichen Inline-Styles der Sidebar wieder her. Mit React oder Vue übernehmen das die [Adapter](./react.md) für dich.
