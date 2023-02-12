/**
 * COYO Desktop
 * 
 * (c) Copyright 2017 Denis Meyer. All rights reserved.
 */
'use strict';

const {app, BrowserWindow, Menu, ipcMain, globalShortcut} = require('electron');

const logger = require('./logger');
const events = require('./events');
const tray = require('./tray');
const i18n = require('./i18n');

function build() {
  logger.logDebug('main', 'build');

  tray.init();
}

function logInformation() {
  logger.logDebug('main', 'logInformation');
  
  logger.logInfo('main', 'Node.js version: ' + process.versions.node);
  logger.logInfo('main', 'Chrome version: ' + process.versions.chrome);
  logger.logInfo('main', 'Electron version: ' + process.versions.electron);
}

function registerGlobalShortcut(shortcut, label) {
  globalShortcut.register(shortcut, () => {
    logger.logDebug('main', shortcut);

    events.emitToTray(label);
  });
}

function onAppReady() {
  logger.logDebug('main', 'onAppReady');

  logInformation();

  registerGlobalShortcut('Alt+C', 'toggleWindow');

  i18n.init(app.getLocale(), (translations) => {
    build();
  });
}

function destroy() {
  logger.logDebug('main', 'destroy');

  tray.destroy();
  events.destroy();
}

function onAppQuit() {
  logger.logDebug('main', 'onAppQuit');

  globalShortcut.unregisterAll();
  destroy();
  app.quit(); // Alternatively: app.exit(0); // does not emit events!
}

function registerAppEvents() {
  logger.logDebug('main', 'registerAppEvents');

  app.on('ready', onAppReady);
}

function registerMainEvents() {
  logger.logDebug('main', 'registerMainEvents');

  events.onMainEvent('quit', (className) => {
    logger.logDebug('main', 'quit(\'' + className + '\')');

    onAppQuit();
  });
}

// This method will be called when Electron has finished initialization and is ready to create browser windows
(function init() {
  logger.logDebug('main', 'init');

  registerAppEvents();
  registerMainEvents();
})();
