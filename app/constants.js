/**
 * COYO Desktop
 * 
 * (c) Copyright 2017 Denis Meyer. All rights reserved.
 */
'use strict';

const intervals = {
  refresh: {
    posts: 60000,
    messages: 60000
  }
};
const isWin = /^win/.test(process.platform);

const presenceStatus = 'I am using the COYO Desktop app, check it out: http://bit.ly/coyo4desktop';

const release = true;
const debug = {
  debug: true,
  angular: true,
  devTools: true,
  blur: false
};

const logLevel = debug.debug ? 'DEBUG' : (release ? 'WARNING' : 'INFO');

const standardFiles = {
  styles: [
    'dist/styles/vendor-08d1f7810b.css',
    'dist/styles/app-50d34c9188.css'
  ],
  scripts: [
    'assets/scripts/angular/config.js',
    'dist/scripts/vendor-b2e8d27574.js',
    'dist/scripts/app-3e9cbca31c.js',
    'assets/scripts/angular/index.js'
  ],
  client: {
    style: 'assets/styles/client.css'
  }
};

const values = {
  raiseNotificationTimeoutTime: 500
}

function getPresenceStatus() {
  return presenceStatus;
}

function getIntervals() {
  return intervals;
}

function isWindows() {
  return isWin;
}

function isDebug() {
  return !release && debug.debug;
}

function isDebugAngular() {
  return isDebug() && debug.debugAngular;
}

function isDevTools() {
  return isDebug() && debug.devTools;
}

function isBlur() {
  return !isDebug() || (isDebug() && debug.blur);
}

function isRelease() {
  return release;
}

function getLogLevel() {
  return logLevel;
}

function getStandardFiles() {
  return standardFiles;
}

function getImagePaths() {
  return {
    logoHD: 'assets/images/logo-hd.png',
    logoMid: 'assets/images/logo-mid.png',
    logo: 'assets/images/logo.png',
    notification: 'assets/images/notification.png',
    post: 'assets/images/post.png',
    message: 'assets/images/message.png',
    notificationInverted: 'assets/images/notification-inverted.png',
    postInverted: 'assets/images/post-inverted.png',
    messageInverted: 'assets/images/message-inverted.png',
    tray: 'assets/images/tray.png',
    trayGray: 'assets/images/tray-gray.png',
    trayNew: 'assets/images/tray-new.png'
  };
}

function getValues() {
  return values;
}

module.exports = {
  getPresenceStatus: getPresenceStatus,
  getIntervals: getIntervals,
  isWindows: isWindows,
  isDebug: isDebug,
  isDebugAngular: isDebugAngular,
  isDevTools: isDevTools,
  isBlur: isBlur,
  isRelease: isRelease,
  getLogLevel: getLogLevel,
  getStandardFiles: getStandardFiles,
  getImagePaths: getImagePaths,
  getValues: getValues
};
