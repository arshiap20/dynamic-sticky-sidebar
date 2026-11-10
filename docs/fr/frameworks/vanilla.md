# Vanilla JS

```js
import { stickySidebar } from 'dynamic-sticky-sidebar';
```

## Utilisation de base {#basic-usage}

```js
const sidebar = stickySidebar('#sidebar', {
    header: '.site-header',
    gap: 16,
    media: '(min-width: 768px)',
});
```

Le premier argument est un élément ou un sélecteur. Une erreur est levée si rien ne correspond : créez donc l'instance une fois l'élément présent.

`stickySidebar()` renvoie une [instance](../api/README.md#instance) :

```js
sidebar.update();          // recalculate now
sidebar.refresh();         // re-query header selectors / scroller and restart
sidebar.setOptions({ … }); // replace options
sidebar.destroy();         // remove listeners and restore inline styles
```

## Sans bundler {#without-a-bundler}

Le paquet fournit un build IIFE qui définit une variable globale `StickySidebar` :

```html
<script src="https://unpkg.com/dynamic-sticky-sidebar"></script>
<script>
    StickySidebar.stickySidebar('#sidebar', { header: '.site-header' });
</script>
```

`https://cdn.jsdelivr.net/npm/dynamic-sticky-sidebar` fonctionne aussi. En production, fixez une version, par exemple `dynamic-sticky-sidebar@0.1.0`.

Le fichier CDN est un build de production minifié (environ 2 kB gzippé) : il n'affiche donc pas les avertissements de développement décrits dans [Dépannage](../guide/troubleshooting.md). Si vous en avez besoin, utilisez le paquet npm avec un bundler pendant le développement.

## CommonJS {#commonjs}

```js
const { stickySidebar } = require('dynamic-sticky-sidebar');
```

## Mettre à jour les options {#updating-options}

`setOptions` **remplace** les options. Il ne les fusionne pas : passez donc l'ensemble complet.

```js
const base = { header: '.site-header', media: '(min-width: 768px)' };
const sidebar = stickySidebar('#sidebar', { ...base, gap: 16 });

sidebar.setOptions({ ...base, gap: 24 });
```

Modifier `gap`, `offsetTop` ou `offsetBottom` déclenche simplement un recalcul. Modifier `header`, `media`, `scroller` ou `subscribe` redémarre l'instance.

## Dans un panneau défilant {#inside-a-scrollable-panel}

Lorsque ce n'est pas la page elle-même qui défile mais un conteneur (app shells, tableaux de bord), passez ce conteneur dans `scroller`. Les positions sont alors mesurées par rapport à lui :

```js
stickySidebar('#filters', {
    scroller: '#panel',
    header: '#panel-toolbar',
});
```

## Applications monopages {#single-page-apps}

Appelez `destroy()` lorsque la vue est démontée. Cette méthode retire tous les écouteurs et observers, et restaure les styles inline d'origine de la barre latérale. Avec React ou Vue, les [adaptateurs](./react.md) s'en chargent pour vous.
