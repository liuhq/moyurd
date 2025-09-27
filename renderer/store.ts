import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import type { PersistentData } from '../lib/load-data'

export const [showCommandLine, setShowCommandLine] = createSignal(false)
export const [showSearchLine, setShowSearchLine] = createSignal(false)

export const [filePath, setFilePath] = createSignal('')

export const [cache, setCache] = createStore<PersistentData>({ recent: [] })
