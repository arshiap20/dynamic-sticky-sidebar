<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { withBase } from "vuepress/client";
import { useStickySidebar } from "../../../src/vue";
import { localeStrings, LOCALES } from "../i18n/index";
import { useStrings } from "../i18n/useStrings";

const props = withDefaults(
  defineProps<{
    height?: number;
    page?: boolean;
  }>(),
  { height: 560, page: false },
);

const root = ref<HTMLElement | null>(null);
const scroller = ref<HTMLElement | null>(null);
const sidebar = ref<HTMLElement | null>(null);
const bar = ref<HTMLElement | null>(null);
const nav = ref<HTMLElement | null>(null);
const expandBtn = ref<HTMLButtonElement | null>(null);

const tall = ref(true);
const autoHide = ref(true);
const navHidden = ref(false);
const hud = ref("");

useStickySidebar(sidebar, () => ({
  scroller: props.page ? null : scroller.value,
  header: [bar.value, nav.value].filter((x): x is HTMLElement => !!x),
  gap: 12,
  media: "(min-width: 560px)",
}));

// ---------- language ----------
// Docs pages use the route's language. The standalone page (/playground.html)
// lives outside the language folders, so it gets the language via ?lang=fa.
const { routeLocale } = useStrings();
const queryLocale = ref<string | null>(null);
const prefix = computed(() =>
  props.page ? (queryLocale.value ?? "/") : routeLocale.value,
);
const t = computed(() => localeStrings(prefix.value));

const pageUrl = computed(() => {
  const lang = routeLocale.value.replace(/\//g, "");
  return withBase("/playground.html") + (lang ? `?lang=${lang}` : "");
});
const docsUrl = computed(() => withBase(`${prefix.value}demo.html`));

// ---------- expanded modal ----------
const expanded = ref(false);
const slotHeight = ref(0);

async function open() {
  slotHeight.value = root.value?.offsetHeight ?? 0;
  expanded.value = true;
  document.documentElement.style.overflow = "hidden";
  await nextTick();
  scroller.value?.focus({ preventScroll: true });
}

async function close() {
  expanded.value = false;
  document.documentElement.style.overflow = "";
  await nextTick();
  expandBtn.value?.focus({ preventScroll: true });
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && expanded.value) close();
}

// ---------- header auto-hide + readout ----------
let last = 0;
let frame = 0;
let hudFrame = 0;

const scrollY = () =>
  props.page ? window.scrollY : (scroller.value?.scrollTop ?? 0);

function onScroll() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const y = scrollY();
    const d = y - last;
    if (!autoHide.value || y < 120) {
      navHidden.value = false;
      last = y;
    } else if (d > 8) {
      navHidden.value = true;
      last = y;
    } else if (d < -4) {
      navHidden.value = false;
      last = y;
    }
  });
}

function loop() {
  const s = sidebar.value;
  const sc = scroller.value;
  if (s && sc) {
    const r = s.getBoundingClientRect();
    const top = props.page ? 0 : sc.getBoundingClientRect().top;
    const bottom = props.page
      ? window.innerHeight
      : sc.getBoundingClientRect().bottom;
    hud.value = `top ${(r.top - top).toFixed(0)}px · bottom ${(bottom - r.bottom).toFixed(0)}px`;
  }
  hudFrame = requestAnimationFrame(loop);
}

onMounted(() => {
  if (props.page) {
    const lang = new URLSearchParams(location.search).get("lang");
    if (lang && LOCALES[`/${lang}/`]) queryLocale.value = `/${lang}/`;
  }
  hudFrame = requestAnimationFrame(loop);
  window.addEventListener("keydown", onKey);
  if (props.page)
    window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  cancelAnimationFrame(hudFrame);
  window.removeEventListener("keydown", onKey);
  window.removeEventListener("scroll", onScroll);
  if (expanded.value) document.documentElement.style.overflow = "";
});

