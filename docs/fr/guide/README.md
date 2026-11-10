# Introduction

**dynamic-sticky-sidebar** garde une barre latérale visible pendant le défilement de la page, même lorsqu'elle est plus haute que l'écran et que l'en-tête au-dessus change sans cesse de taille.

## Le problème {#the-problem}

Un simple `position: sticky; top: 80px` fonctionne bien, jusqu'à ce que l'un de ces cas se présente :

- **La barre latérale est plus haute que le viewport.** Elle reste collée en haut, et sa partie inférieure reste inaccessible jusqu'à la fin de la page.
- **L'en-tête se masque et réapparaît.** Beaucoup de sites font disparaître l'en-tête (ou une seconde rangée de navigation) quand on défile vers le bas, puis le font revenir quand on remonte. Un `top` fixe laisse alors soit un vide, soit la barre latérale glisse sous l'en-tête.
- **L'en-tête change de hauteur.** Des bannières se ferment, des barres de recherche s'agrandissent, des en-têtes passent en mode compact.

Les solutions habituelles écoutent l'événement `scroll` et modifient `transform` ou `top` à chaque frame, ce qui provoque saccades et retard, ou bien exigent des décalages réglés à la main pour chaque état de l'en-tête.

## Ce que fait cette bibliothèque {#what-this-library-does}

- **Sticky bidirectionnel.** En défilant vers le bas, une barre latérale haute accompagne le contenu jusqu'à ce que son **bas** atteigne le viewport, puis s'y fixe. En remontant, elle revient jusqu'à ce que son **haut** atteigne l'en-tête, puis s'y fixe. Une barre latérale courte reste simplement fixée sous l'en-tête.
- **Suivi de l'en-tête en direct.** Vous passez le ou les éléments d'en-tête, et la barre latérale se place sous le bord visible le plus bas. Elle suit l'en-tête frame par frame pendant qu'il glisse, se replie ou se redimensionne.
- **Le natif d'abord.** C'est le `position: sticky` du navigateur qui gère chaque frame de défilement. Le JS ne modifie les contraintes sticky (`top`, `bottom`, une marge) que lorsque le sens du défilement s'inverse ou que l'en-tête bouge. Voir [Comment ça marche](./how-it-works.md).

## Paquets {#packages}

Il n'y a qu'un seul paquet npm, avec trois points d'entrée :

| Import | À utiliser pour |
| --- | --- |
| `dynamic-sticky-sidebar` | Le cœur, sans framework : [`stickySidebar()`](../frameworks/vanilla.md) |
| `dynamic-sticky-sidebar/react` | [Le hook `useStickySidebar` et le composant `<StickySidebar>`](../frameworks/react.md) |
| `dynamic-sticky-sidebar/vue` | [Composable, directive `v-sticky-sidebar` et plugin](../frameworks/vue.md) |

React (≥ 16.8) et Vue (≥ 3.3) sont des peer dependencies optionnelles. N'installez que ce dont vous avez besoin.

Les types sont fournis avec le paquet et se résolvent aussi bien avec `moduleResolution: "bundler"` / `"node16"` qu'avec l'ancien réglage `"node"`.

## Taille du bundle {#bundle-size}

Mesurée sur le build publié, minifié avec `NODE_ENV=production` comme le ferait votre bundler. Les entrées React et Vue incluent le cœur.

| Entrée | Minifié | gzip | brotli |
| --- | --- | --- | --- |
| `dynamic-sticky-sidebar` | 3.4 kB | 1.8 kB | 1.6 kB |
| `dynamic-sticky-sidebar/react` | 4.6 kB | 2.2 kB | 2.0 kB |
| `dynamic-sticky-sidebar/vue` | 4.2 kB | 2.1 kB | 1.9 kB |
| Build CDN `<script>` | 3.8 kB | 2.0 kB | 1.8 kB |

- **Aucune dépendance.** React et Vue ne sont utilisés que par leurs propres points d'entrée.
- **Les avertissements de développement sont retirés en production.** Les indications affichées dans la console, décrites dans [Dépannage](./troubleshooting.md), sont entourées de `process.env.NODE_ENV !== 'production'` : Vite, webpack, Next.js et Nuxt les suppriment donc des bundles de production. Le build de développement du cœur pèse environ 0,2 kB de plus (gzip).
- **Compatible tree-shaking.** Le paquet est marqué `sideEffects: false` et le composant React est annoté comme pur, de sorte que les exports inutilisés sont éliminés.

Lancez `pnpm size` dans le dépôt pour reproduire ces chiffres.

## Navigateurs pris en charge {#browser-support}

Tout navigateur qui prend en charge `position: sticky`, `ResizeObserver` et `MutationObserver`, c'est-à-dire tous les navigateurs evergreen actuels. Les builds ESM/CJS comme le build CDN `<script>` ciblent ES2020.
