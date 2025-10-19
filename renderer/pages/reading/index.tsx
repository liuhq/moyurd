import { useCache } from '#renderer/context/CacheProvider'
import { useEventBus } from '#renderer/context/EventBusProvider'
import { registerKeymap } from '#renderer/hooks/useKeybind'
import {
    filePath,
    showCommandLine,
    showKeymapHelp,
    showSearchLine,
} from '#renderer/store'
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
import Content from './Content'
import Toc from './Toc'

const Reading: Component = () => {
    const [cache] = useCache()
    const eventBus = useEventBus()
    const cleanerId = 'reading'
    const [showToc, setShowToc] = createSignal(false)
    const [currentChapter, setCurrentChapter] = createSignal(
        cache.recent.find((rnt) => rnt.path == filePath())?.lastChapter ?? '',
    )

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
        if (book.error) {
            eventBus.emit('error', ['FILE_NOT_FOUND', book.error])
        }
    })

    return (
        <div class='h-full w-full py-2 pl-2'>
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
