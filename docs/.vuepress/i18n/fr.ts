import type { LocaleStrings } from "./types";

const fr: LocaleStrings = {
  lang: "fr-FR",
  dir: "ltr",
  name: "Français",

  site: {
    title: "dynamic-sticky-sidebar",
    description:
      "Barre latérale sticky bidirectionnelle, sans saccades, qui suit les en-têtes dynamiques (masqués/affichés). Vanilla JS, React et Vue.",
  },
  nav: {
    guide: "Guide",
    frameworks: "Frameworks",
    api: "API",
    demo: "Démo",
  },
  sidebar: {
    guide: "Guide",
    frameworks: "Frameworks",
    reference: "Référence",
  },

  theme: {
    selectLanguageText: "Langues",
    selectLanguageAriaLabel: "Choisir la langue",
    editLinkText: "Modifier cette page sur GitHub",
    tip: "Astuce",
    warning: "Attention",
    danger: "Danger",
    important: "Important",
    note: "Remarque",
    notFound: [
      "Cette page n'existe pas.",
      "Rien ici. Essayez la recherche.",
    ],
    backToHome: "Retour à l'accueil",
    openInNewWindow: "ouvrir dans une nouvelle fenêtre",
    toggleColorMode: "Changer de thème",
    toggleSidebar: "Afficher/masquer la barre latérale",
    prev: "Précédent",
    next: "Suivant",
  },

  search: {
    cancel: "Annuler",
    placeholder: "Rechercher des options, méthodes, guides…",
    search: "Rechercher",
    clear: "Effacer la recherche",
    remove: "Supprimer cet élément",
    searching: "Recherche en cours",
    defaultTitle: "Documentation",
    select: "pour sélectionner",
    navigate: "pour naviguer",
    autocomplete: "pour compléter",
    exit: "pour quitter",
    queryHistory: "Recherches récentes",
    resultHistory: "Ouverts récemment",
    emptyHistory:
      "Recherchez par nom d'option (gap, scroller), de méthode (refresh) ou par sujet (grid, Nuxt).",
    emptyResult: "Aucun résultat. Essayez un terme plus court ou un nom d'option.",
    loading: "Chargement de l'index de recherche…",
  },

  hero: {
    badges: ["1,8 kB gzippé", "0 dépendance", "TypeScript"],
    titleBefore: "La barre latérale qui suit votre ",
    titleEm: "en-tête",
    titleAfter: ".",
    lede: "Un positionnement sticky bidirectionnel pour les barres latérales plus hautes que l'écran. Elle suit les en-têtes qui disparaissent, se replient ou changent de taille, et fonctionne avec du JS natif, React et Vue.",
    getStarted: "Commencer",
    copy: "Copier",
    copied: "Copié",
    copyLabel: "Copier la commande d'installation : {cmd}",
  },

  problems: {
    eyebrow: "Pourquoi pas simplement position: sticky",
    title: "Là où le sticky classique ne suffit pas",
    items: [
      {
        title: "Les barres latérales hautes sont coupées",
        body: "Le sticky classique fixe le haut d'une longue barre latérale : ses derniers éléments restent hors d'atteinte jusqu'à la fin de la page.",
        fix: "Fixe le bas en descendant et le haut en remontant.",
        label: "hors d'atteinte",
      },
      {
        title: "Les en-têtes masqués laissent un vide",
        body: "Une valeur top fixe ne convient qu'à un seul état de l'en-tête. Quand l'en-tête disparaît, la barre latérale reste où elle était.",
        fix: "Suit le bord inférieur de l'en-tête à chaque frame pendant qu'il bouge.",
        label: "vide",
      },
      {
        title: "Les en-têtes qui grandissent la recouvrent",
        body: "Bannières, barres de recherche et modes compacts modifient la hauteur de l'en-tête pendant que la page est ouverte.",
        fix: "Remesure à chaque redimensionnement et à chaque changement de classe ou de style.",
        label: "recouverte",
      },
    ],
  },

  stage: {
    ariaLabel:
      "Exemple de page de boutique. Faites-la défiler pour voir la barre latérale de filtres suivre l'en-tête.",
    stuckTop: "Fixée sous l'en-tête",
    stuckBottom: "Fixée en bas",
    replay: "Rejouer",
    captions: {
      start:
        "La colonne orange est une barre latérale de filtres, plus haute que la fenêtre. Son haut se trouve juste sous l'en-tête.",
      top: "Son haut a de nouveau atteint l'en-tête : elle s'y arrête et reste visible.",
      down: "En descendant : la barre latérale défile avec la page, et les filtres du bas apparaissent.",
      bottom:
        "Sa fin a atteint le bas de la fenêtre : elle s'y arrête. Le bouton « Apply filters » reste accessible.",
      up: "En remontant : la barre latérale revient avec la page et dévoile les filtres du haut.",
      navHidden:
        "La rangée de menu a disparu, et la barre latérale est remontée avec elle.",
      navShown:
        "La rangée de menu est revenue, et la barre latérale est redescendue pour lui laisser la place.",
      columnEnd:
        "La page touche à sa fin : la barre latérale s'en va avec sa colonne.",
    },
  },

  diagram: {
    notes: [
      "Fixée sous l'en-tête",
      "Défilement ↓, suit la page",
      "Bord inférieur fixé",
      "Défilement ↑, suit la page",
    ],
  },

  demo: {
    tall: "Barre latérale haute",
    autoHide: "Sous-navigation auto-masquée",
    openInNewTab: "Ouvrir dans un nouvel onglet",
    expand: "Agrandir",
    close: "Fermer",
    closeLabel: "Fermer la démo agrandie",
    backToDocs: "← Retour à la documentation",
    dialogLabel: "Démo en direct",
    scrollerLabel: "Page de démo, défilable",
    hintBox: "faites défiler dans ce cadre ↓",
    hintModal: "défilez ↓",
    hintPage: "faites défiler la page ↓",
  },
};

export default fr;
