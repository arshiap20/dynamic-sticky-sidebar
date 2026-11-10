# عیب‌یابی

::: tip
هشدارهای کنسول زیر فقط در بیلدهای توسعه نمایش داده می‌شوند. بیلدهای production و بیلد CDN برای صرفه‌جویی در حجم، آن‌ها را حذف می‌کنند.
:::

## سایدبار اصلاً نمی‌چسبد {#the-sidebar-doesn-t-stick-at-all}

- **کش آمده است.** در grid/flex، سایدبار به‌طور پیش‌فرض تا ارتفاع کامل ردیف کش می‌آید. `align-items: start` را به والد یا `align-self: start` را به سایدبار اضافه کنید. [چیدمان](./layout.md#the-sidebar-must-not-stretch) را ببینید.
- **یکی از والدها `overflow` دارد.** `overflow: hidden | auto | scroll` روی هر والدی، آن را به ظرف sticky تبدیل می‌کند. از `overflow: clip` استفاده کنید، یا اگر آن المنت واقعاً ظرف اسکرول است، آن را به‌عنوان `scroller` پاس بدهید.
- **`media` match نمی‌شود.** تا وقتی media query برقرار نباشد، نمونه غیرفعال است.
- **در ابتدا پنهان است.** اگر سایدبار در شروع ارتفاع نداشته باشد (`display: none`، داخل یک تب بسته)، نمونه منتظر می‌ماند. وقتی نمایان شود، `ResizeObserver` آن را تشخیص می‌دهد؛ یا `update()` را صدا بزنید.

## خطای "element not found" {#element-not-found-error}

اگر selector هیچ المنتی را match نکند، `stickySidebar('#sidebar')` خطا می‌دهد. نمونه را بعد از اینکه المنت در DOM قرار گرفت بسازید: بعد از `DOMContentLoaded`، داخل `onMounted` / `useEffect`، یا از adapterهای فریم‌ورک استفاده کنید که این کار را خودشان انجام می‌دهند.

## selector هدر چیزی را match نکرد {#header-selector-matched-nothing}

```
[dynamic-sticky-sidebar] header selector ".site-header" matched no elements
```

selector `header` هنگام شروع نمونه چیزی پیدا نکرد، پس سایدبار به بالای viewport می‌چسبد و ممکن است زیر هدر برود. selector را بررسی کنید، یا وقتی هدر رندر شد `refresh()` را صدا بزنید.

## اسکرولر پیدا نشد {#scroller-not-found}

```
[dynamic-sticky-sidebar] scroller "#app" not found, using the window
```

آپشن `scroller` به هیچ المنتی resolve نشد. selector را بررسی کنید، یا خود المنت را پاس بدهید.

## هشدار کنسول درباره‌ی grid / row-flex {#console-warning-about-grid-row-flex}

```
[dynamic-sticky-sidebar] parent is not grid / row-flex, so scrolling up uses a JS fallback …
```

**والد مستقیم** سایدبار یک block است. همه‌چیز کار می‌کند، اما اسکرول به بالا ممکن است یک فریم عقب بماند. به والد `display: grid; align-items: start` بدهید. [چیدمان block](./layout.md#block-layout-fallback) را ببینید.

## سایدبار زیر هدر می‌رود یا با آن فاصله دارد {#the-sidebar-overlaps-or-leaves-a-gap-under-the-header}

- مطمئن شوید **همه‌ی** ردیف‌های هدر در `header` پاس داده شده‌اند. با selector، همه‌ی المنت‌های match‌شده استفاده می‌شوند.
- اگر هدر به‌خاطر کلاسی روی یکی از والدها جابه‌جا می‌شود، کتابخانه آن را نمی‌بیند. `update()` را صدا بزنید یا از [`subscribe`](./headers.md#use-subscribe) استفاده کنید.
- هدرهایی که بعد از شروع در DOM جایگزین می‌شوند، به [`refresh()`](../api/README.md#refresh) نیاز دارند.
- فاصله‌ی بیشتری می‌خواهید؟ `gap` (پیش‌فرض `16`) را زیاد کنید یا `offsetTop` اضافه کنید.

## ارتفاع محتوای سایدبار تغییر می‌کند {#the-sidebar-content-changes-height}

کاری لازم نیست. یک `ResizeObserver` سایدبار و والدش را زیر نظر دارد. اگر ارتفاع سایدبار در حالت آزاد تغییر کند، در همان موقعیت فعلی‌اش روی صفحه دوباره لنگر می‌شود و موقعیت‌های چسبیده دوباره محاسبه می‌شوند.

## رندر سمت سرور {#server-side-rendering}

هسته فقط وقتی `stickySidebar()` صدا زده شود به `document` و `window` دست می‌زند. هوک React داخل یک ref callback اجرا می‌شود و نقطه‌ی ورود React با `"use client"` علامت‌گذاری شده است. composable و دایرکتیو Vue بعد از mount اجرا می‌شوند. import کردن همه‌ی آن‌ها در اپ‌های SSR (Next.js، Nuxt، VuePress و …) امن است.
