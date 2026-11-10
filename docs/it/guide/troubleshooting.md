# Risoluzione dei problemi

::: tip
Gli avvisi in console descritti qui sotto compaiono solo nelle build di sviluppo. Le build di produzione e la build CDN li rimuovono per risparmiare byte.
:::

## La sidebar non resta bloccata {#the-sidebar-doesn-t-stick-at-all}

- **È allungata.** In grid/flex la sidebar occupa per impostazione predefinita l'intera altezza della riga. Aggiungi `align-items: start` al genitore o `align-self: start` alla sidebar. Vedi [Layout](./layout.md#the-sidebar-must-not-stretch).
- **Un antenato ha `overflow` impostato.** `overflow: hidden | auto | scroll` su qualsiasi antenato lo trasforma nel contenitore sticky. Usa `overflow: clip`, oppure passa quell'elemento come `scroller` se è davvero il contenitore di scroll.
- **`media` non corrisponde.** L'istanza resta inattiva finché la media query è falsa.
- **All'avvio è nascosta.** Se la sidebar non ha altezza all'avvio (`display: none`, dentro una tab chiusa), l'istanza resta in attesa. Un `ResizeObserver` la rileva quando diventa visibile, oppure puoi chiamare `update()`.

## Errore "element not found" {#element-not-found-error}

`stickySidebar('#sidebar')` lancia un errore quando il selettore non trova nulla. Crea l'istanza dopo che l'elemento è nel DOM: dopo `DOMContentLoaded`, in `onMounted` / `useEffect`, oppure usa gli adapter per i framework, che se ne occupano al posto tuo.

## Il selettore dell'header non trova nulla {#header-selector-matched-nothing}

```
[dynamic-sticky-sidebar] header selector ".site-header" matched no elements
```

All'avvio dell'istanza il selettore `header` non ha trovato nulla, quindi la sidebar si blocca alla cima del viewport e può finire sotto il tuo header. Controlla il selettore, oppure chiama `refresh()` dopo che l'header è stato renderizzato.

## Scroller non trovato {#scroller-not-found}

```
[dynamic-sticky-sidebar] scroller "#app" not found, using the window
```

L'opzione `scroller` non corrisponde a nessun elemento. Controlla il selettore, oppure passa direttamente l'elemento.

## Avviso in console su grid / row-flex {#console-warning-about-grid-row-flex}

```
[dynamic-sticky-sidebar] parent is not grid / row-flex, so scrolling up uses a JS fallback …
```

Il **genitore diretto** della sidebar è un block. Funziona comunque, ma lo scroll verso l'alto può restare indietro di un frame. Assegna al genitore `display: grid; align-items: start`. Vedi [Layout a blocchi](./layout.md#block-layout-fallback).

## La sidebar si sovrappone all'header o lascia un vuoto sotto di esso {#the-sidebar-overlaps-or-leaves-a-gap-under-the-header}

- Assicurati di passare in `header` **tutte** le righe dell'header. Con un selettore vengono usati tutti gli elementi trovati.
- Se l'header si sposta per via di una classe su un antenato, la libreria non può accorgersene. Chiama `update()`, oppure usa [`subscribe`](./headers.md#use-subscribe).
- Gli header sostituiti nel DOM dopo l'avvio richiedono [`refresh()`](../api/README.md#refresh).
- Vuoi più spazio? Aumenta `gap` (predefinito `16`) o aggiungi `offsetTop`.

## Il contenuto della sidebar cambia altezza {#the-sidebar-content-changes-height}

Non serve fare nulla. Un `ResizeObserver` osserva la sidebar e il suo genitore. Se l'altezza della sidebar cambia mentre è rilasciata, viene riancorata alla sua posizione attuale sullo schermo e le posizioni bloccate vengono ricalcolate.

## Rendering lato server {#server-side-rendering}

Il core accede a `document` e `window` solo quando viene chiamata `stickySidebar()`. L'hook React viene eseguito in una callback ref e l'entry React è marcata `"use client"`. Il composable e la direttiva Vue vengono eseguiti dopo il mount. Puoi importarli tutti senza problemi in app SSR (Next.js, Nuxt, VuePress, …).
