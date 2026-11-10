# Einführung

**dynamic-sticky-sidebar** hält eine Sidebar beim Scrollen im Blick – auch wenn sie höher als der Bildschirm ist und der Header darüber ständig seine Größe ändert.

## Das Problem {#the-problem}

Ein schlichtes `position: sticky; top: 80px` funktioniert gut, bis einer dieser Fälle eintritt:

- **Die Sidebar ist höher als der Viewport.** Sie klebt oben fest, und ihr unterer Teil ist erst am Ende der Seite erreichbar.
- **Der Header blendet sich aus und ein.** Viele Seiten lassen den Header (oder eine zweite Navigationszeile) beim Runterscrollen wegrutschen und beim Hochscrollen wieder erscheinen. Ein fester `top`-Wert hinterlässt dann entweder eine Lücke oder rutscht unter den Header.
- **Der Header ändert seine Höhe.** Banner werden geschlossen, Suchleisten klappen auf, und Header schrumpfen in einen Kompaktmodus.

Die üblichen Lösungen hören entweder auf `scroll` und setzen in jedem Frame `transform` oder `top`, was zu Ruckeln und Verzögerung führt. Oder sie brauchen von Hand abgestimmte Offsets für jeden Header-Zustand.

## Was diese Bibliothek macht {#what-this-library-does}

- **Sticky in beide Richtungen.** Beim Runterscrollen wandert eine hohe Sidebar mit dem Inhalt, bis ihr **unterer** Rand den Viewport erreicht, und bleibt dann stehen. Beim Hochscrollen wandert sie zurück, bis ihr **oberer** Rand den Header erreicht, und bleibt dort stehen. Eine kurze Sidebar bleibt einfach unter dem Header fixiert.
- **Live-Tracking des Headers.** Du übergibst das oder die Header-Elemente, und die Sidebar sitzt unter der untersten sichtbaren Header-Kante. Sie folgt dem Header Frame für Frame, während er wegrutscht, einklappt oder seine Größe ändert.
- **Nativ zuerst.** Das browsereigene `position: sticky` erledigt jeden einzelnen Scroll-Frame. JS ändert nur die Sticky-Vorgaben (`top`, `bottom`, einen Margin), wenn sich die Scrollrichtung umkehrt oder der Header bewegt. Siehe [So funktioniert es](./how-it-works.md).

## Pakete {#packages}

Es gibt ein npm-Paket mit drei Einstiegspunkten:

| Import | Wofür |
| --- | --- |
| `dynamic-sticky-sidebar` | Framework-unabhängiger Kern: [`stickySidebar()`](../frameworks/vanilla.md) |
| `dynamic-sticky-sidebar/react` | [`useStickySidebar`-Hook und `<StickySidebar>`-Komponente](../frameworks/react.md) |
| `dynamic-sticky-sidebar/vue` | [Composable, `v-sticky-sidebar`-Direktive und Plugin](../frameworks/vue.md) |

React (≥ 16.8) und Vue (≥ 3.3) sind optionale Peer-Dependencies. Installiere nur, was du tatsächlich nutzt.

Die Typen sind im Paket enthalten und werden sowohl mit `moduleResolution: "bundler"` / `"node16"` als auch mit der älteren Einstellung `"node"` aufgelöst.

## Bundle-Größe {#bundle-size}

Gemessen am veröffentlichten Build, minifiziert mit `NODE_ENV=production`, so wie es dein Bundler tun würde. Die React- und Vue-Einstiegspunkte enthalten den Kern.

| Einstiegspunkt | Minifiziert | gzip | brotli |
| --- | --- | --- | --- |
| `dynamic-sticky-sidebar` | 3,4 kB | 1,8 kB | 1,6 kB |
| `dynamic-sticky-sidebar/react` | 4,6 kB | 2,2 kB | 2,0 kB |
| `dynamic-sticky-sidebar/vue` | 4,2 kB | 2,1 kB | 1,9 kB |
| CDN-Build für `<script>` | 3,8 kB | 2,0 kB | 1,8 kB |

- **Keine Abhängigkeiten.** React und Vue werden nur von ihren eigenen Einstiegspunkten verwendet.
- **Entwicklungswarnungen fallen in Produktion weg.** Die Konsolenhinweise aus [Fehlerbehebung](./troubleshooting.md) stehen in `process.env.NODE_ENV !== 'production'`, daher entfernen Vite, webpack, Next.js und Nuxt sie aus Produktions-Bundles. Der Entwicklungs-Build des Kerns ist etwa 0,2 kB größer (gzip).
- **Tree-shakeable.** Das Paket ist mit `sideEffects: false` markiert und die React-Komponente als pure annotiert, sodass ungenutzte Exporte wegfallen.

Führe `pnpm size` im Repository aus, um diese Zahlen nachzuvollziehen.

## Browser-Unterstützung {#browser-support}

Jeder Browser mit `position: sticky`, `ResizeObserver` und `MutationObserver` – also alle aktuellen Evergreen-Browser. Sowohl die ESM-/CJS-Builds als auch der CDN-Build für `<script>` zielen auf ES2020.
