let remote, electronLocalshortcut, win
try {
  remote = require('electron').remote
  electronLocalshortcut = require('electron-localshortcut')
  win = remote.getCurrentWindow()
} catch (err) {

}
const grid = {
  initialize() {
    var grid = new Muuri('.grid', {
      dragEnabled: true,
      layoutOnInit: false
    }).on('move', () => {
      saveGridLayout(grid)
    })

    var layout = window.localStorage.getItem('layout')
    if (layout) {
      loadGridLayout(grid, layout)
    } else {
      grid.layout(true)
    }

    function saveGridLayout(grid) {
      var layout = serializeLayout(grid)
      window.localStorage.setItem('layout', layout)
    }

    function serializeLayout(grid) {
      var itemIds = grid.getItems().map(function (item) {
        return item.getElement().getAttribute('data-id')
      })
      return JSON.stringify(itemIds)
    }

    function loadGridLayout(grid, serializedLayout) {
      var layout = JSON.parse(serializedLayout)
      var currentItems = grid.getItems()
      var currentItemIds = currentItems.map(function (item) {
        return item.getElement().getAttribute('data-id')
      })
      var newItems = []
      var itemId
      var itemIndex

      for (var i = 0; i < layout.length; i++) {
        itemId = layout[i]
        itemIndex = currentItemIds.indexOf(itemId)
        if (itemIndex > -1) {
          newItems.push(currentItems[itemIndex])
        }
      }

      grid.sort(newItems, { layout: 'instant' })
    }
  }
}

const page = {
  clearOutput() {
    document.getElementById('output').innerText = ''
  }
}

const desktop = {
  launch() {
    let child = new remote.BrowserWindow({
      parent: win, modal: true, show: false
    })
    child.setMenu(null)
    child.loadURL('https://areve.github.io/vue-pwa-demo/dist/')
    child.once('ready-to-show', () => child.show())
  },
  exit() {
    win.closeEnabled = true
    win.close()
  },
  debug() {
    win.webContents.openDevTools()
  },
  openDialog() {
    const dir = remote.dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] })
    const fs = require('fs')
    const list = fs.readdirSync(dir[0])
    document.getElementById('output').innerText = JSON.stringify(list, null, '  ')
  },
  fullscreen() {
    win.setFullScreen(!win.isFullScreen())
  },
  initialize() {

    const status = document.getElementById('status')
    if (typeof process !== 'undefined') {
      status.innerText =
        'Using node ' +
        process.versions.node +
        ' Chrome ' + process.versions.chrome +
        ' and Electron ' + process.versions.electron
    } else {
      status.innerText = 'Using browser mode, desktop functionality is disabled'
      return
    }

    remote.globalShortcut.unregister('Ctrl+Shift+X')
    remote.globalShortcut.register('Ctrl+Shift+X', desktop.exit)
    remote.globalShortcut.unregister('Ctrl+Shift+O')
    remote.globalShortcut.register('Ctrl+Shift+O', desktop.openDialog)
    electronLocalshortcut.unregister(remote.getCurrentWindow(), 'F12')
    electronLocalshortcut.register(remote.getCurrentWindow(), 'F12', desktop.debug)

    const elems = document.getElementsByClassName('desktop')
    for (let i = 0; i < elems.length; i++) {
      const el = elems[i]
      el.style.display = 'initial'
    }

  }
}


const pwa = {
  initialize() {
    Notification.requestPermission(function (status) {
      console.log('Notification permission status:', status)
    })
  },
  notify() {
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(function (reg) {
        var options = {
          body: 'This is an example notification',
          icon: 'android/android-launchericon-72-72.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
          actions: [
            {action: 'explore', title: 'See example.com',
              icon: 'images/yes.png'},
            {action: 'close', title: 'Close notification',
              icon: 'images/no.png'},
          ]
        }
        reg.showNotification('Example Notice', options)
      })
    }
  }
}
