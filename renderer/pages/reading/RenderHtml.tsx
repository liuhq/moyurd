import type { Component } from 'solid-js'

const epubElements = (element: HTMLElement) => {
    return element.querySelectorAll(
        'p, span, h1, h2, h3, li, blockquote, pre, b',
    ) as NodeListOf<HTMLElement>
}

const parseResourcePath = (element: HTMLElement) => {
    const imgTags = [
        ...element.querySelectorAll('img'),
        ...element.querySelectorAll('image'),
    ]
    const attr = ['src', 'xlink:href']
    for (const t of imgTags) {
        const src = attr
            .map((a) => [a, t.getAttribute(a)] as [string, string | null])
            .find(([_, a]) => a !== null) ?? null
        if (!src) continue
        if (window.electronAPI.platform == 'win32') {
            // `moyurd:///C:\path\to\file`
            t.setAttribute(src[0], `moyurd:///${src[1]}`)
        } else {
            // `moyurd:///path/to/file`
            t.setAttribute(src[0], `moyurd://${src[1]}`)
        }
    }
}

const parseInlineStyle = (element: NodeListOf<HTMLElement>) => {
    for (const c of element) {
        const style = c.getAttribute('style')
        if (!style) continue
        c.removeAttribute('style')
    }
}

const assignDataId = (element: NodeListOf<HTMLElement>) => {
    let count = 0
    for (const el of element) {
        if (!el.dataset.id) {
            el.dataset.id = `${el.tagName.toLowerCase()}:${count++}`
        }
    }
}

const processHtml = (htmlString: string) => {
    const div = document.createElement('div')
    div.innerHTML = htmlString

    const elements = epubElements(div)

    parseResourcePath(div)
    parseInlineStyle(elements)
    assignDataId(elements)

    return div.innerHTML
}

const RenderHtml: Component<
    { raw: string }
> = (props) => (
    <div
        class='w-full h-full place-content-center-safe *:[&_img,&_svg]:w-1/4 *:[&_img,&_svg]:m-auto'
        /* eslint-disable-next-line solid/no-innerhtml */
        innerHTML={processHtml(props.raw)}
    />
)

export default RenderHtml
