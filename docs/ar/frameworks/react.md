# React

```tsx
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

يتطلب React 16.8 أو أحدث. المدخل معلَّم بـ `"use client"`، لذا يعمل مع App Router في Next.js كما هو.

## المكوّن `<StickySidebar>` {#stickysidebar-component}

يعرض عنصر `<aside>` (غيّره عبر `as`) ويربط به سلوك الشريط الجانبي:

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

- يقبل كل [خيار](../api/README.md#options) بوصفه خاصية (prop).
- تحدد `as` العنصر المعروض، وقيمتها الافتراضية `'aside'`.
- كل خاصية أخرى (`className` و`id` و`aria-*` ومعالجات الأحداث…) تُمرَّر إلى العنصر.
- يُمرَّر `ref` إلى عنصر DOM.

## الخطاف `useStickySidebar` {#usestickysidebar-hook}

يُعيد **callback ref** تضعه على عنصرك الخاص:

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

تُنشأ النسخة حين يُركَّب العنصر (mount) وتُدمَّر حين يُزال (unmount).

### المراجع (refs) بوصفها خيارات {#refs-as-options}

يقبل `header` و`scroller` كائن `RefObject` إضافةً إلى قيم العنصر أو المحدِّد المعتادة. ويُقرأ المرجع حين تُطبَّق الخيارات.

### الخيارات التفاعلية {#reactive-options}

تُطبَّق التغييرات على `header` و`scroller` و`media` و`gap` وعلى `offsetTop` / `offsetBottom` **الرقمية** عند إعادة العرض (re-render). يُفضَّل استخدام أرقام عادية للإزاحات المستمدة من الحالة:

```tsx
const [bannerOpen, setBannerOpen] = useState(true);

<StickySidebar header=".site-header" offsetTop={bannerOpen ? 48 : 0}>
```

الخيارات التي هي دوال (`offsetTop` و`offsetBottom` و`subscribe`) **تُقرأ دائمًا من أحدث عرض**، لذا لا تعيد الدوال السهمية المضمّنة تشغيل النسخة أبدًا. وتُقرأ دالة الجلب عند كل إعادة حساب (تمرير، تغيّر حجم، تغيّر الترويسة). تغيير الحالة التي تعتمد عليها لا يطلق إعادة حساب بحد ذاته، لذا استخدم رقمًا أو `subscribe` حين يهمك ذلك.

### ترويسات تتحكم فيها الحالة {#state-driven-headers}

إذا كانت إزاحة الترويسة موجودة في مخزن حالة (store)، فاربطه عبر `subscribe`:

```tsx
<StickySidebar
    header=".site-header"
    subscribe={(update) => useHeaderStore.subscribe(update)}
>
```

تتلقى `subscribe` دالة التحديث ويجب أن تُعيد دالة لإلغاء الاشتراك. وهي تُقرأ دائمًا من أحدث عرض، لذا لا تعيد الدالة المضمّنة تشغيل النسخة عند كل عرض.

## الأنواع {#types}

```ts
import type {
    StickySidebarProps,
    UseStickySidebarOptions,
    StickySidebarOptions,
    HeaderInput,
    Px,
} from 'dynamic-sticky-sidebar/react';
```
