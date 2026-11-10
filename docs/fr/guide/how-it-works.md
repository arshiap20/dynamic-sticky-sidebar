# Comment ça marche

La plupart des scripts de barre latérale sticky déplacent la barre avec `transform` ou `top` à chaque événement de défilement. Or ces événements arrivent après que le navigateur a déjà fait défiler la page : la barre latérale a donc toujours une frame de retard et tremble. Cette bibliothèque prend le contre-pied : **c'est le `position: sticky` du navigateur qui fait le travail à chaque frame, et le JS ne fait que changer les règles.**

## Deux positions fixées {#two-pinned-positions}

À chaque mise à jour, la bibliothèque calcule deux positions pour le bord supérieur de la barre latérale, relatives au viewport (ou au scroller) :

```
max = header bottom + offsetTop + gap        // pinned under the header
min = viewport height − sidebar height − offsetBottom − gap   // bottom aligned
```

Si la barre latérale tient dans l'espace disponible (`max − min < 1px`), elle est simplement fixée à `top: max` et rien d'autre ne se passe.

## Quatre états {#four-states}

Lorsque la barre latérale est plus haute que l'espace disponible, elle passe par quatre états :

<StateDiagram />

| État | Contrainte sticky | Ce que vous voyez |
| --- | --- | --- |
| **TOP** | `top: max` | Fixée sous l'en-tête |
| **DOWN** | `top: auto` + décalage `margin-top` | Défile avec la page, en descendant |
| **BOTTOM** | `top: min` | Bord inférieur fixé au bas du viewport |
| **UP** | `bottom: …` + décalage `margin-bottom` | Défile avec la page, en remontant |

Les transitions ne se produisent que lorsque le **sens du défilement s'inverse** ou que la barre latérale atteint un bord. En descendant, elle passe de TOP à BOTTOM en passant par DOWN. En remontant, elle passe de BOTTOM à TOP en passant par UP.

Changer de sens en cours de route (DOWN ↔ UP) libère à nouveau la barre latérale depuis sa position actuelle : elle ne saute donc jamais.

Lorsque la barre latérale est « libérée » (DOWN / UP), la bibliothèque met `top`/`bottom` à `auto` et ajoute une marge égale à la distance actuelle entre la barre et sa position naturelle. La barre latérale reste exactement où elle était à l'écran et défile désormais nativement avec la page. Lorsqu'elle atteint l'autre bord, le positionnement sticky du navigateur reprend la main et la bibliothèque se contente d'enregistrer le nouvel état.

### Pourquoi grid ou flex {#why-grid-or-flex}

Pour libérer la barre latérale vers le haut, il faut l'ancrer au **bas** de son conteneur. Dans un parent en grid ou en flex en ligne, la bibliothèque applique `align-self: flex-end` et une marge inférieure, et la barre latérale remonte nativement.

En flux bloc, il n'existe aucun moyen d'aligner un élément en bas : la bibliothèque se rabat donc sur un calcul de `top` en JS pendant la remontée. Voir [Contraintes de mise en page](./layout.md#block-layout-fallback).

## Suivre l'en-tête {#following-the-header}

Quand l'en-tête bouge, `max` change. Dans l'état TOP, la bibliothèque écrit immédiatement le nouveau `top`, et la barre latérale se déplace avec l'en-tête.

Comme une animation d'en-tête peut se dérouler sans aucun défilement, la bibliothèque lance une courte boucle `requestAnimationFrame` dès que quelque chose est susceptible de bouger :

- un défilement, un redimensionnement ou un callback de `ResizeObserver` ;
- un événement `transitionrun` / `animationstart` ou une mutation d'attribut sur un en-tête.

La boucle recalcule à chaque frame tant que `max` continue de changer ou qu'une animation finie est en cours sur un en-tête, et s'arrête d'elle-même **3 frames d'inactivité** après que tout s'est stabilisé. Rien ne tourne quand la page est inactive.

## Petits détails {#small-details}

- **Seuls les vrais changements sont écrits.** `top` et `bottom` sont comparés à la dernière valeur écrite avant de toucher au DOM, et les valeurs sont arrondies à 0,01 px.
- **L'ancrage du défilement est désactivé** sur la barre latérale (`overflow-anchor: none`) pour que le navigateur n'entre pas en conflit avec les ajustements de marge.
- **Les redimensionnements de la barre latérale** (contenu chargé, accordéons ouverts) sont détectés par `ResizeObserver`. Une barre latérale libérée est réancrée à sa position actuelle à l'écran.
- **Uniquement des écouteurs passifs.** L'écouteur de défilement est passif et se contente de planifier une frame.
