
const { BrowserWindow, app, ipcMain, Notification } = require('electron');
const path = require('path');

let mainWindow;
let NewsWindow = null;
let ChartWindow = {};
const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    backgroundColor: "#000000",
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html');

  // Handle mainWindow close event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  })
}


ipcMain.on('pop-out-news', (event) => {
  if (NewsWindow) {
    NewsWindow.focus();
    return;
  }

  NewsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    backgroundColor:"#333",
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), 'preload.js'),
      additionalArguments: ['--child-window'],
    }
  });

  const childUrl = `file://${path.join(__dirname, 'public', 'news-window.html')}?child=true`;
  NewsWindow.loadURL(childUrl);
  
  NewsWindow.on('closed', () => {
    NewsWindow = null;
    event.sender.send('news-window-closed');
  });
});

ipcMain.on('reopen-news-in-main', () => {
  mainWindow.webContents.send('make-news-visible');
});

ipcMain.on('pop-out-chart', (event, { chartId, symbol }) => {
  if (ChartWindow[chartId]) {
    ChartWindow[chartId].focus();
    return;
  }

  const chartWindow = new BrowserWindow({
    width: 600,
    height: 600,
    backgroundColor:"#333",
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), 'preload.js'),
      additionalArguments: ['--child-window'],
    }
  });

  const childUrl = `file://${path.join(__dirname, 'public', 'chart-window.html')}?child=true&chartId=${chartId}&symbol=${symbol}`;
  chartWindow.loadURL(childUrl);
  
  chartWindow.on('closed', () => {
    delete ChartWindow[chartId];
    console.log(chartId)
    event.sender.send('chart-window-closed', chartId);
  });

  ChartWindow[chartId] = chartWindow;
});

ipcMain.on('reopen-chart-in-main', (event, chartId) => {
    mainWindow.webContents.send('make-chart-visible', chartId);

});

app.whenReady().then(createWindow);
