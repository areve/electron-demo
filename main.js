const { app, BrowserWindow } = require('electron')

let win

function createWindow() {
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
