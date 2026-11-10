# Layout-Anforderungen

Die Bibliothek baut auf `position: sticky` auf. Es gelten also die üblichen Sticky-Regeln – plus eine weitere für das Elternelement der Sidebar.

## Empfohlen: Grid {#recommended-grid}

```css
.layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: start;
}
```

Mit einem **Grid**- oder **Zeilen-Flex**-Elternelement laufen beide Scrollrichtungen über native Sticky-Positionierung. JS passt die Vorgaben nur an, wenn sich die Richtung ändert, daher hinkt die Sidebar dem Scrollen nie hinterher.

Flex in Zeilenrichtung funktioniert genauso:

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

## Die Sidebar darf nicht gestreckt werden {#the-sidebar-must-not-stretch}

Grid- und Flex-Elemente strecken sich standardmäßig auf die Zeilenhöhe. Eine gestreckte Sidebar ist so hoch wie die Inhaltsspalte. Sticky hat dann keinen Spielraum, und es passiert nichts. Verwende eine dieser Möglichkeiten:

- `align-items: start` (Grid) / `align-items: flex-start` (Flex) am Elternelement, oder
- `align-self: start` an der Sidebar selbst.

Das Elternelement selbst muss so hoch sein wie der scrollende Inhalt. Das ist automatisch der Fall, wenn sich Sidebar und Hauptinhalt eine Zeile teilen.

## Block-Layout (Fallback) {#block-layout-fallback}

Ist das Elternelement ein normaler Block – etwa wenn die Sidebar in einem gestreckten Spalten-`<div>` steckt –, funktioniert die Bibliothek trotzdem:

- Das Scrollen nach **unten** ist nativ, wie im Grid-Modus.
- Das Scrollen nach **oben** nutzt ein per JS gesetztes `top`, das bei schnellem Scrollen einen Frame hinterherhinken kann.

In Entwicklungs-Builds gibt die Bibliothek dazu einmalig einen Hinweis in der Konsole aus:

```
[dynamic-sticky-sidebar] parent is not grid / row-flex, so scrolling up uses a JS fallback that can lag a frame. …
```

Um das zu beheben, gib dem **direkten Elternelement** der Sidebar `display: grid` (ein einspaltiges Grid genügt):

```css
.sidebar-column {
    display: grid;
    align-items: start;
}
```

## Overflow an Vorfahren {#overflow-on-ancestors}

Wie bei jedem Sticky-Element gilt: Hat ein Vorfahre zwischen der Sidebar und ihrem Scroller `overflow: hidden | auto | scroll`, wird er zum Sticky-Container, und das Kleben an der Seite funktioniert nicht mehr. Typische Übeltäter sind Seiten-Wrapper mit `overflow-x: hidden`, die horizontalen Überlauf verstecken sollen.

- Verwende `overflow: clip` (oder `overflow-x: clip`) statt `hidden`. Das schneidet ab, ohne einen Scroll-Container zu erzeugen.
- Liegt die Sidebar tatsächlich in einem scrollbaren Panel, übergib dieses Panel als Option [`scroller`](../api/README.md#scroller).

## Kleine Bildschirme {#small-screens}

Auf Mobilgeräten steht die Sidebar meist über oder unter dem Inhalt und sollte nicht kleben. Mit `media` läuft die Bibliothek nur, solange das Layout zweispaltig ist:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    media: '(min-width: 768px)',
});
```

Trifft die Query nicht mehr zu, entfernt die Bibliothek ihre Listener und stellt die ursprünglichen Inline-Styles der Sidebar wieder her. Sobald die Query wieder zutrifft, startet sie erneut.

## Styles, die die Bibliothek setzt {#styles-the-library-touches}

Solange sie aktiv ist, schreibt die Bibliothek diese Inline-Styles auf das Sidebar-Element:

| Eigenschaft | Warum |
| --- | --- |
| `position` | Wird auf `sticky` gesetzt, falls nicht schon vorhanden |
| `top`, `bottom` | Die Sticky-Vorgaben |
| `margin-top`, `margin-bottom` | Halten die Sidebar an Ort und Stelle, solange sie zwischen den fixierten Zuständen „freigegeben“ ist |
| `align-self` | Wird beim Hochscrollen im Grid-/Flex-Modus auf `flex-end` gesetzt |
| `overflow-anchor` | Wird auf `none` gesetzt, damit Scroll-Anchoring nicht gegen die Anpassungen arbeitet |

Die ursprünglichen Inline-Werte werden beim Start gespeichert und bei `destroy()` oder wenn `media` nicht mehr zutrifft wiederhergestellt. Lege eigene Abstände in einem Stylesheet oder einer Klasse ab, nicht in Inline-Styles, die du änderst, während die Bibliothek läuft.
