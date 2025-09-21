import { A } from '@solidjs/router'
import type { Component } from 'solid-js'
import type { BookCache } from '../../../lib/load-data'
import { setFilePath } from '../../store'

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

const BookItem: Component<{ index: number; item: BookCache }> = (props) => {
    return (
        <li class='flex items-center gap-2'>
            <div class='w-8 text-center text-2xl text-accent'>
                {props.index}
            </div>
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
                <p class='text-sm text-sub-fg'>{props.item.path}</p>
            </div>
            <div class='flex items-center gap-4 *:w-fit'>
                <p class='text-sm'>{formatDT(props.item.lastRead)}</p>
                <p>{formatProgress(props.item.progress)}</p>
            </div>
        </li>
    )
}

export default BookItem
