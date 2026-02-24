// src/on-events.d.ts

export type Stop = () => void

export type Handler<E extends Event = Event> = (this: Element, ev: E) => any
export type DirectHandler<E extends Event = Event> = (ev: E) => any

// --- Low-level API ---

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

// --- Fluent Chain API ---

export interface OnChain {
    // modifiers (composable)
    first: OnChain
    once: OnChain
    capture: OnChain
    passive: OnChain
    delegate: OnChain

    // utilities
    hover(
        el: Element,
        enter: (ev: MouseEvent) => any,
        leave: (ev: MouseEvent) => any
    ): Stop

    batch(
        el: EventTarget,
        map: Record<
            string,
            | DirectHandler<any>
            | [string, Handler<any>]
        >
    ): Stop

    ready(fn: () => void): void

    // event binder (fluent)
    <E extends Event = Event>(
        el: EventTarget,
        handler: DirectHandler<E>
    ): Stop

    <E extends Event = Event>(
        el: Element | Document,
        selector: string,
        handler: Handler<E>
    ): Stop

    // dynamic event access (On.click, On.keydown, etc.)
    [event: string]:
    | OnChain
    | (<E extends Event = Event>(
        el: EventTarget,
        handler: DirectHandler<E>
    ) => Stop)
    | (<E extends Event = Event>(
        el: Element | Document,
        selector: string,
        handler: Handler<E>
    ) => Stop)
}

export const On: OnChain