import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/vazirmatn";
import "./styles/index.scss";

import { onBeforeUnmount, onMounted, watch } from "vue";
import { defineClientConfig, useRouteLocale } from "vuepress/client";
import { localeStrings } from "./i18n/index";
import HeroStage from "./components/HeroStage.vue";
import LandingHero from "./components/LandingHero.vue";
import LandingProblems from "./components/LandingProblems.vue";
import StateDiagram from "./components/StateDiagram.vue";
import StickyDemo from "./components/StickyDemo.vue";
import BlankLayout from "./layouts/BlankLayout.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("HeroStage", HeroStage);
    app.component("LandingHero", LandingHero);
    app.component("LandingProblems", LandingProblems);
    app.component("StateDiagram", StateDiagram);
    app.component("StickyDemo", StickyDemo);
  },
  layouts: { BlankLayout },
  setup() {
    // Keep <html dir> in sync with the page language (Persian/Arabic are RTL).
    const routeLocale = useRouteLocale();
    onMounted(() =>
      watch(
        routeLocale,
        (prefix) => {
          document.documentElement.dir = localeStrings(prefix).dir;
        },
        { immediate: true },
      ),
    );

    const onKey = (e: KeyboardEvent) => {
      if (!e.metaKey || e.ctrlKey || e.altKey || e.key.toLowerCase() !== "k")
        return;
      const button = document.querySelector<HTMLElement>(".vp-search-button");
      if (!button || document.querySelector(".vp-search-modal")) return;
      e.preventDefault();
      button.click();
    };

    const ENTITY = /&(amp|lt|gt|quot|#39);/g;
    const CHARS: Record<string, string> = {
      amp: "&",
      lt: "<",
      gt: ">",
      quot: '"',
      "#39": "'",
    };
    const fixText = (node: Node) => {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      for (let t = walker.nextNode(); t; t = walker.nextNode()) {
        if (t.nodeValue?.includes("&"))
          t.nodeValue = t.nodeValue.replace(ENTITY, (_, k: string) => CHARS[k]);
      }
    };
    const observer =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver((records) => {
            for (const r of records) {
              const el =
                r.target instanceof Element ? r.target : r.target.parentElement;
              if (el?.closest(".vp-search-result-wrapper")) fixText(r.target);
            }
          });

    onMounted(() => {
      window.addEventListener("keydown", onKey);
      const app = document.getElementById("app");
      if (app)
        observer?.observe(app, {
          childList: true,
          characterData: true,
          subtree: true,
        });
    });
    onBeforeUnmount(() => {
      window.removeEventListener("keydown", onKey);
      observer?.disconnect();
    });
  },
});