const hint = computed(() =>
  props.page
    ? t.value.demo.hintPage
    : expanded.value
      ? t.value.demo.hintModal
      : t.value.demo.hintBox,
);
</script>

<template>
  <!-- holds the space while the demo is shown in the modal -->
  <div
    class="ssd-slot"
    :style="expanded ? { height: `${slotHeight}px` } : undefined"
  >
    <Teleport to="body" :disabled="!expanded">
      <div
        v-if="expanded"
        class="ssd-backdrop"
        aria-hidden="true"
        @click="close"
      />
      <div
        ref="root"
        class="ssd"
        :class="{ modal: expanded, page }"
        :role="expanded ? 'dialog' : undefined"
        :aria-modal="expanded ? 'true' : undefined"
        :aria-label="expanded ? t.demo.dialogLabel : undefined"
        :dir="t.dir"
      >
        <div class="ssd-controls">
          <label><input v-model="tall" type="checkbox" /> {{ t.demo.tall }}</label>
          <label
            ><input v-model="autoHide" type="checkbox" />
            {{ t.demo.autoHide }}</label
          >
          <span class="ssd-hud" dir="ltr">{{ hud }}</span>

          <template v-if="page">
            <a class="ssd-btn" :href="docsUrl">{{ t.demo.backToDocs }}</a>
          </template>
          <template v-else>
            <a class="ssd-btn" :href="pageUrl" target="_blank" rel="noopener">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M9.5 2.5h4v4M13.5 2.5 7.5 8.5M12 9.5V13a.5.5 0 0 1-.5.5h-8.5a.5.5 0 0 1-.5-.5V4.5A.5.5 0 0 1 3 4h3.5"
                />
              </svg>
              {{ t.demo.openInNewTab }}
            </a>
            <button
              v-if="!expanded"
              ref="expandBtn"
              type="button"
              class="ssd-btn"
              @click="open"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10"
                />
              </svg>
              {{ t.demo.expand }}
            </button>
            <button
              v-else
              type="button"
              class="ssd-btn"
              :aria-label="t.demo.closeLabel"
              @click="close"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
              {{ t.demo.close }}
            </button>
          </template>
        </div>

        <div
          ref="scroller"
          class="ssd-scroller"
          dir="ltr"
          :tabindex="page ? undefined : 0"
          :aria-label="page ? undefined : t.demo.scrollerLabel"
          :style="{
            height: page || expanded ? undefined : `${props.height}px`,
          }"
          @scroll.passive="page ? undefined : onScroll()"
        >
          <header class="ssd-header">
            <div ref="bar" class="ssd-bar">
              <b>Shop</b><span>{{ hint }}</span>
            </div>
            <nav ref="nav" class="ssd-nav" :class="{ hidden: navHidden }">
              <span>Categories</span><span>Brands</span><span>Deals</span>
            </nav>
          </header>
          <div class="ssd-nav-space" />

          <div class="ssd-layout">
            <aside ref="sidebar" class="ssd-sidebar">
              <div
                v-for="i in tall ? 18 : 4"
                :key="i"
                class="ssd-item"
                :class="{ first: i === 1, last: i === (tall ? 18 : 4) }"
              >
                Filter {{ i }}{{ i === (tall ? 18 : 4) ? " (last)" : "" }}
              </div>
            </aside>
            <main class="ssd-main">
              <div v-for="i in 24" :key="i" class="ssd-card">Card {{ i }}</div>
            </main>
          </div>
          <footer class="ssd-footer">footer</footer>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.ssd-slot {
  margin: 1.25rem 0;
}
.ssd {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text);
}

/* ---------- controls ---------- */
.ssd-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  padding: 8px 10px 8px 14px;
  font-size: 13px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}
