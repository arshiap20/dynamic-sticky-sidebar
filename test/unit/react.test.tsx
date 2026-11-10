import {
  act,
  createRef,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { StickySidebar, useStickySidebar } from "../../src/react";
import { cleanup, fixture, GAP, HEADER } from "./helpers";

let root: Root | undefined;

beforeAll(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  act(() => root?.unmount());
  root = undefined;
  cleanup();
});

function render(ui: ReactNode) {
  const { layout, sidebar } = fixture();
  sidebar.remove();
  const host = document.createElement("div");
  layout.prepend(host);
  host.style.display = "contents";
  root = createRoot(host);
  act(() => root!.render(ui));
  return host;
}

const rerender = (ui: ReactNode) => act(() => root!.render(ui));
const aside = () => document.querySelector<HTMLElement>("#sb")!;

describe("useStickySidebar", () => {
  function Hook(props: Parameters<typeof useStickySidebar>[0]) {
    const ref = useStickySidebar(props);
    return <aside id="sb" className="short" ref={ref} />;
  }

  it("makes the element sticky under the header", () => {
    render(<Hook header="#header" />);
    expect(aside().style.position).toBe("sticky");
    expect(aside().style.top).toBe(`${HEADER + GAP}px`);
  });

  it("accepts a ref as header", () => {
    function WithRef() {
      const header = useRef<HTMLDivElement>(null);
      const ref = useStickySidebar({ header });
      return (
        <>
          <div
            ref={header}
            style={{ position: "fixed", top: 0, height: 90, width: "100%" }}
          />
          <aside id="sb" className="short" ref={ref} />
        </>
      );
    }
    render(<WithRef />);
    expect(aside().style.top).toBe(`${90 + GAP}px`);
  });

  it("applies option changes on rerender", () => {
    render(<Hook header="#header" gap={16} />);
    rerender(<Hook header="#header" gap={40} />);
    expect(aside().style.top).toBe(`${HEADER + 40}px`);
  });

  it("reads the latest offsetTop function", () => {
    function Offset() {
      const [offset, setOffset] = useState(0);
      const ref = useStickySidebar({ offsetTop: () => offset });
      return (
        <aside
          id="sb"
          className="short"
          ref={ref}
          onClick={() => setOffset(30)}
        />
      );
    }
    render(<Offset />);
    expect(aside().style.top).toBe(`${GAP}px`);
    act(() => aside().click());
    act(() => window.dispatchEvent(new Event("resize")));
    return vi.waitFor(() => expect(aside().style.top).toBe(`${GAP + 30}px`));
  });

  it("restores inline styles on unmount", () => {
    render(<Hook header="#header" />);
    const el = aside();
    act(() => root!.unmount());
    root = undefined;
    expect(el.getAttribute("style")).toBe("");
  });

  it("moves to a new node when the element changes", () => {
    function Swap({ tag }: { tag: "aside" | "nav" }) {
      const ref = useStickySidebar({ header: "#header" });
      const Tag = tag;
      return <Tag id="sb" key={tag} ref={ref} />;
    }
    render(<Swap tag="aside" />);
    const first = aside();
    rerender(<Swap tag="nav" />);
    expect(first.isConnected).toBe(false);
    expect(aside().tagName).toBe("NAV");
    expect(aside().style.position).toBe("sticky");
  });
});

describe("<StickySidebar>", () => {
  it("renders an aside with props and children", () => {
    render(
      <StickySidebar id="sb" className="side" header="#header" data-x="1">
        <span>child</span>
      </StickySidebar>,
    );
    expect(aside().tagName).toBe("ASIDE");
    expect(aside().className).toBe("side");
    expect(aside().dataset.x).toBe("1");
    expect(aside().textContent).toBe("child");
    expect(aside().style.top).toBe(`${HEADER + GAP}px`);
  });

  it("renders the `as` element", () => {
    render(<StickySidebar id="sb" as="nav" />);
    expect(aside().tagName).toBe("NAV");
  });

  it("does not leak options as DOM attributes", () => {
    render(<StickySidebar id="sb" header="#header" gap={8} media="all" />);
    expect(aside().hasAttribute("header")).toBe(false);
    expect(aside().hasAttribute("gap")).toBe(false);
    expect(aside().hasAttribute("media")).toBe(false);
  });

  it("forwards object refs", () => {
    const ref = createRef<HTMLElement>() as RefObject<HTMLElement | null>;
    render(<StickySidebar id="sb" ref={ref} />);
    expect(ref.current).toBe(aside());
  });

  it("forwards callback refs", () => {
    const ref = vi.fn();
    render(<StickySidebar id="sb" ref={ref} />);
    expect(ref).toHaveBeenCalledWith(aside());
  });

  it("has a readable display name", () => {
    expect(
      (StickySidebar as unknown as { render: { name: string } }).render.name,
    ).toBe("StickySidebar");
  });
});
