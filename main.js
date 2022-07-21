const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegrationInWorker: true,
    },
    show: false,
  });

  win.maximize();
  win.loadFile('index.html');
  win.show();
};

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  });
}

// ipcMain.on('notify', (_, message) => {
//   new Notification({
//     title: 'Notification',
//     body: message,
//   }).show();
// });

app.whenReady().then(createWindow);
