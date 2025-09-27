import type { EpubBook } from '../lib/epub-parser'
import type { PersistentData } from '../lib/load-data'

export interface IElectronAPI {
    appQuit: () => Promise<void>
    appMin: () => Promise<void>
    appMax: () => Promise<void>
    appUnmax: () => Promise<void>
    cacheLoad: () => Promise<PersistentData>
    cacheSave: (data: PersistentData) => Promise<void>
    openFileDialog: () => Promise<string>
    openFile: (path: string) => Promise<EpubBook>
    closeFile: () => Promise<void>
    loadChapter: (id: string) => Promise<string>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
