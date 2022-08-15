const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

const createWindow = () => {
  const win = new BrowserWindow({
    frame: false,
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

  win.on('maximize', () => {
    win?.webContents.send('windowMaximized');
  });

  win.on('unmaximize', () => {
    win?.webContents.send('windowRestored');
  });

  ipcMain.on('maximize', () => {
    win.maximize();
  });

  ipcMain.on('restore', () => {
    win.restore();
  });

  ipcMain.on('minimize', () => {
    win.minimize();
  });

  ipcMain.on('close', () => {
    win.close();
  });
};

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  });
}

app.whenReady().then(createWindow);
