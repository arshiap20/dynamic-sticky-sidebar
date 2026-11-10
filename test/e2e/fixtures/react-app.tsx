import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { StickySidebar, useStickySidebar } from "../../../src/react";

const items = (n: number) =>
  Array.from({ length: n }, (_, i) => (
    <div key={i} className="item">
      {i}
    </div>
  ));

function HookPage() {
  const header = useRef<HTMLElement>(null);
  const [gap, setGap] = useState(16);
  const ref = useStickySidebar<HTMLElement>({ header, gap });
  window.setGap = (g: number) => flushSync(() => setGap(g));
  return (
    <>
      <header ref={header} className="hdr" />
      <div className="layout">
        <aside id="sidebar" ref={ref}>
          {items(30)}
        </aside>
        <main className="main" />
      </div>
    </>
  );
}

function ComponentPage() {
  return (
    <>
      <header className="hdr" />
      <div className="layout">
        <StickySidebar
          id="sidebar"
          header=".hdr"
          offsetTop={() => 4}
          className="x"
        >
          {items(30)}
        </StickySidebar>
        <main className="main" />
      </div>
    </>
  );
}

const root = createRoot(document.getElementById("app")!);
window.mount = (which: string) =>
  flushSync(() =>
    root.render(which === "hook" ? <HookPage /> : <ComponentPage />),
  );
window.unmount = () => flushSync(() => root.render(<div />));
