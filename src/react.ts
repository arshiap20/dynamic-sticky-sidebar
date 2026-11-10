"use client";

import {
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type {
  ElementType,
  HTMLAttributes,
  ReactNode,
  Ref,
  RefObject,
} from "react";
import { px, stickySidebar } from "./core";
import type {
  HeaderInput,
  Px,
  StickySidebar as Instance,
  StickySidebarOptions,
} from "./core";

export type { HeaderInput, Px, StickySidebarOptions } from "./core";

export interface UseStickySidebarOptions extends Omit<
  StickySidebarOptions,
  "header" | "scroller"
> {
  header?: HeaderInput | RefObject<Element | null>;
  scroller?: Element | string | null | RefObject<Element | null>;
}

const isRef = (v: unknown): v is RefObject<Element | null> =>
  !!v && typeof v === "object" && "current" in v;
const deref = <T>(v: T | RefObject<Element | null>) =>
  isRef(v) ? v.current : v;

/**
 * Returns a callback ref for the sidebar element.
 * Function options (`offsetTop`, `offsetBottom`, `subscribe`) always read the latest render's value.
 *
 * @example
 * const sidebar = useStickySidebar({ header: '.site-header' });
 * return <aside ref={sidebar}>…</aside>;
 */
export function useStickySidebar<T extends HTMLElement = HTMLElement>(
  options: UseStickySidebarOptions = {},
): (node: T | null) => void {
  const latest = useRef(options);
  latest.current = options;
  const instance = useRef<Instance | null>(null);

  const stable = useRef({
    offsetTop: () => px(latest.current.offsetTop),
    offsetBottom: () => px(latest.current.offsetBottom),
    subscribe: (u: () => void) => latest.current.subscribe?.(u),
  }).current;

  const resolve = (): StickySidebarOptions => {
    const o = latest.current;
    return {
      header: deref(o.header) as HeaderInput,
      scroller: deref(o.scroller) as Element | string | null,
      media: o.media,
      gap: o.gap,
      offsetTop: stable.offsetTop,
      offsetBottom: stable.offsetBottom,
      subscribe: o.subscribe ? stable.subscribe : undefined,
    };
  };

  const ref = useCallback((node: T | null) => {
    instance.current?.destroy();
    instance.current = node ? stickySidebar(node, resolve()) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = deref(options.header);
  const scroller = deref(options.scroller);
  useEffect(() => {
    instance.current?.setOptions(resolve());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    header,
    scroller,
    options.media,
    options.gap,
    !!options.subscribe,
    num(options.offsetTop),
    num(options.offsetBottom),
  ]);

  return ref;
}

function num(v: Px | undefined) {
  return typeof v === "function" ? -1 : v;
}

export interface StickySidebarProps
  extends
    UseStickySidebarOptions,
    Omit<HTMLAttributes<HTMLElement>, keyof UseStickySidebarOptions> {
  /** Element to render. Default `aside`. */
  as?: ElementType;
  children?: ReactNode;
}

/**
 * Renders a sticky sidebar (`<aside>` by default).
 *
 * @example
 * <StickySidebar header=".site-header" media="(min-width: 768px)">…</StickySidebar>
 */
const Component = /* @__PURE__ */ forwardRef<HTMLElement, StickySidebarProps>(
  function StickySidebar(
    {
      as = "aside",
      header,
      scroller,
      media,
      gap,
      offsetTop,
      offsetBottom,
      subscribe,
      ...rest
    },
    forwarded,
  ) {
    const ref = useStickySidebar({
      header,
      scroller,
      media,
      gap,
      offsetTop,
      offsetBottom,
      subscribe,
    });
    const fwd = useRef<Ref<HTMLElement>>(forwarded);
    fwd.current = forwarded;
    const merged = useCallback(
      (node: HTMLElement | null) => {
        ref(node);
        const f = fwd.current;
        if (typeof f === "function") f(node);
        else if (f) (f as { current: HTMLElement | null }).current = node;
      },
      [ref],
    );

    return createElement(as, { ...rest, ref: merged });
  },
);

export { Component as StickySidebar };
