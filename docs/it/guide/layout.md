# Requisiti di layout

La libreria si basa su `position: sticky`, quindi valgono le solite regole dello sticky, più una che riguarda il genitore della sidebar.

## Consigliato: grid {#recommended-grid}

```css
.layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: start;
}
```

Con un genitore **grid** o **row flex**, entrambe le direzioni di scroll si basano sul posizionamento sticky nativo. Il JS regola i vincoli solo quando cambia la direzione, così la sidebar non resta mai indietro rispetto allo scroll.

Il row flex funziona allo stesso modo:

```css
.layout {
    display: flex;
    flex-direction: row; /* or row-reverse */
    align-items: flex-start;
}
.layout > aside {
    flex: 0 0 280px;
}
```

## La sidebar non deve allungarsi {#the-sidebar-must-not-stretch}

Per impostazione predefinita, gli elementi grid e flex si allungano fino all'altezza della riga. Una sidebar allungata è alta quanto la colonna del contenuto, quindi lo sticky non ha spazio per muoversi e non succede nulla. Usa una di queste soluzioni:

- `align-items: start` (grid) / `align-items: flex-start` (flex) sul genitore, oppure
- `align-self: start` sulla sidebar stessa.

Il genitore, invece, deve essere alto quanto il contenuto che scorre. È il comportamento predefinito quando sidebar e contenuto principale condividono la stessa riga.

## Layout a blocchi (fallback) {#block-layout-fallback}

Se il genitore è un normale block, per esempio quando la sidebar è racchiusa in un `<div>` di colonna allungato, la libreria funziona comunque:

- lo scroll verso il **basso** è nativo, come in modalità grid;
- lo scroll verso l'**alto** usa un `top` gestito dal JS, che con uno scroll veloce può restare indietro di un frame.

Nelle build di sviluppo la libreria lo segnala una volta in console:

```
[dynamic-sticky-sidebar] parent is not grid / row-flex, so scrolling up uses a JS fallback that can lag a frame. …
```

Per risolvere, assegna `display: grid` al **genitore diretto** della sidebar (basta una grid a colonna singola):

```css
.sidebar-column {
    display: grid;
    align-items: start;
}
```

## Overflow sugli antenati {#overflow-on-ancestors}

Come per qualsiasi elemento sticky, un antenato tra la sidebar e il suo scroller con `overflow: hidden | auto | scroll` diventa il contenitore sticky e impedisce alla sidebar di restare bloccata rispetto alla pagina. I colpevoli più comuni sono i wrapper di pagina che usano `overflow-x: hidden` per nascondere l'overflow orizzontale.

- Usa `overflow: clip` (o `overflow-x: clip`) al posto di `hidden`: ritaglia il contenuto senza creare un contenitore di scroll.
- Se la sidebar si trova davvero dentro un pannello scorrevole, passa quel pannello come opzione [`scroller`](../api/README.md#scroller).

## Schermi piccoli {#small-screens}

Su mobile la sidebar di solito si dispone sopra o sotto il contenuto e non dovrebbe essere sticky. Usa `media` in modo che la libreria sia attiva solo quando il layout ha due colonne:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    media: '(min-width: 768px)',
});
```

Quando la query smette di corrispondere, la libreria rimuove i suoi listener e ripristina gli stili inline originali della sidebar. Riparte quando la query torna a corrispondere.

## Stili modificati dalla libreria {#styles-the-library-touches}

Mentre è attiva, la libreria scrive questi stili inline sull'elemento della sidebar:

| Proprietà | Perché |
| --- | --- |
| `position` | Impostata a `sticky` se non lo è già |
| `top`, `bottom` | I vincoli sticky |
| `margin-top`, `margin-bottom` | Tengono ferma la sidebar mentre è "rilasciata" tra uno stato bloccato e l'altro |
| `align-self` | Impostata a `flex-end` durante lo scroll verso l'alto in modalità grid/flex |
| `overflow-anchor` | Impostata a `none` perché lo scroll anchoring non contrasti le regolazioni |

I valori inline originali vengono salvati all'avvio della libreria e ripristinati con `destroy()` o quando `media` smette di corrispondere. Tieni la tua spaziatura in un foglio di stile o in una classe, non in stili inline che modifichi mentre la libreria è in esecuzione.
