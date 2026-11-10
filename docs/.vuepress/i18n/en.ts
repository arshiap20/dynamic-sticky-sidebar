import type { LocaleStrings } from "./types";

const en: LocaleStrings = {
  lang: "en-US",
  dir: "ltr",
  name: "English",

  site: {
    title: "dynamic-sticky-sidebar",
    description:
      "Jank-free two-way sticky sidebar that follows dynamic (hide/show) headers. Vanilla JS, React and Vue.",
  },
  nav: { guide: "Guide", frameworks: "Frameworks", api: "API", demo: "Demo" },
  sidebar: { guide: "Guide", frameworks: "Frameworks", reference: "Reference" },

  theme: {
    selectLanguageText: "Languages",
    selectLanguageAriaLabel: "Select language",
    editLinkText: "Edit this page on GitHub",
    tip: "Tip",
    warning: "Warning",
    danger: "Danger",
    important: "Important",
    note: "Note",
    notFound: ["This page does not exist.", "Nothing here. Try the search."],
    backToHome: "Back to home",
    openInNewWindow: "open in new window",
    toggleColorMode: "Toggle color mode",
    toggleSidebar: "Toggle sidebar",
    prev: "Previous",
    next: "Next",
  },

  search: {
    cancel: "Cancel",
    placeholder: "Search options, methods, guides…",
    search: "Search",
    clear: "Clear search query",
    remove: "Remove this item",
    searching: "Searching",
    defaultTitle: "Documentation",
    select: "to select",
    navigate: "to navigate",
    autocomplete: "to autocomplete",
    exit: "to exit",
    queryHistory: "Recent searches",
    resultHistory: "Recently opened",
    emptyHistory:
      "Search by option name (gap, scroller), method (refresh) or topic (grid, Nuxt).",
    emptyResult: "No matches. Try a shorter term or an option name.",
    loading: "Loading search index…",
  },

  hero: {
    badges: ["1.8 kB gzipped", "0 dependencies", "TypeScript"],
    titleBefore: "The sidebar that keeps up with your ",
    titleEm: "header",
    titleAfter: ".",
    lede: "Two-way sticky positioning for sidebars taller than the screen. It follows headers that slide away, collapse or resize, and works with plain JS, React and Vue.",
    getStarted: "Get started",
    copy: "Copy",
    copied: "Copied",
    copyLabel: "Copy install command: {cmd}",
  },

  problems: {
    eyebrow: "Why not just position: sticky",
    title: "Where plain sticky falls short",
    items: [
      {
        title: "Tall sidebars get cut off",
        body: "Plain sticky pins the top of a long sidebar, so its last items stay out of reach until the page ends.",
        fix: "Pins the bottom on the way down and the top on the way up.",
        label: "out of reach",
      },
      {
        title: "Hiding headers leave a gap",
        body: "A fixed top value fits one header state. When the header slides away, the sidebar stays where it was.",
        fix: "Follows the header's bottom edge every frame while it moves.",
        label: "empty gap",
      },
      {
        title: "Growing headers cover it",
        body: "Banners, search bars and compact modes change the header height while the page is open.",
        fix: "Re-measures on resize, class and style changes.",
        label: "covered",
      },
    ],
  },

  stage: {
    ariaLabel:
      "Example shop page. Scroll it to see the filter sidebar follow the header.",
    stuckTop: "Stuck under the header",
    stuckBottom: "Stuck to the bottom",
    replay: "Replay",
    captions: {
      start:
        "The orange column is a filter sidebar, taller than the window. Its top sits just under the header.",
      top: "Its top reached the header again, so it stops there and stays in view.",
      down: "Scrolling down: the sidebar scrolls with the page, so the lower filters come into view.",
      bottom:
        "Its end reached the bottom of the window, so it stops there. “Apply filters” stays reachable.",
      up: "Scrolling up: the sidebar moves back with the page, showing the filters above.",
      navHidden: "The menu row slid away, and the sidebar moved up with it.",
      navShown:
        "The menu row came back, and the sidebar moved down to make room.",
      columnEnd:
        "The page is ending, so the sidebar scrolls away together with its column.",
    },
  },

  diagram: {
    notes: [
      "Pinned under the header",
      "Scroll ↓, moves with the page",
      "Bottom edge pinned",
      "Scroll ↑, moves with the page",
    ],
  },

  demo: {
    tall: "Tall sidebar",
    autoHide: "Auto-hide sub-nav",
    openInNewTab: "Open in new tab",
    expand: "Expand",
    close: "Close",
    closeLabel: "Close the expanded demo",
    backToDocs: "← Back to the docs",
    dialogLabel: "Live demo",
    scrollerLabel: "Demo page, scrollable",
    hintBox: "scroll inside this box ↓",
    hintModal: "scroll ↓",
    hintPage: "scroll the page ↓",
  },
};

export default en;
