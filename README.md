# on-events

**A tiny DOM event utility with sugar.**  
Write clean event bindings using fluent `On.click(...)`, `On.once.keydown(...)`, or classic `on(el, 'click', fn)`.

---

## Features

- `on(el, 'click', fn)` — classic event binding
- `On.click(el, fn)` — fluent sugar per event name
- `On.once.click(el, fn)` — fires once then unbinds
- `On.delegate.click(el, selector, fn)` — delegated events
- `On.capture.focus(el, fn)` — capture-phase listener
- `On.hover(el, enter, leave)` — mouseenter/leave pair
- `On.batch(el, { event: fn, ... })` — bulk binding
- `On.ready(fn)` — run when DOM is ready
- Fully ESM, no dependencies, < 1KB min+gzip

---

## Install

```bash
npm install on-events
```

---

## Usage

### Classic Binding

```js
import { on, off } from 'on-events'

const stop = on(window, 'keydown', (e) => {
  console.log('Pressed:', e.key)
})

stop() // unbinds
```

---

### Fluent Sugar

```js
import { On } from 'on-events'

// Basic
On.click(button, () => console.log('Clicked!'))

// Once
On.once.submit(form, () => console.log('Submitted once'))

// Delegate
On.delegate.click(document, 'button.action', (e) => {
  console.log('Clicked', e.target.textContent)
})

// Capture
On.capture.focus(input, () => console.log('Focus (captured)'))

// Hover
const stopHover = On.hover(card,
  () => card.classList.add('hover'),
  () => card.classList.remove('hover')
)
```

---

### Batch Binding

```js
const stop = On.batch(window, {
  click: () => console.log('Window clicked'),
  keydown: (e) => console.log('Key pressed:', e.key)
})

// Call `stop()` to unbind all
```

---

### DOM Ready

```js
On.ready(() => {
  console.log('DOM fully loaded and parsed')
})
```

---

## API Reference

### `on(el, event, [selector], handler)`

Adds a standard or delegated event listener. Returns a stop function.

### `off(el, event, handler, [selector])`

Removes a previously added listener.

---

### `On.event(el, handler)`

Fluent alias for `on(el, 'event', handler)`.  
Example: `On.click(el, fn)`.

---

### `On.once.event(el, handler)`

Binds the event with `{ once: true }`.  
Auto-removes after first call.

---

### `On.delegate.event(el, selector, handler)`

Binds a delegated event using `closest(selector)`.

---

### `On.capture.event(el, handler)`

Listens in the capture phase.

---

### `On.hover(el, enterFn, leaveFn)`

Convenience for `mouseenter` and `mouseleave`.

---

### `On.batch(el, map)`

Bind multiple events at once:
```js
On.batch(el, {
  click: fn1,
  keydown: fn2
})
```

Returns an `unmount()` function to remove all.

---

### `On.ready(fn)`

Runs `fn` once the DOM is fully loaded (`DOMContentLoaded` or immediate).

---

## License

MIT © J W
