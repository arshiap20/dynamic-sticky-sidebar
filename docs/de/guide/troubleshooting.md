# Fehlerbehebung

::: tip
Die folgenden Konsolenwarnungen erscheinen nur in Entwicklungs-Builds. Produktions-Builds und der CDN-Build lassen sie weg, um Bytes zu sparen.
:::

## Die Sidebar klebt überhaupt nicht {#the-sidebar-doesn-t-stick-at-all}

- **Sie ist gestreckt.** In Grid/Flex nimmt die Sidebar standardmäßig die volle Zeilenhöhe ein. Füge `align-items: start` am Elternelement oder `align-self: start` an der Sidebar hinzu. Siehe [Layout](./layout.md#the-sidebar-must-not-stretch).
- **Ein Vorfahre hat `overflow` gesetzt.** `overflow: hidden | auto | scroll` macht jeden Vorfahren zum Sticky-Container. Verwende `overflow: clip`, oder übergib das Element als `scroller`, falls es der eigentliche Scroll-Container ist.
- **`media` trifft nicht zu.** Solange die Media Query false ist, ist die Instanz inaktiv.
- **Sie ist anfangs versteckt.** Hat die Sidebar beim Start keine Höhe (`display: none`, in einem geschlossenen Tab), wartet die Instanz. Ein `ResizeObserver` greift, sobald sie sichtbar wird – alternativ rufst du `update()` auf.

## Fehler „element not found“ {#element-not-found-error}

`stickySidebar('#sidebar')` wirft einen Fehler, wenn der Selektor nichts findet. Erstelle die Instanz erst, wenn das Element im DOM ist: nach `DOMContentLoaded`, in `onMounted` / `useEffect` – oder nutze die Framework-Adapter, die das für dich erledigen.

## Header-Selektor findet nichts {#header-selector-matched-nothing}

```
[dynamic-sticky-sidebar] header selector ".site-header" matched no elements
```

Der `header`-Selektor hat beim Start der Instanz nichts gefunden. Die Sidebar wird daher am oberen Viewport-Rand fixiert und rutscht womöglich unter deinen Header. Prüfe den Selektor oder rufe `refresh()` auf, sobald der Header gerendert ist.

## Scroller nicht gefunden {#scroller-not-found}

```
[dynamic-sticky-sidebar] scroller "#app" not found, using the window
```

Die Option `scroller` ließ sich keinem Element zuordnen. Prüfe den Selektor oder übergib direkt das Element.

## Konsolenwarnung zu Grid / Zeilen-Flex {#console-warning-about-grid-row-flex}

```
[dynamic-sticky-sidebar] parent is not grid / row-flex, so scrolling up uses a JS fallback …
```

Das **direkte Elternelement** der Sidebar ist ein Block. Es funktioniert trotzdem, aber beim Hochscrollen kann die Sidebar einen Frame hinterherhinken. Gib dem Elternelement `display: grid; align-items: start`. Siehe [Block-Layout](./layout.md#block-layout-fallback).

## Die Sidebar überlappt den Header oder lässt eine Lücke darunter {#the-sidebar-overlaps-or-leaves-a-gap-under-the-header}

- Stelle sicher, dass **jede** Header-Zeile in `header` übergeben wird. Bei einem Selektor werden alle Treffer verwendet.
- Bewegt sich der Header wegen einer Klasse an einem Vorfahren, sieht die Bibliothek das nicht. Rufe `update()` auf oder verwende [`subscribe`](./headers.md#use-subscribe).
- Header, die nach dem Start im DOM ersetzt werden, brauchen [`refresh()`](../api/README.md#refresh).
- Mehr Abstand gewünscht? Erhöhe `gap` (Standard `16`) oder füge `offsetTop` hinzu.

## Der Inhalt der Sidebar ändert seine Höhe {#the-sidebar-content-changes-height}

Du musst nichts tun. Ein `ResizeObserver` beobachtet die Sidebar und ihr Elternelement. Ändert sich die Höhe der Sidebar, während sie freigegeben ist, wird sie an ihrer aktuellen Bildschirmposition neu verankert, und die fixierten Positionen werden neu berechnet.

## Serverseitiges Rendering {#server-side-rendering}

Der Kern greift erst auf `document` und `window` zu, wenn `stickySidebar()` aufgerufen wird. Der React-Hook läuft in einem Ref-Callback, und der React-Einstiegspunkt ist mit `"use client"` markiert. Das Vue-Composable und die Direktive laufen nach dem Mounten. Alle lassen sich gefahrlos in SSR-Apps importieren (Next.js, Nuxt, VuePress, …).
