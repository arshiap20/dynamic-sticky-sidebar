# Come funziona

La maggior parte degli script per sidebar sticky sposta la sidebar con `transform` o `top` a ogni evento di scroll. Dato che gli eventi di scroll arrivano quando il browser ha già scrollato, la sidebar resta sempre indietro di un frame e scatta. Questa libreria segue l'approccio opposto: **il lavoro di ogni frame lo fa il `position: sticky` del browser, e il JS cambia solo le regole.**

## Due posizioni bloccate {#two-pinned-positions}

A ogni aggiornamento la libreria calcola due posizioni per il bordo superiore della sidebar, relative al viewport (o allo scroller):

```
max = header bottom + offsetTop + gap        // pinned under the header
min = viewport height − sidebar height − offsetBottom − gap   // bottom aligned
```

Se la sidebar ci sta (`max − min < 1px`), viene semplicemente bloccata a `top: max` e non succede nient'altro.

## Quattro stati {#four-states}

Quando la sidebar è più alta dello spazio disponibile, passa attraverso quattro stati:

<StateDiagram />

| Stato | Vincolo sticky | Cosa vedi |
| --- | --- | --- |
| **TOP** | `top: max` | Bloccata sotto l'header |
| **DOWN** | `top: auto` + offset con `margin-top` | Scorre con la pagina, mentre va verso il basso |
| **BOTTOM** | `top: min` | Bordo inferiore bloccato al fondo del viewport |
| **UP** | `bottom: …` + offset con `margin-bottom` | Scorre con la pagina, mentre va verso l'alto |

Le transizioni avvengono solo quando **si inverte la direzione di scroll** o la sidebar raggiunge un bordo. Scorrendo verso il basso passa da TOP a DOWN fino a BOTTOM. Scorrendo verso l'alto passa da BOTTOM a UP e torna a TOP.

Se inverti la direzione a metà strada (DOWN ↔ UP), la sidebar viene rilasciata di nuovo dal punto in cui si trova, quindi non salta mai.

Quando la sidebar è "rilasciata" (DOWN / UP), la libreria imposta `top`/`bottom` ad `auto` e aggiunge un margine pari alla distanza attuale della sidebar dalla sua posizione naturale. La sidebar resta esattamente dov'era sullo schermo e da lì in poi scorre in modo nativo con la pagina. Quando raggiunge il bordo opposto, il posizionamento sticky del browser riprende il controllo e la libreria si limita a registrare il nuovo stato.

### Perché grid o flex {#why-grid-or-flex}

Per rilasciare la sidebar verso l'alto, bisogna ancorarla al **fondo** del suo contenitore. In un genitore grid o row-flex, la libreria imposta `align-self: flex-end` più un margine inferiore, e la sidebar risale in modo nativo.

Nel flusso block non c'è modo di allineare un elemento in basso, quindi durante lo scroll verso l'alto la libreria ripiega sul calcolo di `top` in JS. Vedi [Requisiti di layout](./layout.md#block-layout-fallback).

## Seguire l'header {#following-the-header}

Quando l'header si muove, `max` cambia. Nello stato TOP la libreria scrive subito il nuovo `top`, così la sidebar si muove insieme all'header.

Poiché un'animazione dell'header può avvenire anche senza scroll, la libreria avvia un breve ciclo di `requestAnimationFrame` ogni volta che qualcosa potrebbe muoversi:

- uno scroll, un resize o una callback di `ResizeObserver`;
- un evento `transitionrun` / `animationstart` o una modifica di attributo su un header.

Il ciclo ricalcola a ogni frame finché `max` continua a cambiare o finché su un header è in corso un'animazione finita, e si ferma da solo dopo **3 frame di inattività** quando tutto si è stabilizzato. Quando la pagina è ferma, non gira nulla.

## Piccoli dettagli {#small-details}

- **Vengono scritte solo le modifiche reali.** Prima di toccare il DOM, `top` e `bottom` vengono confrontati con l'ultimo valore scritto, e i valori sono arrotondati a 0.01px.
- **Lo scroll anchoring è disattivato** sulla sidebar (`overflow-anchor: none`), così il browser non contrasta le regolazioni del margine.
- **I ridimensionamenti della sidebar** (contenuto caricato, accordion aperti) vengono rilevati da `ResizeObserver`. Una sidebar rilasciata viene riancorata alla sua posizione attuale sullo schermo.
- **Solo listener passivi.** Il listener di scroll è passivo e si limita a programmare un frame.
