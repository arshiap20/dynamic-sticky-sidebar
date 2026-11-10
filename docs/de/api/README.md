# API-Referenz

## `stickySidebar(target, options?)` {#stickysidebar-target-options}

```ts
function stickySidebar(target: HTMLElement | string, options?: StickySidebarOptions): StickySidebar;
```

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| `target` | `HTMLElement \| string` | Das Sidebar-Element oder ein Selektor dafür. Wirft `[dynamic-sticky-sidebar] sidebar element not found`, wenn nichts gefunden wird. |
| `options` | `StickySidebarOptions` | Siehe [Optionen](#options). Alle optional. |

## Optionen {#options}

```ts
type Px = number | (() => number);
type HeaderInput = string | Element | ArrayLike<Element> | null | undefined;

interface StickySidebarOptions {
    header?: HeaderInput;
    offsetTop?: Px;
    offsetBottom?: Px;
    gap?: number;
    media?: string;
    scroller?: Element | string | null;
    subscribe?: (update: () => void) => void | (() => void);
}
```

### `header` {#header}

- **Typ:** `string | Element | ArrayLike<Element> | null`
- **Standard:** keiner

Sticky oder fixed positionierte(s) Header-Element(e). Ein Selektor verwendet **alle** passenden Elemente. Die Sidebar wird unter der untersten sichtbaren Unterkante dieser Elemente fixiert und folgt ihnen live, während sie wegrutschen, einklappen oder ihre Größe ändern. Siehe [Dynamische Header](../guide/headers.md).

### `offsetTop` {#offsettop}

- **Typ:** `number | () => number`
- **Standard:** `0`

Zusätzlicher Abstand zwischen dem Header (bzw. ohne Header dem oberen Viewport-Rand) und der Sidebar. Eine Funktion wird bei jeder Neuberechnung aufgerufen.

### `offsetBottom` {#offsetbottom}

- **Typ:** `number | () => number`
- **Standard:** `0`

Zusätzlicher Abstand zwischen der Sidebar und dem unteren Viewport-Rand, wenn die Sidebar unten fixiert ist.

### `gap` {#gap}

- **Typ:** `number`
- **Standard:** `16`

Abstand in px, der an **beiden** Rändern angewendet wird, zusätzlich zu `offsetTop` / `offsetBottom`.

### `media` {#media}

- **Typ:** `string`
- **Standard:** immer aktiv

Eine Media Query. Die Instanz läuft nur, solange sie zutrifft, z. B. `'(min-width: 768px)'`. Trifft sie nicht mehr zu, werden die Listener entfernt und die Inline-Styles wiederhergestellt.

### `scroller` {#scroller}

- **Typ:** `Element | string | null`
- **Standard:** das Fenster (`window`)

Das scrollende Element, wenn die Sidebar in einem scrollbaren Container statt in der Seite liegt. Alle Positionen werden relativ zum sichtbaren Bereich des Scrollers gemessen.

### `subscribe` {#subscribe}

- **Typ:** `(update: () => void) => void | (() => void)`
- **Standard:** keiner

Bindet eine externe Quelle an, die den Header bewegt (ein Store, ein Event-Bus …). Rufe `update` bei jeder Änderung auf und gib eine Unsubscribe-Funktion zurück. Die Funktion wird beim Start der Instanz aufgerufen, und das Abo wird beim Stoppen beendet.

```js
subscribe: (update) => store.subscribe(update)
```

## Instanz {#instance}

```ts
interface StickySidebar {
    readonly element: HTMLElement;
    update(): void;
    refresh(): void;
    setOptions(options: StickySidebarOptions): void;
    destroy(): void;
}
```

### `element` {#element}

Das aufgelöste Sidebar-Element.

### `update()` {#update}

Rechnet synchron neu und folgt danach noch einige Frames lang, falls sich noch etwas bewegt. Rufe es nach Änderungen auf, die die Bibliothek nicht beobachten kann. Siehe [Wenn du nachhelfen musst](../guide/headers.md#when-you-need-to-help).

### `refresh()` {#refresh}

Startet vollständig neu: fragt die `header`-Selektoren und `scroller` erneut ab, wertet `media` neu aus und erkennt den Layout-Modus erneut. Verwende es, nachdem Header-Elemente im DOM ersetzt wurden.

### `setOptions(options)` {#setoptions-options}

**Ersetzt** alle Optionen; sie werden nicht zusammengeführt.

- Eine Änderung an `header`, `media`, `scroller` oder `subscribe` (Vergleich per Identität) startet die Instanz neu.
- Andere Änderungen (`gap`, `offsetTop`, `offsetBottom`) lösen nur eine Neuberechnung aus.

### `destroy()` {#destroy}

Entfernt alle Listener und Observer, bricht ausstehende Frames ab, ruft die Aufräumfunktion von `subscribe` auf und stellt die ursprünglichen Inline-Styles der Sidebar wieder her.

## React {#react}

```ts
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

| Export | Signatur |
| --- | --- |
| `useStickySidebar` | `<T extends HTMLElement>(options?: UseStickySidebarOptions) => (node: T \| null) => void` |
| `StickySidebar` | `ForwardRefExoticComponent<StickySidebarProps>` |

```ts
interface UseStickySidebarOptions extends Omit<StickySidebarOptions, 'header' | 'scroller'> {
    header?: HeaderInput | RefObject<Element | null>;
    scroller?: Element | string | null | RefObject<Element | null>;
}

interface StickySidebarProps extends UseStickySidebarOptions, HTMLAttributes<HTMLElement> {
    as?: ElementType; // default 'aside'
    children?: ReactNode;
}
```

Siehe [React](../frameworks/react.md).

## Vue {#vue}

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

| Export | Signatur |
| --- | --- |
| `useStickySidebar` | `(target: MaybeRefOrGetter<HTMLElement \| ComponentPublicInstance \| null>, options?: MaybeRefOrGetter<VueStickySidebarOptions>) => { update(): void; refresh(): void }` |
| `vStickySidebar` | `Directive<HTMLElement, VueStickySidebarOptions \| undefined>` |
| `StickySidebarPlugin` | `Plugin`, das `v-sticky-sidebar` registriert |

```ts
interface VueStickySidebarOptions extends Omit<StickySidebarOptions, 'header' | 'scroller'> {
    header?: MaybeRefOrGetter<HeaderInput | ComponentPublicInstance>;
    scroller?: MaybeRefOrGetter<Element | string | null | undefined | ComponentPublicInstance>;
}
```

Siehe [Vue](../frameworks/vue.md).
