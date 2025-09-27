import {
    createEffect,
    createSignal,
    Match,
    on,
    onCleanup,
    onMount,
    type ParentComponent,
    Switch,
} from 'solid-js'
import type { CommandEvents } from '../../../config/command'
import { keymap } from '../../../config/keymap'
import { useEventBus } from '../../context/EventBusProvider'
import { registerKeymap } from '../../hooks/useKeybind'
import {
    setShowCommandLine,
    setShowKeymapHelp,
    showCommandLine,
    showKeymapHelp,
    showSearchLine,
} from '../../store'
import Commandline from './commandline'
import KeymapHelp from './keymapHelp'

const Layout: ParentComponent = (props) => {
    const [command, setCommand] = createSignal<
        [string, CommandEvents[keyof CommandEvents]] | null
    >(null)
    const eventBus = useEventBus()
    const cleanerId = 'app'

    onMount(() => {
        /// register global listener
        eventBus.on('quit', window.electronAPI.appQuit, cleanerId)
        eventBus.on('win', async (state) => {
            switch (state) {
                case 'minimize':
                case 'min':
                    await window.electronAPI.appMin()
                    break
                case 'maximize':
                case 'max':
                    await window.electronAPI.appMax()
                    break
                case 'unmaximize':
                case 'unmax':
                    await window.electronAPI.appUnmax()
                    break
                default:
                    eventBus.emit('error', [
                        'MISSING_ARGUMENT',
                        'win <min(imize) | max(imize) | unmax(imize)>',
                    ])
                    break
            }
        }, cleanerId)
        eventBus.on('keymap', (show) => {
            if (show == undefined) {
                eventBus.emit('error', [
                    'MISSING_ARGUMENT',
                    'keymap <true | false>',
                ])
                return
            }
            if (show == showKeymapHelp()) return
            setShowKeymapHelp(show)
        }, cleanerId)
        eventBus.on('commandline', (show) => {
            if (show == undefined) {
                eventBus.emit('error', [
                    'MISSING_ARGUMENT',
                    'commandline <true | false>',
                ])
                return
            }
            if (show == showCommandLine() || showSearchLine()) return
            setShowCommandLine(show)
        }, cleanerId)
        eventBus.on('error', (msg) => {
            if (!msg) return
            console.error(`${msg[0]}: ${msg[1]}`)
        }, cleanerId)
    })

    onCleanup(() => {
        eventBus.offHandlers(cleanerId)
    })

    /// register shortcut keys
    createEffect(() => {
        if (showCommandLine() || showSearchLine()) return
        registerKeymap('global')
    })

    /// handle the command from commandline
    createEffect(on(command, (cmd) => {
        if (!cmd) return
        if (!cmd[0]) return
        if (cmd[0] == 'commandline' || cmd[0] == 'searchline') {
            eventBus.emit('error', [
                'COMMAND_NOT_FOUND',
                `${cmd[0]} is an internal command`,
            ])
            setCommand(null)
            return
        }
        eventBus.emit(cmd[0] as keyof CommandEvents, cmd[1])
        setCommand(null)
    }))

    return (
        <>
            <div class='h-dvh w-dvw bg-surface text-fg'>
                {props.children}
                <Switch>
                    <Match when={showCommandLine()}>
                        <Commandline commit={setCommand} />
                    </Match>
                    <Match when={showKeymapHelp()}>
                        <KeymapHelp keymap={keymap['global']} />
                    </Match>
                </Switch>
            </div>
        </>
    )
}

export default Layout
