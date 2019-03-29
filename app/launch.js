const {app, BrowserWindow, ipcMain} = require('electron');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 500
  });
  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: '../icon_512x512.png'
  });
});
