<script setup lang="ts">
import { ref } from "vue";
import { RouteLink } from "vuepress/client";
import { useStrings } from "../i18n/useStrings";
import HeroStage from "./HeroStage.vue";

const { t, link } = useStrings();
const INSTALL = "npm i dynamic-sticky-sidebar";
const copied = ref(false);
let timer = 0;

async function copy() {
  try {
    await navigator.clipboard.writeText(INSTALL);
    copied.value = true;
    clearTimeout(timer);
    timer = window.setTimeout(() => (copied.value = false), 1600);
  } catch {}
}
</script>

<template>
  <section class="lh">
    <div class="lh-copy">
      <p class="lh-meta">
        <span v-for="badge in t.hero.badges" :key="badge">{{ badge }}</span>
      </p>
      <h1 class="lh-title">
        {{ t.hero.titleBefore }}<em>{{ t.hero.titleEm }}</em>{{ t.hero.titleAfter }}
      </h1>
      <p class="lh-lede">{{ t.hero.lede }}</p>
      <div class="lh-actions">
        <RouteLink :to="link('/guide/getting-started.html')" class="lh-btn primary">{{
          t.hero.getStarted
        }}</RouteLink>
        <button
          type="button"
          class="lh-install"
          :aria-label="t.hero.copyLabel.replace('{cmd}', INSTALL)"
          @click="copy"
        >
          <span class="lh-prompt" aria-hidden="true">$</span>
          <code dir="ltr">{{ INSTALL }}</code>
          <span class="lh-copy-state" aria-live="polite">{{
            copied ? t.hero.copied : t.hero.copy
          }}</span>
        </button>
      </div>
      <p class="lh-frameworks">
        <RouteLink :to="link('/frameworks/vanilla.html')">Vanilla JS</RouteLink>
        <RouteLink :to="link('/frameworks/react.html')">React</RouteLink>
        <RouteLink :to="link('/frameworks/vue.html')">Vue</RouteLink>
      </p>
    </div>
    <div class="lh-stage">
      <HeroStage />
    </div>
  </section>
</template>

<style scoped>
.lh {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 480px);
  gap: 4rem;
  align-items: center;
  padding: 4.5rem 0 5rem;
}

.lh-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 1.5rem;
}
.lh-meta span {
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  font: 500 11.5px/1.5 var(--code-font-family);
  color: var(--vp-c-text-mute);
}

.lh .lh-title {
  margin: 0;
  padding: 0;
  font-family: var(--ds-font-display);
  font-size: clamp(2.6rem, 5.2vw, 4.2rem);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.032em;
  font-variation-settings: "opsz" 96;
  color: var(--ds-ink);
  text-wrap: balance;
}
.lh-title em {
  font-style: normal;
  color: var(--ds-blue);
  position: relative;
  white-space: nowrap;
}
/* the dashed pin line from the stage, under the header word */
.lh-title em::after {
  content: "";
  position: absolute;
  inset-inline: 0.02em;
  bottom: 0.02em;
  border-bottom: 0.055em dashed var(--ds-signal);
}

.lh .lh-lede {
  margin: 1.5rem 0 0;
  max-width: 34rem;
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--vp-c-text-mute);
}

.lh-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 2rem;
}

.lh .lh-btn {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 20px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 0.15s,
    transform 0.15s;
}
.lh .lh-btn.primary {
  background: var(--ds-ink);
  color: var(--vp-c-bg);
}
.lh .lh-btn.primary:hover {
  background: var(--ds-blue);
  color: #fff;
}

.lh-install {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 8px 0 14px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
  cursor: pointer;
  font: inherit;
}
.lh-install:hover {
  border-color: var(--vp-c-border-hard);
}
.lh-install {
  max-width: 100%;
}
.lh-install code {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font: 500 13.5px var(--code-font-family);
  background: none;
  padding: 0;
}
.lh-prompt {
  font-family: var(--code-font-family);
  color: var(--ds-signal);
}
.lh-copy-state {
  min-width: 3.6rem;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  font: 500 11px/1.4 var(--code-font-family);
  color: var(--vp-c-text-mute);
}

.lh .lh-frameworks {
  display: flex;
  gap: 18px;
  margin: 1.5rem 0 0;
  font-size: 0.9rem;
}
.lh-frameworks a {
  color: var(--vp-c-text-mute);
  text-decoration: none;
  border-bottom: 1px solid var(--vp-c-divider);
}
.lh-frameworks a:hover {
  color: var(--vp-c-accent);
  border-color: currentColor;
}

@media (max-width: 960px) {
  .lh {
    grid-template-columns: minmax(0, 1fr);
    gap: 3rem;
    padding-top: 3rem;
  }
  .lh-stage {
    max-width: 520px;
    width: 100%;
    margin-inline: auto;
  }
}
</style>
