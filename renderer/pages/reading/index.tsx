import {
    type Component,
    createEffect,
    createResource,
    createSignal,
    onCleanup,
    onMount,
    Show,
    Suspense,
} from 'solid-js'
import { useEventBus } from '../../context/EventBusProvider'
import { registerKeymap } from '../../hooks/useKeybind'
import {
    cache,
    filePath,
    showCommandLine,
    showKeymapHelp,
    showSearchLine,
} from '../../store'
import Content from './Content'
import Toc from './Toc'

const Reading: Component = () => {
    // const [content, setContent] = createSignal('')
    const eventBus = useEventBus()
    const cleanerId = 'reading'
    const [showToc, setShowToc] = createSignal(false)
    const [currentChapter, setCurrentChapter] = createSignal(
        cache.recent.find((rnt) => rnt.path == filePath())?.lastChapter ?? '',
    )

    let containerRef: HTMLDivElement

    const [book] = createResource(
        filePath,
        async (path: string) => await window.electronAPI.openFile(path),
    )

    onMount(() => {
        eventBus.on('toc', (show) => {
            if (show == undefined) {
                eventBus.emit('error', [
                    'MISSING_ARGUMENT',
                    'toc <true | false>',
                ])
                return
            }
            setShowToc(show)
        }, cleanerId)
        eventBus.on('loadnext', async () => {
            requestAnimationFrame(() =>
                containerRef!.scrollTo({
                    top: 0,
                    behavior: 'instant',
                })
            )
        }, cleanerId)
        eventBus.on('loadprev', async () => {
            requestAnimationFrame(() =>
                containerRef!.scrollTo({
                    top: 0,
                    behavior: 'instant',
                })
            )
        }, cleanerId)
    })

    onCleanup(() => eventBus.offHandlers(cleanerId))

    /// register shortcut keys
    createEffect(() => {
        if (
            showCommandLine()
            || showSearchLine()
            || showToc()
            || showKeymapHelp()
        ) return
        registerKeymap('reading')
    })

    createEffect(() => {
        if (showKeymapHelp()) return

        const scrollCleanerId = 'scroll'
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
        }, scrollCleanerId)
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
        }, scrollCleanerId)

        onCleanup(() => eventBus.offHandlers(scrollCleanerId))
    })

    createEffect(() => {
        if (book.error) {
            eventBus.emit('error', ['FILE_NOT_FOUND', book.error])
        }
    })

    return (
        <div ref={containerRef!} class='h-full w-full py-2 pl-2 overflow-auto'>
            <Suspense
                fallback={
                    <p class='w-full h-full place-content-center-safe text-3xl text-center'>
                        Loading...
                    </p>
                }
            >
                <Show when={book()}>
                    <Content
                        loading={book
                            .loading}
                        bookName={book()!
                            .bookName}
                        tocFlat={book()!
                            .tocFlat}
                        currentChapter={currentChapter()}
                        setCurrentChapter={setCurrentChapter}
                    />
                </Show>
                <Show when={showToc()}>
                    <Toc
                        toc={book()!
                            .tocFlat}
                        currentChapter={currentChapter()}
                        setCurrentChapter={setCurrentChapter}
                    />
                </Show>
            </Suspense>
        </div>
    )
}

export default Reading
