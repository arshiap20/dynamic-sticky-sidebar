import type { Frame } from "./jump.spec";

declare global {
  interface Window {
    __frames: Frame[];
    mount(which: "hook" | "component"): void;
    unmount(): void;
    setGap(gap: number): void;
  }
}
