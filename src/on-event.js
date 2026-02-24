// on-event.js

// --- internal base ---
const listeners = new WeakMap()


function baseOn(el, type, selector, cb, options = {}) {
  if (typeof selector === 'function') {
    if (cb && typeof cb === 'object') {
      options = cb
    }
    cb = selector
    selector = null
  } else if (cb && typeof cb === 'object') {
    options = cb
    cb = selector
    selector = null
  }

  let wrapped = selector
    ? (e) => {
        const match = e.target.closest(selector)
        if (match && el.contains(match)) cb.call(match, e)
      }
    : cb

  if (options.once) {
    const orig = wrapped
    wrapped = (e) => {
      off(el, type, cb, selector)
      orig(e)
    }
  }

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

// On.first.* — fires once
On.first = new Proxy({}, {
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


// On.batch(el, { click, mouseenter, keydown })
On.batch = (el, map) => {
  const stops = []
  for (const [event, fn] of Object.entries(map)) {
    stops.push(On[event](el, fn))
  }
  return () => stops.forEach(stop => stop())
}

// On.ready(fn)
On.ready = (fn) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
  } else {
    fn()
  }
}


// --- first.batch sugar ---
On.first.batch = (el, map) => {
  const stops = []
  for (const [event, fn] of Object.entries(map)) {
    stops.push(On.first[event](el, fn))
  }
  return () => stops.forEach(stop => stop())
}

// --- passive.* sugar ---
On.passive = new Proxy({}, {
  get(_, event) {
    return (el, ...args) => baseOn(el, event, ...args, { passive: true })
  }
})


// alias On.once → On.first for backward compatibility
On.once = On.first

// --- classic support
const on = (el, event, ...args) => baseOn(el, event, ...args)

export { on, On, off }
