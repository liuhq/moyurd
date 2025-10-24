import { useConfig } from '#renderer/context/ConfigProvider'
import { useEventBus } from '#renderer/context/EventBusProvider'
import { applyTheme } from '#renderer/hooks/applyTheme'
import { registerKeymap } from '#renderer/hooks/useKeybind'
import {
    setShowKeymapHelp,
    showKeymapHelp,
    showSearchLine,
} from '#renderer/store'
import {
    createEffect,
    Match,
    onCleanup,
    onMount,
    type ParentComponent,
    Show,
    Switch,
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { Portal } from 'solid-js/web'
import KeymapHelp from './keymapHelp'
import Notification, { type NotificationItemContent } from './Notification'

const Layout: ParentComponent = (props) => {
    const moyurdConfig = useConfig()
    const eventBus = useEventBus()
    const cleanerId = 'app'
    const [notifications, setNotifications] = createStore<
        NotificationItemContent[]
    >([])

    onMount(() => {
        applyTheme(moyurdConfig)

        /// register global listener
        eventBus.on('quit', async () => {
            eventBus.emit('close')
            await window.electronAPI.appQuit()
        }, cleanerId)
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

        eventBus.on('info', (msg) => {
            if (!msg) return
            console.info(`${msg[0]}: ${msg[1]}`)
            setNotifications(produce((ns) =>
                ns.push({
                    level: 'INFO',
                    message: msg,
                })
            ))
        }, cleanerId)
        eventBus.on('warn', (msg) => {
            if (!msg) return
            console.warn(`${msg[0]}: ${msg[1]}`)
            setNotifications(produce((ns) =>
                ns.push({
                    level: 'WARN',
                    message: msg,
                })
            ))
        }, cleanerId)
        eventBus.on('error', (msg) => {
            if (!msg) return
            console.error(`${msg[0]}: ${msg[1]}`)
            setNotifications(produce((ns) =>
                ns.push({
                    level: 'ERROR',
                    message: msg,
                })
            ))
        }, cleanerId)
    })

    onCleanup(() => {
        eventBus.offHandlers(cleanerId)
    })

    /// register shortcut keys
    createEffect(() => {
        if (showSearchLine() || showKeymapHelp()) return
        registerKeymap('global')
    })

    /// close notification with ms timeout
    createEffect(() => {
        if (notifications.length <= 0) return
        window.setTimeout(
            () => setNotifications(produce((ns) => ns.shift())),
            5000,
        )
    })

    return (
        <>
            <div class='h-dvh w-dvw bg-bg text-fg'>
                {props.children}
                <Switch>
                    <Match when={showKeymapHelp()}>
                        <KeymapHelp />
                    </Match>
                </Switch>
                <Show when={notifications.length > 0}>
                    <Portal>
                        <Notification notifications={notifications} />
                    </Portal>
                </Show>
            </div>
        </>
    )
}

export default Layout
