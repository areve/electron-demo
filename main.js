
if (require('electron-squirrel-startup')) return

if (handleSquirrelEvent()) return

initialize()

function handleSquirrelEvent() {
  if (process.argv.length === 1) return false
  const path = require('path')
  const ChildProcess = require('child_process')
  const exeName = path.basename(process.execPath)
  const squirrelEvent = process.argv[1]

  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      spawnUpdate(['--createShortcut', exeName])
      setTimeout(app.quit, 1000)
      return true
    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName])
      setTimeout(app.quit, 1000)
      return true
    case '--squirrel-obsolete':
      app.quit()
      return true
  }

  function spawn(command, args) {
    let spawnedProcess, error
    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true })
    } catch (error) { }
    return spawnedProcess
  }

  function spawnUpdate(args) {
    const appFolder = path.resolve(process.execPath, '..')
    const rootAtomFolder = path.resolve(appFolder, '..')
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'))
    return spawn(updateDotExe, args)
  }
}

function initialize() {
  const { app, BrowserWindow, Tray, Menu } = require('electron')
  const windowStateKeeper = require('electron-window-state')
  const path = require('path')

  let win = null

  app.on('ready', initialize)
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', () => {
    if (win === null) initialize()
  })

  function initialize() {
    createTrayIcon()
    createWindow()
  }

  function createTrayIcon() {
    const tray = new Tray(path.resolve(__dirname, 'favicon.ico'))
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Exit',
        click() {
          win.closeEnabled = true
          win.close()
        }
      },
      {
        label: 'Debug',
        click() {
          win.webContents.openDevTools()
        }
      },
    ])

    tray.setToolTip('electron-pwa-demo')
    tray.setContextMenu(contextMenu)
  }

  function createWindow() {
    let mainWindowState = windowStateKeeper({
      defaultWidth: 1000,
      defaultHeight: 800
    })

    win = new BrowserWindow({
      show: false,
      'x': mainWindowState.x,
      'y': mainWindowState.y,
      'width': mainWindowState.width,
      'height': mainWindowState.height,
      frame: false,
      webPreferences: { devTools: true }
    })

    mainWindowState.manage(win)
    win.once('ready-to-show', () => win.show())
    win.loadFile('index.html')
    win.setMenu(null)
    win.closeEnabled = false
    win.on('close', (event) => {
      if (!win.closeEnabled) event.preventDefault()
    })
    win.on('closed', () => { win = null })
  }
}

