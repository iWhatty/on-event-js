import { describe, it, expect, vi, beforeEach } from 'vitest'
import { on, off } from './on-event.js'

describe('micro-on', () => {
  let el, child
micro-on.test
  beforeEach(() => {
    el = document.createElement('div')
    child = document.createElement('button')
    child.textContent = 'Click Me'
    el.appendChild(child)
    document.body.appendChild(el)
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
})
