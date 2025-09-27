import type { EpubBook } from '#lib/epub-parser'
import { useEventBus } from '#renderer/context/EventBusProvider'
import { cache, filePath, setCache } from '#renderer/store'
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

const processHtml = (htmlString: string) => {
    const div = document.createElement('div')
    div.innerHTML = htmlString

    // resolve file path
    const imgTags = [
        ...div.querySelectorAll('img'),
        ...div.querySelectorAll('image'),
    ]
    const attr = ['src', 'xlink:href']
    for (const t of imgTags) {
        const src = attr
            .map((a) => [a, t.getAttribute(a)] as [string, string | null])
            .find(([_, a]) => a !== null) ?? null
        if (!src) continue
        t.setAttribute(src[0], `moyurd://${src[1]}`)
    }

    // remove inline style
    for (const c of div.children) {
        const style = c.getAttribute('style')
        if (!style) continue
        c.removeAttribute('style')
    }
    return div.innerHTML
}

const RenderHtml: Component<
    { raw: string }
> = (props) => (
    <div
        class='w-full h-full place-content-center-safe *:[&_img,&_svg]:w-1/4 *:[&_img,&_svg]:m-auto'
        /* eslint-disable-next-line solid/no-innerhtml */
        innerHTML={props.raw}
    />
)

const Content: Component<
    {
        loading: boolean
        bookName: string
        tocFlat: EpubBook['tocFlat']
        currentChapter: string
        setCurrentChapter: Setter<string>
    }
> = (props) => {
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
    const processedContent = () => {
        const contentCopy = content()
        if (!contentCopy) return ''
        return processHtml(contentCopy)
    }

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
                    } else {
                        rnt.push({
                            path: filePath(),
                            bookName: untrack(() => props.bookName),
                            lastChapter: currentChapterCopy,
                            lastRead: new Date().toISOString(),
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

    onCleanup(() => {
        eventBus.offHandlers(cleanerId)
    })

    return (
        <Suspense
            fallback={<RenderHtml raw={processHtml(lastContent())} />}
        >
            <Show
                when={props.currentChapter !== ''}
                fallback={
                    <div class='w-full h-full place-content-center-safe text-3xl text-center'>
                        {props.bookName}
                    </div>
                }
            >
                <RenderHtml raw={processedContent()} />
            </Show>
        </Suspense>
    )
}

export default Content
