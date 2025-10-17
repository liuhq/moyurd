import defaultConfig from '#config/config.default.json'
import { type EpubFile, parseEpub } from '#lib/epub-parser'
import {
    type Config as MoyurdConfig,
    type DataCache,
    loadCache,
    loadConfig,
    saveCache,
    saveConfig,
} from '#lib/load-data'
import {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    nativeImage,
    net,
    protocol,
} from 'electron'
import started from 'electron-squirrel-startup'
import { join } from 'node:path'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit()
}

// Debug
if (import.meta.env.DEV) {
    app.commandLine.appendSwitch('remote-debugging-port', '9229')
}

const ICON_FILE = 'icon.png'
const ICON_PATH = app.isPackaged
    ? join(process.resourcesPath, 'extraResources', ICON_FILE)
    : join(__dirname, '../images', ICON_FILE)
const APP_ICON = nativeImage.createFromPath(ICON_PATH)

const CACHE_PATH = join(app.getPath('userData'), 'cache.json')
const CONFIG_PATH = join(app.getPath('userData'), 'config.json')
const TEMP_PATH = join(app.getPath('userData'), 'temp_resource/')

const EPUB_MAP = new Map<number, EpubFile>()

const createWindow = async (config: {
    bg: string
}) => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: config.bg,
        frame: false,
        resizable: true,
        icon: APP_ICON,
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    const config = await loadConfig(CONFIG_PATH, defaultConfig)

    const win = await createWindow({ bg: config.colors.bg })

    protocol.handle('moyurd', (req) => {
        const filePath = req.url.replace('moyurd://', 'file://')
        return net.fetch(filePath)
    })

    ipcMain.handle('app:quit', () => {
        for (const epub of EPUB_MAP.values()) {
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
    ipcMain.handle(
        'cache:load',
        async () => await loadCache(CACHE_PATH, { recent: [] }),
    )
    ipcMain.handle(
        'cache:save',
        async (_, data: DataCache) => await saveCache(CACHE_PATH, data),
    )
    ipcMain.handle('config:load', async () => config)
    ipcMain.handle(
        'config:save',
        async (_, data: MoyurdConfig) => await saveConfig(CONFIG_PATH, data),
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
        if (EPUB_MAP.has(win.id)) {
            EPUB_MAP.get(win.id)?.destroy()
            EPUB_MAP.delete(win.id)
        }
        const [parsed, epub] = await parseEpub(path, {
            resourceSavePath: TEMP_PATH,
        })
        EPUB_MAP.set(win.id, epub)
        return parsed
    })
    ipcMain.handle('data:close', () => {
        if (!EPUB_MAP.has(win.id)) return
        EPUB_MAP.get(win.id)?.destroy()
        EPUB_MAP.delete(win.id)
    })
    ipcMain.handle('data:load-chapter', async (_, id: string) => {
        const epub = EPUB_MAP.get(win.id)
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
        for (const epub of EPUB_MAP.values()) {
            epub.destroy()
        }
        app.quit()
    }
})

app.on('activate', async () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length == 0) {
        const config = await loadConfig(CONFIG_PATH, defaultConfig)
        await createWindow({ bg: config.colors.bg })
    }
})
