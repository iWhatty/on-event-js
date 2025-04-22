// micro-on.js

const handlers = new WeakMap()

export function on(el, type, selector, cb, opts) {
  if (typeof selector === 'function') {
    opts = cb
    cb = selector
    selector = null
  }

  const wrapped = selector
    ? (e) => {
        const match = e.target.closest(selector)
        if (match && el.contains(match)) cb.call(match, e)
      }
    : cb

  el.addEventListener(type, wrapped, opts)

  if (!handlers.has(el)) handlers.set(el, [])
  handlers.get(el).push({ type, cb, selector, wrapped })

  return () => off(el, type, cb, selector)
}

export function off(el, type, cb, selector) {
  const store = handlers.get(el)
  if (!store) return

  for (let i = store.length; i-- > 0; ) {
    const h = store[i]
    const match =
      h.type === type &&
      h.cb === cb &&
      h.selector === (selector || null)

    if (match) {
      el.removeEventListener(type, h.wrapped)
      store.splice(i, 1)
    }
  }

  if (store.length === 0) handlers.delete(el)
}
