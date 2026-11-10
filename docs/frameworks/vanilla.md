# Vanilla JS

```js
import { stickySidebar } from 'dynamic-sticky-sidebar';
```

## Basic usage

```js
const sidebar = stickySidebar('#sidebar', {
    header: '.site-header',
    gap: 16,
    media: '(min-width: 768px)',
});
```

The first argument is an element or a selector. It throws if nothing matches, so create the instance once the element exists.

`stickySidebar()` returns an [instance](../api/README.md#instance):

```js
sidebar.update();          // recalculate now
sidebar.refresh();         // re-query header selectors / scroller and restart
sidebar.setOptions({ … }); // replace options
sidebar.destroy();         // remove listeners and restore inline styles
```

## Without a bundler

The package ships an IIFE build that defines a global `StickySidebar`:

```html
<script src="https://unpkg.com/dynamic-sticky-sidebar"></script>
<script>
    StickySidebar.stickySidebar('#sidebar', { header: '.site-header' });
</script>
```

`https://cdn.jsdelivr.net/npm/dynamic-sticky-sidebar` works too. Pin a version in production, for example `dynamic-sticky-sidebar@0.1.0`.

The CDN file is a minified production build (about 2 kB gzipped), so it does not print the development warnings described in [Troubleshooting](../guide/troubleshooting.md). Use the npm package with a bundler in development if you want them.

## CommonJS

```js
const { stickySidebar } = require('dynamic-sticky-sidebar');
```

## Updating options

`setOptions` **replaces** the options. It does not merge them, so pass the full set:

```js
const base = { header: '.site-header', media: '(min-width: 768px)' };
const sidebar = stickySidebar('#sidebar', { ...base, gap: 16 });

sidebar.setOptions({ ...base, gap: 24 });
```

Changing `gap`, `offsetTop` or `offsetBottom` just recalculates. Changing `header`, `media`, `scroller` or `subscribe` restarts the instance.

## Inside a scrollable panel

When the page itself doesn't scroll but a container does (app shells, dashboards), pass the container as `scroller`. Positions are then measured against that container:

```js
stickySidebar('#filters', {
    scroller: '#panel',
    header: '#panel-toolbar',
});
```

## Single-page apps

Call `destroy()` when the view unmounts. It removes every listener and observer and restores the sidebar's original inline styles. If you use React or Vue, the [adapters](./react.md) do this for you.
