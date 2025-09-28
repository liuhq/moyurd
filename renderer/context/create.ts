import type { CommandEvents } from '#config/command'
import type { EventBus } from '#lib/event-bus'
import type { Config as MoyurdConfig } from '#lib/load-data'
import { createContext } from 'solid-js'

export const EventBusContext = createContext<EventBus<CommandEvents>>()

export const ConfigContext = createContext<MoyurdConfig>()
