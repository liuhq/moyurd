import type { ParentComponent } from 'solid-js'

const Kbd: ParentComponent = (props) => {
    return (
        <kbd class='px-1 border border-b-4 border-border rounded-sm text-xs not-italic'>
            {props.children}
        </kbd>
    )
}

export default Kbd
