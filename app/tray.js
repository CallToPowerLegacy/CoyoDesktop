/**
 * COYO Desktop
 * 
 * (c) Copyright 2017 Denis Meyer. All rights reserved.
 */
'use strict';

const electron = require('electron');
const {app, BrowserWindow, Menu, Tray, ipcMain, clipboard} = electron;
const path = require('path');
const url = require('url');
const fs = require('fs');
const _ = require('lodash');
const settings = require('electron-settings');
const openAboutWindow = require('about-window').default;

const events = require('./events');
const constants = require('./constants');
const logger = require('./logger');
const i18n = require('./i18n');
const helper = require('./helper');
const contextMenu = require('electron-context-menu');

const imagePaths = constants.getImagePaths();

const standardFiles = constants.getStandardFiles();

const defaultSettings = {
  sounds: true,
  notifications: true
};

const browserWindowOptions = {
  dimensions: {
    width: 450,
    height: 650
  },
  config: {
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#374555',
    'node-integration': false,
    maximizable: false,
    minimizable: false,
    closable: false,
    resizable: false,
    moveable: false,
    show: false
  }
};

let items = {};
let selectionMenu;
let inputMenu;
let browserWindowBounds;

let browserWindow = undefined;
let tray = undefined;

let loggedIn = false;
let coyoConfig = undefined;
let instanceUrl = undefined;
let connectedCoyoVersion = undefined;
let currentUser = undefined;

let lastLinkOpened = undefined;
let lastLinkOpenedTime = Date.now();

let notificationsCount = 0;
let postsCount = 0;
let messagesCount = 0;

let notificationTimeout = null;
let notifications = {};

function execPathIsElectron() {
  logger.logDebug('tray', 'execPathIsElectron');

  let isElec = false;
  if (constants.isWindows()) {
    isElec = process.execPath.endsWith('electron.exe');
  } else {
    isElec = process.execPath.endsWith('Electron');
  }

  logger.logDebug('tray', 'execPathIsElectron', isElec);

  return isElec;
}

function readResourceFile(filename) {
  logger.logDebug('tray', 'readResourceFile', 'filename = ' + filename);

  let filePath;
  if (execPathIsElectron()) {
    filePath = filename;
  } else {
    filePath = path.join(process.resourcesPath, 'app', filename);
  }

  return fs.readFileSync(filePath, 'utf-8');
}

function injectStandardFiles(webContents) {
  logger.logDebug('tray', 'injectStandardFiles');
  
  let scripts = _.get(standardFiles, 'scripts');
  if (scripts) {
    scripts.forEach(file => webContents.executeJavaScript(readResourceFile(file)));
  }
  let styles = _.get(standardFiles, 'styles');
  if (styles) {
    styles.forEach(file => webContents.executeJavaScript('$(\'head\').append($(\'<link rel="stylesheet" href="' + file + '">\'));'));
  }
}

function onDomReady(onDomReadyCallback) {
  logger.logDebug('tray', 'onDomReady');

  if (browserWindow) {
    injectStandardFiles(browserWindow.webContents);
    browserWindow.webContents.insertCSS(readResourceFile(standardFiles.client.style));
    if (onDomReadyCallback) {
      onDomReadyCallback();
    }
  }
}

function onRedirect(e, url) {
  logger.logDebug('tray', 'onRedirect', url);

  let domainData = helper.extractDomainData(url);
  if (!instanceUrl || instanceUrl.indexOf(domainData.protocol) < 0 || instanceUrl.indexOf(domainData.domain) < 0) {
    e.preventDefault();
    if (domainData.protocol !== 'file') {
      logger.logInfo('tray', 'onRedirect - opening URL externally');

      let now = Date.now();
      let isSameUrl = lastLinkOpened === url;
      if (!isSameUrl || (isSameUrl && lastLinkOpenedTime <= (now - 100))) {
        lastLinkOpened = url;
        lastLinkOpenedTime = now;
        openExternalLink(url);
      }
    } else {
      logger.logInfo('tray', 'onRedirect - cannot open local files, yet. Reloading client...');

      onReload();
    }
  }
}

