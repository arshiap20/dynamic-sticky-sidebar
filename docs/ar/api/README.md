# مرجع API

## `stickySidebar(target, options?)` {#stickysidebar-target-options}

```ts
function stickySidebar(target: HTMLElement | string, options?: StickySidebarOptions): StickySidebar;
```

| المعامل | النوع | الوصف |
| --- | --- | --- |
| `target` | `HTMLElement \| string` | عنصر الشريط الجانبي، أو محدِّد له. يرمي الخطأ `[dynamic-sticky-sidebar] sidebar element not found` إن لم يطابق شيئًا. |
| `options` | `StickySidebarOptions` | راجع [الخيارات](#options). كلها اختيارية. |

## الخيارات {#options}

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

- **النوع:** `string | Element | ArrayLike<Element> | null`
- **القيمة الافتراضية:** لا شيء

عنصر الترويسة اللاصقة أو الثابتة (أو عناصرها). عند تمرير محدِّد، تُستخدم **كل** العناصر المطابقة. يُثبَّت الشريط الجانبي تحت أدنى حافة سفلية ظاهرة بينها، ويتبعها مباشرةً أثناء انزلاقها أو انطوائها أو تغيّر حجمها. راجع [الترويسات الديناميكية](../guide/headers.md).

### `offsetTop` {#offsettop}

- **النوع:** `number | () => number`
- **القيمة الافتراضية:** `0`

مسافة إضافية بين الترويسة (أو أعلى منفذ العرض عند عدم وجود ترويسة) والشريط الجانبي. إذا كانت دالة، فإنها تُستدعى عند كل إعادة حساب.

### `offsetBottom` {#offsetbottom}

- **النوع:** `number | () => number`
- **القيمة الافتراضية:** `0`

مسافة إضافية بين الشريط الجانبي وأسفل منفذ العرض حين يكون الشريط مثبّتًا من الأسفل.

### `gap` {#gap}

- **النوع:** `number`
- **القيمة الافتراضية:** `16`

تباعد بالبكسل يُطبَّق على **كلتا** الحافتين، فوق `offsetTop` / `offsetBottom`.

### `media` {#media}

- **النوع:** `string`
- **القيمة الافتراضية:** نشط دائمًا

استعلام وسائط (media query). لا تعمل النسخة إلا ما دام مطابقًا، مثل `'(min-width: 768px)'`. وحين يتوقف عن المطابقة، تُزال المستمعات وتُستعاد الأنماط المضمّنة.

### `scroller` {#scroller}

- **النوع:** `Element | string | null`
- **القيمة الافتراضية:** النافذة (window)

عنصر التمرير، حين يكون الشريط الجانبي داخل حاوية قابلة للتمرير بدلًا من الصفحة. تُقاس كل المواضع بالنسبة إلى المساحة الظاهرة من حاوية التمرير.

### `subscribe` {#subscribe}

- **النوع:** `(update: () => void) => void | (() => void)`
- **القيمة الافتراضية:** لا شيء

يربط مصدرًا خارجيًا يحرّك الترويسة (مخزن حالة، ناقل أحداث…). استدعِ `update` كلما تغيّر، وأعِد دالة لإلغاء الاشتراك. يُستدعى حين تبدأ النسخة، ويُلغى الاشتراك حين تتوقف.

```js
subscribe: (update) => store.subscribe(update)
```

## النسخة {#instance}

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

عنصر الشريط الجانبي بعد حلّه.

### `update()` {#update}

تعيد الحساب بشكل متزامن، ثم تواصل المتابعة لبضعة إطارات تحسّبًا لأن شيئًا ما لا يزال يتحرك. استدعها بعد التغييرات التي لا تستطيع المكتبة مراقبتها. راجع [متى تحتاج إلى المساعدة](../guide/headers.md#when-you-need-to-help).

### `refresh()` {#refresh}

إعادة تشغيل كاملة: تعيد الاستعلام عن محدِّدات `header` و`scroller`، وتعيد تقييم `media`، وتعيد اكتشاف وضع التخطيط. استخدمها بعد استبدال عناصر الترويسة في DOM.

### `setOptions(options)` {#setoptions-options}

**تستبدل** كل الخيارات؛ ولا تدمجها.

- تغيير `header` أو `media` أو `scroller` أو `subscribe` (بالمقارنة بالهوية) يعيد تشغيل النسخة.
- التغييرات الأخرى (`gap` و`offsetTop` و`offsetBottom`) تكتفي بإعادة الحساب.

### `destroy()` {#destroy}

تزيل كل مستمع ومراقب، وتلغي الإطارات المعلّقة، وتستدعي دالة التنظيف الخاصة بـ `subscribe`، وتعيد الأنماط المضمّنة الأصلية للشريط الجانبي.

## React {#react}

```ts
import { StickySidebar, useStickySidebar } from 'dynamic-sticky-sidebar/react';
```

| التصدير | التوقيع |
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

راجع [React](../frameworks/react.md).

## Vue {#vue}

```ts
import { useStickySidebar, vStickySidebar, StickySidebarPlugin } from 'dynamic-sticky-sidebar/vue';
```

| التصدير | التوقيع |
| --- | --- |
| `useStickySidebar` | `(target: MaybeRefOrGetter<HTMLElement \| ComponentPublicInstance \| null>, options?: MaybeRefOrGetter<VueStickySidebarOptions>) => { update(): void; refresh(): void }` |
| `vStickySidebar` | `Directive<HTMLElement, VueStickySidebarOptions \| undefined>` |
| `StickySidebarPlugin` | `Plugin`، تسجّل `v-sticky-sidebar` |

```ts
interface VueStickySidebarOptions extends Omit<StickySidebarOptions, 'header' | 'scroller'> {
    header?: MaybeRefOrGetter<HeaderInput | ComponentPublicInstance>;
    scroller?: MaybeRefOrGetter<Element | string | null | undefined | ComponentPublicInstance>;
}
```

راجع [Vue](../frameworks/vue.md).
