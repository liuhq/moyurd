import { contextBridge, ipcRenderer } from 'electron'
import type { IElectronAPI } from './types'

const electronAPI: IElectronAPI = {
    appQuit: () => ipcRenderer.invoke('app:quit'),
    appMin: () => ipcRenderer.invoke('app:min'),
    appMax: () => ipcRenderer.invoke('app:max'),
    appUnmax: () => ipcRenderer.invoke('app:unmax'),
    cacheLoad: () => ipcRenderer.invoke('cache:load'),
    cacheSave: (data) => ipcRenderer.invoke('cache:save', data),
    configLoad: () => ipcRenderer.invoke('config:load'),
    configSave: (data) => ipcRenderer.invoke('config:save', data),
    openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
    openFile: (path) => ipcRenderer.invoke('data:open', path),
    closeFile: () => ipcRenderer.invoke('data:close'),
    loadChapter: (id) => ipcRenderer.invoke('data:load-chapter', id),
    platform: process.platform,
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
