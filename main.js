const path = require('path')
const { app, BrowserWindow, Tray, Menu } = require('electron')

let win
let tray = null

function createWindow() {
  tray = new Tray(path.resolve(__dirname, 'favicon.ico'))
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'},
    {label: 'Item3', type: 'radio', checked: true},
    {label: 'Item4', type: 'radio'}
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)


  win = new BrowserWindow({
    show: false,
    width: 800, height: 600,
    fullscreen: false,
    alwaysOnTop: false,
    backgroundColor: '#ccc',
    frame: false,
    webPreferences: {
      devTools: true
    }
  })

  win.once('ready-to-show', () => {
    win.show()
  })
  win.loadFile('index.html')
  win.setMenu(null)
  win.closeEnabled = false
  win.on('close', (event) => {
    if (!win.closeEnabled) event.preventDefault()
  })
  win.on('closed', () => { win = null })



  
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (win === null) createWindow()
})


  
