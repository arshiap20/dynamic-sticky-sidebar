# مرجع API

## `stickySidebar(target, options?)` {#stickysidebar-target-options}

```ts
function stickySidebar(target: HTMLElement | string, options?: StickySidebarOptions): StickySidebar;
```

| پارامتر | تایپ | توضیح |
| --- | --- | --- |
| `target` | `HTMLElement \| string` | المنت سایدبار، یا یک selector برای آن. اگر چیزی match نشود، خطای `[dynamic-sticky-sidebar] sidebar element not found` پرتاب می‌شود. |
| `options` | `StickySidebarOptions` | [آپشن‌ها](#options) را ببینید. همه اختیاری هستند. |

## آپشن‌ها {#options}

```ts
type Px = number | (() => number);
type HeaderInput = string | Element | ArrayLike<Element> | null | undefined;

interface StickySidebarOptions {
    header?: HeaderInput;
    offsetTop?: Px;
    offsetBottom?: Px;
    gap?: number;
    media?: string;
    scroller?: Element | string | null;
    subscribe?: (update: () => void) => void | (() => void);
}
```

### `header` {#header}

- **تایپ:** `string | Element | ArrayLike<Element> | null`
- **پیش‌فرض:** ندارد

المنت (یا المنت‌های) هدر sticky یا fixed. اگر selector بدهید، **همه‌ی** المنت‌های match‌شده استفاده می‌شوند. سایدبار زیر پایین‌ترین لبه‌ی قابل‌مشاهده در میان آن‌ها می‌چسبد و وقتی کنار می‌روند، جمع می‌شوند یا تغییر اندازه می‌دهند، به‌صورت زنده دنبالشان می‌کند. [هدرهای پویا](../guide/headers.md) را ببینید.

### `offsetTop` {#offsettop}

- **تایپ:** `number | () => number`
- **پیش‌فرض:** `0`

فاصله‌ی اضافه بین هدر (یا بالای viewport، اگر هدری نباشد) و سایدبار. اگر تابع باشد، در هر محاسبه‌ی دوباره صدا زده می‌شود.

### `offsetBottom` {#offsetbottom}

- **تایپ:** `number | () => number`
- **پیش‌فرض:** `0`

فاصله‌ی اضافه بین سایدبار و پایین viewport، وقتی سایدبار به پایین چسبیده است.

### `gap` {#gap}

- **تایپ:** `number`
- **پیش‌فرض:** `16`

فاصله بر حسب px که روی **هر دو** لبه، علاوه بر `offsetTop` / `offsetBottom`، اعمال می‌شود.

### `media` {#media}

- **تایپ:** `string`
- **پیش‌فرض:** همیشه فعال

یک media query. نمونه فقط تا وقتی query برقرار است اجرا می‌شود، مثلاً `'(min-width: 768px)'`. وقتی دیگر برقرار نباشد، listenerها حذف و استایل‌های inline برگردانده می‌شوند.

### `scroller` {#scroller}

- **تایپ:** `Element | string | null`
- **پیش‌فرض:** window

المنت اسکرول‌شونده، وقتی سایدبار به‌جای خود صفحه داخل یک container اسکرول‌شونده قرار دارد. همه‌ی موقعیت‌ها نسبت به بخش قابل‌مشاهده‌ی اسکرولر اندازه‌گیری می‌شوند.

### `subscribe` {#subscribe}

- **تایپ:** `(update: () => void) => void | (() => void)`
- **پیش‌فرض:** ندارد

یک منبع خارجی را که هدر را جابه‌جا می‌کند (یک store، یک event bus و…) وصل می‌کند. هر بار که منبع تغییر کرد `update` را صدا بزنید و یک تابع unsubscribe برگردانید. این تابع هنگام شروع نمونه صدا زده می‌شود و هنگام توقف آن unsubscribe می‌شود.

```js
subscribe: (update) => store.subscribe(update)
```

## نمونه (Instance) {#instance}

```ts
interface StickySidebar {
    readonly element: HTMLElement;
    update(): void;
    refresh(): void;
    setOptions(options: StickySidebarOptions): void;
    destroy(): void;
}
```

### `element` {#element}

المنت سایدبار، بعد از resolve شدن.

### `update()` {#update}

به‌صورت همگام دوباره محاسبه می‌کند و بعد برای چند فریم به دنبال کردن ادامه می‌دهد، در صورتی که چیزی هنوز در حال حرکت باشد. آن را بعد از تغییراتی صدا بزنید که کتابخانه نمی‌تواند ببیند. [وقتی باید کمک کنید](../guide/headers.md#when-you-need-to-help) را ببینید.

### `refresh()` {#refresh}

نمونه را کامل از نو راه‌اندازی می‌کند: selectorهای `header` و `scroller` را دوباره query می‌کند، `media` را دوباره ارزیابی می‌کند و حالت چیدمان را دوباره تشخیص می‌دهد. بعد از جایگزین شدن المنت‌های هدر در DOM از آن استفاده کنید.

### `setOptions(options)` {#setoptions-options}

همه‌ی آپشن‌ها را **جایگزین** می‌کند و merge نمی‌کند.

- تغییر `header`، `media`، `scroller` یا `subscribe` (مقایسه بر اساس identity) نمونه را از نو راه‌اندازی می‌کند.
- بقیه‌ی تغییرات (`gap`، `offsetTop`، `offsetBottom`) فقط باعث محاسبه‌ی دوباره می‌شوند.

### `destroy()` {#destroy}

همه‌ی listenerها و observerها را حذف می‌کند، فریم‌های در انتظار را لغو می‌کند، تابع پاک‌سازی `subscribe` را صدا می‌زند و استایل‌های inline اصلی سایدبار را برمی‌گرداند.

## React {#react}

```ts
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

| Export | امضا |
| --- | --- |
| `useStickySidebar` | `<T extends HTMLElement>(options?: UseStickySidebarOptions) => (node: T \| null) => void` |
| `StickySidebar` | `ForwardRefExoticComponent<StickySidebarProps>` |

```ts
interface UseStickySidebarOptions extends Omit<StickySidebarOptions, 'header' | 'scroller'> {
    header?: HeaderInput | RefObject<Element | null>;
    scroller?: Element | string | null | RefObject<Element | null>;
}

interface StickySidebarProps extends UseStickySidebarOptions, HTMLAttributes<HTMLElement> {
    as?: ElementType; // default 'aside'
    children?: ReactNode;
}
```

[React](../frameworks/react.md) را ببینید.

## Vue {#vue}

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

| Export | امضا |
| --- | --- |
| `useStickySidebar` | `(target: MaybeRefOrGetter<HTMLElement \| ComponentPublicInstance \| null>, options?: MaybeRefOrGetter<VueStickySidebarOptions>) => { update(): void; refresh(): void }` |
| `vStickySidebar` | `Directive<HTMLElement, VueStickySidebarOptions \| undefined>` |
| `StickySidebarPlugin` | `Plugin` که `v-sticky-sidebar` را ثبت می‌کند |

```ts
interface VueStickySidebarOptions extends Omit<StickySidebarOptions, 'header' | 'scroller'> {
    header?: MaybeRefOrGetter<HeaderInput | ComponentPublicInstance>;
    scroller?: MaybeRefOrGetter<Element | string | null | undefined | ComponentPublicInstance>;
}
```

[Vue](../frameworks/vue.md) را ببینید.
