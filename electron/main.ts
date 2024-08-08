import {app, BrowserWindow, globalShortcut, Menu, ipcMain, Tray} from 'electron'
//import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

//const require: NodeRequire = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

// 构建的目录结构
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let mainWin: any

//判断只允许开启一个窗口
const goTheLock = app.requestSingleInstanceLock()
if (!goTheLock) {
    app.quit()
} else {
    app.on('second-instance', () => {
        if (mainWin) {
            if (mainWin.isMinimized()) {
                mainWin.restore()
                mainWin.focus()
                mainWin.show()
            }
        }
    })
    app.on('ready', () => {
        createWindow()
        createTrayIcon()
    })
}


/**
 * 创建窗口
 */
function createWindow() {
    mainWin = new BrowserWindow({
        title: import.meta.env.VITE_APP_TITLE,
        width: 1920,
        height: 1080,
        resizable: false,
        icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
        webPreferences: {
            preload: join(__dirname, 'preload.mjs'),
            nodeIntegration: true,
            contextIsolation: true,
            webSecurity: true,
            //@ts-ignore
            nativeWindowOpen: true,
        }
    })

    globalShortcut.register('F5', function () {
        mainWin.webContents.reloadIgnoringCache();
    })

    globalShortcut.register('ctrl + shift + F11', function () {
        mainWin.fullScreen = !mainWin.fullScreen
    })

    globalShortcut.register('ctrl + shift + F12', function () {
        mainWin.webContents.openDevTools()
    })

    mainWin.webContents.on("before-input-event", (_: any, input: any) => {
        mainWin.webContents.setIgnoreMenuShortcuts(input.key === "F4" && input.alt);
    })

    // setTimeout(() => {
    //     mainWin.fullScreen = process.env.NODE_ENV !== 'development';
    // }, 500)

    if (process.env.NODE_ENV === 'development') {
        //win.webContents.openDevTools()
    }

    if (VITE_DEV_SERVER_URL) {
        //mainWin.loadURL("https://www.szlc-lh.cn/")
        mainWin.loadURL(VITE_DEV_SERVER_URL)
    } else {
        app.setLoginItemSettings({
            openAtLogin: true
        })
        //mainWin.loadURL("https://www.szlc-lh.cn/")
        mainWin.loadFile('dist/index.html')
        //win.loadFile(join(RENDERER_DIST, 'index.html'))
    }

    ipcMain.on('win-restart', () => {
        app.relaunch()
        setTimeout(() => app.exit(), 100)
    })

    // 隐藏menu
    Menu.setApplicationMenu(null)
    // 阻止默认关闭窗口事件
    mainWin.on('close', (event: any) => {
        event.preventDefault()
        mainWin.hide()
    })
}

/**
 * 创建托盘图标
 */
function createTrayIcon() {
    //创建托盘图标
    const tray: any = new Tray(join(process.env.VITE_PUBLIC, 'favicon.ico'))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '重启', click: () => {
                app.relaunch()
                setTimeout(() => app.exit(), 100)
            }
        },
        {
            label: '退出', click: () => {
                app.exit(0)
            }
        }
    ])
    tray.setToolTip(import.meta.env.VITE_APP_TITLE)
    tray.setContextMenu(contextMenu)

    //双击托盘图标打开窗口
    tray.on('double-click', () => {
        if (!mainWin) {
            createWindow()
        } else {
            mainWin.show()
        }
    })
}

// 设置默认语言
app.commandLine.appendSwitch('lang', 'zh-CN')

// 当所有窗口都关闭时退出，但在 macOS 上除外。在那里，应用程序及其菜单栏通常会保持活动状态，直到用户使用 Cmd + Q 明确退出。
app.on('window-all-closed', () => {
    mainWin = null
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在 OS X 上，当单击停靠图标并且没有打开其他窗口时，通常会在应用程序中重新创建窗口。
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})
