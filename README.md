# on-events

**A tiny DOM event utility with sugar.**  
Write clean event bindings using fluent `On.click(...)`, `On.once.keydown(...)`, or classic `on(el, 'click', fn)`.

---

## Features

- `on(el, 'click', fn)` — classic event binding
- `On.click(el, fn)` — fluent sugar per event name
- `On.once.click(el, fn)` — auto-unbind after first call
- `On.delegate.click(el, selector, fn)` — event delegation
- `On.capture.click(el, fn)` — capture phase handling
- `On.hover(el, enterFn, leaveFn)` — sugar for mouseenter/leave
- Tiny (<1KB), ESM, zero dependencies

---

## Install

```bash
npm install on-events
```

---

## Usage

### Classic Syntax

```js
import { on, off } from 'on-events'

const stop = on(window, 'keydown', (e) => {
  console.log('key:', e.key)
})

stop() // Unbinds
```

---

### Sugar Syntax

```js
import { On } from 'on-events'

// Basic binding
On.click(button, () => console.log('clicked'))
On.keydown(window, (e) => console.log('pressed', e.key))

// Once
On.once.submit(form, (e) => console.log('submitted once'))

// Delegate
On.delegate.click(document, 'button.action', (e) => {
  console.log('clicked', e.target.textContent)
})

// Capture
On.capture.focus(input, () => console.log('focused (capture)'))

// Hover
const stopHover = On.hover(card,
  () => card.classList.add('hover'),
  () => card.classList.remove('hover')
)
```

---

## API

### `on(element, event, [selector], handler)`

Adds an event listener. If `selector` is provided, uses delegation.  
Returns a `stop()` function to unbind.

---

### `off(element, event, handler, [selector])`

Removes an event listener previously added with `on()`.

---

### `On.event(element, handler)`

Sugar for `on(el, 'event', handler)`.  
Example: `On.click(el, handler)`.

---

### `On.once.event(element, handler)`

Binds an event that auto-removes after one call.  
Example: `On.once.click(el, handler)`.

---

### `On.delegate.event(element, selector, handler)`

Binds using event delegation.  
Example: `On.delegate.click(document, '.btn', handler)`.

---

### `On.capture.event(element, handler)`

Binds the event in the capture phase.  
Example: `On.capture.focus(input, fn)`.

---

### `On.hover(element, enterFn, leaveFn)`

Binds `mouseenter` and `mouseleave` together.  
Returns a function to unbind both.

---

## Notes

- `On.*` methods return an unbind function.
- Works with any `EventTarget`: DOM nodes, `window`, etc.
- Safe delegation using `el.contains()` and `closest()`.

---

## License

MIT © J W
