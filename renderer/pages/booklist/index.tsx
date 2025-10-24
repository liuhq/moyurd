import { useCache } from '#renderer/context/CacheProvider'
import { useEventBus } from '#renderer/context/EventBusProvider'
import { registerKeymap } from '#renderer/hooks/useKeybind'
import { useNavigate } from '@solidjs/router'
import {
    type Component,
    createEffect,
    createSignal,
    Index,
    onCleanup,
    onMount,
    Show,
    untrack,
} from 'solid-js'
import {
    filePath,
    setFilePath,
    showKeymapHelp,
    showSearchLine,
} from '../../store'
import Kbd from '../layout/keymapHelp/Kbd'
import BookItem from './BookItem'

const BookList: Component = () => {
    const navigate = useNavigate()
    const [cache] = useCache()
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
        if (showSearchLine() || showKeymapHelp()) return
        registerKeymap('booklist')
    })

    createEffect(() => {
        targetRef[target()]?.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
        })
    })

    return (
        <div class='h-full w-full p-8 flex flex-col gap-2'>
            <header class='w-full flex flex-wrap items-end gap-2'>
                <h1 class='text-2xl'>Recent Books</h1>
                <span class='text-sub-fg text-sm italic'>
                    Press <Kbd>Shift+/</Kbd> to to get help with shortcut keys
                </span>
            </header>
            <Show
                when={cache.recent.length > 0}
                fallback={<div class='text-sub-fg italic'>No book history</div>}
            >
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
            </Show>
        </div>
    )
}

export default BookList
