import { onBeforeUnmount, toValue, watch } from "vue";
import type {
  ComponentPublicInstance,
  Directive,
  MaybeRefOrGetter,
  Plugin,
} from "vue";
import { stickySidebar } from "./core";
import type { HeaderInput, StickySidebar, StickySidebarOptions } from "./core";

export type { HeaderInput, Px, StickySidebarOptions } from "./core";

type Target = HTMLElement | ComponentPublicInstance | null | undefined;

export interface VueStickySidebarOptions extends Omit<
  StickySidebarOptions,
  "header" | "scroller"
> {
  header?: MaybeRefOrGetter<HeaderInput | ComponentPublicInstance>;
  scroller?: MaybeRefOrGetter<
    Element | string | null | undefined | ComponentPublicInstance
  >;
}

const unwrap = <T>(v: T | ComponentPublicInstance): T =>
  v && typeof v === "object" && "$el" in v ? (v.$el as T) : (v as T);

function normalize(o: VueStickySidebarOptions = {}): StickySidebarOptions {
  return {
    ...o,
    header: unwrap(toValue(o.header)) as HeaderInput,
    scroller: unwrap(toValue(o.scroller)) as Element | string | null,
  };
}

/**
 * Composable. `target` is a template ref (element or component).
 * Options may be a plain object, a ref or a getter; reactive changes are applied.
 *
 * @example
 * const sidebar = ref<HTMLElement>(); // <aside ref="sidebar">
 * useStickySidebar(sidebar, { header: '.site-header' });
 */
export function useStickySidebar(
  target: MaybeRefOrGetter<Target>,
  options: MaybeRefOrGetter<VueStickySidebarOptions> = {},
) {
  let instance: StickySidebar | null = null;

  const stopTarget = watch(
    () => unwrap<HTMLElement | null | undefined>(toValue(target)),
    (el, _old, onCleanup) => {
      if (!el) return;
      const current = stickySidebar(el, normalize(toValue(options)));
      instance = current;
      onCleanup(() => {
        current.destroy();
        if (instance === current) instance = null;
      });
    },
    { immediate: true, flush: "post" },
  );

  const stopOptions = watch(
    () => normalize(toValue(options)),
    (o) => instance?.setOptions(o),
    { flush: "post" },
  );

  onBeforeUnmount(() => {
    stopOptions();
    stopTarget();
  });

  return {
    update: () => instance?.update(),
    refresh: () => instance?.refresh(),
  };
}

const instances = /* @__PURE__ */ new WeakMap<HTMLElement, StickySidebar>();

/** `v-sticky-sidebar="{ header: '.site-header', media: '(min-width: 768px)' }"` */
export const vStickySidebar: Directive<
  HTMLElement,
  VueStickySidebarOptions | undefined
> = {
  mounted(el, { value }) {
    instances.set(el, stickySidebar(el, normalize(value)));
  },
  updated(el, { value, oldValue }) {
    if (value !== oldValue) instances.get(el)?.setOptions(normalize(value));
  },
  beforeUnmount(el) {
    instances.get(el)?.destroy();
    instances.delete(el);
  },
};

/** `app.use(StickySidebarPlugin)` registers `v-sticky-sidebar` globally. */
export const StickySidebarPlugin: Plugin = {
  install(app) {
    app.directive("sticky-sidebar", vStickySidebar);
  },
};
