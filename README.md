# Building a desktop react app
### Requirements
React: 18.3.1<br>
Node 20.10.0

## Creating react app
```node
npx create-react-app my-app --template typescript
```
## Adding electron and electron forge
Electron Forge is a complete tool for packaging and building Electron apps. Initialize it in your project:
```node
npm install --save-dev electron @electron-forge/cli
npx electron-forge import
```

## Configure Electron
### Create a file named main.js inside the public folder and add the following content:
```node
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
```
### Create a file named preload.js inside the public folder with the following content:
```node
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector);
      if (element) element.innerText = text;
    }
    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type]);
      }
});
```

### Adjust the Package.json
Update your package.json to configure Electron. Add the following scripts and the main entry:
*Pay special attention to include "homepage":"/" . Otherwise white screen issue may appear
```node
{
  "name": "lunaerp",
  "version": "0.1.0",
  "private": true,
  "homepage": "./",
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.101",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "electron-squirrel-startup": "^1.0.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "main": "public/main.js",
  "scripts": {
    "start": "cross-env NODE_ENV=development react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "electron": "cross-env NODE_ENV=development electron .",
    "package": "npm run build && cross-env NODE_ENV=production electron-forge package"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@electron-forge/cli": "^7.4.0",
    "@electron-forge/maker-deb": "^7.4.0",
    "@electron-forge/maker-rpm": "^7.4.0",
    "@electron-forge/maker-squirrel": "^7.4.0",
    "@electron-forge/maker-zip": "^7.4.0",
    "@electron-forge/plugin-auto-unpack-natives": "^7.4.0",
    "@electron-forge/plugin-fuses": "^7.4.0",
    "@electron/fuses": "^1.8.0",
    "cross-env": "^7.0.3",
    "electron": "^31.2.1"
  }
}
```

### create an Electron configuration file named forge.config.js in the root of your project with the following content:
```node
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
```
## Scripts
## To build prod release:
```node
npm run build
```
then
```node
npm run package
```
