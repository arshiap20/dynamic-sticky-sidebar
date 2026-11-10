# استكشاف الأخطاء وإصلاحها

::: tip
لا تظهر تحذيرات وحدة التحكم أدناه إلا في بناءات التطوير. أما بناءات الإنتاج وبناء CDN فتحذفها توفيرًا للحجم.
:::

## الشريط الجانبي لا يلتصق إطلاقًا {#the-sidebar-doesn-t-stick-at-all}

- **إنه متمدد.** في grid/flex يأخذ الشريط الجانبي افتراضيًا ارتفاع الصف كاملًا. أضف `align-items: start` إلى العنصر الأب أو `align-self: start` إلى الشريط الجانبي. راجع [التخطيط](./layout.md#the-sidebar-must-not-stretch).
- **أحد الأسلاف مضبوط عليه `overflow`.** وجود `overflow: hidden | auto | scroll` على أي عنصر سلف يجعله حاوية التثبيت. استخدم `overflow: clip`، أو مرّر ذلك العنصر في `scroller` إن كان هو حاوية التمرير الفعلية.
- **`media` لا يطابق.** تبقى النسخة غير نشطة ما دام استعلام الوسائط غير متحقق.
- **يبدأ مخفيًا.** إذا لم يكن للشريط الجانبي ارتفاع عند البدء (`display: none`، أو داخل تبويب مغلق)، فإن النسخة تنتظر. يلتقطه `ResizeObserver` حين يصبح ظاهرًا، أو استدعِ `update()`.

## خطأ "element not found" {#element-not-found-error}

ترمي `stickySidebar('#sidebar')` خطأً حين لا يطابق المحدِّد أي عنصر. أنشئ النسخة بعد أن يصبح العنصر في DOM: بعد `DOMContentLoaded`، أو داخل `onMounted` / `useEffect`، أو استخدم محوّلات أطر العمل التي تتولى ذلك عنك.

## محدِّد الترويسة لم يطابق شيئًا {#header-selector-matched-nothing}

```
[dynamic-sticky-sidebar] header selector ".site-header" matched no elements
```

لم يعثر محدِّد `header` على شيء حين بدأت النسخة، لذا يُثبَّت الشريط الجانبي بأعلى منفذ العرض وقد ينزلق تحت الترويسة. تحقق من المحدِّد، أو استدعِ `refresh()` بعد أن تُعرض الترويسة.

## لم يُعثر على حاوية التمرير {#scroller-not-found}

```
[dynamic-sticky-sidebar] scroller "#app" not found, using the window
```

لم يُحَل الخيار `scroller` إلى عنصر. تحقق من المحدِّد، أو مرّر العنصر نفسه.

## تحذير في وحدة التحكم بشأن grid / row-flex {#console-warning-about-grid-row-flex}

```
[dynamic-sticky-sidebar] parent is not grid / row-flex, so scrolling up uses a JS fallback …
```

**الأب المباشر** للشريط الجانبي عنصر كتلي. الأمور تعمل مع ذلك، لكن التمرير لأعلى قد يتأخر إطارًا. أعطِ العنصر الأب `display: grid; align-items: start`. راجع [التخطيط الكتلي](./layout.md#block-layout-fallback).

## الشريط الجانبي يتداخل مع الترويسة أو يترك فراغًا تحتها {#the-sidebar-overlaps-or-leaves-a-gap-under-the-header}

- تأكد من تمرير **كل** صفوف الترويسة في `header`. عند استخدام محدِّد، تُستخدم كل العناصر المطابقة.
- إذا كانت الترويسة تتحرك بسبب صنف (class) على عنصر سلف، فلا تستطيع المكتبة رؤية ذلك. استدعِ `update()`، أو استخدم [`subscribe`](./headers.md#use-subscribe).
- الترويسات المستبدَلة في DOM بعد البدء تحتاج إلى [`refresh()`](../api/README.md#refresh).
- تريد مساحة أكبر؟ زِد `gap` (القيمة الافتراضية `16`) أو أضف `offsetTop`.

## محتوى الشريط الجانبي يتغير ارتفاعه {#the-sidebar-content-changes-height}

لا حاجة إلى أي إجراء. يراقب `ResizeObserver` الشريط الجانبي وأباه. حين يتغير ارتفاع الشريط الجانبي وهو محرَّر، يُعاد ارتكازه عند موضعه الحالي على الشاشة، ويُعاد حساب مواضع التثبيت.

## العرض من جهة الخادم {#server-side-rendering}

لا تمسّ النواة `document` و`window` إلا عند استدعاء `stickySidebar()`. يعمل خطاف React داخل دالة ref، ومدخل React معلَّم بـ `"use client"`. وتعمل دالة composable والموجّه في Vue بعد التركيب (mount). وكلها آمنة للاستيراد في تطبيقات SSR (Next.js وNuxt وVuePress، …).