function onWindowBlur() {
  logger.logDebug('tray', 'onWindowBlur');

  if (constants.isBlur()) {
    hideBrowserWindow();
  }
}

function loadClient(onDomReadyCallback) {
  logger.logDebug('tray', 'loadClient');

  if (browserWindow) {
    browserWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
    if (constants.isDevTools()) {
      browserWindow.webContents.openDevTools({mode: 'detach'});
      setTrayHighlightMode('always');
    }
    browserWindow.webContents.on('dom-ready', () => {onDomReady(onDomReadyCallback);});
    browserWindow.webContents.on('will-navigate', onRedirect);
    browserWindow.webContents.on('new-window', onRedirect);
    browserWindow.on('blur', onWindowBlur);
  }
}

function openExternalLink(url) {
  logger.logDebug('tray', 'openExternalLink', url);

  if (url) {
    electron.shell.openExternal(url);
    hideBrowserWindow();
  }
}

function onIsAuthenticated(e, config, coyoInfo) {
  logger.logDebug('tray', 'onIsAuthenticated');

  coyoConfig = config;
  instanceUrl = coyoInfo.backendUrl;
  connectedCoyoVersion = coyoInfo.version;
  currentUser = coyoInfo.user;
  loggedIn = true;
  updateTray();
}

function onIsNotAuthenticated(e, config, coyoInfo) {
  logger.logDebug('tray', 'onIsNotAuthenticated');

  coyoConfig = config;
  instanceUrl = coyoInfo.backendUrl;
  connectedCoyoVersion = coyoInfo.version;
  currentUser = undefined;
  loggedIn = false;
  updateTray();
}

function onLoginSuccess(e, config, coyoInfo) {
  logger.logDebug('tray', 'onLoginSuccess');

  coyoConfig = config;
  instanceUrl = coyoInfo.backendUrl;
  connectedCoyoVersion = coyoInfo.version;
  currentUser = coyoInfo.user;
  loggedIn = true;
  updateTray();
  loadClient();
}

function onLogoutSuccess() {
  logger.logDebug('tray', 'onLogout');

  onLogout(true);
}

function onReload() {
  logger.logDebug('tray', 'onReload');

  if (browserWindow) {
    loadClient(() => {
      showBrowserWindow();
    });
  }
}

function onLogout(suppressSendWebContentMsg) {
  logger.logDebug('tray', 'onLogout');

  instanceUrl = undefined;
  connectedCoyoVersion = undefined;
  currentUser = undefined;
  loggedIn = false;
  updateTray();
  if (!suppressSendWebContentMsg && browserWindow) {
    browserWindow.webContents.send('logout');
  }
}

function onExternalLinkOpened() {
  hideBrowserWindow();
}

function onOpenInstance() {
  logger.logDebug('tray', 'onOpenInstance');

  if (browserWindow) {
    browserWindow.webContents.send('open:instance', i18n.get('COYO.WEBSITE'));
  }
}

function updateTray() {
  logger.logDebug('tray', 'updateTray');

  if (tray) {
    if (loggedIn) {
      if (notificationsCount > 0 || postsCount > 0 || messagesCount > 0) {
        tray.setImage(path.join(__dirname, imagePaths.trayNew));
      } else {
        tray.setImage(path.join(__dirname, imagePaths.tray));
      }
    } else {
      tray.setImage(path.join(__dirname, imagePaths.trayGray));
    }
    setTrayTooltip();
  }
}

function getNotificationsLabel(nrOfNotifications) {
  logger.logDebug('tray', 'getNotificationsLabel(\'' + nrOfNotifications + '\')');

  return nrOfNotifications === 1 ?
    i18n.get('STR.NOTIFICATION.NEWNOTIFICATION') :
    _.replace(i18n.get('STR.NOTIFICATION.NEWNOTIFICATIONS'), new RegExp('{{nr}}', 'g'), nrOfNotifications);
}

