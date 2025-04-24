import { on, On, off } from '../src/on-event'

// Classic
on(window, 'click', () => console.log('clicked'))

// Fluent
On.keydown(document, (e) => console.log(e.key))
On.click('#btn', () => console.log('clicked'))

// Once
On.once.submit(form, handleSubmitOnce)

// Delegated
On.delegate.click(document, 'button.action', e => console.log(e.target))

// Capture phase
On.capture.focus(input, () => console.log('focus in capture'))

// Hover
const unhover = On.hover(box, () => box.classList.add('hover'), () => box.classList.remove('hover'))
