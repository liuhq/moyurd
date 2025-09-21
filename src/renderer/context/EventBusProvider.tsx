import { useContext } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import type { CommandEvents } from '../../config/command'
import { EventBus } from '../../lib/event-bus'
import { EventBusContext } from './create'

export const EventBusProvider: ParentComponent = (props) => {
    const eventBus = new EventBus<CommandEvents>()
    return (
        <EventBusContext.Provider value={eventBus}>
            {props.children}
        </EventBusContext.Provider>
    )
}

export const useEventBus = () => {
    const context = useContext(EventBusContext)
    if (!context) {
        throw new Error("can't find EventBusContext")
    }
    return context
}