function getPostsLabel(nrOfPosts) {
  logger.logDebug('tray', 'getPostsLabel(\'' + nrOfPosts + '\')');

  return nrOfPosts === 1 ?
    i18n.get('STR.NOTIFICATION.NEWPOST') :
    _.replace(i18n.get('STR.NOTIFICATION.NEWPOSTS'), new RegExp('{{nr}}', 'g'), nrOfPosts);
}

function getMessagesLabel(nrOfMessages) {
  logger.logDebug('tray', 'getMessagesLabel(\'' + nrOfMessages + '\')');

  return nrOfMessages === 1 ?
    i18n.get('STR.NOTIFICATION.NEWMESSAGE') :
    _.replace(i18n.get('STR.NOTIFICATION.NEWMESSAGES'), new RegExp('{{nr}}', 'g'), nrOfMessages);
}

function getSummarizedLabel(notification, post, message) {
  logger.logDebug('tray', 'getSummarizedLabel');

  if (notification && post && !message) {
    if (notification.count === 1 && post.count === 1) {
      return i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONANDPOST');
    } else if (notification.count === 1) {
      return _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONANDPOSTS'), new RegExp('{{nr}}', 'g'), post.count);
    } else if (post.count === 1) {
      return _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONSANDPOST'), new RegExp('{{nr}}', 'g'), notification.count);
    } else {
      let str = _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONSANDPOSTS'), new RegExp('{{nr1}}', 'g'), notification.count);
      return _.replace(str, new RegExp('{{nr2}}', 'g'), post.count);
    }
  } else if (notification && !post && message) {
    if (notification.count === 1 && message.count === 1) {
      return i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONANDMESSAGE');
    } else if (notification.count === 1) {
      return _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONANDMESSAGES'), new RegExp('{{nr}}', 'g'), message.count);
    } else if (message.count === 1) {
      return _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONSANDMESSAGE'), new RegExp('{{nr}}', 'g'), notification.count);
    } else {
      let str = _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONSANDMESSAGES'), new RegExp('{{nr1}}', 'g'), notification.count);
      return _.replace(str, new RegExp('{{nr2}}', 'g'), post.count);
    }
  } else if (!notification && post && message) {
    if (post.count === 1 && message.count === 1) {
      return i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWPOSTANDMESSAGE');
    } else if (post.count === 1) {
      return _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWPOSTANDMESSAGES'), new RegExp('{{nr}}', 'g'), message.count);
    } else if (message.count === 1) {
      return _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWPOSTSANDMESSAGE'), new RegExp('{{nr}}', 'g'), post.count);
    } else {
      let str = _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWPOSTSANDMESSAGES'), new RegExp('{{nr1}}', 'g'), post.count);
      return _.replace(str, new RegExp('{{nr2}}', 'g'), message.count);
    }
  } else if (notification && post && message) {
    if (notification.count === 1 && post.count === 1 && message.count === 1) {
      return i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONANDPOSTANDMESSAGE');
    } else if (notification.count === 1 && post.count === 1) {
      return _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONANDPOSTANDMESSAGES'), new RegExp('{{nr}}', 'g'), message.count);
    } else if (notification.count === 1 && message.count === 1) {
      return _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONANDPOSTSANDMESSAGE'), new RegExp('{{nr}}', 'g'), post.count);
    } else if (post.count === 1 && message.count === 1) {
      return _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONSANDPOSTANDMESSAGE'), new RegExp('{{nr}}', 'g'), notification.count);
    } else if (notification.count === 1) {
      let str = _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONANDPOSTSANDMESSAGES'), new RegExp('{{nr1}}', 'g'), post.count);
      return _.replace(str, new RegExp('{{nr2}}', 'g'), message.count);
    } else if (post.count === 1) {
      let str = _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONSANDPOSTANDMESSAGES'), new RegExp('{{nr1}}', 'g'), notification.count);
      return _.replace(str, new RegExp('{{nr2}}', 'g'), message.count);
    } else if (post.count === 1) {
      let str = _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONSANDPOSTSANDMESSAGE'), new RegExp('{{nr1}}', 'g'), notification.count);
      return _.replace(str, new RegExp('{{nr2}}', 'g'), post.count);
    } else {
      let str = _.replace(i18n.get('STR.NOTIFICATION.SUMMARIZED.NEWNOTIFICATIONSANDPOSTSANDMESSAGES'), new RegExp('{{nr1}}', 'g'), notification.count);
      str = _.replace(str, new RegExp('{{nr2}}', 'g'), post.count);
      return _.replace(str, new RegExp('{{nr3}}', 'g'), message.count);
    }
  }
}

