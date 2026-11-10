import { afterEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { stickySidebar, type StickySidebar } from "../../src";
import {
  bottomGap,
  cleanup,
  fixture,
  frames,
  GAP,
  HEADER,
  scrollTo,
  top,
} from "./helpers";

let instance: StickySidebar | undefined;
const create = (...args: Parameters<typeof stickySidebar>) =>
  (instance = stickySidebar(...args));

afterEach(() => {
  instance?.destroy();
  instance = undefined;
  cleanup();
});

describe("setup", () => {
  it("accepts an element", () => {
    const { sidebar } = fixture();
    expect(create(sidebar).element).toBe(sidebar);
  });

  it("accepts a selector", () => {
    const { sidebar } = fixture();
    expect(create("#sidebar").element).toBe(sidebar);
  });

  it("throws when the element is missing", () => {
    fixture();
    expect(() => stickySidebar("#nope")).toThrow(
      "[dynamic-sticky-sidebar] sidebar element not found: #nope",
    );
  });

  it("makes the sidebar sticky", () => {
    const { sidebar } = fixture();
    create(sidebar);
    expect(sidebar.style.position).toBe("sticky");
    expect(sidebar.style.overflowAnchor).toBe("none");
  });

  it("does not override a stylesheet position: sticky", () => {
    const { sidebar } = fixture();
    const style = document.createElement("style");
    style.textContent = "#sidebar { position: sticky; }";
    sidebar.before(style);
    create(sidebar);
    expect(sidebar.style.position).toBe("");
  });
});

describe("short sidebar", () => {
  it("pins under the header plus gap", async () => {
    const { sidebar } = fixture();
    create(sidebar, { header: "#header" });
    expect(sidebar.style.top).toBe(`${HEADER + GAP}px`);
    await scrollTo(1000);
    expect(top(sidebar)).toBeCloseTo(HEADER + GAP, 0);
  });

  it("uses only the gap without a header", () => {
    const { sidebar } = fixture();
    create(sidebar);
    expect(sidebar.style.top).toBe(`${GAP}px`);
  });

  it("applies gap and offsetTop", () => {
    const { sidebar } = fixture();
    create(sidebar, { header: "#header", gap: 10, offsetTop: 5 });
    expect(sidebar.style.top).toBe(`${HEADER + 15}px`);
  });

  it("reads offsetTop getters on every update", () => {
    const { sidebar } = fixture();
    let offset = 0;
    const sticky = create(sidebar, { offsetTop: () => offset });
    expect(sidebar.style.top).toBe(`${GAP}px`);
    offset = 40;
    sticky.update();
    expect(sidebar.style.top).toBe(`${GAP + 40}px`);
  });

  it("follows the lowest visible header", () => {
    const { root, sidebar } = fixture();
    const extra = document.createElement("nav");
    extra.style.cssText =
      "position: fixed; top: 0; left: 0; right: 0; height: 100px;";
    root.prepend(extra);
    create(sidebar, { header: [root.querySelector("#header")!, extra] });
    expect(sidebar.style.top).toBe(`${100 + GAP}px`);
  });

  it("ignores hidden headers", () => {
    const { header, sidebar } = fixture();
    header.style.display = "none";
    create(sidebar, { header });
    expect(sidebar.style.top).toBe(`${GAP}px`);
  });

  it("follows a header that changes size in the same frame", async () => {
    const { header, sidebar } = fixture();
    create(sidebar, { header });
    header.style.height = "100px";
    await Promise.resolve();
    expect(sidebar.style.top).toBe(`${100 + GAP}px`);
  });

  it("follows a header that resizes without a style change", async () => {
    const { header, sidebar } = fixture();
    const content = document.createElement("div");
    content.style.height = "40px";
    header.style.height = "auto";
    header.append(content);
    create(sidebar, { header });
    expect(sidebar.style.top).toBe(`${40 + GAP}px`);
    content.style.height = "120px";
    await vi.waitFor(() => expect(sidebar.style.top).toBe(`${120 + GAP}px`));
  });
});

describe("tall sidebar", () => {
  it("pins its bottom while scrolling down", async () => {
    const { sidebar } = fixture({ size: "tall" });
    create(sidebar, { header: "#header" });
    await scrollTo(2500);
    expect(bottomGap(sidebar)).toBeCloseTo(GAP, 0);
  });

  it("pins its top under the header while scrolling up", async () => {
    const { sidebar } = fixture({ size: "tall" });
    create(sidebar, { header: "#header" });
    await scrollTo(3500);
    await scrollTo(1500);
    expect(top(sidebar)).toBeCloseTo(HEADER + GAP, 0);
  });

  it("does not jump on a direction change, then scrolls with the page", async () => {
    const { sidebar } = fixture({ size: "tall" });
    create(sidebar, { header: "#header" });
    await scrollTo(2500);
    const pinned = top(sidebar);
    await scrollTo(2490);
    const released = top(sidebar);
    expect(released).toBeCloseTo(pinned, 0);
    await scrollTo(2290);
    expect(top(sidebar)).toBeCloseTo(released + 200, 0);
  });

  it("respects offsetBottom", async () => {
    const { sidebar } = fixture({ size: "tall" });
    create(sidebar, { header: "#header", offsetBottom: 30 });
    await scrollTo(2500);
    expect(bottomGap(sidebar)).toBeCloseTo(GAP + 30, 0);
  });

  it("works in a block parent through the JS fallback", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { sidebar } = fixture({ size: "tall", layout: "block" });
    create(sidebar, { header: "#header" });
    await scrollTo(3500);
    expect(bottomGap(sidebar)).toBeCloseTo(GAP, 0);
    await scrollTo(1500);
    expect(top(sidebar)).toBeCloseTo(HEADER + GAP, 0);
  });
});

