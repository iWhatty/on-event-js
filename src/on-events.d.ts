// src/on-events.d.ts

export type Stop = () => void

export type Handler<E extends Event = Event> = (this: Element, ev: E) => any
export type DirectHandler<E extends Event = Event> = (ev: E) => any

export type BatchMap = Record<
  string,
  | DirectHandler<any>
  | [string, Handler<any>]
>

// --- Low-level API ---

export function on<E extends Event = Event>(
  el: EventTarget,
  event: string,
  handler: DirectHandler<E>,
  options?: AddEventListenerOptions | boolean
): Stop

export function on<E extends Event = Event>(
  el: Element | Document,
  event: string,
  selector: string,
  handler: Handler<E>,
  options?: AddEventListenerOptions | boolean
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

// --- Fluent Event Binder ---

export interface EventBinder<E extends Event = Event> {
  (el: EventTarget, handler: DirectHandler<E>): Stop
  (el: Element | Document, selector: string, handler: Handler<E>): Stop
}

// --- Fluent Chain API core ---

export interface OnChain {
  first: OnChain
  once: OnChain
  capture: OnChain
  passive: OnChain
  delegate: OnChain

  hover(
    el: Element,
    enter: (ev: MouseEvent) => any,
    leave: (ev: MouseEvent) => any
  ): Stop

  batch(
    el: EventTarget,
    map: BatchMap
  ): Stop

  ready(fn: () => void): void

  group(): OnGroup

  <E extends Event = Event>(
    el: EventTarget,
    handler: DirectHandler<E>
  ): Stop

  <E extends Event = Event>(
    el: Element | Document,
    selector: string,
    handler: Handler<E>
  ): Stop

  // fallback for custom / non-standard event names
  event(type: string): OnChain & EventBinder<Event>
}

export type OnEventMap = {
  [K in keyof GlobalEventHandlersEventMap]:
    OnChain & EventBinder<GlobalEventHandlersEventMap[K]>
}

export type OnAPI = OnChain & OnEventMap

export type OnGroup = OnAPI & {
  stop(): void
  add<T extends Stop | null | undefined | false>(stop: T): T
}

export const On: OnAPI