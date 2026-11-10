# Riferimento API

## `stickySidebar(target, options?)` {#stickysidebar-target-options}

```ts
function stickySidebar(target: HTMLElement | string, options?: StickySidebarOptions): StickySidebar;
```

| Parametro | Tipo | Descrizione |
| --- | --- | --- |
| `target` | `HTMLElement \| string` | L'elemento della sidebar, o un selettore che lo individua. Lancia `[dynamic-sticky-sidebar] sidebar element not found` se non trova nulla. |
| `options` | `StickySidebarOptions` | Vedi [Opzioni](#options). Tutte facoltative. |

## Opzioni {#options}

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

- **Tipo:** `string | Element | ArrayLike<Element> | null`
- **Predefinito:** nessuno

Uno o più elementi header sticky o fixed. Un selettore usa **tutti** gli elementi corrispondenti. La sidebar si blocca sotto il bordo inferiore visibile più basso tra questi e li segue in tempo reale mentre scorrono via, si comprimono o cambiano dimensione. Vedi [Header dinamici](../guide/headers.md).

### `offsetTop` {#offsettop}

- **Tipo:** `number | () => number`
- **Predefinito:** `0`

Spazio extra tra l'header (o la cima del viewport, se non c'è un header) e la sidebar. Una funzione viene chiamata a ogni ricalcolo.

### `offsetBottom` {#offsetbottom}

- **Tipo:** `number | () => number`
- **Predefinito:** `0`

Spazio extra tra la sidebar e il fondo del viewport quando la sidebar è bloccata in basso.

### `gap` {#gap}

- **Tipo:** `number`
- **Predefinito:** `16`

Spaziatura in px applicata su **entrambi** i bordi, in aggiunta a `offsetTop` / `offsetBottom`.

### `media` {#media}

- **Tipo:** `string`
- **Predefinito:** sempre attiva

Una media query. L'istanza è attiva solo finché la query corrisponde, ad esempio `'(min-width: 768px)'`. Quando smette di corrispondere, i listener vengono rimossi e gli stili inline ripristinati.

### `scroller` {#scroller}

- **Tipo:** `Element | string | null`
- **Predefinito:** la finestra

L'elemento che scorre, quando la sidebar si trova in un contenitore scorrevole anziché nella pagina. Tutte le posizioni vengono misurate rispetto all'area visibile dello scroller.

### `subscribe` {#subscribe}

- **Tipo:** `(update: () => void) => void | (() => void)`
- **Predefinito:** nessuno

Collega una sorgente esterna che sposta l'header (uno store, un event bus…). Chiama `update` ogni volta che cambia e restituisci una funzione di disiscrizione. Viene chiamata all'avvio dell'istanza e la disiscrizione avviene quando l'istanza si ferma.

```js
subscribe: (update) => store.subscribe(update)
```

## Istanza {#instance}

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

L'elemento della sidebar risolto.

### `update()` {#update}

Ricalcola in modo sincrono, poi continua a seguire per qualche frame nel caso qualcosa si stia ancora muovendo. Chiamalo dopo cambiamenti che la libreria non può osservare. Vedi [Quando devi dare una mano](../guide/headers.md#when-you-need-to-help).

### `refresh()` {#refresh}

Riavvia completamente: interroga di nuovo i selettori di `header` e `scroller`, rivaluta `media` e rileva di nuovo la modalità di layout. Usalo dopo aver sostituito elementi header nel DOM.

### `setOptions(options)` {#setoptions-options}

**Sostituisce** tutte le opzioni; non le unisce.

- Cambiare `header`, `media`, `scroller` o `subscribe` (confrontati per identità) riavvia l'istanza.
- Le altre modifiche (`gap`, `offsetTop`, `offsetBottom`) provocano solo un ricalcolo.

### `destroy()` {#destroy}

Rimuove tutti i listener e gli observer, annulla i frame in sospeso, esegue la pulizia di `subscribe` e ripristina gli stili inline originali della sidebar.

## React {#react}

```ts
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

| Export | Firma |
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

Vedi [React](../frameworks/react.md).

## Vue {#vue}

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

| Export | Firma |
| --- | --- |
| `useStickySidebar` | `(target: MaybeRefOrGetter<HTMLElement \| ComponentPublicInstance \| null>, options?: MaybeRefOrGetter<VueStickySidebarOptions>) => { update(): void; refresh(): void }` |
| `vStickySidebar` | `Directive<HTMLElement, VueStickySidebarOptions \| undefined>` |
| `StickySidebarPlugin` | `Plugin`, che registra `v-sticky-sidebar` |

```ts
interface VueStickySidebarOptions extends Omit<StickySidebarOptions, 'header' | 'scroller'> {
    header?: MaybeRefOrGetter<HeaderInput | ComponentPublicInstance>;
    scroller?: MaybeRefOrGetter<Element | string | null | undefined | ComponentPublicInstance>;
}
```

Vedi [Vue](../frameworks/vue.md).
