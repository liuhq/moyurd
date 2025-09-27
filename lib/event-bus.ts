type EventHandler<T> = (payload?: T) => void

export class EventBus<E> {
    #id: number
    #listener: { [K in keyof E]?: EventHandler<E[K]>[] }
    #cleaner: { [K: string]: (() => void)[] }

    constructor() {
        this.#id = Date.now()
        this.#listener = {}
        this.#cleaner = {}
    }

    get id(): number {
        return this.#id
    }

    emit<K extends keyof E>(
        event: K,
        payload?: E[K],
    ) {
        if (!this.#listener[event]) return
        for (const h of this.#listener[event]) {
            h(payload)
        }
    }

    on<K extends keyof E>(
        event: K,
        handler: EventHandler<E[K]>,
        cleanerId: string,
    ) {
        if (!this.#listener[event]) this.#listener[event] = []
        this.#listener[event].push(handler)
        if (!this.#cleaner[cleanerId]) this.#cleaner[cleanerId] = []
        this.#cleaner[cleanerId].push(() => this.#off(event, handler))
    }

    #off<K extends keyof E>(event: K, handler: EventHandler<E[K]>) {
        this.#listener[event] = this.#listener[event]?.filter((h) =>
            h !== handler
        )
    }

    offHandlers(type: string) {
        if (!this.#cleaner[type]) return
        for (const c of this.#cleaner[type]) {
            c()
        }
        this.#cleaner[type].length = 0
    }
}
