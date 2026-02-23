// on-events.js
// On-Events — tiny DOM event utility with composable sugar.

// --- internal base ---
const listeners = new WeakMap()

/**
 * baseOn(el, type, handler)
 * baseOn(el, type, selector, handler)
 * baseOn(el, type, handler, options)
 * baseOn(el, type, selector, handler, options)
 */
function baseOn(el, type, selector, cb, options) {
  // normalize args
  if (typeof selector === 'function') {
    options = cb
    cb = selector
    selector = null
  }

  const opts = options || undefined

  const wrapped = selector
    ? (e) => {
      const target = e.target instanceof Element ? e.target : e.target?.parentElement
      if (!target) return
      const match = target.closest(selector)
      if (match && el.contains(match)) cb.call(match, e)
    }
    : cb

  el.addEventListener(type, wrapped, opts)

  if (!listeners.has(el)) listeners.set(el, [])
  listeners.get(el).push({
    type,
    cb,
    selector,
    wrapped,
    capture: !!(opts && opts.capture), // critical for proper removal
  })

  return () => off(el, type, cb, selector)
}

function off(el, type, cb, selector = null) {
  const group = listeners.get(el)
  if (!group) return

  for (let i = group.length; i-- > 0;) {
    const h = group[i]
    const match =
      h.type === type &&
      h.cb === cb &&
      (selector ? h.selector === selector : !h.selector)

    if (match) {
      // capture must match for removal
      el.removeEventListener(type, h.wrapped, { capture: h.capture })
      group.splice(i, 1)
    }
  }

  if (!group.length) listeners.delete(el)
}

// --- composable sugar: On.<mods>.<event>(...) ---
// bitflags keep the proxy tiny + fast
const ONCE = 1
const CAPTURE = 2
const PASSIVE = 4
const DELEGATE = 8

const optsFor = (f) => {
  // Avoid allocating options when none are set.
  // Note: capture removal is handled by storing capture in registry.
  if (!(f & (ONCE | CAPTURE | PASSIVE))) return undefined
  const o = {}
  if (f & ONCE) o.once = true
  if (f & CAPTURE) o.capture = true
  if (f & PASSIVE) o.passive = true
  return o
}

const makeOn = (flags = 0) =>
  new Proxy(Object.create(null), {
    get(_t, prop) {
      const k = String(prop)

      // modifier chaining
      if (k === 'first' || k === 'once') return makeOn(flags | ONCE)
      if (k === 'capture') return makeOn(flags | CAPTURE)
      if (k === 'passive') return makeOn(flags | PASSIVE)
      if (k === 'delegate') return makeOn(flags | DELEGATE)

      // utilities (kept as properties for backwards-compat ergonomics)
      if (k === 'hover') {
        return (el, enter, leave) => {
          const o = optsFor(flags)
          const offIn = baseOn(el, 'mouseenter', enter, o)
          const offOut = baseOn(el, 'mouseleave', leave, o)
          return () => {
            offIn()
            offOut()
          }
        }
      }

      if (k === 'batch') {
        return (el, map) => {
          const stops = []
          for (const [event, val] of Object.entries(map)) {
            // basic: { click: fn }
            if (typeof val === 'function') {
              stops.push(makeOn(flags)[event](el, val))
              continue
            }
            // optional delegate batch: { click: ['a', fn] }
            if (Array.isArray(val)) {
              const [selector, fn] = val
              stops.push(makeOn(flags | DELEGATE)[event](el, selector, fn))
            }
          }
          return () => stops.forEach((stop) => stop())
        }
      }

      if (k === 'ready') {
        return (fn) => {
          if (typeof document === 'undefined') return
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true })
          } else {
            fn()
          }
        }
      }

      // event binder
      return (el, ...args) => {
        const o = optsFor(flags)

        if (flags & DELEGATE) {
          const [selector, handler] = args
          return baseOn(el, k, selector, handler, o)
        }

        const [handler] = args
        return baseOn(el, k, handler, o)
      }
    },
  })

const On = makeOn()

// --- legacy alias for backward compatibility ---
On.once = On.first

// --- classic support ---
const on = (el, event, ...args) => baseOn(el, event, ...args)

export { on, On, off }