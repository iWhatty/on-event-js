// micro-on.js

const listeners = new WeakMap()

export function on(el, type, selector, cb, options = {}) {
  if (typeof selector === 'function') {
    cb = selector
    selector = null
  }

  const wrapped = selector
    ? (e) => {
        if (e.target.closest(selector)) cb.call(e.target, e)
      }
    : cb

  el.addEventListener(type, wrapped, options)

  // Track for `off`
  if (!listeners.has(el)) listeners.set(el, [])
  listeners.get(el).push({ type, cb, selector, wrapped })

  return () => off(el, type, cb, selector)
}

export function off(el, type, cb, selector) {
  const group = listeners.get(el)
  if (!group) return

  for (let i = group.length - 1; i >= 0; i--) {
    const h = group[i]
    const match =
      h.type === type &&
      h.cb === cb &&
      (selector ? h.selector === selector : !h.selector)

    if (match) {
      el.removeEventListener(type, h.wrapped)
      group.splice(i, 1)
    }
  }

  if (!group.length) listeners.delete(el)
}
