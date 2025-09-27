import type { EpubTocFlat } from '#lib/epub-parser'
import { useEventBus } from '#renderer/context/EventBusProvider'
import { registerKeymap } from '#renderer/hooks/useKeybind'
import {
    type Component,
    createEffect,
    createSignal,
    Index,
    onCleanup,
    onMount,
    type Setter,
    Show,
    untrack,
} from 'solid-js'
import { Portal } from 'solid-js/web'

const Toc: Component<
    {
        toc: EpubTocFlat
        currentChapter: string
        setCurrentChapter: Setter<string>
    }
> = (props) => {
    const eventBus = useEventBus()
    const cleanerId = 'toc'
    const [target, setTarget] = createSignal(0)

    let currentRef: HTMLLIElement
    const targetRef: HTMLLIElement[] = []

    onMount(() => {
        /// register shortcut keys
        registerKeymap('toc')

        currentRef!.scrollIntoView({
            behavior: 'instant',
            block: 'center',
        })

        const currentChapterIndex = props.toc.idMap.get(props.currentChapter)
        if (currentChapterIndex && currentChapterIndex > 0) {
            setTarget(currentChapterIndex)
        }

        eventBus.on(
            'tocprev',
            (n) =>
                setTarget((i) => {
                    if (typeof n == 'string' && n == 'top') return 0
                    return Math.max(i - (n ?? 1), 0)
                }),
            cleanerId,
        )
        eventBus.on(
            'tocnext',
            (n) =>
                setTarget((i) => {
                    const last = untrack(() => props.toc.items.length - 1)
                    if (typeof n == 'string' && n == 'bottom') return last
                    return Math.min(i + (n ?? 1), last)
                }),
            cleanerId,
        )
        eventBus.on('tocselect', () => {
            const t = untrack(target)
            const p = untrack(() => props)
            p.setCurrentChapter(p.toc.items.at(t)?.id ?? '')
            eventBus.emit('toc', false)
        }, cleanerId)
    })

    onCleanup(() => eventBus.offHandlers(cleanerId))

    createEffect(() => {
        targetRef[target()].scrollIntoView({
            behavior: 'instant',
            block: 'center',
        })
    })

    const itemStyle = {
        current: 'bg-accent text-inverse-fg',
        select: 'bg-inverse-surface text-inverse-fg',
    }

    return (
        <Portal>
            <div class='absolute top-0 left-0 w-full h-full bg-panal-mask z-30 flex place-content-center items-center'>
                <div class='w-4/5 h-4/5 py-4 pl-4 pr-1 bg-surface'>
                    <Show when={props.toc} fallback={<div>Loading...</div>}>
                        <ul class='w-full h-full pr-1 overflow-auto'>
                            <Index each={props.toc.items}>
                                {(item, index) => (
                                    <li
                                        ref={(el) => {
                                            if (
                                                item().id
                                                    == props.currentChapter
                                            ) currentRef = el
                                            targetRef[index] = el
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            props.setCurrentChapter(
                                                item().id,
                                            )
                                        }}
                                        class={`w-full p-1 select-none ${
                                            (props
                                                    .toc
                                                    .idMap
                                                    .get(item().id) ?? 0)
                                                    == target()
                                                ? itemStyle.select
                                                : item().id
                                                        == props.currentChapter
                                                ? itemStyle.current
                                                : ''
                                        }`}
                                    >
                                        {item().label}
                                    </li>
                                )}
                            </Index>
                        </ul>
                    </Show>
                </div>
            </div>
        </Portal>
    )
}

export default Toc
