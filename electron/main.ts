import {app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray} from 'electron'
//import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'
import {spawn} from 'node:child_process'

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

let mainWin: any;
let ledChild: any;
let rtspChild: any;
let serviceChild: any;

let iconPath: string;
let exePath: string;

let staticPath: string = 'resources/app.asar.unpacked/';

//@ts-ignore
let configPath: string;
//@ts-ignore
let serverConfigPath: string;

let rtspType: boolean;

// logToFile(`'cwd====${process.cwd()}'`)
// logToFile(`'execPath====${process.execPath}'`)
// logToFile(`'__dirname====${__dirname}'`)
// logToFile(`'process.env.VITE_PUBLIC====${process.env.VITE_PUBLIC}'`)
// logToFile(`'app.getPath('exe')====${dirname(app.getPath('exe'))}'`)
// logToFile(`'app.getPath('home')====${app.getPath('home')}'`)

//判断只允许开启一个窗口
const goTheLock: boolean = app.requestSingleInstanceLock()
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
    SetFilePath();
    mainWin = new BrowserWindow({
        title: import.meta.env.VITE_APP_TITLE,
        width: 1024,
        height: 768,
        frame: false,
        resizable: false,
        icon: iconPath,
        webPreferences: {
            preload: join(__dirname, 'preload.mjs'),
            webSecurity: true,
            nodeIntegration: true,
            contextIsolation: true,
            //@ts-ignore
            nativeWindowOpen: true,
        }
    })

    mainWin.webContents.on('did-finish-load', () => {
        ipcMain.on('win-restart', () => {
            restart()
        })

        const [currentX, currentY] = mainWin.getPosition();
        mainWin.webContents.send('updateXY', {x: currentX, y: currentY})

        RegisterGlobalShortcut()

        if (JudgmentMode()) {
            startExe(exePath)
            mainWin.webContents.openDevTools()
        } else {
            startExe(exePath)
            setTimeout(() => {
                mainWin.fullScreen = true
            }, 1000)
        }
    })

    if (JudgmentMode()) {
        mainWin.loadURL(VITE_DEV_SERVER_URL)
    } else {
        mainWin.setAlwaysOnTop(true)
        app.setLoginItemSettings({
            openAtLogin: true,
            type: "mainAppService",
            path: `"${process.execPath}"`
        })
        mainWin.loadFile('dist/index.html')
    }

    // 隐藏menu
    Menu.setApplicationMenu(null)
    // 阻止默认关闭窗口事件
    mainWin.on('close', (event: any) => {
        event.preventDefault()
        mainWin.hide()
    })
}

// 使用 ipcMain 接收窗口位置更新
ipcMain.on('update-window-position', (_event: any, position) => {
    if (mainWin) {
        const [currentX, currentY] = mainWin.getPosition();
        const newX = currentX + position.x;
        const newY = currentY + position.y;
        mainWin.setPosition(newX, newY);
    }
});

// 使用 ipcMain 响应窗口位置请求
ipcMain.on('get-window-position', (event) => {
    if (mainWin) {
        const [currentX, currentY] = mainWin.getPosition();
        console.log('currentX:', currentX, 'currentY:', currentY)
        event.returnValue = {x: currentX, y: currentY};
    }
});

function restart() {
    stopExe()
    app.relaunch()
    setTimeout(() => app.exit(), 100)
}

/**
 * 启动执行
 * @param path
 */
function startExe(path: string) {
    try {
        startRtsp(path)
    } catch (err) {
        console.error(err)
    }
}

/**
 * 启动rtsp
 * @param path
 */
function startRtsp(path: string) {
    if (rtspType) {
        try {
            const rtspStaticPath: string = join(path, 'rtsp/');

            rtspChild = spawn(join(rtspStaticPath, 'rtsp2webrtc.exe'), {cwd: rtspStaticPath});

            rtspChild.stdout.on('data', (data: any) => {
                console.log(`rtspChild_stdout: ${data}`);
            });

            rtspChild.stderr.on('data', (data: any) => {
                console.log(`rtspChild_stderr: ${data}`);
            });
        } catch (err) {
            console.error(`rtspChild_err:${err}`)
        }
    }
}

/**
 * 停止执行
 */
function stopExe() {
    if (rtspChild) {
        try {
            rtspChild.kill()
        } catch (err) {
            console.error(err)
        }
    }

    if (ledChild) {
        try {
            ledChild.kill()
        } catch (err) {
            console.error(err)
        }
    }

    if (serviceChild) {
        try {
            serviceChild.kill()
        } catch (err) {
            console.error(err)
        }
    }
}

/**
 * 创建托盘图标
 */
function createTrayIcon() {
    const tray: any = new Tray(join(process.env.VITE_PUBLIC, 'favicon.ico'))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '重启', click: () => {
                restart()
            }
        },
        {
            label: '退出', click: () => {
                stopExe()
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

/**
 * 当应用程序激活时，如果没有其他窗口打开，则重新创建窗口。
 */
app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

/**
 * 判断是否为开发模式
 * @constructor
 */
function JudgmentMode() {
    return process.env.NODE_ENV === 'development';
}

/**
 * 设置文件路径
 * @constructor
 */
function SetFilePath() {
    if (JudgmentMode()) {
        exePath = join(process.env.VITE_PUBLIC, 'software/')
        configPath = join(process.env.VITE_PUBLIC, 'config/')
        serverConfigPath = join(process.env.VITE_PUBLIC, 'software/service/')
        iconPath = join(process.env.VITE_PUBLIC, 'favicon.ico')
    } else {
        exePath = join(dirname(app.getPath('exe')), staticPath, 'software/')
        configPath = join(dirname(app.getPath('exe')), staticPath, 'config/')
        serverConfigPath = join(dirname(app.getPath('exe')), staticPath, 'software/service/')
        iconPath = join(dirname(app.getPath('exe')), 'favicon.ico')
    }
}

/**
 * 注册全局快捷键
 * @constructor
 */
function RegisterGlobalShortcut() {

    //退出全屏
    globalShortcut.register('shift + ESC', () => {
        mainWin.fullScreen = false
    })

    //全屏
    globalShortcut.register('shift + F1', () => {
        mainWin.fullScreen = true
    })


    //开发者工具
    globalShortcut.register('ctrl + shift + i', () => {
        mainWin.webContents.openDevTools()
    })

    //重启
    globalShortcut.register('ctrl + shift + alt + r', () => {
        restart()
    })

    //确认
    globalShortcut.register('ctrl + shift + alt + y', () => {
        mainWin.webContents.send('enter')
    })

    //取消
    globalShortcut.register('ctrl + shift + alt + n', () => {
        mainWin.webContents.send('exit')
    })

    //设置
    globalShortcut.register('ctrl + shift + alt + s', () => {
        mainWin.webContents.send('setting')
    })

    //退出
    globalShortcut.register('ctrl + shift+ alt + d', () => {
        mainWin.webContents.send('dropOut')
    })

    //关闭退出
    globalShortcut.register('ctrl + shift+ alt + q', () => {
        stopExe()
        app.exit(0)
    })

    //屏蔽Alt+F4
    mainWin.webContents.on("before-input-event", (_: any, input: any) => {
        mainWin.webContents.setIgnoreMenuShortcuts(input.key === "F4" && input.alt);
    })
}