function getIconForType(type) {
  logger.logDebug('tray', 'getIconForType(\'' + type + '\')');

  switch (type) {
    case 'notification':
      return path.join(__dirname, constants.isWindows() ? imagePaths.notificationInverted : imagePaths.notification);
    case 'message':
      return path.join(__dirname, constants.isWindows() ? imagePaths.messageInverted : imagePaths.message);
    case 'post':
      return path.join(__dirname, constants.isWindows() ? imagePaths.postInverted : imagePaths.post);
    default:
      return path.join(__dirname, imagePaths.logoMid);
  }
}

function sendSummarizedNotification(soundSettings, label) {
  logger.logDebug('tray', 'sendSummarizedNotification');
  browserWindow.webContents.send('notification:raise', null, label, getIconForType(null), soundSettings, null);
}

function sendSingleNotification(soundSettings, name, label, type) {
  logger.logDebug('tray', 'sendSingleNotification', type);
  browserWindow.webContents.send('notification:raise', name, label, getIconForType(type), soundSettings, type);
}

function addNotification(notification) {
  logger.logDebug('tray', 'addNotification');
  notifications[notification.type] = notification;
}

function distributeNotifications() {
  logger.logDebug('tray', 'distributeNotifications');

  const _settings = loadSettings();
  if (_settings.notifications && browserWindow) {
    if (!browserWindow.isVisible() || constants.isDebug()) {
      if (notifications.notification && !notifications.post && !notifications.message) {
        sendSingleNotification(_settings.sounds, notifications.notification.name, getNotificationsLabel(notifications.notification.count), notifications.notification.type);
      } else if (!notifications.notification && notifications.post && !notifications.message) {
        sendSingleNotification(_settings.sounds, notifications.post.name, getPostsLabel(notifications.post.count), notifications.post.type);
      } else if (!notifications.notification && !notifications.post && notifications.message) {
        sendSingleNotification(_settings.sounds, notifications.message.name, getMessagesLabel(notifications.message.count), notifications.message.type);
      } else {
        sendSummarizedNotification(_settings.sounds, getSummarizedLabel(notifications.notification, notifications.post, notifications.message));
      }
    }
  }

  notifications = {};
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }

  updateTray();
}

function raiseNotification(name, count, type) {
  logger.logDebug('tray', 'raiseNotification', {name: name, count: count, type: type});

  addNotification({name: name, count: count, type: type});
  if (!notificationTimeout) {
    notificationTimeout = setTimeout(distributeNotifications, constants.getValues().raiseNotificationTimeoutTime);
  }
}

function onNotificationClicked(event, type) {
  logger.logDebug('tray', 'onNotificationClicked', type);

  showBrowserWindow();
}

function onNotificationStatusUpdate(event, status, initial) {
  logger.logDebug('tray', 'onNotificationStatusUpdate', _.get(status, 'unseen._total', 0));

  let oldCount = notificationsCount;
  notificationsCount = _.get(status, 'unseen._total', 0);
  if (notificationsCount > oldCount) {
    raiseNotification(i18n.get('COYO.NAME'), notificationsCount, 'notification');
  }

  updateTray();
}

function onPostStatusUpdate(event, count, initial) {
  logger.logDebug('tray', 'onPostStatusUpdate', count);

  let oldCount = postsCount;
  postsCount = count;
  if (postsCount > oldCount) {
    raiseNotification(i18n.get('COYO.NAME'), postsCount, 'post');
  }

  updateTray();
}

