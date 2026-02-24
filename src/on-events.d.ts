// src/on-events.d.ts

export type Stop = () => void

export type Handler<E extends Event = Event> = (this: Element, ev: E) => any
export type DirectHandler<E extends Event = Event> = (ev: E) => any

export function on<E extends Event = Event>(
    el: EventTarget,
    event: string,
    handler: DirectHandler<E>
): Stop

export function on<E extends Event = Event>(
    el: Element | Document,
    event: string,
    selector: string,
    handler: Handler<E>
): Stop

export function off<E extends Event = Event>(
    el: EventTarget,
    event: string,
    handler: DirectHandler<E>,
    selector?: null
): void

export function off<E extends Event = Event>(
    el: Element | Document,
    event: string,
    handler: Handler<E>,
    selector?: string
): void

export interface OnChain {
    // modifiers
    first: OnChain
    once: OnChain
    capture: OnChain
    passive: OnChain
    delegate: OnChain

    // utilities
    hover(el: Element, enter: (ev: Event) => any, leave: (ev: Event) => any): Stop
    batch(
        el: EventTarget,
        map: Record<
            string,
            ((ev: any) => any) | [string, (ev: any) => any]
        >
    ): Stop
    ready(fn: () => void): void

    // event binder (unknown event names supported)
    [event: string]: any
}

export const On: OnChain