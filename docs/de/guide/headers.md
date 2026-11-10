# Dynamische Header

Übergib deinen Header, und die Sidebar sitzt direkt darunter – egal, wo sich der Header gerade befindet.

```js
stickySidebar('#sidebar', { header: '.site-header' });
```

## Wo die Sidebar sitzt {#where-the-sidebar-sits}

Im fixierten Zustand liegt der obere Rand der Sidebar bei:

```
lowest visible header bottom + offsetTop + gap
```

- **Unterster sichtbarer Rand.** Bei mehreren Headern gewinnt der, der am weitesten nach unten reicht.
- **Versteckte Header werden ignoriert.** Ein Header mit Höhe null (`display: none`, `hidden`, eingeklappt) oder einer, der vollständig über den Viewport hinausgerutscht ist, zählt als `0`.
- Gemessen wird relativ zum Viewport oder, wenn du einen verwendest, zum [`scroller`](../api/README.md#scroller).

## Mehrere Header-Zeilen {#several-header-rows}

Übergib einen Selektor, der alle trifft, ein Array oder eine `NodeList`:

```js
stickySidebar('#sidebar', { header: '#top-bar, #sub-nav' });

stickySidebar('#sidebar', { header: [topBar, subNav] });

stickySidebar('#sidebar', { header: document.querySelectorAll('[data-sticky-header]') });
```

Das ist das typische Muster: eine feste obere Leiste plus eine Sub-Navigation, die beim Runterscrollen wegrutscht. Rutscht die Sub-Navigation nach oben, wandert die Sidebar mit ihr nach oben. Kommt sie zurück, wandert die Sidebar mit ihr nach unten.

::: tip
Selektoren werden einmal beim Start der Instanz aufgelöst. Werden Header-Elemente später hinzugefügt oder ersetzt, rufe [`refresh()`](../api/README.md#refresh) auf.
:::

## Was automatisch verfolgt wird {#what-is-tracked-automatically}

Für all das musst du nichts verdrahten. Die Bibliothek bemerkt die Änderung und folgt dem Header Frame für Frame, bis er zur Ruhe kommt.

| Änderung am Header-Element | Erkannt über |
| --- | --- |
| Höhenänderungen (Einklappen, Aufklappen, geänderter Inhalt) | `ResizeObserver` |
| Änderungen an den Attributen `class`, `style` oder `hidden` | `MutationObserver` |
| CSS-Transitions und Keyframe-Animationen | `transitionrun` / `animationstart`, danach über `getAnimations()` verfolgt, bis sie enden |
| Web Animations API (`el.animate()`) | `getAnimations()` |
| JS-Animation, die in jedem Frame `style.transform` schreibt | `MutationObserver` auf `style` |
| Größenänderung von Seite oder Scroller | `resize`-Event, `ResizeObserver` auf der Sidebar und ihrem Elternelement |

## Wenn du nachhelfen musst {#when-you-need-to-help}

Die Bibliothek beobachtet die **Header-Elemente selbst**. Änderungen, die einen Header bewegen, ohne dieses Element anzufassen, sieht sie nicht, zum Beispiel:

- eine Klasse, die auf `<body>` oder einem Wrapper umgeschaltet wird, während der Header selbst keine Transition hat;
- ein Header, dessen Position aus einer CSS-Variable auf einem Vorfahren stammt;
- ein Offset, der im App-State liegt und noch nicht im DOM steht.

Wähle in diesen Fällen eine der drei folgenden Möglichkeiten.

### `update()` aufrufen {#call-update}

```js
const sidebar = stickySidebar('#sidebar', { header: '.site-header' });

document.body.classList.toggle('compact-header');
sidebar.update();
```

### `subscribe` verwenden {#use-subscribe}

Steuert ein Store den Header, lass die Bibliothek ihn abonnieren:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    subscribe: (update) => headerStore.subscribe(update), // must return an unsubscribe function
});
```

`update` wird bei jeder Änderung des Stores aufgerufen. Bei `destroy()` ruft die Bibliothek deine Unsubscribe-Funktion auf.

### Einen `offsetTop`-Getter verwenden {#use-an-offsettop-getter}

`offsetTop` und `offsetBottom` akzeptieren eine Funktion, die bei jedem Update gelesen wird:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    offsetTop: () => (cookieBanner.isOpen ? cookieBanner.height : 0),
});
```

Kombiniere einen Getter mit `subscribe` oder `update()`, damit die Bibliothek weiß, wann sie ihn erneut lesen soll.

## Ohne Header {#no-header}

Ohne `header` wird die Sidebar `offsetTop + gap` Pixel unterhalb des oberen Viewport-Rands (bzw. Scroller-Rands) fixiert:

```js
stickySidebar('#sidebar', { offsetTop: 64 }); // fixed 64px header you don't want to observe
```
