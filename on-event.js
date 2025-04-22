// micro-on.js

const listeners = new WeakMap()

function baseOn(el, type, selector, cb, opts = {}) {
  if (typeof selector === 'function') {
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

  if (!listeners.has(el)) listeners.set(el, [])
  listeners.get(el).push({ type, cb, selector, wrapped })

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


// Proxy to support On.click(...) syntax
const On = new Proxy({}, {
  get(_, event) {
    return (el, ...args) => baseOn(el, event, ...args)
  }
})


export const on = (el, event, ...rest) => baseOn(el, event, ...rest)


export { On, off }