function onMessageStatusUpdate(event, count, initial) {
  logger.logDebug('tray', 'onMessageStatusUpdate', count);
  
  let oldCount = messagesCount;
  messagesCount = count;
  if (messagesCount > oldCount) {
    raiseNotification(i18n.get('COYO.NAME'), messagesCount, 'message');
  }

  updateTray();
}

function hideBrowserWindow() {
  logger.logDebug('tray', 'hideBrowserWindow');

  initBrowserWindow();
  setTrayHighlightMode('selection');
  browserWindow.hide();
}

function showBrowserWindow() {
  logger.logDebug('tray', 'showBrowserWindow - bounds = ', browserWindowBounds);

  initBrowserWindow();
  setTrayHighlightMode('always');
  if (constants.isWindows()) {
    browserWindow.setBounds({
      width: browserWindowOptions.dimensions.width,
      height: browserWindowOptions.dimensions.height,
      x: electron.screen.getPrimaryDisplay().workAreaSize.width - browserWindowOptions.dimensions.width,
      y: electron.screen.getPrimaryDisplay().workAreaSize.height - browserWindowOptions.dimensions.height
    });
  } else {
    browserWindow.setBounds({
      width: browserWindowOptions.dimensions.width,
      height: browserWindowOptions.dimensions.height,
      x: browserWindowBounds ? browserWindowBounds.x : tray.getBounds().x,
      y: browserWindowBounds ? browserWindowBounds.y : tray.getBounds().y
    });
  }
  browserWindow.show();
}

function toggleBrowserWindow(event, bounds) {
  logger.logDebug('tray', 'toggleBrowserWindow', bounds);

  if (bounds) {
    browserWindowBounds = bounds;
  }
  if (browserWindow) {
    if (browserWindow.isVisible()) {
      hideBrowserWindow();
    } else {
      showBrowserWindow();
    }
  }
}

function saveSettings(values) {
  logger.logDebug('tray', 'saveSettings');

  settings.set('tray', values);
}

function loadSettings() {
  logger.logDebug('tray', 'loadSettings');

  return settings.get('tray');
}

function getSoundsCheckbox(values) {
  logger.logDebug('tray', 'getSoundsCheckbox');

  const checkboxItem = items.checkboxes.sounds;
  checkboxItem.checked = values.sounds;
  checkboxItem.enabled = values.notifications;
  checkboxItem.click = function () {
    logger.logDebug('tray', 'Clicked \'checkbox:sounds\’');

    values.sounds = !values.sounds;
    saveSettings(values);
    checkboxItem.checked = values.sounds;
  };

  return checkboxItem;
}

function getNotificationsCheckbox(values) {
  logger.logDebug('tray', 'getNotificationsCheckbox');

  const checkboxItem = items.checkboxes.notifications;
  checkboxItem.checked = values.notifications;
  checkboxItem.enabled = true;
  checkboxItem.click = function () {
    logger.logDebug('tray', 'Clicked \'checkbox:notifications\’');

    values.notifications = !values.notifications;
    saveSettings(values);
    checkboxItem.checked = values.notifications;
  };

  return checkboxItem;
}

