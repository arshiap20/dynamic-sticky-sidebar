# Référence de l'API

## `stickySidebar(target, options?)` {#stickysidebar-target-options}

```ts
function stickySidebar(target: HTMLElement | string, options?: StickySidebarOptions): StickySidebar;
```

| Paramètre | Type | Description |
| --- | --- | --- |
| `target` | `HTMLElement \| string` | L'élément de la barre latérale, ou un sélecteur qui le cible. Lève `[dynamic-sticky-sidebar] sidebar element not found` si rien ne correspond. |
| `options` | `StickySidebarOptions` | Voir [Options](#options). Toutes facultatives. |

## Options {#options}

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

- **Type :** `string | Element | ArrayLike<Element> | null`
- **Par défaut :** aucun

Le ou les éléments d'en-tête sticky ou fixes. Un sélecteur utilise **tous** les éléments correspondants. La barre latérale se fixe sous le bord inférieur visible le plus bas parmi eux et les suit en direct pendant qu'ils glissent, se replient ou se redimensionnent. Voir [En-têtes dynamiques](../guide/headers.md).

### `offsetTop` {#offsettop}

- **Type :** `number | () => number`
- **Par défaut :** `0`

Espace supplémentaire entre l'en-tête (ou le haut du viewport, en l'absence d'en-tête) et la barre latérale. Une fonction est appelée à chaque recalcul.

### `offsetBottom` {#offsetbottom}

- **Type :** `number | () => number`
- **Par défaut :** `0`

Espace supplémentaire entre la barre latérale et le bas du viewport lorsque la barre est fixée en bas.

### `gap` {#gap}

- **Type :** `number`
- **Par défaut :** `16`

Espacement en px appliqué aux **deux** bords, en plus de `offsetTop` / `offsetBottom`.

### `media` {#media}

- **Type :** `string`
- **Par défaut :** toujours active

Une media query. L'instance ne fonctionne que tant qu'elle correspond, par ex. `'(min-width: 768px)'`. Quand elle ne correspond plus, les écouteurs sont retirés et les styles inline restaurés.

### `scroller` {#scroller}

- **Type :** `Element | string | null`
- **Par défaut :** la fenêtre

L'élément qui défile, lorsque la barre latérale se trouve dans un conteneur défilant plutôt que dans la page. Toutes les positions sont mesurées par rapport à la zone visible du scroller.

### `subscribe` {#subscribe}

- **Type :** `(update: () => void) => void | (() => void)`
- **Par défaut :** aucun

Connecte une source externe qui déplace l'en-tête (un store, un bus d'événements…). Appelez `update` à chacun de ses changements et renvoyez une fonction de désabonnement. Elle est appelée au démarrage de l'instance, et le désabonnement a lieu à son arrêt.

```js
subscribe: (update) => store.subscribe(update)
```

## Instance {#instance}

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

L'élément de la barre latérale, une fois résolu.

### `update()` {#update}

Recalcule de façon synchrone, puis continue de suivre pendant quelques frames au cas où quelque chose bougerait encore. Appelez-la après des changements que la bibliothèque ne peut pas observer. Voir [Quand vous devez donner un coup de main](../guide/headers.md#when-you-need-to-help).

### `refresh()` {#refresh}

Redémarre complètement : réinterroge les sélecteurs `header` et `scroller`, réévalue `media` et redétecte le mode de mise en page. À utiliser après le remplacement d'éléments d'en-tête dans le DOM.

### `setOptions(options)` {#setoptions-options}

**Remplace** toutes les options ; ne les fusionne pas.

- Modifier `header`, `media`, `scroller` ou `subscribe` (comparés par identité) redémarre l'instance.
- Les autres changements (`gap`, `offsetTop`, `offsetBottom`) déclenchent simplement un recalcul.

### `destroy()` {#destroy}

Retire tous les écouteurs et observers, annule les frames en attente, appelle la fonction de nettoyage de `subscribe` et restaure les styles inline d'origine de la barre latérale.

## React {#react}

```ts
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

| Export | Signature |
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

Voir [React](../frameworks/react.md).

## Vue {#vue}

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

| Export | Signature |
| --- | --- |
| `useStickySidebar` | `(target: MaybeRefOrGetter<HTMLElement \| ComponentPublicInstance \| null>, options?: MaybeRefOrGetter<VueStickySidebarOptions>) => { update(): void; refresh(): void }` |
| `vStickySidebar` | `Directive<HTMLElement, VueStickySidebarOptions \| undefined>` |
| `StickySidebarPlugin` | `Plugin`, qui enregistre `v-sticky-sidebar` |

```ts
interface VueStickySidebarOptions extends Omit<StickySidebarOptions, 'header' | 'scroller'> {
    header?: MaybeRefOrGetter<HeaderInput | ComponentPublicInstance>;
    scroller?: MaybeRefOrGetter<Element | string | null | undefined | ComponentPublicInstance>;
}
```

Voir [Vue](../frameworks/vue.md).
