import { createApp, defineComponent, h, ref, withDirectives, type App } from "vue";
import { useStickySidebar, vStickySidebar } from "../../../src/vue";

const items = () =>
  Array.from({ length: 30 }, (_, i) => h("div", { class: "item" }, String(i)));

const Composable = defineComponent(() => {
  const el = ref<HTMLElement>();
  const header = ref<HTMLElement>();
  const opts = ref({ header, gap: 16 });
  window.setGap = (gap) => {
    opts.value = { header, gap };
  };
  useStickySidebar(el, opts);
  return () => [
    h("header", { ref: header, class: "hdr" }),
    h("div", { class: "layout" }, [
      h("aside", { id: "sidebar", ref: el }, items()),
      h("main", { class: "main" }),
    ]),
  ];
});

const Directive = defineComponent(() => () => [
  h("header", { class: "hdr" }),
  h("div", { class: "layout" }, [
    withDirectives(h("aside", { id: "sidebar" }, items()), [
      [vStickySidebar, { header: ".hdr", offsetTop: 4 }],
    ]),
    h("main", { class: "main" }),
  ]),
]);

let app: App | null = null;
window.mount = (which) => {
  app = createApp(which === "hook" ? Composable : Directive);
  app.mount("#app");
};
window.unmount = () => app?.unmount();
