const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  return Promise.resolve({
    appDirectory: path.join(__dirname, 'build/electronpwa-win32-x64'),
    authors: 'Andrew',
    noMsi: true,
    appCopyright: 'Copywrite 2018 yeah',
    outputDirectory: path.join(__dirname, 'build/windows-installer'),
    exe: 'electronpwa.exe',
    setupMsi: 'electronpwa-Installer.msi',
    setupExe: 'electronpwa-Installer.exe',
    setupIcon: path.join(__dirname, 'favicon.ico'),
  })
}