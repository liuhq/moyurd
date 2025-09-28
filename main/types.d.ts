import type { EpubBook } from '#lib/epub-parser'
import type { Config as MoyurdConfig, DataCache } from '#lib/load-data'

export interface IElectronAPI {
    appQuit: () => Promise<void>
    appMin: () => Promise<void>
    appMax: () => Promise<void>
    appUnmax: () => Promise<void>
    cacheLoad: () => Promise<DataCache>
    cacheSave: (data: DataCache) => Promise<void>
    configLoad: () => Promise<MoyurdConfig>
    configSave: (data: MoyurdConfig) => Promise<void>
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
