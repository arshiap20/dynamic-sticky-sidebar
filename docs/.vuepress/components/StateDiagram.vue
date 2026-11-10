<script setup lang="ts">
import { useStrings } from "../i18n/useStrings";

const { t } = useStrings();
const H = 130;
const PANELS = [
  {
    key: "TOP",
    y: 40,
    pin: 40,
    rule: "top: max",
  },
  {
    key: "DOWN",
    y: 14,
    pin: null,
    rule: "top: auto + margin-top",
  },
  {
    key: "BOTTOM",
    y: 134 - H,
    pin: 134,
    rule: "top: min",
  },
  {
    key: "UP",
    y: 24,
    pin: null,
    rule: "bottom + margin-bottom",
  },
] as const;
</script>

<template>
  <figure class="sd">
    <ol class="sd-row">
      <li v-for="(p, i) in PANELS" :key="p.key" class="sd-panel">
        <svg
          viewBox="0 -12 120 200"
          role="img"
          :aria-label="`${p.key}: ${t.diagram.notes[i]}`"
        >
          <defs>
            <clipPath :id="`sd-clip-${i}`">
              <rect x="10" y="34" width="100" height="106" />
            </clipPath>
          </defs>
          <rect x="10" y="20" width="100" height="120" rx="6" class="frame" />
          <!-- full sidebar, ghosted where it is off-screen -->
          <rect x="20" :y="p.y" width="36" :height="H" rx="4" class="ghost" />
          <g :clip-path="`url(#sd-clip-${i})`">
            <rect x="20" :y="p.y" width="36" :height="H" rx="4" class="side" />
            <rect
              v-for="n in 5"
              :key="n"
              x="64"
              :y="p.y - 30 + n * 30"
              width="38"
              height="22"
              rx="3"
              class="card"
            />
          </g>
          <rect x="10" y="20" width="100" height="14" rx="1" class="head" />
          <line
            v-if="p.pin !== null"
            x1="4"
            :y1="p.pin"
            x2="116"
            :y2="p.pin"
            class="pin"
          />
          <path
            v-if="p.key === 'DOWN'"
            d="M38 150 v12 m-4 -4 l4 4 l4 -4"
            class="arrow"
          />
          <path
            v-if="p.key === 'UP'"
            d="M38 162 v-12 m-4 4 l4 -4 l4 4"
            class="arrow"
          />
        </svg>
        <div class="sd-caption">
          <b>{{ p.key }}</b>
          <span>{{ t.diagram.notes[i] }}</span>
          <code>{{ p.rule }}</code>
        </div>
      </li>
    </ol>
  </figure>
</template>

<style scoped>
.sd {
  margin: 1.5rem 0;
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}
.sd-row {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}
.sd-panel {
  margin: 0;
  position: relative;
}
.sd-panel + .sd-panel::before {
  content: "→";
  position: absolute;
  top: 38%;
  inset-inline-start: -0.85rem;
  transform: translateX(-50%);
  font-family: var(--code-font-family);
  color: var(--vp-c-text-subtle);
}
svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
.frame {
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-border);
  stroke-width: 1.2;
}
.head {
  fill: var(--ds-blue);
}
.ghost {
  fill: none;
  stroke: var(--ds-signal);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0.55;
}
.side {
  fill: var(--ds-signal-soft);
  stroke: var(--ds-signal);
  stroke-width: 1.4;
}
.card {
  fill: var(--ds-skeleton);
}
.pin {
  stroke: var(--ds-signal);
  stroke-width: 1.4;
  stroke-dasharray: 4 3;
}
.arrow {
  fill: none;
  stroke: var(--vp-c-text-mute);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.sd-caption {
  display: grid;
  gap: 2px;
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.82rem;
  line-height: 1.35;
  color: var(--vp-c-text-mute);
}
.sd-caption b {
  font: 700 0.78rem var(--code-font-family);
  letter-spacing: 0.06em;
  color: var(--ds-signal);
}
.sd-caption code {
  justify-self: center;
  margin-top: 4px;
  font-size: 0.72rem !important;
}
@media (max-width: 640px) {
  .sd-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 1.5rem;
  }
  .sd-panel:nth-child(3)::before {
    display: none;
  }
}
</style>