function showTrayContextMenu() {
  logger.logDebug('tray', 'showTrayContextMenu');

  if (tray) {
    hideBrowserWindow();
    let _settings = loadSettings();
    let template = undefined;
    let applicationSettings = items.settings;
    applicationSettings.submenu = [
      items.labels.notifications,
      getNotificationsCheckbox(_settings),
      getSoundsCheckbox(_settings),
    ];
    if (loggedIn) {
      if (instanceUrl && connectedCoyoVersion && currentUser) {
        let coyoServerVersionStr =
                i18n.get('STR.VERSION') + ' ' + connectedCoyoVersion.major + '.' + connectedCoyoVersion.minor + '.'
                + connectedCoyoVersion.patch + ' ' + connectedCoyoVersion.qualifier;
        let coyoConnection = {
          label: i18n.get('STR.INFORMATION'),
          submenu: [
            items.labels.connectedTo,
            {
              label: instanceUrl,
              enabled: true,
              click: () => {
                logger.logDebug('tray', 'showTrayContextMenu::items.labels.connectedTo::click');

                clipboard.writeText(instanceUrl);
              }
            },
            items.separator,
            items.labels.serverVersion,
            {
              label: coyoServerVersionStr,
              enabled: true,
              click: () => {
                logger.logDebug('tray', 'showTrayContextMenu::items.labels.serverVersion::click');

                clipboard.writeText(coyoServerVersionStr);
              }
            }
          ]
        };
        let coyoCurrentUser = {
          label: i18n.get('STR.CURRENTUSER'),
          submenu: [
            items.labels.userName,
            {
              label: currentUser.displayName,
              enabled: true,
              click: () => {
                logger.logDebug('tray', 'showTrayContextMenu::items.labels.userName::click');

                clipboard.writeText(currentUser.displayName);
              }
            },
            items.separator,
            items.labels.loginName,
            {
              label: currentUser.loginName,
              enabled: true,
              click: () => {
                logger.logDebug('tray', 'showTrayContextMenu::items.labels.loginName::click');

                clipboard.writeText(currentUser.loginName);
              }
            }
          ]
        };
        template = [
          items.labels.coyo,
          items.openInstance,
          items.reload,
          items.moreCoyo,
          items.separator,
          items.labels.coyoServer,
          coyoConnection,
          coyoCurrentUser,
          items.separator,
          applicationSettings,
          items.about,
          items.separator,
          items.quit
        ];
      } else {
        template = [
          items.labels.coyo,
          items.openInstance,
          items.reload,
          items.moreCoyo,
          items.separator,
          applicationSettings,
          items.about,
          items.separator,
          items.quit
        ];
      }
    } else {
      template = [
        items.labels.coyo,
        items.openInstance,
        items.login,
        items.separator,
        applicationSettings,
        items.about,
        items.separator,
        items.quit
      ];
    }
    tray.popUpContextMenu(Menu.buildFromTemplate(template));
  }
}

function setTrayTooltip(hideInstance) {
  tray.setToolTip(i18n.get('APPLICATION.NAME'));
}

// mode = selection (default), always, never
function setTrayHighlightMode(mode) {
  logger.logDebug('tray', 'setTrayHighlightMode,', 'mode = \'' + mode + '\'');

  if (tray && (mode === 'selection' || mode === 'always' || mode === 'never')) {
    tray.setHighlightMode(mode);
  }
}

function destroyWindow() {
  logger.logDebug('tray', 'destroyWindow');

  if (browserWindow) {
    logger.logDebug('tray', 'destroy: Browser window');

    if (browserWindow.isDevToolsOpened()) {
      browserWindow.webContents.closeDevTools();
    }
    if (browserWindow.isVisible()) {
      browserWindow.hide();
    }
    browserWindow.destroy();
    browserWindow = undefined;
  }
}

function destroyTray() {
  logger.logDebug('tray', 'destroyTray');

  if (tray) {
    tray.destroy();
    tray = undefined;
  }
}

function destroy() {
  logger.logDebug('tray', 'destroy');

  destroyWindow();
  destroyTray();
}

function initBrowserWindow() {
  logger.logDebug('tray', 'initBrowserWindow', browserWindowBounds);

  if (!browserWindow) {
    browserWindow = new BrowserWindow(browserWindowOptions.config);

    contextMenu({
      showInspectElement: constants.isDebug(),
      labels: {
        cut: i18n.get('CONTEXTMENU.CUT'),
        copy: i18n.get('CONTEXTMENU.COPY'),
        paste: i18n.get('CONTEXTMENU.PASTE'),
        save: i18n.get('CONTEXTMENU.SAVE'),
        copyLink: i18n.get('CONTEXTMENU.COPYLINK'),
        inspect: i18n.get('CONTEXTMENU.INSPECT'),
      }
    });
    if (constants.isWindows()) {
      browserWindow.setBounds({
        width: browserWindowOptions.dimensions.width,
        height: browserWindowOptions.dimensions.height,
        x: electron.screen.getPrimaryDisplay().workAreaSize.width - browserWindowOptions.dimensions.width,
        y: electron.screen.getPrimaryDisplay().workAreaSize.height - browserWindowOptions.dimensions.height
      });
    } else {
      browserWindow.setBounds({
        width: browserWindowOptions.dimensions.width,
        height: browserWindowOptions.dimensions.height,
        x: browserWindowBounds ? browserWindowBounds.x : tray.getBounds().x,
        y: browserWindowBounds ? browserWindowBounds.y : tray.getBounds().y
      });
    }
    loadClient();
  }
}

