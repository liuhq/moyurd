import type { EpubBook } from '#lib/epub-parser'
import { useCache } from '#renderer/context/CacheProvider'
import { useEventBus } from '#renderer/context/EventBusProvider'
import { filePath } from '#renderer/store'
import { useNavigate } from '@solidjs/router'
import {
    type Component,
    createResource,
    createSignal,
    onCleanup,
    onMount,
    type Setter,
    Show,
    Suspense,
    untrack,
} from 'solid-js'
import { produce, unwrap } from 'solid-js/store'
import RenderHtml from './RenderHtml'
import ScrollView from './ScrollView'

const Content: Component<
    {
        loading: boolean
        bookName: string
        tocFlat: EpubBook['tocFlat']
        currentChapter: string
        setCurrentChapter: Setter<string>
    }
> = (props) => {
    const [cache, setCache] = useCache()
    const eventBus = useEventBus()
    const cleanerId = 'reading-content'
    const navigate = useNavigate()
    const [lastContent, setLastContent] = createSignal('')
    const [content] = createResource(
        () => props.currentChapter,
        async (chapter: string) => {
            if (untrack(() => props.loading)) return ''
            if (chapter == '') return ''
            else return await window.electronAPI.loadChapter(chapter)
        },
    )
    const anchor = () => {
        const current = cache.recent.find((rnt) => rnt.path == filePath())
        if (!current) return undefined
        if (current.lastChapter != props.currentChapter) return undefined
        return current.lastAnchor
    }
    const [cacheAnchor, setCacheAnchor] = createSignal(
        anchor(),
    )

    onMount(() => {
        eventBus.on('close', async () => {
            setCache(
                'recent',
                produce((rnt) => {
                    const currentBook = rnt.find((b) =>
                        b.path == untrack(filePath)
                    )
                    const currentChapterCopy = untrack(() =>
                        props.currentChapter
                    )
                    if (currentBook) {
                        currentBook.lastRead = new Date().toISOString()
                        currentBook.lastChapter = currentChapterCopy
                        const ind = untrack(() =>
                            props.tocFlat.idMap.get(currentChapterCopy)
                                ?? 1
                        )
                        currentBook.lastAnchor = untrack(cacheAnchor)
                        currentBook.progress = untrack(() =>
                            ind
                            / (props.tocFlat.items.length - 1)
                        )
                    } else {
                        rnt.push({
                            path: filePath(),
                            bookName: untrack(() => props.bookName),
                            lastChapter: currentChapterCopy,
                            lastRead: new Date().toISOString(),
                            lastAnchor: untrack(cacheAnchor),
                            progress: 0,
                        })
                    }
                }),
            )
            await window.electronAPI.cacheSave(unwrap(cache))
            await window.electronAPI.closeFile()
            navigate('/')
        }, cleanerId)
        eventBus.on('loadnext', async () => {
            const tocFlat = untrack(() => props.tocFlat)
            const currentChapter = untrack(() => props.currentChapter)
            if (currentChapter == '') {
                untrack(() => props.setCurrentChapter)(tocFlat.items[0].id)
                return
            }
            const index = tocFlat.idMap.get(currentChapter) ?? 0
            const nextIndex = Math.min(
                index + 1,
                tocFlat.items.length - 1,
            )
            const item = tocFlat.items[nextIndex]
            untrack(() => props.setCurrentChapter)(item.id)
            setLastContent(content() ?? '')
        }, cleanerId)
        eventBus.on('loadprev', async () => {
            const tocFlat = untrack(() => props.tocFlat)
            const currentChapter = untrack(() => props.currentChapter)
            if (currentChapter == '') return
            const index = tocFlat.idMap.get(currentChapter) ?? 0
            const prevIndex = index - 1
            if (prevIndex < 0) {
                // return book name page
                untrack(() => props.setCurrentChapter)('')
            } else {
                const item = tocFlat.items[prevIndex]
                untrack(() => props.setCurrentChapter)(item.id)
            }
            setLastContent(content() ?? '')
        }, cleanerId)
    })

    onCleanup(() => eventBus.offHandlers(cleanerId))

    return (
        <ScrollView
            anchor={anchor()}
            setAnchor={setCacheAnchor}
        >
            <Suspense
                fallback={<RenderHtml raw={lastContent()} />}
            >
                <Show
                    when={props.currentChapter !== ''}
                    fallback={
                        <div class='w-full h-full place-content-center-safe text-3xl text-center'>
                            {props.bookName}
                        </div>
                    }
                >
                    <RenderHtml raw={content() ?? ''} />
                </Show>
            </Suspense>
        </ScrollView>
    )
}

export default Content
