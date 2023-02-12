# COYO Desktop * DEV README

COYO for the desktop.

(c) Copyright 2017 Denis Meyer. All rights reserved.


## Prerequisites

* Electron (http://electron.atom.io)
  * npm install -g electron
* Electron packager (https://github.com/electron-userland/electron-packager)
  * npm install -g electron-packager
* Other dependencies
  * cd app
  * npm install


## Changes to be done

* Update the file names in constants.js
  * standardFiles.styles
  * standardFiles.scripts
* Search for 'SNAPSHOT' and 'BETA.<OLD_VERSION>' and replace with 'BETA.<NEW_VERSION>'.
* In "dist/scripts/vendor-*.js" replace 'require("../build/pdf.js")' with 'window["pdfjs-dist/build/pdf"]'.


## Run

* cd app
* electron .


## Distribution

#### Windows

```
electron-packager app "COYODesktop" --platform="win32" --arch="x64" --electron-version="1.7.9" --version-string.CompanyName="Denis Meyer" --version-string.ProductName="COYO Desktop" --version-string.ProductVersion="5.0.4b" --app-version="5.0.4b" --build-version="1" --version-string.LegalCopyright="Copyright (C) 2017 Denis Meyer" --version-string.OriginalFilename="COYODesktop.exe" --app-copyright="Denis Meyer" --out="release" --overwrite
```

#### Mac OS

```
electron-packager app "COYO Desktop" \
--platform="darwin" \
--arch="x64" \
--electron-version="1.7.9" \
--version-string.CompanyName="Denis Meyer" \
--version-string.ProductName="COYO Desktop" \
--version-string.ProductVersion="5.0.4b" \
--app-version="5.0.4b" \
--build-version="1" \
--app-copyright="Denis Meyer" \
--icon="support/mac/logo.icns" \
--extend-info="support/mac/Package/com.mindsmash.coyo.agent.plist" \
--out="release" \
--overwrite
```
