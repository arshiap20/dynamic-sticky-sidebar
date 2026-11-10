/** Every user-facing string outside the markdown pages, per language. */
export interface LocaleStrings {
  /** `<html lang>` value, e.g. "fa-IR". */
  lang: string;
  dir: "ltr" | "rtl";
  /** Language name written in that language, shown in the language menu. */
  name: string;

  site: { title: string; description: string };
  nav: { guide: string; frameworks: string; api: string; demo: string };
  sidebar: { guide: string; frameworks: string; reference: string };

  /** Default theme labels. */
  theme: {
    selectLanguageText: string;
    selectLanguageAriaLabel: string;
    editLinkText: string;
    tip: string;
    warning: string;
    danger: string;
    important: string;
    note: string;
    notFound: string[];
    backToHome: string;
    openInNewWindow: string;
    toggleColorMode: string;
    toggleSidebar: string;
    prev: string;
    next: string;
  };

  /** Search box (slimsearch). */
  search: {
    cancel: string;
    placeholder: string;
    search: string;
    clear: string;
    remove: string;
    searching: string;
    defaultTitle: string;
    select: string;
    navigate: string;
    autocomplete: string;
    exit: string;
    queryHistory: string;
    resultHistory: string;
    emptyHistory: string;
    emptyResult: string;
    loading: string;
  };

  /** Landing page hero. The title is split so the middle word can be highlighted. */
  hero: {
    badges: [string, string, string];
    titleBefore: string;
    titleEm: string;
    titleAfter: string;
    lede: string;
    getStarted: string;
    copy: string;
    copied: string;
    /** `{cmd}` is replaced with the install command. */
    copyLabel: string;
  };

  /** Landing page "where plain sticky falls short" cards. `label` is the short tag drawn inside the figure. */
  problems: {
    eyebrow: string;
    title: string;
    items: [ProblemItem, ProblemItem, ProblemItem];
  };

  /** Animated demo in the hero. */
  stage: {
    ariaLabel: string;
    stuckTop: string;
    stuckBottom: string;
    replay: string;
    captions: {
      start: string;
      top: string;
      down: string;
      bottom: string;
      up: string;
      navHidden: string;
      navShown: string;
      columnEnd: string;
    };
  };

  /** "How it works" state diagram: one note per state (TOP, DOWN, BOTTOM, UP). */
  diagram: { notes: [string, string, string, string] };

  /** Live demo component. */
  demo: {
    tall: string;
    autoHide: string;
    openInNewTab: string;
    expand: string;
    close: string;
    closeLabel: string;
    backToDocs: string;
    dialogLabel: string;
    scrollerLabel: string;
    hintBox: string;
    hintModal: string;
    hintPage: string;
  };
}

export interface ProblemItem {
  title: string;
  body: string;
  fix: string;
  label: string;
}
