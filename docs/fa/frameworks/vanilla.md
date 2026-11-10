# Vanilla JS

```js
import { stickySidebar } from 'dynamic-sticky-sidebar';
```

## استفاده‌ی پایه {#basic-usage}

```js
const sidebar = stickySidebar('#sidebar', {
    header: '.site-header',
    gap: 16,
    media: '(min-width: 768px)',
});
```

آرگومان اول یک المنت یا یک selector است. اگر چیزی match نشود خطا می‌دهد، پس نمونه را وقتی بسازید که المنت وجود دارد.

`stickySidebar()` یک [نمونه](../api/README.md#instance) برمی‌گرداند:

```js
sidebar.update();          // recalculate now
sidebar.refresh();         // re-query header selectors / scroller and restart
sidebar.setOptions({ … }); // replace options
sidebar.destroy();         // remove listeners and restore inline styles
```

## بدون باندلر {#without-a-bundler}

پکیج یک بیلد IIFE دارد که یک global به نام `StickySidebar` تعریف می‌کند:

```html
<script src="https://unpkg.com/dynamic-sticky-sidebar"></script>
<script>
    StickySidebar.stickySidebar('#sidebar', { header: '.site-header' });
</script>
```

`https://cdn.jsdelivr.net/npm/dynamic-sticky-sidebar` هم کار می‌کند. در production نسخه را ثابت کنید، مثلاً `dynamic-sticky-sidebar@0.1.0`.

فایل CDN یک بیلد production مینیفای‌شده است (حدود 2 kB بعد از gzip)، پس هشدارهای حالت توسعه که در [عیب‌یابی](../guide/troubleshooting.md) توضیح داده شده‌اند را چاپ نمی‌کند. اگر این هشدارها را در زمان توسعه می‌خواهید، از پکیج npm همراه با یک باندلر استفاده کنید.

## CommonJS {#commonjs}

```js
const { stickySidebar } = require('dynamic-sticky-sidebar');
```

## به‌روزرسانی آپشن‌ها {#updating-options}

`setOptions` آپشن‌ها را **جایگزین** می‌کند و آن‌ها را merge نمی‌کند، پس مجموعه‌ی کامل را پاس بدهید:

```js
const base = { header: '.site-header', media: '(min-width: 768px)' };
const sidebar = stickySidebar('#sidebar', { ...base, gap: 16 });

sidebar.setOptions({ ...base, gap: 24 });
```

تغییر `gap`، `offsetTop` یا `offsetBottom` فقط باعث محاسبه‌ی دوباره می‌شود. تغییر `header`، `media`، `scroller` یا `subscribe` نمونه را از نو راه‌اندازی می‌کند.

## داخل یک پنل اسکرول‌شونده {#inside-a-scrollable-panel}

وقتی خود صفحه اسکرول نمی‌خورد ولی یک container اسکرول می‌خورد (app shellها، داشبوردها)، آن container را به‌عنوان `scroller` پاس بدهید. در این حالت موقعیت‌ها نسبت به همان container اندازه‌گیری می‌شوند:

```js
stickySidebar('#filters', {
    scroller: '#panel',
    header: '#panel-toolbar',
});
```

## اپلیکیشن‌های تک‌صفحه‌ای {#single-page-apps}

وقتی view از صفحه unmount می‌شود، `destroy()` را صدا بزنید. این متد همه‌ی listenerها و observerها را حذف می‌کند و استایل‌های inline اصلی سایدبار را برمی‌گرداند. اگر از React یا Vue استفاده می‌کنید، [adapterها](./react.md) این کار را برایتان انجام می‌دهند.
