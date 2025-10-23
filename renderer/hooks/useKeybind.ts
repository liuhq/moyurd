import { keymap, type KeymapMode } from '#config/keymap'
import { useEventBus } from '#renderer/context/EventBusProvider'
import { createEffect, onCleanup } from 'solid-js'

const normalizeKeySeq = (keySeq: string) => {
    const parts = keySeq
        .split('+')
        .map((p) => p.toLowerCase() == 'space' ? ' ' : p.trim().toLowerCase())
        .sort()
    return [...new Set(parts)].join('+')
}

export const useKeybind = (
    keys: string,
    callback: () => void,
    enabled = true,
) => {
    const delay = 250
    let isBan = false
    let timer: number | null = null

    const handleKeyDown = (event: KeyboardEvent) => {
        if (isBan) return

        const pressed = []
        if (event.ctrlKey) pressed.push('ctrl')
        if (event.shiftKey) pressed.push('shift')
        if (event.altKey) pressed.push('alt')
        if (event.metaKey) pressed.push('meta')

        const k = event.key.toLowerCase()
        if (!['ctrl', 'shift', 'alt', 'meta'].includes(k)) {
            pressed.push(k)
        }

        const pressedSeq = normalizeKeySeq(pressed.join('+'))

        if (pressedSeq !== normalizeKeySeq(keys)) return

        event.preventDefault()
        event.stopPropagation()
        callback()

        if (!event.repeat) return
        isBan = true
        timer = window.setTimeout(() => {
            isBan = false
        }, delay)
    }

    const handleKeyUp = () => {
        if (!timer) return
        clearTimeout(timer)
        isBan = false
        timer = null
    }

    createEffect(() => {
        if (enabled) {
            window.addEventListener('keydown', handleKeyDown)
            window.addEventListener('keyup', handleKeyUp)
        } else {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }

        onCleanup(() => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        })
    })
}

export const registerKeymap = (mode: KeymapMode) => {
    const eventBus = useEventBus()
    const modeKeymap = keymap[mode]
    for (const [k, v] of Object.entries(modeKeymap)) {
        useKeybind(k, () => eventBus.emit(v.command, v.payload))
    }
}
