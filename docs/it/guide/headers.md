# Header dinamici

Passa il tuo header e la sidebar si posiziona subito sotto, ovunque si trovi l'header in quel momento.

```js
stickySidebar('#sidebar', { header: '.site-header' });
```

## Dove si posiziona la sidebar {#where-the-sidebar-sits}

Quando è bloccata, il bordo superiore della sidebar si trova a:

```
lowest visible header bottom + offsetTop + gap
```

- **Il fondo visibile più basso.** Con più header vince quello che arriva più in basso.
- **Gli header nascosti vengono ignorati.** Un header con altezza zero (`display: none`, `hidden`, compresso) o che è scivolato completamente sopra il viewport conta come `0`.
- La misura è relativa al viewport, oppure allo [`scroller`](../api/README.md#scroller) se ne usi uno.

## Più righe di header {#several-header-rows}

Passa un selettore che le individui tutte, un array o una `NodeList`:

```js
stickySidebar('#sidebar', { header: '#top-bar, #sub-nav' });

stickySidebar('#sidebar', { header: [topBar, subNav] });

stickySidebar('#sidebar', { header: document.querySelectorAll('[data-sticky-header]') });
```

È lo schema tipico di una barra superiore fissa più una sub-nav che scorre via quando scorri verso il basso. Quando la sub-nav sale, la sidebar sale con lei. Quando ricompare, la sidebar scende con lei.

::: tip
I selettori vengono risolti una sola volta, all'avvio dell'istanza. Se in seguito aggiungi o sostituisci elementi dell'header, chiama [`refresh()`](../api/README.md#refresh).
:::

## Cosa viene tracciato automaticamente {#what-is-tracked-automatically}

Per nessuno di questi casi devi collegare nulla. La libreria si accorge del cambiamento e segue l'header frame per frame finché non si stabilizza.

| Cambiamento sull'elemento header | Rilevato tramite |
| --- | --- |
| Cambi di altezza (compressione, espansione, cambio di contenuto) | `ResizeObserver` |
| Modifiche agli attributi `class`, `style` o `hidden` | `MutationObserver` |
| Transizioni CSS e animazioni keyframe | `transitionrun` / `animationstart`, poi seguite tramite `getAnimations()` fino alla fine |
| Web Animations API (`el.animate()`) | `getAnimations()` |
| Animazioni JS che scrivono `style.transform` a ogni frame | `MutationObserver` su `style` |
| Ridimensionamento della pagina o dello scroller | Evento `resize`, `ResizeObserver` sulla sidebar e sul suo genitore |

## Quando devi dare una mano {#when-you-need-to-help}

La libreria osserva **gli elementi header stessi**. Non può vedere i cambiamenti che spostano un header senza toccare quell'elemento, per esempio:

- una classe applicata a `<body>` o a un wrapper, quando l'header non ha una transizione propria;
- un header la cui posizione dipende da una variabile CSS impostata su un antenato;
- un offset che vive nello stato dell'app e non è ancora nel DOM.

In questi casi, scegli uno dei tre agganci qui sotto.

### Chiama `update()` {#call-update}

```js
const sidebar = stickySidebar('#sidebar', { header: '.site-header' });

document.body.classList.toggle('compact-header');
sidebar.update();
```

### Usa `subscribe` {#use-subscribe}

Se l'header è guidato da uno store, lascia che la libreria si iscriva ai suoi cambiamenti:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    subscribe: (update) => headerStore.subscribe(update), // must return an unsubscribe function
});
```

`update` viene chiamata a ogni cambiamento dello store. La libreria chiama la tua funzione di disiscrizione al `destroy()`.

### Usa un getter per `offsetTop` {#use-an-offsettop-getter}

`offsetTop` e `offsetBottom` accettano una funzione che viene letta a ogni aggiornamento:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    offsetTop: () => (cookieBanner.isOpen ? cookieBanner.height : 0),
});
```

Abbina un getter a `subscribe` o a `update()`, così la libreria sa quando rileggerlo.

## Nessun header {#no-header}

Senza `header`, la sidebar si blocca `offsetTop + gap` pixel sotto la cima del viewport (o dello scroller):

```js
stickySidebar('#sidebar', { offsetTop: 64 }); // fixed 64px header you don't want to observe
```
