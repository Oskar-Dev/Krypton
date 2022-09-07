const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;

const createWindow = () => {
  const win = new BrowserWindow({
    frame: false,
    width: 1280,
    height: 720,
    icon: path.join(__dirname, 'assets', 'logo', 'icon.ico'),
    backgroundColor: 'white',
    webPreferences: {
      devTools: isDev,
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
        win?.webContents.send('loadedSettings', { data: null, loaded: false });

        return;
      }

      win?.webContents.send('loadedSettings', { data: data, loaded: true });
    });
  });

  ipcMain.on('openFile', () => {
    dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Pliki Tekstowe', extensions: ['txt', 'json'] }],
      })
      .then((result) => {
        var { canceled, filePaths } = result;
        var filePath = filePaths[0];

        if (canceled) return;

        fs.readFile(filePath, 'utf-8', (err, data) => {
          if (err) {
            console.log(err);
            win?.webContents.send('loadedFile', { data: null, loaded: false });

            return;
          }

          win?.webContents.send('loadedFile', { data: data, loaded: true });
          // console.log(win);
        });
      })
      .catch((e) => console.log(e));
  });

  ipcMain.on('saveFile', (event, data) => {
    dialog
      .showSaveDialog({
        defaultPath: 'wykresy.txt',
        filters: [{ name: 'Pliki Tekstowe', extensions: ['txt', 'json'] }],
      })
      .then((result) => {
        var { canceled, filePath } = result;

        if (canceled) return;

        fs.writeFile(filePath, data, 'utf-8', (err) => {
          if (err) console.log(err);
        });
      })
      .catch((e) => console.log(e));
  });
};

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    ignored: [/node_modules|[\/\\]\./, /settings\.json/],
  });
}

app.whenReady().then(createWindow);
