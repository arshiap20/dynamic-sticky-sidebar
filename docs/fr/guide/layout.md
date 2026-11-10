# Contraintes de mise en page

La bibliothèque repose sur `position: sticky` : les règles habituelles du sticky s'appliquent donc, plus une concernant le parent de la barre latérale.

## Recommandé : grid {#recommended-grid}

```css
.layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: start;
}
```

Avec un parent en **grid** ou en **flex en ligne**, les deux sens de défilement reposent sur le positionnement sticky natif. Le JS n'ajuste les contraintes que lorsque le sens change, si bien que la barre latérale n'est jamais en retard sur le défilement.

Le flex en ligne fonctionne de la même façon :

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

## La barre latérale ne doit pas s'étirer {#the-sidebar-must-not-stretch}

Par défaut, les éléments de grid et de flex s'étirent sur la hauteur de la rangée. Une barre latérale étirée est aussi haute que la colonne de contenu : le sticky n'a alors aucune marge de manœuvre et rien ne se passe. Utilisez l'une de ces solutions :

- `align-items: start` (grid) / `align-items: flex-start` (flex) sur le parent, ou
- `align-self: start` sur la barre latérale elle-même.

Le parent, lui, doit être aussi haut que le contenu qui défile. C'est le cas par défaut lorsque la barre latérale et le contenu principal partagent la même rangée.

## Mise en page en bloc (repli) {#block-layout-fallback}

Si le parent est un bloc classique, par exemple lorsque la barre latérale est enveloppée dans une colonne `<div>` étirée, la bibliothèque fonctionne quand même :

- le défilement vers le **bas** est natif, comme en mode grid ;
- le défilement vers le **haut** utilise un `top` piloté en JS, qui peut avoir une frame de retard lors d'un défilement rapide.

Dans les builds de développement, la bibliothèque le signale une fois dans la console :

```
[dynamic-sticky-sidebar] parent is not grid / row-flex, so scrolling up uses a JS fallback that can lag a frame. …
```

Pour corriger cela, donnez `display: grid` au **parent direct** de la barre latérale (une grille à une seule colonne suffit) :

```css
.sidebar-column {
    display: grid;
    align-items: start;
}
```

## Overflow sur les ancêtres {#overflow-on-ancestors}

Comme pour tout élément sticky, un ancêtre situé entre la barre latérale et son conteneur de défilement qui a `overflow: hidden | auto | scroll` devient le conteneur sticky et empêche l'élément de rester collé à la page. Les coupables habituels sont les wrappers de page qui utilisent `overflow-x: hidden` pour masquer le débordement horizontal.

- Utilisez `overflow: clip` (ou `overflow-x: clip`) plutôt que `hidden` : le contenu est rogné sans créer de conteneur de défilement.
- Si la barre latérale se trouve réellement dans un panneau défilant, passez ce panneau dans l'option [`scroller`](../api/README.md#scroller).

## Petits écrans {#small-screens}

Sur mobile, la barre latérale s'empile généralement au-dessus ou en dessous du contenu et ne doit pas être sticky. Utilisez `media` pour que la bibliothèque ne s'active que lorsque la mise en page compte deux colonnes :

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    media: '(min-width: 768px)',
});
```

Lorsque la requête ne correspond plus, la bibliothèque retire ses écouteurs et restaure les styles inline d'origine de la barre latérale. Elle redémarre dès que la requête correspond à nouveau.

## Styles modifiés par la bibliothèque {#styles-the-library-touches}

Tant qu'elle est active, la bibliothèque écrit ces styles inline sur l'élément de la barre latérale :

| Propriété | Pourquoi |
| --- | --- |
| `position` | Passe à `sticky` si ce n'est pas déjà le cas |
| `top`, `bottom` | Les contraintes sticky |
| `margin-top`, `margin-bottom` | Maintiennent la barre latérale en place lorsqu'elle est « libérée » entre deux états fixés |
| `align-self` | Passe à `flex-end` lors de la remontée en mode grid/flex |
| `overflow-anchor` | Passe à `none` pour que l'ancrage du défilement n'entre pas en conflit avec les ajustements |

Les valeurs inline d'origine sont sauvegardées au démarrage de la bibliothèque et restaurées lors de `destroy()` ou lorsque `media` ne correspond plus. Définissez votre propre espacement dans une feuille de style ou une classe, et non dans des styles inline que vous modifiez pendant que la bibliothèque tourne.
