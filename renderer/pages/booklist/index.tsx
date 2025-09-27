import { useNavigate } from '@solidjs/router'
import {
    type Component,
    createEffect,
    createResource,
    createSignal,
    Index,
    onCleanup,
    onMount,
    untrack,
} from 'solid-js'
import { useEventBus } from '../../context/EventBusProvider'
import { registerKeymap } from '../../hooks/useKeybind'
import {
    cache,
    filePath,
    setCache,
    setFilePath,
    showCommandLine,
    showKeymapHelp,
    showSearchLine,
} from '../../store'
import BookItem from './BookItem'

const BookList: Component = () => {
    const navigate = useNavigate()
    const eventBus = useEventBus()
    const cleanerId = 'booklist'
    const [target, setTarget] = createSignal(0)

    const targetRef: HTMLLIElement[] = []

    onMount(() => {
        const closeBookIndex = cache.recent.findIndex((b) =>
            b.path == filePath()
        )
        if (closeBookIndex > 0) setTarget(closeBookIndex)

        eventBus.on('openfiledialog', async () => {
            const path = await window.electronAPI.openFileDialog()
            eventBus.emit('open', path)
        }, cleanerId)
        eventBus.on('open', async (path) => {
            if (!path) {
                eventBus.emit('error', ['MISSING_ARGUMENT', 'open <FILE_PATH>'])
                return
            }
            if (/^(0|[1-9]\d*)$/.test(path)) {
                const fpath = cache.recent.at(+path)?.path
                if (fpath) {
                    setFilePath(fpath)
                    navigate('reading')
                }
            } else {
                setFilePath(path)
                navigate('reading')
            }
        }, cleanerId)
        eventBus.on('bookprev', (n) => {
            setTarget((i) => {
                if (typeof n == 'string' && n == 'top') return 0
                return Math.max(i - (n ?? 1), 0)
            })
        }, cleanerId)
        eventBus.on('booknext', (n) => {
            setTarget((i) => {
                const last = cache.recent.length - 1
                if (typeof n == 'string' && n == 'bottom') return last
                return Math.min(i + (n ?? 1), last)
            })
        }, cleanerId)
        eventBus.on('bookselect', () => {
            const t = untrack(target)
            const path = cache.recent[t].path
            eventBus.emit('open', path)
        }, cleanerId)
    })

    onCleanup(() => eventBus.offHandlers(cleanerId))

    /// register shortcut keys
    createEffect(() => {
        if (showCommandLine() || showSearchLine() || showKeymapHelp()) return
        registerKeymap('booklist')
    })

    const [cacheRes] = createResource(async () =>
        await window.electronAPI.cacheLoad()
    )

    createEffect(() => {
        if (cacheRes.error) return
        const cacheResCopy = cacheRes()
        if (!cacheResCopy) return
        setCache(cacheResCopy)
    })

    createEffect(() => {
        targetRef[target()]?.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
        })
    })

    return (
        <div class='h-full w-full p-8'>
            <ul class='w-full h-full pr-1 flex flex-col gap-2 overflow-auto'>
                <Index each={cache.recent}>
                    {(item, index) => (
                        <BookItem
                            item={item()}
                            selected={target() == index}
                            ref={(el) => {
                                targetRef[index] = el
                            }}
                        />
                    )}
                </Index>
            </ul>
        </div>
    )
}

export default BookList
