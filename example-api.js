import { on, off } from 'on-events'

// Delegate click inside #nav
const stop = on(document, 'click', '#nav a', e => {
  console.log('Clicked nav link:', e.target)
})

// Unbind
stop()

// Or store to unbind later
const handler = e => console.log(e)
on(window, 'resize', handler)
off(window, 'resize', handler)