function registerEvents() {
  logger.logDebug('tray', 'registerEvents');

  events.onTrayEvent('toggleWindow', toggleBrowserWindow);
}

function registerIcpMainEvents() {
  logger.logDebug('tray', 'registerIcpMainEvents');

  ipcMain.on('login:success', onLoginSuccess);
  ipcMain.on('logout:success', onLogout);
  ipcMain.on('logout:failed', onLogout);
  ipcMain.on('reload', onReload);
  ipcMain.on('opened:external', onExternalLinkOpened);
  ipcMain.on('isAuthenticated', onIsAuthenticated);
  ipcMain.on('isNotAuthenticated', onIsNotAuthenticated);
  ipcMain.on('notifications:statusUpdate', onNotificationStatusUpdate);
  ipcMain.on('notification:clicked', onNotificationClicked);
  ipcMain.on('posts:statusUpdate', onPostStatusUpdate);
  ipcMain.on('messages:statusUpdate', onMessageStatusUpdate);
}

function initTray() {
  logger.logDebug('tray', 'initTray');

  tray = new Tray(path.join(__dirname, imagePaths.trayGray));
  tray.on('click', toggleBrowserWindow);
  tray.on('right-click', showTrayContextMenu);
  setTrayTooltip();
  setTrayHighlightMode('selection');
}

function initSettings() {
  logger.logDebug('tray', 'initSettings');

  let values = loadSettings();
  if (!values || constants.isDebug()) {
    logger.logDebug('tray', 'settings:resetToDefaults');

    values = defaultSettings;
  }
  saveSettings(values);
}

function initContextMenus() {
  selectionMenu = Menu.buildFromTemplate([
    {role: 'copy'},
    {type: 'separator'},
    {role: 'selectall'}
  ]);

  inputMenu = Menu.buildFromTemplate([
    {role: 'undo'},
    {role: 'redo'},
    {type: 'separator'},
    {role: 'cut'},
    {role: 'copy'},
    {role: 'paste'},
    {type: 'separator'},
    {role: 'selectall'}
  ]);
}

function getRandomEmoji() {
  return Math.random() >= 0.92 ? '🦄' : '⚓';
}

