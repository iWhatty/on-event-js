// micro-on.js

// --- internal base ---
const listeners = new WeakMap()


function baseOn(el, type, selector, cb, options = {}) {
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

  el.addEventListener(type, wrapped, options)

  if (!listeners.has(el)) listeners.set(el, [])
  listeners.get(el).push({ type, cb, selector, wrapped })

  return () => off(el, type, cb, selector)
}

function off(el, type, cb, selector = null) {
  const group = listeners.get(el)
  if (!group) return
  for (let i = group.length; i-- > 0; ) {
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

// --- sugar: On.* ---
const On = new Proxy({}, {
  get(_, event) {
    return (el, ...args) => baseOn(el, event, ...args)
  }
})

// On.once.* — fires once
On.once = new Proxy({}, {
  get(_, event) {
    return (el, ...args) => baseOn(el, event, ...args, { once: true })
  }
})

// On.delegate.* — forces selector style
On.delegate = new Proxy({}, {
  get(_, event) {
    return (el, selector, handler) => baseOn(el, event, selector, handler)
  }
})

// On.capture.* — capture phase
On.capture = new Proxy({}, {
  get(_, event) {
    return (el, ...args) => baseOn(el, event, ...args, { capture: true })
  }
})

// On.hover(el, enterFn, leaveFn)
On.hover = (el, enter, leave) => {
  const offIn = baseOn(el, 'mouseenter', enter)
  const offOut = baseOn(el, 'mouseleave', leave)
  return () => { offIn(); offOut() }
}

// --- classic support
const on = (el, event, ...args) => baseOn(el, event, ...args)

export { on, On, off }
