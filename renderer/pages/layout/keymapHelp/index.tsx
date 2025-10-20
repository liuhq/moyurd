import { keymap } from '#config/keymap'
import { useEventBus } from '#renderer/context/EventBusProvider'
import { registerKeymap } from '#renderer/hooks/useKeybind'
import { useLocation } from '@solidjs/router'
import { Match, onCleanup, onMount, Switch } from 'solid-js'
import { Portal } from 'solid-js/web'
import KeymapCate from './KeymapCate'

const KeymapHelp = () => {
    const eventBus = useEventBus()
    const cleanerId = 'keymap'
    const location = useLocation()

    let containerRef: HTMLUListElement

    onMount(() => {
        registerKeymap('keymap')

        eventBus.on('scrollup', (n) => {
            requestAnimationFrame(() => {
                if (n == 'top') {
                    containerRef!.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    })
                    return
                }
                let scrollDelta: number
                switch (n) {
                    case 'half':
                        scrollDelta = -document.documentElement.clientHeight / 2
                        break
                    case 'page':
                        scrollDelta = -document.documentElement.clientHeight
                        break
                    default:
                        {
                            const line = n ?? 1
                            const lineHeight = parseFloat(
                                window
                                    .getComputedStyle(containerRef!)
                                    .lineHeight,
                            )
                            scrollDelta = -lineHeight * line
                        }
                        break
                }
                containerRef!.scrollBy({
                    top: scrollDelta,
                    behavior: 'smooth',
                })
            })
        }, cleanerId)
        eventBus.on('scrolldown', (n) => {
            requestAnimationFrame(() => {
                if (n == 'bottom') {
                    containerRef!.scrollTo({
                        top: containerRef!.scrollHeight,
                        behavior: 'smooth',
                    })
                    return
                }
                let scrollDelta: number
                switch (n) {
                    case 'half':
                        scrollDelta = document.documentElement.clientHeight / 2
                        break
                    case 'page':
                        scrollDelta = document.documentElement.clientHeight
                        break
                    default:
                        {
                            const line = n ?? 1
                            const lineHeight = parseFloat(
                                window
                                    .getComputedStyle(containerRef!)
                                    .lineHeight,
                            )
                            scrollDelta = lineHeight * line
                        }
                        break
                }
                containerRef!.scrollBy({
                    top: scrollDelta,
                    behavior: 'smooth',
                })
            })
        }, cleanerId)
    })

    onCleanup(() => eventBus.offHandlers(cleanerId))

    return (
        <Portal>
            <div class='absolute top-0 left-0 w-full h-full bg-panel-mask z-30 flex place-content-center items-center'>
                <div class='no-drag w-4/5 h-4/5 py-4 pl-4 pr-1 bg-bg text-fg'>
                    <ul
                        ref={containerRef!}
                        class='w-full h-full pr-1 overflow-auto flex flex-col gap-8'
                    >
                        <KeymapCate
                            title='keymap help'
                            kc={keymap['keymap']}
                        />
                        <Switch>
                            <Match when={location.pathname == '/'}>
                                <KeymapCate
                                    title='booklist'
                                    kc={keymap['booklist']}
                                />
                            </Match>
                            <Match
                                when={location.pathname == '/reading'}
                            >
                                <KeymapCate
                                    title='reading'
                                    kc={keymap['reading']}
                                />
                                <KeymapCate
                                    title='toc'
                                    kc={keymap['toc']}
                                />
                            </Match>
                        </Switch>
                        <KeymapCate
                            title='global'
                            kc={keymap['global']}
                        />
                    </ul>
                </div>
            </div>
        </Portal>
    )
}

export default KeymapHelp
