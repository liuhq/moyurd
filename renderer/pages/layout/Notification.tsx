import type { ErrorMessage, InfoMessage, WarnMessage } from '#config/command'
import { type Component, For } from 'solid-js'
import type { Store } from 'solid-js/store'

export type NotificationItemContent = {
    level: 'INFO' | 'WARN' | 'ERROR'
    message: [InfoMessage | WarnMessage | ErrorMessage, string]
}

type NotificationProps = {
    notifications: Store<NotificationItemContent[]>
}

const NotificationItem: Component<NotificationItemContent> = (props) => {
    const levelStyles = {
        INFO: 'font-bold text-info',
        WARN: 'font-bold text-warn',
        ERROR: 'font-bold text-error',
    }
    return (
        <section class='text-sm p-1 border border-border rounded-popup-radius bg-floating-bg text-fg'>
            <header class='flex gap-popup-gap border-b border-b-border pb-1 mb-1'>
                <span class={levelStyles[props.level]}>{props.level}</span>
                <span class='text-sub-fg'>{props.message[0]}</span>
            </header>
            <main>
                {props.message[1]}
            </main>
        </section>
    )
}

const Notification: Component<NotificationProps> = (props) => {
    return (
        <div class='flex flex-col-reverse gap-popup-gap w-popup-w fixed bottom-popup-gap right-popup-gap'>
            <For each={props.notifications}>
                {(item) => (
                    <NotificationItem
                        level={item.level}
                        message={item.message}
                    />
                )}
            </For>
        </div>
    )
}

export default Notification
