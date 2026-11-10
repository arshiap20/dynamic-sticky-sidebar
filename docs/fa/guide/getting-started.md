# شروع به کار

## نصب {#install}

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

## 1. چیدمان صفحه {#_1-lay-out-the-page}

سایدبار را کنار محتوا داخل یک **grid** (یا flex با جهت row) بگذارید و جلوی کش آمدنش تا ارتفاع کامل ردیف را بگیرید:

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

::: tip چرا grid؟
والد grid یا row-flex به کتابخانه اجازه می‌دهد در هر دو جهت از رفتار sticky **بومی** مرورگر استفاده کند. چیدمان block هم کار می‌کند، اما اسکرول به بالا در آن از یک راه‌حل جایگزین JS استفاده می‌کند. [الزامات چیدمان](./layout.md) را ببینید.
:::

## 2. اتصال سایدبار {#_2-attach-the-sidebar}

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

همین. به پایین اسکرول کنید؛ سایدبار تا انتهای خودش همراه محتوا می‌آید و بعد می‌چسبد. به بالا اسکرول کنید؛ برمی‌گردد و زیر هدر می‌چسبد، هر جا که هدر در آن لحظه باشد.

## 3. امتحانش کنید {#_3-try-it}

داخل کادر زیر اسکرول کنید. منوی فرعی هنگام اسکرول به پایین کنار می‌رود و هنگام اسکرول به بالا برمی‌گردد، و سایدبار هم دنبالش می‌کند.

<StickyDemo />

## قدم‌های بعدی {#next-steps}

- [الزامات چیدمان](./layout.md): مقایسه‌ی grid، flex و block، و اشتباه‌های رایج
- [هدرهای پویا](./headers.md): چند هدر، هدرهایی که با JS انیمیت می‌شوند و offsetهای وابسته به state
- [مرجع API](../api/README.md): همه‌ی آپشن‌ها و متدهای نمونه
