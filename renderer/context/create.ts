import type { CommandEvents } from '#config/command'
import type { EventBus } from '#lib/event-bus'
import { createContext } from 'solid-js'

export const EventBusContext = createContext<EventBus<CommandEvents>>()
