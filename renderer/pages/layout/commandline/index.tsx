import type { Component, Setter } from 'solid-js'
import { onCleanup, onMount, untrack } from 'solid-js'
import { Portal } from 'solid-js/web'
import {
    type CommandEvents,
    matchCommand,
    parseCommand,
} from '../../../../config/command'
import { useEventBus } from '../../../context/EventBusProvider'
import { registerKeymap } from '../../../hooks/useKeybind'
import { setShowCommandLine } from '../../../store'

const Commandline: Component<
    { commit: Setter<[string, CommandEvents[keyof CommandEvents]] | null> }
> = (props) => {
    const eventBus = useEventBus()
    const cleanerId = 'commandline'

    let inputRef: HTMLInputElement

    onMount(() => {
        inputRef!.focus()

        /// register shortcut keys
        registerKeymap('commandline')

        eventBus.on('commit', () => {
            if (inputRef!.value) {
                const parsed = parseCommand(inputRef!.value)
                if (!matchCommand(parsed[0])) {
                    parsed[0] = 'error'
                    parsed[1] = ['COMMAND_NOT_FOUND', parsed[0]]
                }
                untrack(() => props.commit(parsed))
            }
            setShowCommandLine(false)
        }, cleanerId)
    })

    onCleanup(() => {
        eventBus.offHandlers(cleanerId)
    })

    return (
        <Portal>
            <div class='fixed bg-surface w-dvw bottom-0 p-1 z-40'>
                <input
                    type='text'
                    ref={inputRef!}
                    class='bg-surface w-full outline-accent caret-accent'
                />
            </div>
        </Portal>
    )
}

export default Commandline
