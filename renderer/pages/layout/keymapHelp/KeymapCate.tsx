import { type Component, Index } from 'solid-js'
import type { Keymap } from '../../../../config/keymap'

const KeymapCate: Component<{ title: string; kc: Keymap }> = (props) => {
    return (
        <li>
            <p>{props.title.toUpperCase()}</p>
            <ul class='flex flex-col gap-2 mt-1'>
                <Index
                    each={Object
                        .entries(props.kc)}
                >
                    {(ke, _) => (
                        <li class='flex flex-wrap gap-2'>
                            <kbd class='px-1 border border-b-4 rounded-sm text-xs'>
                                {ke()[0]}
                            </kbd>
                            {ke()[1].desc}
                        </li>
                    )}
                </Index>
            </ul>
        </li>
    )
}

export default KeymapCate
