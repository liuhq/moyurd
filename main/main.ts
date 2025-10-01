import defaultConfig from '#config/config.default.json'
import { type EpubFile, parseEpub } from '#lib/epub-parser'
import {
    type Config as MoyurdConfig,
    type DataCache,
    loadCache as _loadCache,
    loadConfig as _loadConfig,
    saveCache as _saveCache,
    saveConfig as _saveConfig,
} from '#lib/load-data'
import { app, BrowserWindow, dialog, ipcMain, net, protocol } from 'electron'
import started from 'electron-squirrel-startup'
import { join } from 'node:path'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit()
}

// Debug
app.commandLine.appendSwitch('remote-debugging-port', '9229')

const epubMap = new Map<number, EpubFile>()

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        resizable: true,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
        },
    })

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    } else {
        mainWindow.loadFile(
            join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
            ),
        )
    }

    // Open the DevTools
    if (import.meta.env.DEV) mainWindow.webContents.openDevTools()

    return mainWindow
}

const cachePath = join(app.getPath('userData'), 'cache.json')
const configPath = join(app.getPath('userData'), 'config.json')

const loadCache = async (): Promise<DataCache> => {
    const data = await _loadCache(cachePath, { recent: [] })
    return data
}
const saveCache = async (data: DataCache) => {
    await _saveCache(cachePath, data)
}

const loadConfig = async (): Promise<MoyurdConfig> => {
    const data = await _loadConfig(configPath, defaultConfig)
    return data
}
const saveConfig = async (data: MoyurdConfig) => {
    await _saveConfig(cachePath, data)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    const win = createWindow()

    protocol.handle('moyurd', (req) => {
        const filePath = req.url.replace('moyurd://', 'file://')
        return net.fetch(filePath)
    })

    ipcMain.handle('app:quit', () => {
        for (const epub of epubMap.values()) {
            epub.destroy()
        }
        app.quit()
    })
    ipcMain.handle('app:min', () => {
        if (!win.minimizable) return
        win.minimize()
    })
    ipcMain.handle('app:max', () => {
        if (!win.maximizable) return
        win.maximize()
    })
    ipcMain.handle('app:unmax', () => {
        if (!win.isMaximized()) return
        win.unmaximize()
    })
    ipcMain.handle('cache:load', async () => await loadCache())
    ipcMain.handle(
        'cache:save',
        async (_, data: DataCache) => await saveCache(data),
    )
    ipcMain.handle('config:load', async () => await loadConfig())
    ipcMain.handle(
        'config:save',
        async (_, data: MoyurdConfig) => await saveConfig(data),
    )
    ipcMain.handle('dialog:openFile', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(win, {
            filters: [{
                name: 'epub',
                extensions: ['epub'],
            }],
            properties: ['openFile'],
        })
        if (canceled) return ''
        return filePaths[0]
    })
    ipcMain.handle('data:open', async (_, path: string) => {
        if (epubMap.has(win.id)) {
            epubMap.get(win.id)?.destroy()
            epubMap.delete(win.id)
        }
        // const EXAMPLE_EPUB_PATH = './example/長月達平 - Re：從零開始的異世界生活 01.epub'
        const EXAMPLE_RESOURCE_SAVE_PATH = './example/images'
        const [parsed, epub] = await parseEpub(path, {
            resourceSavePath: EXAMPLE_RESOURCE_SAVE_PATH,
        })
        epubMap.set(win.id, epub)
        return parsed
    })
    ipcMain.handle('data:close', () => {
        if (!epubMap.has(win.id)) return
        epubMap.get(win.id)?.destroy()
        epubMap.delete(win.id)
    })
    ipcMain.handle('data:load-chapter', async (_, id: string) => {
        const epub = epubMap.get(win.id)
        if (!epub) return 'INSTANCE_NOT_FOUND'
        const { html } = await epub.loadChapter(id)
        return html
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        for (const epub of epubMap.values()) {
            epub.destroy()
        }
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length == 0) {
        createWindow()
    }
})
