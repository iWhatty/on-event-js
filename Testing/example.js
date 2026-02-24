// ./Testing/example.js

import { on, off, On } from '../src/on-events.js'

// --- helpers ---
function logClicked() {
    console.log('clicked')
}

function logKey(e) {
    console.log(e.key)
}

function handleSubmitOnce(e) {
    e.preventDefault()
    console.log('submitted once')
}

function handleDelegatedClick(e) {
    // `this` is the matched element (because delegation uses cb.call(match, e))
    console.log('delegated target:', this)
    console.log('event target:', e.target)
}

function logFocusCapture() {
    console.log('focus in capture')
}

function addHover() {
    box.classList.add('hover')
}

function removeHover() {
    box.classList.remove('hover')
}

// --- elements ---
const btn = document.querySelector('#btn')
const form = document.querySelector('form')
const input = document.querySelector('input')
const box = document.querySelector('.box')

// --- Classic ---
const stopClick = on(window, 'click', logClicked)

// If you want to demonstrate off():
// off(window, 'click', logClicked)
// stopClick() // also unbinds

// --- Fluent ---
if (btn) On.click(btn, logClicked)
On.keydown(document, logKey)

// --- Once ---
if (form) On.once.submit(form, handleSubmitOnce)

// --- Delegated ---
On.delegate.click(document, 'button.action', handleDelegatedClick)

// --- Capture phase ---
if (input) On.capture.focus(input, logFocusCapture)

// --- Hover ---
const unhover = box ? On.hover(box, addHover, removeHover) : () => { }