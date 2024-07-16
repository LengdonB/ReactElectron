const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
    //   preload: path.join(__dirname, 'preload.js')
      preload: path.join(app.getAppPath(), 'public', 'preload.js')
    }
  });
  console.log('Conditional path');
  console.log('getAppPath: '+ app.getAppPath());
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    const filePath = path.join(app.getAppPath(), 'build', 'index.html');
    console.log('Loading file:', filePath);
    mainWindow.loadFile(filePath).catch(err => console.error('Failed to load file:', err));
  }

  mainWindow.on('closed', function () {
    app.quit();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});