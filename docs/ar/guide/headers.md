# الترويسات الديناميكية

مرّر الترويسة، وسيستقر الشريط الجانبي تحتها مباشرة أينما كانت في تلك اللحظة.

```js
stickySidebar('#sidebar', { header: '.site-header' });
```

## أين يستقر الشريط الجانبي {#where-the-sidebar-sits}

الحافة العلوية للشريط الجانبي، حين يكون مثبّتًا، هي:

```
lowest visible header bottom + offsetTop + gap
```

- **أدنى حافة سفلية ظاهرة.** عند وجود عدة ترويسات، تفوز الترويسة التي تمتد إلى الأسفل أكثر من غيرها.
- **الترويسات المخفية تُتجاهل.** الترويسة ذات الارتفاع الصفري (`display: none` أو `hidden` أو المطوية) أو التي انزلقت كليًا فوق منفذ العرض تُحسب `0`.
- يُقاس الموضع بالنسبة إلى منفذ العرض، أو بالنسبة إلى [`scroller`](../api/README.md#scroller) حين تستخدمه.

## عدة صفوف للترويسة {#several-header-rows}

مرّر محدِّدًا (selector) يطابقها جميعًا، أو مصفوفة، أو `NodeList`:

```js
stickySidebar('#sidebar', { header: '#top-bar, #sub-nav' });

stickySidebar('#sidebar', { header: [topBar, subNav] });

stickySidebar('#sidebar', { header: document.querySelectorAll('[data-sticky-header]') });
```

هذا هو النمط المعتاد: شريط علوي ثابت وقائمة فرعية تنزلق بعيدًا عند التمرير لأسفل. حين تنزلق القائمة الفرعية لأعلى، يصعد الشريط الجانبي معها. وحين تعود، ينزل معها.

::: tip
تُحَل المحدِّدات مرة واحدة فقط، حين تبدأ النسخة. إذا أُضيفت عناصر ترويسة أو استُبدلت لاحقًا، فاستدعِ [`refresh()`](../api/README.md#refresh).
:::

## ما يُتتبَّع تلقائيًا {#what-is-tracked-automatically}

لا حاجة إلى أي ربط لأيٍّ مما يلي. تلاحظ المكتبة التغيير وتتبع الترويسة إطارًا بإطار حتى تستقر.

| التغيير على عنصر الترويسة | يُكتشف عبر |
| --- | --- |
| تغيّر الارتفاع (انطواء، تمدد، تغيّر المحتوى) | `ResizeObserver` |
| تغيّر السمات `class` أو `style` أو `hidden` | `MutationObserver` |
| انتقالات CSS والرسوم المتحركة بالإطارات المفتاحية | `transitionrun` / `animationstart`، ثم المتابعة عبر `getAnimations()` حتى تنتهي |
| واجهة Web Animations API (`el.animate()`) | `getAnimations()` |
| رسوم متحركة بـ JS تكتب `style.transform` في كل إطار | `MutationObserver` على `style` |
| تغيّر حجم الصفحة أو حاوية التمرير | الحدث `resize`، و`ResizeObserver` على الشريط الجانبي وأبيه |

## متى تحتاج إلى المساعدة {#when-you-need-to-help}

تراقب المكتبة **عناصر الترويسة نفسها**. ولا يمكنها رؤية التغييرات التي تحرّك الترويسة دون أن تمسّ ذلك العنصر، مثل:

- صنف (class) يُبدَّل على `<body>` أو على غلاف، دون أن يكون للترويسة انتقال خاص بها؛
- ترويسة يأتي موضعها من متغير CSS مضبوط على عنصر سلف؛
- إزاحة موجودة في حالة التطبيق ولم تصل إلى DOM بعد.

في هذه الحالات، اختر إحدى الطرق الثلاث التالية.

### استدعِ `update()` {#call-update}

```js
const sidebar = stickySidebar('#sidebar', { header: '.site-header' });

document.body.classList.toggle('compact-header');
sidebar.update();
```

### استخدم `subscribe` {#use-subscribe}

إذا كان مخزن حالة (store) هو ما يتحكم في الترويسة، فدع المكتبة تشترك فيه:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    subscribe: (update) => headerStore.subscribe(update), // must return an unsubscribe function
});
```

تُستدعى `update` كلما تغيّر المخزن. وتستدعي المكتبة دالة إلغاء الاشتراك الخاصة بك عند `destroy()`.

### استخدم دالة جلب لـ `offsetTop` {#use-an-offsettop-getter}

يقبل `offsetTop` و`offsetBottom` دالةً تُقرأ عند كل تحديث:

```js
stickySidebar('#sidebar', {
    header: '.site-header',
    offsetTop: () => (cookieBanner.isOpen ? cookieBanner.height : 0),
});
```

اقرن دالة الجلب بـ `subscribe` أو `update()` لكي تعرف المكتبة متى تقرؤها مجددًا.

## بلا ترويسة {#no-header}

من دون `header`، يُثبَّت الشريط الجانبي على بُعد `offsetTop + gap` بكسل أسفل أعلى منفذ العرض (أو حاوية التمرير):

```js
stickySidebar('#sidebar', { offsetTop: 64 }); // fixed 64px header you don't want to observe
```
