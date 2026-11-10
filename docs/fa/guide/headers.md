# هدرهای پویا

هدرتان را پاس بدهید تا سایدبار درست زیر آن قرار بگیرد، هر جا که هدر در آن لحظه باشد.

```js
stickySidebar('#sidebar', { header: '.site-header' });
```

## سایدبار کجا قرار می‌گیرد {#where-the-sidebar-sits}

لبه‌ی بالای سایدبار در حالت چسبیده برابر است با:

```
lowest visible header bottom + offsetTop + gap
```

- **پایین‌ترین لبه‌ی قابل‌مشاهده.** اگر چند هدر داشته باشید، هدری که پایین‌تر می‌آید ملاک است.
- **هدرهای پنهان نادیده گرفته می‌شوند.** هدری با ارتفاع صفر (`display: none`، `hidden` یا جمع‌شده) یا هدری که کامل از بالای viewport بیرون رفته، `0` حساب می‌شود.
- اندازه‌گیری نسبت به viewport انجام می‌شود، یا اگر از [`scroller`](../api/README.md#scroller) استفاده کنید، نسبت به آن.

## چند ردیف هدر {#several-header-rows}

یک selector که همه‌شان را match کند، یک آرایه یا یک `NodeList` پاس بدهید:

```js
stickySidebar('#sidebar', { header: '#top-bar, #sub-nav' });

stickySidebar('#sidebar', { header: [topBar, subNav] });

stickySidebar('#sidebar', { header: document.querySelectorAll('[data-sticky-header]') });
```

این الگوی رایجِ یک نوار بالای ثابت به‌همراه یک منوی فرعی است که هنگام اسکرول به پایین کنار می‌رود. وقتی منوی فرعی بالا می‌رود، سایدبار هم همراهش بالا می‌رود. وقتی برمی‌گردد، سایدبار هم همراهش پایین می‌آید.

::: tip
selectorها فقط یک بار، هنگام شروع نمونه، resolve می‌شوند. اگر المنت‌های هدر بعداً اضافه یا جایگزین شوند، [`refresh()`](../api/README.md#refresh) را صدا بزنید.
:::

## چه چیزهایی خودکار دنبال می‌شوند {#what-is-tracked-automatically}

برای هیچ‌کدام از این‌ها لازم نیست کاری بکنید. کتابخانه تغییر را تشخیص می‌دهد و فریم‌به‌فریم هدر را دنبال می‌کند تا ثابت شود.

| تغییر روی المنت هدر | از طریق |
| --- | --- |
| تغییر ارتفاع (جمع شدن، باز شدن، تغییر محتوا) | `ResizeObserver` |
| تغییر attributeهای `class`، `style` یا `hidden` | `MutationObserver` |
| transitionها و انیمیشن‌های keyframe در CSS | `transitionrun` / `animationstart`، سپس دنبال کردن با `getAnimations()` تا پایان انیمیشن |
| Web Animations API (`el.animate()`) | `getAnimations()` |
| انیمیشن JS که در هر فریم `style.transform` را می‌نویسد | `MutationObserver` روی `style` |
| تغییر اندازه‌ی صفحه یا اسکرولر | رویداد `resize`، و `ResizeObserver` روی سایدبار و والدش |

## وقتی باید کمک کنید {#when-you-need-to-help}

کتابخانه **خود المنت‌های هدر** را زیر نظر دارد. تغییراتی را که هدر را جابه‌جا می‌کنند ولی به خود آن المنت دست نمی‌زنند نمی‌بیند؛ برای مثال:

- کلاسی که روی `<body>` یا یک wrapper عوض می‌شود، در حالی که خود هدر transition ندارد؛
- هدری که موقعیتش از یک متغیر CSS روی یکی از والدها می‌آید؛
- offsetی که در state برنامه است و هنوز در DOM نیامده.

برای این موارد، یکی از سه روش زیر را انتخاب کنید.

### فراخوانی `update()` {#call-update}

```js
const sidebar = stickySidebar('#sidebar', { header: '.site-header' });

document.body.classList.toggle('compact-header');
sidebar.update();
```

### استفاده از `subscribe` {#use-subscribe}

اگر هدر را یک store کنترل می‌کند، اجازه بدهید کتابخانه به آن subscribe کند:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    subscribe: (update) => headerStore.subscribe(update), // must return an unsubscribe function
});
```

هر بار که store تغییر کند، `update` صدا زده می‌شود. کتابخانه هنگام `destroy()` تابع unsubscribe شما را صدا می‌زند.

### استفاده از getter برای `offsetTop` {#use-an-offsettop-getter}

`offsetTop` و `offsetBottom` تابعی هم می‌پذیرند که در هر به‌روزرسانی خوانده می‌شود:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    offsetTop: () => (cookieBanner.isOpen ? cookieBanner.height : 0),
});
```

getter را همراه با `subscribe` یا `update()` استفاده کنید تا کتابخانه بداند کِی باید دوباره آن را بخواند.

## بدون هدر {#no-header}

بدون `header`، سایدبار به اندازه‌ی `offsetTop + gap` پیکسل پایین‌تر از بالای viewport (یا اسکرولر) می‌چسبد:

```js
stickySidebar('#sidebar', { offsetTop: 64 }); // fixed 64px header you don't want to observe
```
