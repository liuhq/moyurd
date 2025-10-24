import type { Keymap } from '#config/keymap'
import { type Component, Index } from 'solid-js'
import Kbd from './Kbd'

const KeymapCate: Component<{ title: string; kc: Keymap }> = (props) => {
    return (
        <li>
            <p class='font-bold'>{props.title.toUpperCase()}</p>
            <ul class='flex flex-col gap-2 mt-2 ml-2'>
                <Index
                    each={Object
                        .entries(props.kc)}
                >
                    {(ke, _) => (
                        <li class='flex flex-wrap gap-4'>
                            <Kbd>{ke()[0]}</Kbd>
                            {ke()[1].desc}
                        </li>
                    )}
                </Index>
            </ul>
        </li>
    )
}

export default KeymapCate
