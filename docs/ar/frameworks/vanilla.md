# JavaScript الخالصة

```js
import { stickySidebar } from 'dynamic-sticky-sidebar';
```

## الاستخدام الأساسي {#basic-usage}

```js
const sidebar = stickySidebar('#sidebar', {
    header: '.site-header',
    gap: 16,
    media: '(min-width: 768px)',
});
```

الوسيط الأول عنصر أو محدِّد (selector). وترمي الدالة خطأً إن لم يطابق شيئًا، لذا أنشئ النسخة بعد أن يصبح العنصر موجودًا.

تُعيد `stickySidebar()` [نسخة](../api/README.md#instance):

```js
sidebar.update();          // recalculate now
sidebar.refresh();         // re-query header selectors / scroller and restart
sidebar.setOptions({ … }); // replace options
sidebar.destroy();         // remove listeners and restore inline styles
```

## من دون أداة تجميع {#without-a-bundler}

تأتي الحزمة ببناء IIFE يعرّف متغيرًا عامًا باسم `StickySidebar`:

```html
<script src="https://unpkg.com/dynamic-sticky-sidebar"></script>
<script>
    StickySidebar.stickySidebar('#sidebar', { header: '.site-header' });
</script>
```

يعمل `https://cdn.jsdelivr.net/npm/dynamic-sticky-sidebar` أيضًا. ثبّت رقم الإصدار في بيئة الإنتاج، مثل `dynamic-sticky-sidebar@0.1.0`.

ملف CDN بناء إنتاجي مصغَّر (نحو 2 kB بعد ضغط gzip)، لذا لا يطبع تحذيرات التطوير الموضحة في [استكشاف الأخطاء وإصلاحها](../guide/troubleshooting.md). إن كنت تريدها، فاستخدم حزمة npm مع أداة تجميع أثناء التطوير.

## CommonJS {#commonjs}

```js
const { stickySidebar } = require('dynamic-sticky-sidebar');
```

## تحديث الخيارات {#updating-options}

تقوم `setOptions` **باستبدال** الخيارات ولا تدمجها، لذا مرّر المجموعة كاملة:

```js
const base = { header: '.site-header', media: '(min-width: 768px)' };
const sidebar = stickySidebar('#sidebar', { ...base, gap: 16 });

sidebar.setOptions({ ...base, gap: 24 });
```

تغيير `gap` أو `offsetTop` أو `offsetBottom` يكتفي بإعادة الحساب. أما تغيير `header` أو `media` أو `scroller` أو `subscribe` فيعيد تشغيل النسخة.

## داخل لوحة قابلة للتمرير {#inside-a-scrollable-panel}

حين لا تُمرَّر الصفحة نفسها بل حاوية بداخلها (هياكل التطبيقات، ولوحات التحكم)، مرّر الحاوية في `scroller`. وتُقاس المواضع حينها بالنسبة إلى تلك الحاوية:

```js
stickySidebar('#filters', {
    scroller: '#panel',
    header: '#panel-toolbar',
});
```

## التطبيقات أحادية الصفحة {#single-page-apps}

استدعِ `destroy()` حين يُزال العرض (unmount). فهي تزيل كل مستمع ومراقب وتعيد الأنماط المضمّنة الأصلية للشريط الجانبي. إن كنت تستخدم React أو Vue، فإن [المحوّلات](./react.md) تفعل ذلك عنك.
