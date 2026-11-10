# Getting Started

## Install

::: code-tabs#pm

@tab npm

```bash
npm i dynamic-sticky-sidebar
```

@tab pnpm

```bash
pnpm add dynamic-sticky-sidebar
```

@tab yarn

```bash
yarn add dynamic-sticky-sidebar
```

@tab CDN

```html
<script src="https://unpkg.com/dynamic-sticky-sidebar"></script>
<!-- exposes window.StickySidebar.stickySidebar -->
```

:::

## 1. Lay out the page

Put the sidebar in a **grid** (or a row-direction flex) next to the content, and stop it from stretching to the full row height:

```html
<header class="site-header">…</header>

<div class="layout">
    <aside id="sidebar">…</aside>
    <main>…</main>
</div>
```

```css
.site-header {
    position: sticky;
    top: 0;
    z-index: 10;
}

.layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 32px;
    align-items: start; /* important: the sidebar keeps its own height */
}
```

::: tip Why grid?
A grid or row-flex parent lets the library use **native** sticky behaviour in both directions. Block layouts still work, but scrolling up then uses a JS fallback. See [Layout requirements](./layout.md).
:::

## 2. Attach the sidebar

::: code-tabs#fw

@tab Vanilla

```js
import { stickySidebar } from 'dynamic-sticky-sidebar';

const sidebar = stickySidebar('#sidebar', {
    header: '.site-header',
    gap: 16,
    media: '(min-width: 768px)',
});

// later, e.g. when the page unmounts
sidebar.destroy();
```

@tab React

```tsx
import { StickySidebar } from 'dynamic-sticky-sidebar/react';

export function Layout({ children }) {
    return (
        <div className="layout">
            <StickySidebar header=".site-header" gap={16} media="(min-width: 768px)">
                …
            </StickySidebar>
            <main>{children}</main>
        </div>
    );
}
```

@tab Vue

```vue
<script setup>
import { vStickySidebar } from 'dynamic-sticky-sidebar/vue';

const sticky = { header: '.site-header', gap: 16, media: '(min-width: 768px)' };
</script>

<template>
    <div class="layout">
        <aside v-sticky-sidebar="sticky">…</aside>
        <main><slot /></main>
    </div>
</template>
```

:::

That's it. Scroll down and the sidebar follows the content until its end, then sticks. Scroll up and it comes back and sticks under the header, wherever the header currently is.

## 3. Try it

Scroll inside the box below. The sub-nav slides away on scroll down and returns on scroll up, and the sidebar follows it.

<StickyDemo />

## Next steps

- [Layout requirements](./layout.md): grid vs. flex vs. block, and common pitfalls
- [Dynamic headers](./headers.md): multiple headers, JS-animated headers and state-driven offsets
- [API reference](../api/README.md): all options and instance methods
