import { useEventBus } from '#renderer/context/EventBusProvider'
import { showKeymapHelp } from '#renderer/store'
import {
    children,
    createEffect,
    on,
    onCleanup,
    onMount,
    type ParentComponent,
    type Setter,
} from 'solid-js'

const getAnchor = (element: HTMLDivElement) => {
    const topPadding = element.getBoundingClientRect().top
    let target = undefined

    for (
        const el of element.querySelectorAll('[data-id]') as NodeListOf<
            HTMLElement
        >
    ) {
        const rect = el.getBoundingClientRect()
        if (rect.bottom - rect.height - topPadding >= 0) {
            target = el
            break
        }
    }

    if (!target) return undefined
    return target.dataset.id
}

const ScrollView: ParentComponent<
    {
        anchor: string | undefined
        setAnchor: Setter<string | undefined>
    }
> = (
    props,
) => {
    const eventBus = useEventBus()
    const resolved = children(() => props.children)
    const setAnchor = () => {
        clearTimeout(scrollTimeout)
        scrollTimeout = window.setTimeout(
            // eslint-disable-next-line solid/reactivity
            () => props.setAnchor(getAnchor(viewRef!)),
            100,
        )
    }

    let viewRef: HTMLDivElement
    let scrollTimeout: number | undefined

    onMount(() => viewRef!.addEventListener('scroll', setAnchor))
    onCleanup(() => viewRef!.removeEventListener('scroll', setAnchor))

    createEffect(on(resolved, () => {
        const target = viewRef!.querySelector(
            `[data-id="${props.anchor}"]`,
        )
        if (target && props.anchor) {
            target.scrollIntoView({
                block: 'start',
                behavior: 'instant',
            })
        } else {
            viewRef!.scrollTo({
                top: 0,
                behavior: 'instant',
            })
        }
    }))

    createEffect(() => {
        if (showKeymapHelp()) return

        const scrollCleanerId = 'reading-scrollview-scroll'
        eventBus.on('scrollup', (n) => {
            if (n == 'top') {
                viewRef!.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                })
            } else {
                let scrollDelta: number
                switch (n) {
                    case 'half':
                        scrollDelta = -document.documentElement.clientHeight
                            / 2
                        break
                    case 'page':
                        scrollDelta = -document.documentElement.clientHeight
                        break
                    default:
                        {
                            const line = n ?? 1
                            const lineHeight = parseFloat(
                                window
                                    .getComputedStyle(viewRef!)
                                    .lineHeight,
                            )
                            scrollDelta = -lineHeight * line
                        }
                        break
                }
                viewRef!.scrollBy({
                    top: scrollDelta,
                    behavior: 'smooth',
                })
            }
        }, scrollCleanerId)
        eventBus.on('scrolldown', (n) => {
            if (n == 'bottom') {
                viewRef!.scrollTo({
                    top: viewRef!.scrollHeight,
                    behavior: 'smooth',
                })
            } else {
                let scrollDelta: number
                switch (n) {
                    case 'half':
                        scrollDelta = document.documentElement.clientHeight
                            / 2
                        break
                    case 'page':
                        scrollDelta = document.documentElement.clientHeight
                        break
                    default:
                        {
                            const line = n ?? 1
                            const lineHeight = parseFloat(
                                window
                                    .getComputedStyle(viewRef!)
                                    .lineHeight,
                            )
                            scrollDelta = lineHeight * line
                        }
                        break
                }
                viewRef!.scrollBy({
                    top: scrollDelta,
                    behavior: 'smooth',
                })
            }
        }, scrollCleanerId)

        onCleanup(() => eventBus.offHandlers(scrollCleanerId))
    })

    return (
        <div
            ref={viewRef!}
            class='w-full h-full overflow-auto'
        >
            {props.children}
        </div>
    )
}

export default ScrollView
