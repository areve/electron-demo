const { app, BrowserWindow } = require('electron')

let win

function createWindow() {
  win = new BrowserWindow({
    width: 800, height: 600,
    fullscreen: false,
    alwaysOnTop: true,
    backgroundColor: '#ccc',
    frame: false,
    webPreferences: {
      devTools: true
    }
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
