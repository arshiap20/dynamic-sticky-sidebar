# الزامات چیدمان

این کتابخانه روی `position: sticky` ساخته شده، پس همان قوانین همیشگی sticky برقرار است، به‌علاوه‌ی یک قانون دیگر درباره‌ی والد سایدبار.

## پیشنهاد ما: grid {#recommended-grid}

```css
.layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: start;
}
```

با والد **grid** یا **row flex**، اسکرول در هر دو جهت با موقعیت‌دهی sticky بومی انجام می‌شود. JS فقط وقتی جهت عوض می‌شود قیدها را تنظیم می‌کند، پس سایدبار هیچ‌وقت از اسکرول عقب نمی‌ماند.

row flex هم به همین شکل کار می‌کند:

```css
.layout {
    display: flex;
    flex-direction: row; /* or row-reverse */
    align-items: flex-start;
}
.layout > aside {
    flex: 0 0 280px;
}
```

## سایدبار نباید کش بیاید {#the-sidebar-must-not-stretch}

آیتم‌های grid و flex به‌طور پیش‌فرض تا ارتفاع ردیف کش می‌آیند. سایدبار کش‌آمده هم‌قد ستون محتواست، پس sticky جایی برای حرکت ندارد و هیچ اتفاقی نمی‌افتد. یکی از این‌ها را استفاده کنید:

- `align-items: start` (برای grid) / `align-items: flex-start` (برای flex) روی والد، یا
- `align-self: start` روی خود سایدبار.

خود والد باید هم‌قد محتوای اسکرول‌شونده باشد. وقتی سایدبار و محتوای اصلی در یک ردیف هستند، این حالت پیش‌فرض است.

## چیدمان block (حالت جایگزین) {#block-layout-fallback}

اگر والد یک block معمولی باشد، مثلاً سایدبار داخل یک `<div>` ستونیِ کش‌آمده قرار گرفته باشد، کتابخانه باز هم کار می‌کند:

- اسکرول به **پایین** بومی است، مثل حالت grid؛
- اسکرول به **بالا** از `top` کنترل‌شده با JS استفاده می‌کند که در اسکرول سریع ممکن است یک فریم عقب بماند.

در بیلدهای توسعه، کتابخانه این پیام را یک بار در کنسول ثبت می‌کند:

```
[dynamic-sticky-sidebar] parent is not grid / row-flex, so scrolling up uses a JS fallback that can lag a frame. …
```

برای رفع آن، به **والد مستقیم** سایدبار `display: grid` بدهید (یک grid تک‌ستونه کافی است):

```css
.sidebar-column {
    display: grid;
    align-items: start;
}
```

## overflow روی والدها {#overflow-on-ancestors}

مثل هر المنت sticky دیگری، اگر یکی از والدهای بین سایدبار و اسکرولرش `overflow: hidden | auto | scroll` داشته باشد، همان والد ظرف sticky می‌شود و چسبیدن به صفحه از کار می‌افتد. مقصر رایج، wrapperهای صفحه هستند که برای پنهان کردن overflow افقی از `overflow-x: hidden` استفاده می‌کنند.

- به‌جای `hidden` از `overflow: clip` (یا `overflow-x: clip`) استفاده کنید؛ محتوا را برش می‌دهد ولی scroll container نمی‌سازد.
- اگر سایدبار واقعاً داخل یک پنل اسکرول‌شونده است، آن پنل را به‌عنوان آپشن [`scroller`](../api/README.md#scroller) پاس بدهید.

## صفحه‌های کوچک {#small-screens}

در موبایل، سایدبار معمولاً بالا یا پایین محتوا قرار می‌گیرد و نباید sticky باشد. از `media` استفاده کنید تا کتابخانه فقط وقتی چیدمان دوستونه است فعال باشد:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    media: '(min-width: 768px)',
});
```

وقتی query دیگر match نشود، کتابخانه listenerهایش را حذف می‌کند و استایل‌های inline اصلی سایدبار را برمی‌گرداند. وقتی query دوباره match شود، دوباره شروع به کار می‌کند.

## استایل‌هایی که کتابخانه تغییر می‌دهد {#styles-the-library-touches}

تا وقتی کتابخانه فعال است، این استایل‌های inline را روی المنت سایدبار می‌نویسد:

| Property | دلیل |
| --- | --- |
| `position` | اگر از قبل `sticky` نباشد، روی آن تنظیم می‌شود |
| `top`، `bottom` | قیدهای sticky |
| `margin-top`، `margin-bottom` | وقتی سایدبار بین دو حالت چسبیده «آزاد» است، آن را سر جایش نگه می‌دارند |
| `align-self` | هنگام اسکرول به بالا در حالت grid/flex روی `flex-end` تنظیم می‌شود |
| `overflow-anchor` | روی `none` تنظیم می‌شود تا scroll anchoring با تنظیم‌های کتابخانه تداخل نکند |

مقادیر inline اصلی هنگام شروع کتابخانه ذخیره می‌شوند و با `destroy()` یا وقتی `media` دیگر match نشود، برگردانده می‌شوند. فاصله‌گذاری‌های خودتان را در stylesheet یا یک کلاس نگه دارید، نه در استایل‌های inline که در حین کار کتابخانه تغییرشان می‌دهید.
