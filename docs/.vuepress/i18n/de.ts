import type { LocaleStrings } from "./types";

const de: LocaleStrings = {
  lang: "de-DE",
  dir: "ltr",
  name: "Deutsch",

  site: {
    title: "dynamic-sticky-sidebar",
    description:
      "Ruckelfreie, in beide Richtungen klebende Sidebar, die dynamischen (ein- und ausblendenden) Headern folgt. Vanilla JS, React und Vue.",
  },
  nav: {
    guide: "Leitfaden",
    frameworks: "Frameworks",
    api: "API",
    demo: "Demo",
  },
  sidebar: {
    guide: "Leitfaden",
    frameworks: "Frameworks",
    reference: "Referenz",
  },

  theme: {
    selectLanguageText: "Sprachen",
    selectLanguageAriaLabel: "Sprache auswählen",
    editLinkText: "Diese Seite auf GitHub bearbeiten",
    tip: "Tipp",
    warning: "Warnung",
    danger: "Achtung",
    important: "Wichtig",
    note: "Hinweis",
    notFound: [
      "Diese Seite existiert nicht.",
      "Hier ist nichts. Versuch es mit der Suche.",
    ],
    backToHome: "Zur Startseite",
    openInNewWindow: "in neuem Fenster öffnen",
    toggleColorMode: "Farbmodus umschalten",
    toggleSidebar: "Seitenleiste ein-/ausblenden",
    prev: "Zurück",
    next: "Weiter",
  },

  search: {
    cancel: "Abbrechen",
    placeholder: "Optionen, Methoden, Anleitungen suchen …",
    search: "Suchen",
    clear: "Suchbegriff löschen",
    remove: "Diesen Eintrag entfernen",
    searching: "Suche läuft",
    defaultTitle: "Dokumentation",
    select: "zum Auswählen",
    navigate: "zum Navigieren",
    autocomplete: "zum Vervollständigen",
    exit: "zum Schließen",
    queryHistory: "Letzte Suchen",
    resultHistory: "Zuletzt geöffnet",
    emptyHistory:
      "Suche nach Optionsnamen (gap, scroller), Methoden (refresh) oder Themen (grid, Nuxt).",
    emptyResult:
      "Keine Treffer. Versuch einen kürzeren Begriff oder einen Optionsnamen.",
    loading: "Suchindex wird geladen …",
  },

  hero: {
    badges: ["1,8 kB gzip", "0 Abhängigkeiten", "TypeScript"],
    titleBefore: "Die Sidebar, die mit deinem ",
    titleEm: "Header",
    titleAfter: " Schritt hält.",
    lede: "Sticky-Positionierung in beide Richtungen für Sidebars, die höher als der Bildschirm sind. Sie folgt Headern, die wegrutschen, einklappen oder ihre Größe ändern – mit reinem JS, React und Vue.",
    getStarted: "Loslegen",
    copy: "Kopieren",
    copied: "Kopiert",
    copyLabel: "Installationsbefehl kopieren: {cmd}",
  },

  problems: {
    eyebrow: "Warum nicht einfach position: sticky",
    title: "Wo reines Sticky an seine Grenzen stößt",
    items: [
      {
        title: "Hohe Sidebars werden abgeschnitten",
        body: "Reines Sticky fixiert den oberen Rand einer langen Sidebar. Ihre letzten Einträge bleiben unerreichbar, bis die Seite endet.",
        fix: "Fixiert beim Runterscrollen den unteren Rand und beim Hochscrollen den oberen.",
        label: "unerreichbar",
      },
      {
        title: "Verschwindende Header hinterlassen eine Lücke",
        body: "Ein fester top-Wert passt nur zu einem Header-Zustand. Rutscht der Header weg, bleibt die Sidebar, wo sie war.",
        fix: "Folgt dem unteren Rand des Headers in jedem Frame, solange er sich bewegt.",
        label: "leere Lücke",
      },
      {
        title: "Wachsende Header verdecken sie",
        body: "Banner, Suchleisten und Kompaktmodi ändern die Header-Höhe, während die Seite offen ist.",
        fix: "Misst bei Größen-, Klassen- und Style-Änderungen neu.",
        label: "verdeckt",
      },
    ],
  },

  stage: {
    ariaLabel:
      "Beispiel-Shopseite. Scrolle sie, um zu sehen, wie die Filter-Sidebar dem Header folgt.",
    stuckTop: "Unter dem Header fixiert",
    stuckBottom: "Unten fixiert",
    replay: "Erneut abspielen",
    captions: {
      start:
        "Die orange Spalte ist eine Filter-Sidebar, höher als das Fenster. Ihr oberer Rand sitzt direkt unter dem Header.",
      top: "Ihr oberer Rand hat den Header wieder erreicht. Dort bleibt sie stehen und im Blick.",
      down: "Beim Runterscrollen scrollt die Sidebar mit der Seite, sodass die unteren Filter sichtbar werden.",
      bottom:
        "Ihr Ende hat den unteren Fensterrand erreicht, also bleibt sie dort stehen. „Apply filters“ bleibt erreichbar.",
      up: "Beim Hochscrollen wandert die Sidebar mit der Seite zurück und zeigt die Filter darüber.",
      navHidden:
        "Die Menüzeile ist weggerutscht, und die Sidebar ist mit ihr nach oben gewandert.",
      navShown:
        "Die Menüzeile ist zurück, und die Sidebar ist nach unten gerückt, um Platz zu machen.",
      columnEnd:
        "Die Seite endet, also scrollt die Sidebar zusammen mit ihrer Spalte weg.",
    },
  },

  diagram: {
    notes: [
      "Unter dem Header fixiert",
      "Scroll ↓, wandert mit der Seite",
      "Unterer Rand fixiert",
      "Scroll ↑, wandert mit der Seite",
    ],
  },

  demo: {
    tall: "Hohe Sidebar",
    autoHide: "Sub-Nav automatisch ausblenden",
    openInNewTab: "In neuem Tab öffnen",
    expand: "Vergrößern",
    close: "Schließen",
    closeLabel: "Vergrößerte Demo schließen",
    backToDocs: "← Zurück zur Dokumentation",
    dialogLabel: "Live-Demo",
    scrollerLabel: "Demoseite, scrollbar",
    hintBox: "in dieser Box scrollen ↓",
    hintModal: "scrollen ↓",
    hintPage: "Seite scrollen ↓",
  },
};

export default de;
