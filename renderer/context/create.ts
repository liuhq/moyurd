import type { CommandEvents } from '#config/command'
import type { EventBus } from '#lib/event-bus'
import type { Config as MoyurdConfig, DataCache } from '#lib/load-data'
import { createContext } from 'solid-js'
import type { SetStoreFunction, Store } from 'solid-js/store'

export const EventBusContext = createContext<EventBus<CommandEvents>>()

export const CacheContext = createContext<
    [get: Store<DataCache>, set: SetStoreFunction<DataCache>]
>()
export const ConfigContext = createContext<MoyurdConfig>()
