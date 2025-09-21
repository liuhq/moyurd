import { useNavigate } from '@solidjs/router'
import {
    type Component,
    createEffect,
    createResource,
    Index,
    onCleanup,
    onMount,
} from 'solid-js'
import { useEventBus } from '../../context/EventBusProvider'
import { registerKeymap } from '../../hooks/useKeybind'
import {
    cache,
    setCache,
    setFilePath,
    showCommandLine,
    showSearchLine,
} from '../../store'
import BookItem from './BookItem'

const BookList: Component = () => {
    const navigate = useNavigate()
    const eventBus = useEventBus()
    const cleanerId = 'booklist'

    onMount(() => {
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
    })

    onCleanup(() => {
        eventBus.offHandlers(cleanerId)
    })

    /// register shortcut keys
    createEffect(() => {
        if (showCommandLine() || showSearchLine()) return
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

    return (
        <div class='h-full w-full p-8'>
            <ul class='flex flex-col gap-2 w-full'>
                <Index each={cache.recent}>
                    {(item, index) => <BookItem index={index} item={item()} />}
                </Index>
            </ul>
        </div>
    )
}

export default BookList
