import type { LocaleStrings } from "./types";

const it: LocaleStrings = {
  lang: "it-IT",
  dir: "ltr",
  name: "Italiano",

  site: {
    title: "dynamic-sticky-sidebar",
    description:
      "Sidebar sticky bidirezionale e senza scatti che segue gli header dinamici (che si nascondono e ricompaiono). Vanilla JS, React e Vue.",
  },
  nav: { guide: "Guida", frameworks: "Framework", api: "API", demo: "Demo" },
  sidebar: { guide: "Guida", frameworks: "Framework", reference: "Riferimento" },

  theme: {
    selectLanguageText: "Lingue",
    selectLanguageAriaLabel: "Seleziona la lingua",
    editLinkText: "Modifica questa pagina su GitHub",
    tip: "Suggerimento",
    warning: "Attenzione",
    danger: "Pericolo",
    important: "Importante",
    note: "Nota",
    notFound: [
      "Questa pagina non esiste.",
      "Qui non c'è niente. Prova con la ricerca.",
    ],
    backToHome: "Torna alla home",
    openInNewWindow: "apri in una nuova finestra",
    toggleColorMode: "Cambia tema chiaro/scuro",
    toggleSidebar: "Mostra/nascondi la barra laterale",
    prev: "Precedente",
    next: "Successiva",
  },

  search: {
    cancel: "Annulla",
    placeholder: "Cerca opzioni, metodi, guide…",
    search: "Cerca",
    clear: "Cancella la ricerca",
    remove: "Rimuovi questo elemento",
    searching: "Ricerca in corso",
    defaultTitle: "Documentazione",
    select: "per selezionare",
    navigate: "per spostarti",
    autocomplete: "per completare",
    exit: "per uscire",
    queryHistory: "Ricerche recenti",
    resultHistory: "Aperti di recente",
    emptyHistory:
      "Cerca per nome di opzione (gap, scroller), metodo (refresh) o argomento (grid, Nuxt).",
    emptyResult:
      "Nessun risultato. Prova con un termine più breve o con il nome di un'opzione.",
    loading: "Caricamento dell'indice di ricerca…",
  },

  hero: {
    badges: ["1.8 kB gzip", "0 dipendenze", "TypeScript"],
    titleBefore: "La sidebar che tiene il passo con il tuo ",
    titleEm: "header",
    titleAfter: ".",
    lede: "Posizionamento sticky bidirezionale per sidebar più alte dello schermo. Segue gli header che scorrono via, si comprimono o cambiano dimensione, e funziona con JS puro, React e Vue.",
    getStarted: "Inizia",
    copy: "Copia",
    copied: "Copiato",
    copyLabel: "Copia il comando di installazione: {cmd}",
  },

  problems: {
    eyebrow: "Perché non basta position: sticky",
    title: "Dove il semplice sticky non basta",
    items: [
      {
        title: "Le sidebar alte vengono tagliate",
        body: "Lo sticky semplice blocca la parte alta di una sidebar lunga, così gli ultimi elementi restano irraggiungibili fino alla fine della pagina.",
        fix: "Blocca il fondo mentre scorri verso il basso e la cima mentre scorri verso l'alto.",
        label: "irraggiungibile",
      },
      {
        title: "Gli header a scomparsa lasciano un vuoto",
        body: "Un valore top fisso va bene per un solo stato dell'header. Quando l'header scorre via, la sidebar resta dov'era.",
        fix: "Segue il bordo inferiore dell'header a ogni frame mentre si muove.",
        label: "spazio vuoto",
      },
      {
        title: "Gli header che crescono la coprono",
        body: "Banner, barre di ricerca e modalità compatte cambiano l'altezza dell'header mentre la pagina è aperta.",
        fix: "Rimisura tutto quando cambiano dimensioni, classi e stili.",
        label: "coperta",
      },
    ],
  },

  stage: {
    ariaLabel:
      "Pagina di esempio di un negozio. Scorrila per vedere la sidebar dei filtri seguire l'header.",
    stuckTop: "Bloccata sotto l'header",
    stuckBottom: "Bloccata in fondo",
    replay: "Riproduci",
    captions: {
      start:
        "La colonna arancione è una sidebar di filtri, più alta della finestra. La sua cima si trova subito sotto l'header.",
      top: "La cima ha di nuovo raggiunto l'header, quindi si ferma lì e resta visibile.",
      down: "Scorrendo verso il basso, la sidebar scorre insieme alla pagina e compaiono i filtri più in basso.",
      bottom:
        "La fine ha raggiunto il fondo della finestra, quindi si ferma lì. “Apply filters” resta a portata di mano.",
      up: "Scorrendo verso l'alto, la sidebar torna indietro con la pagina e mostra i filtri sopra.",
      navHidden: "La riga del menu è scivolata via e la sidebar è salita insieme a lei.",
      navShown:
        "La riga del menu è tornata e la sidebar è scesa per farle spazio.",
      columnEnd:
        "La pagina sta finendo, quindi la sidebar scorre via insieme alla sua colonna.",
    },
  },

  diagram: {
    notes: [
      "Bloccata sotto l'header",
      "Scroll ↓, si muove con la pagina",
      "Bordo inferiore bloccato",
      "Scroll ↑, si muove con la pagina",
    ],
  },

  demo: {
    tall: "Sidebar alta",
    autoHide: "Sub-nav a scomparsa",
    openInNewTab: "Apri in una nuova scheda",
    expand: "Espandi",
    close: "Chiudi",
    closeLabel: "Chiudi la demo espansa",
    backToDocs: "← Torna alla documentazione",
    dialogLabel: "Demo dal vivo",
    scrollerLabel: "Pagina demo, scorrevole",
    hintBox: "scorri dentro questo riquadro ↓",
    hintModal: "scorri ↓",
    hintPage: "scorri la pagina ↓",
  },
};

export default it;
