import { viteBundler } from "@vuepress/bundler-vite";
import { slimsearchPlugin } from "@vuepress/plugin-slimsearch";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { LOCALES } from "./i18n/index";
import type { LocaleStrings } from "./i18n/types";

const base = (process.env.DOCS_BASE ?? "/") as `/${string}/` | "/";

const repo = process.env.GITHUB_REPOSITORY;

const entries = Object.entries(LOCALES) as [string, LocaleStrings][];
const map = <T>(fn: (prefix: string, t: LocaleStrings) => T) =>
  Object.fromEntries(entries.map(([prefix, t]) => [prefix, fn(prefix, t)]));

const navbar = (p: string, t: LocaleStrings) => [
  { text: t.nav.guide, link: `${p}guide/` },
  {
    text: t.nav.frameworks,
    children: [
      `${p}frameworks/vanilla.md`,
      `${p}frameworks/react.md`,
      `${p}frameworks/vue.md`,
    ],
  },
  { text: t.nav.api, link: `${p}api/` },
  { text: t.nav.demo, link: `${p}demo.md` },
  { text: "npm", link: "https://www.npmjs.com/package/dynamic-sticky-sidebar" },
];

const sidebar = (p: string, t: LocaleStrings) => [
  {
    text: t.sidebar.guide,
    children: [
      `${p}guide/README.md`,
      `${p}guide/getting-started.md`,
      `${p}guide/layout.md`,
      `${p}guide/headers.md`,
      `${p}guide/how-it-works.md`,
      `${p}guide/troubleshooting.md`,
    ],
  },
  {
    text: t.sidebar.frameworks,
    children: [
      `${p}frameworks/vanilla.md`,
      `${p}frameworks/react.md`,
      `${p}frameworks/vue.md`,
    ],
  },
  { text: t.sidebar.reference, children: [`${p}api/README.md`, `${p}demo.md`] },
];

// RTL pages: set dir before first paint (client code keeps it in sync on navigation).
const rtlHead = [
  ["script", {}, "document.documentElement.dir='rtl'"],
] as [string, Record<string, string>, string][];

export default defineUserConfig({
  base,
  locales: map((_, t) => ({
    lang: t.lang,
    title: t.site.title,
    description: t.site.description,
    ...(t.dir === "rtl" ? { head: rtlHead } : {}),
  })),

  // `## Heading {#id}` sets the heading id. Translated pages use it to keep the
  // English anchors, so `#block-layout-fallback` links work in every language.
  extendsMarkdown(md) {
    const RE = /\s*\{#([\w-]+)\}\s*$/;
    md.core.ruler.before("anchor", "heading-custom-id", (state) => {
      const tokens = state.tokens;
      for (let i = 0; i < tokens.length - 1; i++) {
        if (tokens[i].type !== "heading_open") continue;
        const inline = tokens[i + 1];
        const match = inline.content.match(RE);
        if (!match) continue;
        inline.content = inline.content.replace(RE, "");
        const last = inline.children?.[inline.children.length - 1];
        if (last?.type === "text") last.content = last.content.replace(RE, "");
        tokens[i].attrSet("id", match[1]);
      }
    });
  },

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: `${base}logo.svg` }],
    ["meta", { name: "theme-color", content: "#3b5bdb" }],
  ],

  bundler: viteBundler({
    viteOptions: {
      plugins: [
        {
          name: "fix-slimsearch-dev-worker",
          enforce: "pre",
          transform(code, id) {
            if (!id.includes("plugin-slimsearch/dist/client/config.js"))
              return null;
            return code.replace(
              "new URL(`worker/dev.js`",
              "new URL(`../worker/dev.js`",
            );
          },
        },
      ],
    },
  }),

  theme: defaultTheme({
    logo: "/logo.svg",
    lastUpdated: false,
    contributors: false,
    repo,
    editLink: !!repo,
    docsDir: "docs",
    docsBranch: process.env.GITHUB_REF_NAME || "main",
    themePlugins: {
      git: false,
      prismjs: { themes: { light: "one-light", dark: "one-dark" } },
    },
    locales: map((p, t) => ({
      selectLanguageName: t.name,
      selectLanguageText: t.theme.selectLanguageText,
      selectLanguageAriaLabel: t.theme.selectLanguageAriaLabel,
      navbar: navbar(p, t),
      sidebar: sidebar(p, t),
      editLinkText: t.theme.editLinkText,
      tip: t.theme.tip,
      warning: t.theme.warning,
      danger: t.theme.danger,
      important: t.theme.important,
      note: t.theme.note,
      notFound: t.theme.notFound,
      backToHome: t.theme.backToHome,
      openInNewWindow: t.theme.openInNewWindow,
      toggleColorMode: t.theme.toggleColorMode,
      toggleSidebar: t.theme.toggleSidebar,
      prev: t.theme.prev,
      next: t.theme.next,
    })),
  }),

  plugins: [
    slimsearchPlugin({
      indexContent: true,
      suggestion: true,
      queryHistoryCount: 5,
      resultHistoryCount: 5,
      searchDelay: 80,
      hotKeys: [
        { key: "k", ctrl: true },
        { key: "/", ctrl: true },
      ],
      filter: (page) =>
        page.path !== "/404.html" && page.path !== "/playground.html",
      locales: map((_, t) => t.search),
    }),
  ],
});
