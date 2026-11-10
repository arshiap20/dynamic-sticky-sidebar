# So funktioniert es

Die meisten Sticky-Sidebar-Skripte verschieben die Sidebar bei jedem Scroll-Event per `transform` oder `top`. Da Scroll-Events erst eintreffen, nachdem der Browser bereits gescrollt hat, hinkt die Sidebar immer einen Frame hinterher und ruckelt. Diese Bibliothek geht den umgekehrten Weg: **Das browsereigene `position: sticky` erledigt die Arbeit in jedem Frame, und JS ändert nur die Regeln.**

## Zwei fixierte Positionen {#two-pinned-positions}

Bei jedem Update berechnet die Bibliothek zwei Positionen für den oberen Rand der Sidebar, relativ zum Viewport (oder Scroller):

```
max = header bottom + offsetTop + gap        // pinned under the header
min = viewport height − sidebar height − offsetBottom − gap   // bottom aligned
```

Passt die Sidebar hinein (`max − min < 1px`), wird sie einfach bei `top: max` fixiert, und sonst passiert nichts.

## Vier Zustände {#four-states}

Ist die Sidebar höher als der verfügbare Platz, durchläuft sie vier Zustände:

<StateDiagram />

| Zustand | Sticky-Vorgabe | Was du siehst |
| --- | --- | --- |
| **TOP** | `top: max` | Unter dem Header fixiert |
| **DOWN** | `top: auto` + `margin-top`-Offset | Scrollt mit der Seite, auf dem Weg nach unten |
| **BOTTOM** | `top: min` | Unterer Rand am unteren Viewport-Rand fixiert |
| **UP** | `bottom: …` + `margin-bottom`-Offset | Scrollt mit der Seite, auf dem Weg nach oben |

Übergänge passieren nur, wenn sich die **Scrollrichtung umkehrt** oder die Sidebar einen Rand erreicht. Beim Runterscrollen geht es von TOP über DOWN zu BOTTOM. Beim Hochscrollen geht es von BOTTOM über UP zurück zu TOP.

Kehrt sich die Richtung mittendrin um (DOWN ↔ UP), wird die Sidebar an ihrer aktuellen Position erneut freigegeben. Sie springt also nie.

Wird die Sidebar „freigegeben“ (DOWN / UP), setzt die Bibliothek `top`/`bottom` auf `auto` und fügt einen Margin hinzu, der dem aktuellen Abstand der Sidebar von ihrer natürlichen Position entspricht. Die Sidebar bleibt genau dort auf dem Bildschirm, wo sie war, und scrollt von da an nativ mit der Seite. Erreicht sie den anderen Rand, übernimmt wieder die Sticky-Positionierung des Browsers, und die Bibliothek merkt sich nur den neuen Zustand.

### Warum Grid oder Flex {#why-grid-or-flex}

Um die Sidebar nach oben freizugeben, muss sie am **unteren** Rand ihres Containers verankert sein. In einem Grid- oder Zeilen-Flex-Elternelement setzt die Bibliothek `align-self: flex-end` plus einen unteren Margin, und die Sidebar scrollt nativ nach oben.

Im Block-Fluss lässt sich ein Element nicht am unteren Rand ausrichten. Daher berechnet die Bibliothek beim Hochscrollen ersatzweise `top` per JS. Siehe [Layout-Anforderungen](./layout.md#block-layout-fallback).

## Dem Header folgen {#following-the-header}

Bewegt sich der Header, ändert sich `max`. Im Zustand TOP schreibt die Bibliothek sofort den neuen `top`-Wert, sodass die Sidebar mit dem Header mitwandert.

Weil eine Header-Animation auch ohne Scrollen laufen kann, startet die Bibliothek eine kurze `requestAnimationFrame`-Schleife, sobald sich etwas bewegen könnte:

- bei einem Scroll, einem Resize oder einem `ResizeObserver`-Callback;
- bei einem `transitionrun`- / `animationstart`-Event oder einer Attributänderung an einem Header.

Die Schleife rechnet in jedem Frame neu, solange sich `max` ändert oder auf einem Header eine endliche Animation läuft. Sie stoppt von selbst nach **3 Leerlauf-Frames**, sobald sich alles beruhigt hat. Solange die Seite ruht, läuft nichts.

## Kleine Details {#small-details}

- **Nur echte Änderungen werden geschrieben.** `top` und `bottom` werden mit dem zuletzt geschriebenen Wert verglichen, bevor das DOM angefasst wird, und Werte werden auf 0,01px gerundet.
- **Scroll-Anchoring ist deaktiviert** an der Sidebar (`overflow-anchor: none`), damit der Browser nicht gegen die Margin-Anpassungen arbeitet.
- **Größenänderungen der Sidebar** (nachgeladener Inhalt, geöffnete Akkordeons) erkennt `ResizeObserver`. Eine freigegebene Sidebar wird an ihrer aktuellen Bildschirmposition neu verankert.
- **Nur passive Listener.** Der Scroll-Listener ist passiv und plant lediglich einen Frame ein.
