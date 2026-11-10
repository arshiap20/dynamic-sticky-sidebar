import { expect, test, type Page } from "@playwright/test";

const URL = new globalThis.URL("../../demo/index.html", import.meta.url).href;
const GAP = 16;
const TOL = 1.5;

export interface Frame {
  kind: "pre" | "post";
  sy: number;
  top: number;
  bottom: number;
  head: number;
  vh: number;
  lTop: number;
  lBottom: number;
  h: number;
}

interface Snapshot {
  label: string;
  top: number;
  bottom: number;
  head: number;
}

type Anim = "css" | "js";
type Size = "tall" | "short";
type Layout = "grid" | "block";

const cases: { anim: Anim; size: Size; layout: Layout }[] = [
  { anim: "css", size: "tall", layout: "grid" },
  { anim: "css", size: "short", layout: "grid" },
  { anim: "js", size: "tall", layout: "grid" },
  { anim: "js", size: "short", layout: "grid" },
  { anim: "css", size: "tall", layout: "block" },
  { anim: "js", size: "tall", layout: "block" },
];

function sampler() {
  window.__frames = [];
  const sb = document.getElementById("sidebar")!;
  const layout = document.querySelector(".layout")!;
  const heads = [
    document.getElementById("bar")!,
    document.getElementById("nav")!,
  ];
  const sample = (kind: "pre" | "post") => {
    const r = sb.getBoundingClientRect();
    const l = layout.getBoundingClientRect();
    let head = 0;
    for (const h of heads) {
      const hr = h.getBoundingClientRect();
      if (hr.height) head = Math.max(head, hr.bottom);
    }
    window.__frames.push({
      kind,
      sy: scrollY,
      top: r.top,
      bottom: r.bottom,
      head,
      vh: document.documentElement.clientHeight,
      lTop: l.top,
      lBottom: l.bottom,
      h: r.height,
    });
  };
  const loop = () => {
    sample("pre");
    setTimeout(() => sample("post"), 0);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function snap() {
  const r = document.getElementById("sidebar")!.getBoundingClientRect();
  let head = 0;
  for (const id of ["bar", "nav"]) {
    const hr = document.getElementById(id)!.getBoundingClientRect();
    if (hr.height) head = Math.max(head, hr.bottom);
  }
  return {
    top: r.top,
    bottom: document.documentElement.clientHeight - r.bottom,
    head,
  };
}

async function scenario(page: Page): Promise<Snapshot[]> {
  await page.mouse.move(800, 500);
  const wheel = async (dy: number, steps: number, wait = 16) => {
    for (let i = 0; i < steps; i++) {
      await page.mouse.wheel(0, dy);
      await page.waitForTimeout(wait);
    }
  };
  const checks: Snapshot[] = [];
  const settle = async (label: string) => {
    await page.waitForTimeout(450);
    checks.push({ label, ...(await page.evaluate(snap)) });
  };

  await wheel(60, 25);
  await settle("after slow scroll down");
  await wheel(-40, 6);
  await settle("after small reversal up");
  await wheel(50, 4);
  await wheel(-50, 3);
  await wheel(50, 3);
  await wheel(250, 12, 30);
  await settle("after fling down");
  await wheel(-80, 30);
  await settle("after long scroll up");
  await wheel(120, 20, 10);
  await wheel(-120, 8, 10);
  await wheel(120, 30, 10);
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await settle("at page end");
  await wheel(-60, 40);
  await settle("after scroll up from end");
  await wheel(300, 15, 10);
  await wheel(-400, 6, 10);
  await settle("after fast fling up");
  await wheel(300, 8, 10);
  await wheel(-250, 10, 16);
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle("at page top");
  return checks;
}

function jumps(frames: Frame[], tall: boolean, kind: Frame["kind"]): string[] {
  const errors: string[] = [];
  for (let i = 1; i < frames.length; i++) {
    const a = frames[i - 1];
    const b = frames[i];
    const dy = b.top - a.top;
    const ds = b.sy - a.sy;
    const dh = b.head - a.head;
    if (Math.abs(b.h - a.h) > 0.5) continue;
    const dhPrev = i > 1 ? b.head - frames[i - 2].head - dh : 0;
    if (Math.abs(dy) > Math.abs(ds) + Math.abs(dh) + Math.abs(dhPrev) + TOL)
      errors.push(
        `${kind} ${i}: jump dy=${dy.toFixed(1)} scroll=${ds.toFixed(1)} head=${dh.toFixed(1)}`,
      );
    const mid = b.lTop < b.head && b.lBottom > b.vh + 20;
    if (!mid) continue;
    if (tall) {
      if (b.bottom < b.vh - GAP - TOL)
        errors.push(
          `${kind} ${i}: gap under sidebar (${(b.vh - b.bottom).toFixed(1)}px)`,
        );
      if (b.top > 60 + 50 + GAP + TOL)
        errors.push(`${kind} ${i}: sidebar top too low (${b.top.toFixed(1)})`);
    } else if (
      kind === "post" &&
      Math.abs(b.top - (b.head + GAP)) > TOL &&
      Math.abs(a.top - (a.head + GAP)) > TOL &&
      a.lTop < a.head
    ) {
      errors.push(
        `${kind} ${i}: short sidebar not following header (top ${b.top.toFixed(1)} vs ${(b.head + GAP).toFixed(1)})`,
      );
    }
  }
  return errors;
}

function settled(checks: Snapshot[], tall: boolean): string[] {
  const errors: string[] = [];
  for (const c of checks) {
    const pinnedTop = Math.abs(c.top - (c.head + GAP)) <= TOL;
    const pinnedBottom = Math.abs(c.bottom - GAP) <= TOL;
    if (c.label === "at page top") {
      if (c.top < c.head + GAP - TOL)
        errors.push(`${c.label}: sidebar under header`);
    } else if (c.label === "at page end") {
      continue;
    } else if (tall) {
      if (c.label.includes("down") && !pinnedBottom)
        errors.push(
          `${c.label}: expected bottom-pinned, got bottom gap ${c.bottom.toFixed(1)}`,
        );
      if (c.label.includes("long scroll up") && !pinnedTop)
        errors.push(
          `${c.label}: expected top-pinned under header, got top ${c.top.toFixed(1)} head ${c.head.toFixed(1)}`,
        );
    } else if (!pinnedTop) {
      errors.push(
        `${c.label}: short sidebar should sit under header, top ${c.top.toFixed(1)} head ${c.head.toFixed(1)}`,
      );
    }
  }
  return errors;
}

for (const { anim, size, layout } of cases) {
  test(`no jumps: header=${anim} sidebar=${size} layout=${layout}`, async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));
    await page.goto(
      `${URL}?test&anim=${anim}&sidebar=${size}&layout=${layout}`,
    );
    await page.evaluate(sampler);
    const checks = await scenario(page);
    const frames = await page.evaluate(() => window.__frames);
    const tall = size === "tall";
    // Block layout scrolls up through the JS fallback (≤1 frame lag), so only corrected frames count.
    const kinds: Frame["kind"][] =
      layout === "block" ? ["post"] : ["pre", "post"];

    expect(pageErrors).toEqual([]);
    for (const kind of kinds)
      expect(
        jumps(
          frames.filter((f) => f.kind === kind),
          tall,
          kind,
        ),
      ).toEqual([]);
    expect(settled(checks, tall)).toEqual([]);
  });
}