function initItems() {
  items = {
    about: {
      label: i18n.get('STR.ABOUT'),
      submenu: [
        {
          label: i18n.get('COYO.NAME').toUpperCase(),
          enabled: false,
        },
        {
          label: i18n.get('STR.COYOMORE'),
          click: function () {
            openExternalLink(i18n.get('COYO.WEBSITE'));
          }
        }, {
          type: 'separator'
        },
        {
          label: i18n.get('STR.THISAPP').toUpperCase(),
          enabled: false,
        },
        {
          label: i18n.get('APPLICATION.NAME'),
          click: function (item, focusedWindow) {
            const windowOptions = {
              titleBarStyle: 'hidden',
              maximizable: false,
              minimizable: false,
              closable: true,
              resizable: false,
              moveable: false
            };
            let clientVersion = undefined;
            let clientVersionString = undefined;
            let copyright = '';
            if (coyoConfig && coyoConfig.version
                && coyoConfig.version.major !== undefined
                && coyoConfig.version.minor !== undefined
                && coyoConfig.version.patch !== undefined
                && coyoConfig.version.qualifier !== undefined) {
              clientVersion = coyoConfig.version.major + '.' + coyoConfig.version.minor + '.'
                              + coyoConfig.version.patch + ' ' + coyoConfig.version.qualifier;
              clientVersionString = i18n.get('CLIENT.ABOUTPRE') + ' ' + clientVersion + i18n.get('CLIENT.ABOUTPOST');
              copyright += clientVersionString + '\n\n';
            }
            copyright += i18n.get('APPLICATION.COPYRIGHT');
            openAboutWindow({
              icon_path: path.join(__dirname, imagePaths.logoHD),
              // bug_report_url: i18n.get('COYO.BUGWEBSITE'),
              homepage: i18n.get('COYO.WEBSITE'),
              copyright: copyright,
              description: '\n' + i18n.get('APPLICATION.ABOUT') + '\n\n' + getRandomEmoji(),
              adjust_window_size: true,
              win_options: windowOptions
            });
          }
        }
      ]
    },
    checkboxes: {
      sounds: {
        label: i18n.get('STR.PLAYSOUNDS'),
        type: 'checkbox',
        checked: false,
      },
      notifications: {
        label: i18n.get('STR.VISUALNOTIFICATIONS'),
        type: 'checkbox',
        checked: false,
      }
    },
    labels: {
      coyo: {
        label: i18n.get('COYO.NAME').toUpperCase(),
        enabled: false
      },
      coyoServer: {
        label: i18n.get('STR.CONNECTION').toUpperCase(),
        enabled: false
      },
      connectedTo: {
        label: i18n.get('STR.CONNECTEDTO').toUpperCase(),
        enabled: false
      },
      loginName: {
        label: i18n.get('STR.LOGINNAME').toUpperCase(),
        enabled: false
      },
      notifications: {
        label: i18n.get('STR.NOTIFICATIONS').toUpperCase(),
        enabled: false
      },
      serverVersion: {
        label: i18n.get('STR.SERVERVERSION').toUpperCase(),
        enabled: false
      },
      userName: {
        label: i18n.get('STR.USERNAME').toUpperCase(),
        enabled: false
      }
    },
    login: {
      label: i18n.get('STR.LOGIN'),
      accelerator: '',
      click: function () {
        logger.logDebug('tray', 'Clicked \'login\’');

        showBrowserWindow();
      }
    },
    moreCoyo: {
      label: i18n.get('STR.MORE'),
      submenu: [
        {
          label: i18n.get('STR.ACTIONS').toUpperCase(),
          enabled: false
        },
        {
          label: i18n.get('STR.LOGOUT'),
          accelerator: '',
          click: function (item, focusedWindow) {
            logger.logDebug('tray', 'Clicked \'logout\’');

            const options = {
              type: 'question',
              title: i18n.get('STR.LOGOUT'),
              buttons: [i18n.get('STR.NO'), i18n.get('STR.YES')],
              message: i18n.get('STR.LOGOUTMSG'),
              detail: i18n.get('STR.LOGOUTDETAIL')
            };
            electron.dialog.showMessageBox(focusedWindow, options, function (response) {
              logger.logDebug('tray', 'showMessageBox - response = ', response);

              if (response && response !== 0) {
                onLogout();
              }
            });
          }
        }
      ]
    },
    openInstance: {
      label: i18n.get('STR.OPENINBROWSER'),
      accelerator: '',
      click: function () {
        logger.logDebug('tray', 'Clicked \'openInstance\’');

        browserWindow.webContents.send('open:instance', i18n.get('COYO.WEBSITE'));
      }
    },
    quit: {
      label: i18n.get('STR.QUIT'),
      accelerator: 'CmdOrCtrl+Q',
      click: function () {
        logger.logDebug('tray', 'Clicked \’quit\’');

        events.emitToMain('quit', 'tray');
      }
    },
    reload: {
      label: i18n.get('STR.RELOAD'),
      accelerator: '',
      click: function () {
        logger.logDebug('tray', 'Clicked \'reload\’');

        onReload();
      }
    },
    separator: {
      type: 'separator'
    },
    settings: {
      label: i18n.get('STR.SETTINGS')
    }
  };
}

function init() {
  logger.logDebug('tray', 'init');

  initItems();
  initContextMenus();
  initSettings();
  initTray();
  registerEvents();
  registerIcpMainEvents();
  initBrowserWindow();
}

module.exports = {
  init: init,
  destroy: destroy
};
