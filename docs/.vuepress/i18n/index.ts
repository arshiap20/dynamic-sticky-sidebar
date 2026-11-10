import ar from "./ar";
import de from "./de";
import en from "./en";
import fa from "./fa";
import fr from "./fr";
import it from "./it";
import type { LocaleStrings } from "./types";

/** Route prefix → strings. `/` is English (the default). */
export const LOCALES: Record<string, LocaleStrings> = {
  "/": en,
  "/fa/": fa,
  "/ar/": ar,
  "/de/": de,
  "/fr/": fr,
  "/it/": it,
};

export const localeStrings = (prefix: string): LocaleStrings =>
  LOCALES[prefix] ?? en;

export type { LocaleStrings };
