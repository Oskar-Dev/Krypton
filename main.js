const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

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

  ipcMain.on('saveSettings', (event, data) => {
    fs.writeFile('settings.json', data, 'utf-8', (err) => {
      if (err) console.log(err);
    });
  });

  ipcMain.on('loadSettings', () => {
    fs.readFile('settings.json', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      win?.webContents.send('loadedSettings', data);
    });
  });
};

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    ignored: [/node_modules|[\/\\]\./, /settings\.json/],
  });
}

app.whenReady().then(createWindow);