.ssd-controls label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.ssd-hud {
  margin-inline-start: auto;
  font-family: var(--code-font-family, ui-monospace, monospace);
  font-size: 12px;
  color: var(--vp-c-text-mute);
}
.ssd-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 7px;
  background: var(--vp-c-bg-alt);
  font: inherit;
  font-size: 12.5px;
  color: var(--vp-c-text) !important;
  text-decoration: none !important;
  cursor: pointer;
  white-space: nowrap;
}
.ssd-btn:hover {
  border-color: var(--vp-c-border-hard);
}
.ssd-btn svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
/* the theme adds an "external link" arrow to target=_blank links */
.ssd-btn::after {
  display: none !important;
}

/* ---------- expanded modal ---------- */
.ssd-backdrop {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgb(12 14 21 / 55%);
  backdrop-filter: blur(4px);
}
.ssd.modal {
  position: fixed;
  inset: 24px;
  z-index: 301;
  display: flex;
  flex-direction: column;
  box-shadow: 0 40px 80px -20px rgb(0 0 0 / 45%);
}
.ssd.modal .ssd-scroller {
  flex: 1;
  min-height: 0;
}
@media (max-width: 640px) {
  .ssd.modal {
    inset: 0;
    border: none;
    border-radius: 0;
  }
}

/* ---------- standalone page ---------- */
.ssd.page {
  border: none;
  border-radius: 0;
  overflow: visible;
  min-height: 100vh;
}
.ssd.page .ssd-controls {
  position: fixed;
  inset-inline-end: 16px;
  bottom: 16px;
  z-index: 10;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: 0 12px 30px -12px rgb(0 0 0 / 35%);
}
.ssd.page .ssd-scroller {
  overflow: visible;
}

/* roomier layout when the demo has the whole screen */
.ssd.modal .ssd-layout,
.ssd.page .ssd-layout {
  max-width: 1180px;
  margin-inline: auto;
  padding: 24px;
  gap: 28px;
}
@media (min-width: 560px) {
  .ssd.modal .ssd-layout,
  .ssd.page .ssd-layout {
    grid-template-columns: 260px 1fr;
  }
}
.ssd.modal .ssd-card,
.ssd.page .ssd-card {
  height: 180px;
}

/* ---------- demo page content ---------- */
.ssd-scroller {
  overflow: auto;
  position: relative;
  overscroll-behavior: contain;
}
.ssd-scroller:focus-visible {
  outline-offset: -2px;
}
.ssd-header {
  position: sticky;
  top: 0;
  z-index: 5;
}
.ssd-bar {
  position: relative;
  z-index: 1;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  background: var(--ds-blue);
  color: #fff;
  font-size: 13px;
}
.ssd-bar b {
  color: #fff;
  font-size: 15px;
}
.ssd-nav {
  position: absolute;
  inset-inline: 0;
  top: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 16px;
  font-size: 13px;
  color: #fff;
  background: color-mix(in srgb, var(--ds-blue) 82%, white);
  transition: transform 0.25s ease-out;
}
.ssd-nav.hidden {
  transform: translateY(-100%);
}
.ssd-nav-space {
  height: 40px;
}
.ssd-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
  align-items: start;
}
@media (min-width: 560px) {
  .ssd-layout {
    grid-template-columns: 170px 1fr;
  }
}
.ssd-sidebar {
  padding: 10px;
  border-radius: 12px;
  background: var(--ds-signal-soft);
  outline: 1.5px solid var(--ds-signal);
  outline-offset: -1.5px;
}
.ssd-item {
  height: 34px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 8px;
  border-radius: 8px;
  font-size: 12px;
  background: color-mix(in srgb, var(--ds-signal) 14%, transparent);
}
.ssd-item.first {
  background: color-mix(in srgb, var(--ds-signal) 32%, transparent);
}
.ssd-item.last {
  margin-bottom: 0;
  background: var(--ds-signal);
  color: #fff;
}
.ssd-card {
  height: 130px;
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg);
  font-size: 12px;
  color: var(--vp-c-text-mute);
}
.ssd-footer {
  height: 220px;
  display: grid;
  place-items: center;
  background: var(--ds-ink);
  color: var(--vp-c-bg);
  font-size: 13px;
}
</style>
