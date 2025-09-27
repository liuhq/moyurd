import { createContext } from 'solid-js'
import type { CommandEvents } from '../../config/command'
import type { EventBus } from '../../lib/event-bus'

export const EventBusContext = createContext<EventBus<CommandEvents>>()
