# React

```tsx
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

به React نسخه‌ی 16.8 یا جدیدتر نیاز دارد. نقطه‌ی ورود با `"use client"` علامت‌گذاری شده، پس بدون هیچ تغییری در App Router نسخه‌ی Next.js کار می‌کند.

## کامپوننت `<StickySidebar>` {#stickysidebar-component}

یک `<aside>` رندر می‌کند (با `as` قابل تغییر است) و رفتار سایدبار را به آن متصل می‌کند:

```tsx
import { StickySidebar } from 'dynamic-sticky-sidebar/react';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="layout">
            <StickySidebar header=".site-header" gap={16} media="(min-width: 768px)" className="sidebar">
                <Filters />
            </StickySidebar>
            <main>{children}</main>
        </div>
    );
}
```

- همه‌ی [آپشن‌ها](../api/README.md#options) را به‌صورت prop می‌پذیرد.
- `as` المنت رندرشده را تعیین می‌کند و پیش‌فرض آن `'aside'` است.
- بقیه‌ی propها (`className`، `id`، `aria-*`، event handlerها و…) به المنت پاس داده می‌شوند.
- `ref` به المنت DOM فوروارد می‌شود.

## هوک `useStickySidebar` {#usestickysidebar-hook}

یک **callback ref** برمی‌گرداند که روی المنت خودتان می‌گذارید:

```tsx
import { useRef } from 'react';
import { useStickySidebar } from 'dynamic-sticky-sidebar/react';

export function Page() {
    const headerRef = useRef<HTMLElement>(null);
    const sidebarRef = useStickySidebar({
        header: headerRef,
        gap: 16,
        media: '(min-width: 768px)',
    });

    return (
        <>
            <header ref={headerRef} className="site-header">…</header>
            <div className="layout">
                <nav ref={sidebarRef}>…</nav>
                <main>…</main>
            </div>
        </>
    );
}
```

نمونه هنگام mount شدن المنت ساخته و هنگام unmount شدن آن destroy می‌شود.

### ref به‌عنوان آپشن {#refs-as-options}

`header` و `scroller` علاوه بر مقادیر معمول (المنت / selector)، یک `RefObject` هم می‌پذیرند. ref در لحظه‌ی اعمال آپشن‌ها خوانده می‌شود.

### آپشن‌های reactive {#reactive-options}

تغییرات `header`، `scroller`، `media`، `gap` و مقادیر **عددی** `offsetTop` / `offsetBottom` در re-render اعمال می‌شوند. برای offsetهای وابسته به state، عدد ساده را ترجیح بدهید:

```tsx
const [bannerOpen, setBannerOpen] = useState(true);

<StickySidebar header=".site-header" offsetTop={bannerOpen ? 48 : 0}>
```

آپشن‌های تابعی (`offsetTop`، `offsetBottom`، `subscribe`) **همیشه از آخرین render خوانده می‌شوند**، پس arrow functionهای inline هیچ‌وقت نمونه را از نو راه‌اندازی نمی‌کنند. getter در هر محاسبه‌ی دوباره (اسکرول، resize، تغییر هدر) خوانده می‌شود. تغییر stateی که پشت آن است به‌تنهایی محاسبه‌ی دوباره را فعال نمی‌کند، پس هر جا این موضوع مهم است از عدد یا `subscribe` استفاده کنید.

### هدرهای وابسته به state {#state-driven-headers}

اگر offset هدر در یک store نگه‌داری می‌شود، آن را با `subscribe` وصل کنید:

```tsx
<StickySidebar
    header=".site-header"
    subscribe={(update) => useHeaderStore.subscribe(update)}
>
```

`subscribe` تابع update را دریافت می‌کند و باید یک تابع unsubscribe برگرداند. این آپشن همیشه از آخرین render خوانده می‌شود، پس تابع inline در هر render نمونه را از نو راه‌اندازی نمی‌کند.

## تایپ‌ها {#types}

```ts
import type {
    StickySidebarProps,
    UseStickySidebarOptions,
    StickySidebarOptions,
    HeaderInput,
    Px,
} from 'dynamic-sticky-sidebar/react';
```
