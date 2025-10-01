import type { BookCache } from '#lib/load-data'
import { setFilePath } from '#renderer/store'
import { A } from '@solidjs/router'
import { type Component, type Ref } from 'solid-js'

const formatDT = (datetime: string) => {
    const dt = new Date(datetime)
    const y = dt.getFullYear()
    const mo = dt.getMonth() + 1
    const d = dt.getDate()
    const h = dt.getHours()
    const mi = dt.getMinutes()
    const s = dt.getSeconds()
    return `${y}-${mo}-${d} ${h}:${mi}:${s}`
}

const formatProgress = (progress: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(progress)
}

const BookItem: Component<
    {
        item: BookCache
        selected: boolean
        ref: Ref<HTMLLIElement>
    }
> = (props) => {
    return (
        <li
            ref={props.ref}
            class='py-1 px-4 flex items-center gap-2'
            classList={{ 'bg-inverse-bg text-inverse-fg': props.selected }}
        >
            <div class='flex-1'>
                <p>
                    <A
                        href='reading'
                        onClick={() => {
                            setFilePath(props.item.path)
                        }}
                    >
                        {props.item.bookName}
                    </A>
                </p>
                <p
                    class={`texs-sm ${
                        props.selected
                            ? 'text-inverse-fg'
                            : 'text-sub-fg'
                    }`}
                >
                    {props.item.path}
                </p>
            </div>
            <div class='flex items-center gap-2 *:font-mono *:text-sm'>
                <p class='w-fit'>
                    {formatDT(props.item.lastRead)}
                </p>
                <p class='w-9 text-end'>
                    {formatProgress(props.item.progress)}
                </p>
            </div>
        </li>
    )
}

export default BookItem
