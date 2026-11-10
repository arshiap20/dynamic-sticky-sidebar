# Dépannage

::: tip
Les avertissements de console ci-dessous n'apparaissent que dans les builds de développement. Les builds de production et le build CDN les retirent pour gagner des octets.
:::

## La barre latérale ne reste pas collée du tout {#the-sidebar-doesn-t-stick-at-all}

- **Elle est étirée.** En grid/flex, la barre latérale occupe par défaut toute la hauteur de la rangée. Ajoutez `align-items: start` au parent ou `align-self: start` à la barre latérale. Voir [Mise en page](./layout.md#the-sidebar-must-not-stretch).
- **Un ancêtre a un `overflow` défini.** `overflow: hidden | auto | scroll` sur n'importe quel ancêtre en fait le conteneur sticky. Utilisez `overflow: clip`, ou passez cet élément dans `scroller` s'il s'agit du vrai conteneur de défilement.
- **`media` ne correspond pas.** L'instance est inactive tant que la media query est fausse.
- **Elle est masquée au départ.** Si la barre latérale n'a pas de hauteur au démarrage (`display: none`, dans un onglet fermé), l'instance attend. Un `ResizeObserver` la prend en charge dès qu'elle devient visible ; vous pouvez aussi appeler `update()`.

## Erreur « element not found » {#element-not-found-error}

`stickySidebar('#sidebar')` lève une erreur lorsque le sélecteur ne trouve rien. Créez l'instance une fois l'élément présent dans le DOM : après `DOMContentLoaded`, dans `onMounted` / `useEffect`, ou utilisez les adaptateurs pour frameworks, qui s'en chargent pour vous.

## Le sélecteur d'en-tête ne trouve rien {#header-selector-matched-nothing}

```
[dynamic-sticky-sidebar] header selector ".site-header" matched no elements
```

Le sélecteur `header` n'a rien trouvé au démarrage de l'instance : la barre latérale se fixe donc en haut du viewport et risque de glisser sous votre en-tête. Vérifiez le sélecteur, ou appelez `refresh()` une fois l'en-tête rendu.

## Scroller introuvable {#scroller-not-found}

```
[dynamic-sticky-sidebar] scroller "#app" not found, using the window
```

L'option `scroller` n'a pas pu être résolue en élément. Vérifiez le sélecteur, ou passez directement l'élément.

## Avertissement de console sur grid / row-flex {#console-warning-about-grid-row-flex}

```
[dynamic-sticky-sidebar] parent is not grid / row-flex, so scrolling up uses a JS fallback …
```

Le **parent direct** de la barre latérale est un bloc. Tout fonctionne quand même, mais la remontée peut avoir une frame de retard. Donnez au parent `display: grid; align-items: start`. Voir [Mise en page en bloc](./layout.md#block-layout-fallback).

## La barre latérale chevauche l'en-tête ou laisse un vide en dessous {#the-sidebar-overlaps-or-leaves-a-gap-under-the-header}

- Vérifiez que **toutes** les rangées d'en-tête sont passées dans `header`. Avec un sélecteur, tous les éléments trouvés sont utilisés.
- Si l'en-tête bouge à cause d'une classe sur un ancêtre, la bibliothèque ne peut pas le voir. Appelez `update()`, ou utilisez [`subscribe`](./headers.md#use-subscribe).
- Les en-têtes remplacés dans le DOM après le démarrage nécessitent un appel à [`refresh()`](../api/README.md#refresh).
- Besoin de plus d'espace ? Augmentez `gap` (`16` par défaut) ou ajoutez `offsetTop`.

## Le contenu de la barre latérale change de hauteur {#the-sidebar-content-changes-height}

Rien à faire. Un `ResizeObserver` surveille la barre latérale et son parent. Si la hauteur de la barre latérale change alors qu'elle est libérée, elle est réancrée à sa position actuelle à l'écran, et les positions fixées sont recalculées.

## Rendu côté serveur {#server-side-rendering}

Le cœur ne touche à `document` et `window` qu'au moment où `stickySidebar()` est appelée. Le hook React s'exécute dans une callback ref, et l'entrée React est marquée `"use client"`. Le composable et la directive Vue s'exécutent après le montage. Tous peuvent être importés sans risque dans des applications SSR (Next.js, Nuxt, VuePress…).
