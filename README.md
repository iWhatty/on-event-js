# On(Events)

**Tiny DOM event binding with sugar.**  
Delegate, unbind, and handle events like a boss — in under 1KB.

[![License](https://img.shields.io/npm/l/on-events.svg)](LICENSE)  
[![npm version](https://img.shields.io/npm/v/on-events.svg)](https://www.npmjs.com/package/on-events)

---

## Features

- `on()` to bind events — directly or via delegation  
- `off()` to clean up easily  
- Supports one-time handlers with `{ once: true }`  
- Uses `WeakMap` internally — no memory leaks  
- Works on any DOM node: `HTMLElement`, `window`, `document`  
- Zero dependencies, ESM-first

---

## Installation

```bash
npm install on-events
```

Or use directly in the browser via a CDN:

```html
<script type="module">
  import { on, off } from 'https://cdn.skypack.dev/on-events'
</script>
```

---

## Usage

```js
import { on, off } from 'on-events'

// Basic event binding
const stopClick = on(window, 'click', () => {
  console.log('Window clicked')
})
stopClick() // Unbinds

// Delegated event
const ul = document.querySelector('ul')
on(ul, 'click', 'button', (e) => {
  console.log('Clicked:', e.target.textContent)
})

// One-time event
on(window, 'keydown', (e) => {
  console.log('Pressed:', e.key)
}, { once: true })
```

---

## API

### `on(element, type, [selector], callback, [options])`

Adds an event listener.

- `element`: any EventTarget (`window`, `document`, or an element)
- `type`: event name (e.g. `'click'`, `'keydown'`)
- `selector`: optional CSS selector (for delegated events)
- `callback`: your event handler
- `options`: native `addEventListener` options (`{ once, capture, passive }`)

Returns a cleanup function — you can call this to remove the event.

---

### `off(element, type, callback, [selector])`

Removes an event listener.

- Use the same `callback` and `selector` used in `on()`
- Can also remove delegated handlers

---

## Example

```js
const log = (e) => console.log('Clicked', e.target)

const stop = on(document.body, 'click', 'button', log)

// Later...
off(document.body, 'click', log, 'button')
// or:
stop()
```

---

## Why Use This?

- Smaller than big event libraries
- Cleaner than raw `addEventListener`
- Safer — tracks and unbinds with no leaks
- Scoped delegation via `closest(selector)` and `el.contains(target)`

---

## Browser Support

Modern browsers: Chrome, Edge, Firefox, Safari.  
Uses `closest()` and `WeakMap`.

---

## License

MIT © [J W](https://github.com/yourhandle)
