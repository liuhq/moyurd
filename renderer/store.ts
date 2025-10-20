import { createSignal } from 'solid-js'

export const [showKeymapHelp, setShowKeymapHelp] = createSignal(false)
export const [showSearchLine, setShowSearchLine] = createSignal(false)

export const [filePath, setFilePath] = createSignal('')
