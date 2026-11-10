<script setup lang="ts">
import { computed } from "vue";
import { useStrings } from "../i18n/useStrings";

const { t } = useStrings();
const IDS = ["tall", "hide", "grow"] as const;
const ITEMS = computed(() =>
  t.value.problems.items.map((item, i) => ({ ...item, id: IDS[i] })),
);
</script>

<template>
  <section class="lp landing-section">
    <p class="landing-eyebrow">{{ t.problems.eyebrow }}</p>
    <h2 class="landing-section-title">{{ t.problems.title }}</h2>

    <div class="lp-grid">
      <article v-for="item in ITEMS" :key="item.id" class="lp-item">
        <svg
          class="lp-fig"
          viewBox="0 0 220 150"
          role="img"
          :aria-label="item.title"
        >
          <defs>
            <pattern
              :id="`hatch-${item.id}`"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                class="hatch"
                stroke-width="2.5"
              />
            </pattern>
          </defs>

          <!-- viewport frame -->
          <rect x="30" y="14" width="160" height="112" rx="8" class="frame" />

          <template v-if="item.id === 'tall'">
            <rect x="31" y="15" width="158" height="16" rx="1" class="head" />
            <rect x="42" y="40" width="44" height="86" class="side" />
            <rect
              x="42"
              y="126"
              width="44"
              height="22"
              :fill="`url(#hatch-${item.id})`"
              class="side-ghost"
            />
            <rect
              v-for="n in 4"
              :key="n"
              x="96"
              :y="18 + n * 22"
              width="82"
              height="16"
              rx="3"
              class="card"
            />
            <text x="94" y="141" class="label">{{ item.label }}</text>
          </template>

          <template v-else-if="item.id === 'hide'">
            <rect
              x="31"
              y="-2"
              width="158"
              height="16"
              rx="1"
              class="head-ghost"
            />
            <rect x="42" y="40" width="44" height="78" class="side" />
            <rect
              x="42"
              y="15"
              width="44"
              height="25"
              :fill="`url(#hatch-${item.id})`"
            />
            <path d="M95 16 v23 M91 16 h8 M91 39 h8" class="measure" />
            <text x="104" y="31" class="label">{{ item.label }}</text>
            <rect
              v-for="n in 3"
              :key="n"
              x="128"
              :y="22 + n * 24"
              width="50"
              height="16"
              rx="3"
              class="card"
            />
          </template>

          <template v-else>
            <rect x="31" y="15" width="158" height="16" rx="1" class="head" />
            <rect x="31" y="31" width="158" height="18" class="head-grow" />
            <rect x="42" y="40" width="44" height="78" class="side" />
            <rect
              x="42"
              y="40"
              width="44"
              height="9"
              :fill="`url(#hatch-${item.id})`"
            />
            <text x="96" y="64" class="label">{{ item.label }}</text>
            <rect
              v-for="n in 2"
              :key="n"
              x="96"
              :y="46 + n * 26"
              width="82"
              height="18"
              rx="3"
              class="card"
            />
          </template>
        </svg>

        <h3>{{ item.title }}</h3>
        <p>{{ item.body }}</p>
        <p class="lp-fix"><span aria-hidden="true">→</span> {{ item.fix }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.lp-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  margin-top: 2rem;
}

.lp-item {
  padding: 1.25rem 1.25rem 1.4rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.lp-fig {
  direction: ltr;
  display: block;
  width: 100%;
  height: auto;
  margin-bottom: 1rem;
  border-radius: 10px;
  background: var(--vp-c-bg-alt);
  overflow: visible;
}
.frame {
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-border);
  stroke-width: 1.5;
}
.head {
  fill: var(--ds-blue);
}
.head-grow {
  fill: var(--ds-blue);
  opacity: 0.55;
}
.head-ghost {
  fill: none;
  stroke: var(--ds-blue);
  stroke-dasharray: 4 3;
  opacity: 0.6;
}
.side {
  fill: var(--ds-signal-soft);
  stroke: var(--ds-signal);
  stroke-width: 1.5;
}
.side-ghost {
  stroke: var(--ds-signal);
  stroke-dasharray: 4 3;
  stroke-width: 1.5;
}
.hatch {
  stroke: var(--ds-signal);
  opacity: 0.45;
}
.card {
  fill: var(--ds-skeleton);
}
.measure {
  fill: none;
  stroke: var(--ds-signal);
  stroke-width: 1.5;
}
.label {
  font: 600 10px var(--code-font-family);
  fill: var(--ds-signal);
  letter-spacing: 0.03em;
}

.lp-item h3 {
  margin: 0 0 0.4rem;
  padding: 0;
  font-family: var(--ds-font-display);
  font-size: 1.2rem;
  font-weight: 650;
  letter-spacing: -0.015em;
}
.lp-item p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--vp-c-text-mute);
}
.lp-item .lp-fix {
  margin-top: 0.9rem;
  padding-top: 0.9rem;
  border-top: 1px dashed var(--vp-c-divider);
  color: var(--vp-c-text);
  font-weight: 500;
}
.lp-fix span {
  color: var(--ds-signal);
  font-family: var(--code-font-family);
}

@media (max-width: 860px) {
  .lp-grid {
    grid-template-columns: minmax(0, 1fr);
    max-width: 520px;
  }
}
</style>
