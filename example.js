import { on, off } from './on-event.js'

// 1. Basic Event
const stopLog = on(window, 'click', () => console.log('clicked window'))
setTimeout(stopLog, 2000) // Auto remove after 2s

// 2. Delegated Event
const ul = document.createElement('ul')
ul.innerHTML = `<li><button>One</button></li><li><button>Two</button></li>`
document.body.appendChild(ul)

on(ul, 'click', 'button', (e) => {
  console.log('Clicked button:', e.textContent.trim())
})

// 3. Multiple bindings
const input = document.createElement('input')
document.body.appendChild(input)

const logInput = () => console.log('typing...')
const stopTyping = on(input, 'input', logInput)

setTimeout(() => {
  stopTyping()
  console.log('Unbound input event')
}, 5000)

// 4. Once-only event
on(window, 'keydown', (e) => {
  console.log('Pressed:', e.key)
}, { once: true })
