## Run this application as a development environment
```
cd app
npm install
npm start
```
&nbsp;

## Compile
Install `electron-packager`
```
npm install electron-packager -g
```

Remove all files from `app/node_modules` before compile.

And hit the command below at the project root directory.

### Windows
```
electron-packager app qwerk --platform=win32 --arch=x64
```

### macOS
```
electron-packager app qwerk --asar --platform=mas --arch=x64 --icon osx.icns
```

### Linux
```
electron-packager app qwerk --platform=linux --arch=x64
```
