import { computed } from "vue";
import { useRouteLocale } from "vuepress/client";
import { localeStrings } from "./index";

/** Strings for the current page's language, plus a helper for locale-aware links. */
export function useStrings() {
  const routeLocale = useRouteLocale();
  const t = computed(() => localeStrings(routeLocale.value));
  /** "/guide/x.html" → "/fa/guide/x.html" on Persian pages. */
  const link = (path: string) => routeLocale.value + path.replace(/^\//, "");
  return { t, link, routeLocale };
}