describe("scroller", () => {
  it("pins relative to a scroll container", async () => {
    const { root, sidebar } = fixture();
    const box = document.createElement("div");
    box.style.cssText = "height: 400px; overflow: auto; margin-top: 50px;";
    box.append(root.querySelector("#layout")!);
    root.append(box);
    create(sidebar, { scroller: box });
    await scrollTo(1000, 120, box);
    expect(top(sidebar) - box.getBoundingClientRect().top).toBeCloseTo(GAP, 0);
  });
});

describe("media", () => {
  afterEach(() => page.viewport(1024, 768));

  it("is inactive while the query does not match", () => {
    const { sidebar } = fixture();
    create(sidebar, { media: "(min-width: 5000px)" });
    expect(sidebar.getAttribute("style")).toBeNull();
  });

  it("starts and stops when the query changes", async () => {
    const { sidebar } = fixture();
    create(sidebar, { media: "(min-width: 800px)" });
    expect(sidebar.style.position).toBe("sticky");
    await page.viewport(600, 768);
    await vi.waitFor(() => expect(sidebar.style.position).toBe(""));
    await page.viewport(1024, 768);
    await vi.waitFor(() => expect(sidebar.style.position).toBe("sticky"));
  });
});

describe("api", () => {
  it("destroy restores the original inline styles", async () => {
    const { sidebar } = fixture({ size: "tall" });
    sidebar.style.cssText = "top: 5px; margin-top: 3px; color: red;";
    const before = sidebar.style.cssText;
    create(sidebar, { header: "#header" });
    await scrollTo(2500);
    await scrollTo(2000);
    instance!.destroy();
    expect(sidebar.style.cssText).toBe(before);
  });

  it("destroy removes every listener it added", () => {
    const { header, sidebar } = fixture();
    const added = [vi.spyOn(window, "addEventListener"), vi.spyOn(header, "addEventListener")];
    const removed = [vi.spyOn(window, "removeEventListener"), vi.spyOn(header, "removeEventListener")];
    create(sidebar, { header }).destroy();
    added.forEach((add, i) => {
      const pairs = (spy: typeof add) => spy.mock.calls.map(([type, fn]) => [type, fn]);
      expect(pairs(add).length).toBeGreaterThan(0);
      expect(pairs(removed[i])).toEqual(expect.arrayContaining(pairs(add)));
    });
  });

  it("stops updating after destroy", async () => {
    const { sidebar } = fixture({ size: "tall" });
    create(sidebar, { header: "#header" }).destroy();
    await scrollTo(2500);
    expect(sidebar.getAttribute("style")).toBe("");
  });

  it("setOptions applies a new gap", () => {
    const { sidebar } = fixture();
    const sticky = create(sidebar, { header: "#header" });
    sticky.setOptions({ header: "#header", gap: 40 });
    expect(sidebar.style.top).toBe(`${HEADER + 40}px`);
  });

  it("setOptions switches the header", () => {
    const { sidebar } = fixture();
    const sticky = create(sidebar, { header: "#header" });
    sticky.setOptions({});
    expect(sidebar.style.top).toBe(`${GAP}px`);
  });

  it("refresh picks up headers added later", () => {
    const { root, sidebar } = fixture();
    const sticky = create(sidebar, { header: ".late" });
    const late = document.createElement("div");
    late.className = "late";
    late.style.cssText = "position: fixed; top: 0; height: 80px; width: 100%;";
    root.append(late);
    sticky.refresh();
    expect(sidebar.style.top).toBe(`${80 + GAP}px`);
  });

  it("subscribe drives updates and is unsubscribed on destroy", () => {
    const { sidebar } = fixture();
    let offset = 0;
    let notify = () => {};
    const unsubscribe = vi.fn();
    const sticky = create(sidebar, {
      offsetTop: () => offset,
      subscribe: (update) => {
        notify = update;
        return unsubscribe;
      },
    });
    offset = 25;
    notify();
    expect(sidebar.style.top).toBe(`${GAP + 25}px`);
    sticky.destroy();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it("waits while the sidebar is hidden", async () => {
    const { sidebar } = fixture();
    sidebar.style.display = "none";
    create(sidebar, { header: "#header" });
    expect(sidebar.style.top).toBe("");
    sidebar.style.display = "";
    await vi.waitFor(() => expect(sidebar.style.top).toBe(`${HEADER + GAP}px`));
  });
});

describe("dev warnings", () => {
  it("warns once for a block parent", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { sidebar } = fixture({ layout: "block" });
    const sticky = create(sidebar);
    sticky.refresh();
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain("parent is not grid / row-flex");
  });

  it("warns when the header selector matches nothing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { sidebar } = fixture();
    create(sidebar, { header: ".missing" });
    expect(warn).toHaveBeenCalledWith(
      '[dynamic-sticky-sidebar] header selector ".missing" matched no elements',
    );
  });

  it("warns when the scroller is missing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { sidebar } = fixture();
    create(sidebar, { scroller: "#missing" });
    expect(warn).toHaveBeenCalledWith(
      '[dynamic-sticky-sidebar] scroller "#missing" not found, using the window',
    );
  });

  it("stays quiet for a correct setup", () => {
    const warn = vi.spyOn(console, "warn");
    const { sidebar } = fixture();
    create(sidebar, { header: "#header" });
    expect(warn).not.toHaveBeenCalled();
  });
});
