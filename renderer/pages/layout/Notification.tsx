import type { ErrorMessage, InfoMessage, WarnMessage } from '#config/command'
import { type Component, For } from 'solid-js'
import type { Store } from 'solid-js/store'

export type NotifyItem = {
    level: 'INFO' | 'WARN' | 'ERROR'
    message: [InfoMessage | WarnMessage | ErrorMessage, string]
}

type NotificationProps = {
    notify: Store<NotifyItem[]>
}

const NtfItem: Component<NotifyItem> = (props) => {
    const levelStyles = {
        INFO: 'font-bold text-info',
        WARN: 'font-bold text-warn',
        ERROR: 'font-bold text-error',
    }
    return (
        <section class='text-sm p-1 border border-popup-border rounded-popup-radius bg-popup-bg text-fg'>
            <header class={levelStyles[props.level]}>{props.level}</header>
            <main>{props.message}</main>
        </section>
    )
}

const Notification: Component<NotificationProps> = (props) => {
    return (
        <div class='flex flex-col-reverse gap-popup-gap w-popup-w fixed bottom-popup-gap right-popup-gap'>
            <For each={props.notify}>
                {(item) => (
                    <NtfItem
                        level={item.level}
                        message={item.message}
                    />
                )}
            </For>
        </div>
    )
}

export default Notification
