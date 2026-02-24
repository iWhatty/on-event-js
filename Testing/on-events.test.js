// ./Testing/on-events.test.js

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { on, off, On } from '../src/on-events.js'

describe('on-events', () => {
  let el, child

  beforeEach(() => {
    el = document.createElement('div')
    child = document.createElement('button')
    child.textContent = 'Click Me'
    el.appendChild(child)
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.removeChild(el)
  })

  it('binds a direct event', () => {
    const fn = vi.fn()
    const stop = on(child, 'click', fn)
    child.click()
    expect(fn).toHaveBeenCalledOnce()
    stop()
  })

  it('unbinds correctly', () => {
    const fn = vi.fn()
    on(child, 'click', fn)
    off(child, 'click', fn)
    child.click()
    expect(fn).not.toHaveBeenCalled()
  })

  it('supports delegation', () => {
    const fn = vi.fn()
    const stop = on(el, 'click', 'button', fn)
    child.click()
    expect(fn).toHaveBeenCalledOnce()
    stop()
  })

  it('unbinding works for delegated handler', () => {
    const fn = vi.fn()
    on(el, 'click', 'button', fn)
    off(el, 'click', fn, 'button')
    child.click()
    expect(fn).not.toHaveBeenCalled()
  })

  it('supports once option', () => {
    const fn = vi.fn()
    on(child, 'click', fn, { once: true })
    child.click()
    child.click()
    expect(fn).toHaveBeenCalledOnce()
  })

  it('supports On.batch and cleanup', () => {
    const click = vi.fn()
    const over = vi.fn()
    const stop = On.batch(child, { click, mouseover: over })

    child.dispatchEvent(new Event('click'))
    child.dispatchEvent(new Event('mouseover'))

    expect(click).toHaveBeenCalledOnce()
    expect(over).toHaveBeenCalledOnce()

    stop()

    child.dispatchEvent(new Event('click'))
    child.dispatchEvent(new Event('mouseover'))

    expect(click).toHaveBeenCalledOnce()
    expect(over).toHaveBeenCalledOnce()
  })

  it('removes capture listeners correctly', () => {
    const fn = vi.fn()
    const stop = On.capture.click(child, fn)
    stop()
    child.click()
    expect(fn).not.toHaveBeenCalled()
  })

  it('delegation does not throw when event target is a Text node', () => {
    const fn = vi.fn()
    const stop = On.delegate.click(el, 'button', fn)

    const text = child.firstChild
    text.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(fn).toHaveBeenCalledOnce()
    stop()
  })
})