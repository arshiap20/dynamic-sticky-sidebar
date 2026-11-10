# En-têtes dynamiques

Passez votre en-tête, et la barre latérale se place juste en dessous, où qu'il se trouve à ce moment-là.

```js
stickySidebar('#sidebar', { header: '.site-header' });
```

## Position de la barre latérale {#where-the-sidebar-sits}

Lorsqu'elle est fixée, le bord supérieur de la barre latérale se trouve à :

```
lowest visible header bottom + offsetTop + gap
```

- **Le bas visible le plus bas.** S'il y a plusieurs en-têtes, c'est celui qui descend le plus loin qui l'emporte.
- **Les en-têtes masqués sont ignorés.** Un en-tête de hauteur nulle (`display: none`, `hidden`, replié) ou entièrement sorti par le haut du viewport compte pour `0`.
- La mesure se fait par rapport au viewport, ou par rapport au [`scroller`](../api/README.md#scroller) si vous en utilisez un.

## Plusieurs rangées d'en-tête {#several-header-rows}

Passez un sélecteur qui les cible toutes, un tableau ou une `NodeList` :

```js
stickySidebar('#sidebar', { header: '#top-bar, #sub-nav' });

stickySidebar('#sidebar', { header: [topBar, subNav] });

stickySidebar('#sidebar', { header: document.querySelectorAll('[data-sticky-header]') });
```

C'est le cas typique d'une barre supérieure fixe accompagnée d'une sous-navigation qui disparaît quand on défile vers le bas. Quand la sous-navigation remonte, la barre latérale remonte avec elle. Quand elle revient, la barre latérale redescend avec elle.

::: tip
Les sélecteurs sont résolus une seule fois, au démarrage de l'instance. Si des éléments d'en-tête sont ajoutés ou remplacés par la suite, appelez [`refresh()`](../api/README.md#refresh).
:::

## Ce qui est suivi automatiquement {#what-is-tracked-automatically}

Vous n'avez rien à brancher pour ces cas-là. La bibliothèque détecte le changement et suit l'en-tête frame par frame jusqu'à ce qu'il se stabilise.

| Changement sur l'élément d'en-tête | Détecté via |
| --- | --- |
| Changement de hauteur (repli, dépliage, contenu modifié) | `ResizeObserver` |
| Modification des attributs `class`, `style` ou `hidden` | `MutationObserver` |
| Transitions CSS et animations keyframes | `transitionrun` / `animationstart`, puis suivi via `getAnimations()` jusqu'à leur fin |
| Web Animations API (`el.animate()`) | `getAnimations()` |
| Animation en JS qui écrit `style.transform` à chaque frame | `MutationObserver` sur `style` |
| Redimensionnement de la page ou du scroller | Événement `resize`, `ResizeObserver` sur la barre latérale et son parent |

## Quand vous devez donner un coup de main {#when-you-need-to-help}

La bibliothèque observe **les éléments d'en-tête eux-mêmes**. Elle ne peut pas voir les changements qui déplacent un en-tête sans toucher à cet élément, par exemple :

- une classe basculée sur `<body>` ou sur un wrapper, alors que l'en-tête n'a pas de transition propre ;
- un en-tête dont la position dépend d'une variable CSS définie sur un ancêtre ;
- un décalage qui vit dans l'état de l'application et n'est pas encore dans le DOM.

Dans ces cas-là, choisissez l'un des trois mécanismes ci-dessous.

### Appeler `update()` {#call-update}

```js
const sidebar = stickySidebar('#sidebar', { header: '.site-header' });

document.body.classList.toggle('compact-header');
sidebar.update();
```

### Utiliser `subscribe` {#use-subscribe}

Si un store pilote l'en-tête, laissez la bibliothèque s'y abonner :

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    subscribe: (update) => headerStore.subscribe(update), // must return an unsubscribe function
});
```

`update` est appelée à chaque changement du store. La bibliothèque appelle votre fonction de désabonnement lors de `destroy()`.

### Utiliser un getter pour `offsetTop` {#use-an-offsettop-getter}

`offsetTop` et `offsetBottom` acceptent une fonction, lue à chaque mise à jour :

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    offsetTop: () => (cookieBanner.isOpen ? cookieBanner.height : 0),
});
```

Associez un getter à `subscribe` ou à `update()` pour que la bibliothèque sache quand le relire.

## Sans en-tête {#no-header}

Sans `header`, la barre latérale se fixe à `offsetTop + gap` pixels sous le haut du viewport (ou du scroller) :

```js
stickySidebar('#sidebar', { offsetTop: 64 }); // fixed 64px header you don't want to observe
```
