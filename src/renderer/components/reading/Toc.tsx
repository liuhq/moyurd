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
import type { EpubTocFlat, EpubTocItem } from '../../../lib/epub-parser'
import { useEventBus } from '../../context/EventBusProvider'
import { registerKeymap } from '../../hooks/useKeybind'

const Dpf: Component<
    {
        item: EpubTocItem
        currentChapter: string
        setCurrentChapter: Setter<string>
    }
> = (props) => (
    <>
        <li
            class='select-none'
            onClick={(e) => {
                e.stopPropagation()
                props.setCurrentChapter(props.item.id)
            }}
        >
            <p
                class={props.item.id === props.currentChapter
                    ? 'bg-toc-dim'
                    : ''}
            >
                {props.item.label}
            </p>
            {props.item.children && props.item.children.length > 0 && (
                <ul>
                    <Index each={props.item.children}>
                        {(child) => (
                            <Dpf
                                item={child()}
                                currentChapter={props.currentChapter}
                                setCurrentChapter={props.setCurrentChapter}
                            />
                        )}
                    </Index>
                </ul>
            )}
        </li>
    </>
)

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
    let containerRef: HTMLDivElement

    onMount(() => {
        /// register shortcut keys
        registerKeymap('toc')

        currentRef!.scrollIntoView({
            behavior: 'instant',
            block: 'center',
        })

        setTarget(props.toc.idMap.get(props.currentChapter) ?? 0)

        eventBus.on(
            'tocprev',
            (n) =>
                setTarget((i) => {
                    if (typeof n == 'string') return 0
                    return Math.max(i - (n ?? 1), 0)
                }),
            cleanerId,
        )
        eventBus.on(
            'tocnext',
            (n) =>
                setTarget((i) => {
                    const last = untrack(() => props.toc.items.length - 1)
                    if (typeof n == 'string') return last
                    return Math.min(i + (n ?? 1), last)
                }),
            cleanerId,
        )
        eventBus.on('tocSelect', () => {
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
        current: 'bg-inverse-surface text-inverse-fg',
        select: 'bg-accent text-inverse-fg',
    }

    return (
        <Portal>
            <div class='absolute top-0 left-0 w-full h-full bg-panal-mask z-30 flex place-content-center items-center'>
                <div
                    ref={containerRef!}
                    class='w-4/5 h-4/5 py-4 pl-4 pr-1 bg-surface'
                >
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
                                                    === target()
                                                ? itemStyle.select
                                                : item().id
                                                        === props.currentChapter
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
