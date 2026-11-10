import {
  createApp,
  defineComponent,
  h,
  nextTick,
  ref,
  resolveDirective,
  withDirectives,
  type App,
  type Component,
} from "vue";
import { afterEach, describe, expect, it } from "vitest";
import {
  StickySidebarPlugin,
  useStickySidebar,
  vStickySidebar,
  type VueStickySidebarOptions,
} from "../../src/vue";
import { cleanup, fixture, GAP, HEADER } from "./helpers";

let app: App | undefined;

afterEach(() => {
  app?.unmount();
  app = undefined;
  cleanup();
});

async function mount(
  component: Component,
  plugin?: typeof StickySidebarPlugin,
) {
  const { layout, sidebar } = fixture();
  sidebar.remove();
  const host = document.createElement("div");
  host.style.display = "contents";
  layout.prepend(host);
  app = createApp(component);
  if (plugin) app.use(plugin);
  app.mount(host);
  await nextTick();
}

const aside = () => document.querySelector<HTMLElement>("#sb")!;

describe("useStickySidebar", () => {
  it("makes a template ref sticky under the header", async () => {
    await mount({
      setup() {
        const el = ref<HTMLElement>();
        useStickySidebar(el, { header: "#header" });
        return () => h("aside", { id: "sb", class: "short", ref: el });
      },
    });
    expect(aside().style.position).toBe("sticky");
    expect(aside().style.top).toBe(`${HEADER + GAP}px`);
  });

  it("accepts a component ref", async () => {
    const Child = defineComponent(
      () => () => h("aside", { id: "sb", class: "short" }),
    );
    await mount({
      setup() {
        const el = ref();
        useStickySidebar(el, { header: "#header" });
        return () => h(Child, { ref: el });
      },
    });
    expect(aside().style.top).toBe(`${HEADER + GAP}px`);
  });

  it("applies reactive options", async () => {
    const options = ref<VueStickySidebarOptions>({
      header: "#header",
      gap: 16,
    });
    await mount({
      setup() {
        const el = ref<HTMLElement>();
        useStickySidebar(el, options);
        return () => h("aside", { id: "sb", class: "short", ref: el });
      },
    });
    options.value = { header: "#header", gap: 40 };
    await nextTick();
    expect(aside().style.top).toBe(`${HEADER + 40}px`);
  });

  it("accepts a getter for options", async () => {
    const gap = ref(16);
    await mount({
      setup() {
        const el = ref<HTMLElement>();
        useStickySidebar(el, () => ({ header: "#header", gap: gap.value }));
        return () => h("aside", { id: "sb", class: "short", ref: el });
      },
    });
    gap.value = 24;
    await nextTick();
    expect(aside().style.top).toBe(`${HEADER + 24}px`);
  });

  it("restores styles when the element is removed", async () => {
    const show = ref(true);
    await mount({
      setup() {
        const el = ref<HTMLElement>();
        useStickySidebar(el, { header: "#header" });
        return () =>
          show.value ? h("aside", { id: "sb", class: "short", ref: el }) : null;
      },
    });
    const el = aside();
    show.value = false;
    await nextTick();
    expect(el.getAttribute("style")).toBe("");
  });

  it("restores styles on unmount", async () => {
    await mount({
      setup() {
        const el = ref<HTMLElement>();
        useStickySidebar(el, { header: "#header" });
        return () => h("aside", { id: "sb", class: "short", ref: el });
      },
    });
    const el = aside();
    app!.unmount();
    app = undefined;
    expect(el.getAttribute("style")).toBe("");
  });

  it("returns update and refresh", async () => {
    let api: ReturnType<typeof useStickySidebar> | undefined;
    await mount({
      setup() {
        const el = ref<HTMLElement>();
        api = useStickySidebar(el, { header: ".late" });
        return () => h("aside", { id: "sb", class: "short", ref: el });
      },
    });
    const late = document.createElement("div");
    late.className = "late";
    late.style.cssText = "position: fixed; top: 0; height: 80px; width: 100%;";
    document.getElementById("layout")!.append(late);
    api!.refresh();
    expect(aside().style.top).toBe(`${80 + GAP}px`);
  });
});

describe("v-sticky-sidebar", () => {
  it("makes the element sticky", async () => {
    await mount({
      setup: () => () =>
        withDirectives(h("aside", { id: "sb", class: "short" }), [
          [vStickySidebar, { header: "#header" }],
        ]),
    });
    expect(aside().style.top).toBe(`${HEADER + GAP}px`);
  });

  it("works without a value", async () => {
    await mount({
      setup: () => () =>
        withDirectives(h("aside", { id: "sb", class: "short" }), [
          [vStickySidebar],
        ]),
    });
    expect(aside().style.top).toBe(`${GAP}px`);
  });

  it("applies a new value", async () => {
    const gap = ref(16);
    await mount({
      setup: () => () =>
        withDirectives(h("aside", { id: "sb", class: "short" }), [
          [vStickySidebar, { header: "#header", gap: gap.value }],
        ]),
    });
    gap.value = 30;
    await nextTick();
    expect(aside().style.top).toBe(`${HEADER + 30}px`);
  });

  it("restores styles on unmount", async () => {
    await mount({
      setup: () => () =>
        withDirectives(h("aside", { id: "sb", class: "short" }), [
          [vStickySidebar, { header: "#header" }],
        ]),
    });
    const el = aside();
    app!.unmount();
    app = undefined;
    expect(el.getAttribute("style")).toBe("");
  });
});

describe("StickySidebarPlugin", () => {
  it("registers v-sticky-sidebar globally", async () => {
    await mount(
      {
        setup: () => () =>
          withDirectives(h("aside", { id: "sb", class: "short" }), [
            [resolveDirective("sticky-sidebar")!, { header: "#header" }],
          ]),
      },
      StickySidebarPlugin,
    );
    expect(aside().style.top).toBe(`${HEADER + GAP}px`);
  });
});
