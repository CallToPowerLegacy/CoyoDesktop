/**
 * COYO Desktop
 * 
 * (c) Copyright 2017 Denis Meyer. All rights reserved.
 */
'use strict';

const _ = require('lodash');

const constants = require('./constants');

const logLevels = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
};

function _log(prefix, className, objToBeLogged, obj) {
  if (_.isString(objToBeLogged)) {
    console.log('[' + prefix + '] - ' + className + '::' + objToBeLogged, obj ? obj : '');
  } else {
    console.log('[' + prefix + '] - ' + className, objToBeLogged, obj ? obj : '');
  }
}

function getLogLevels() {
  return logLevels;
}

function isDebug() {
  return constants.isDebug() && constants.getLogLevel() === logLevels.DEBUG;
}

function isInfo() {
  return isDebug() || constants.getLogLevel() === logLevels.INFO;
}

function isWarning() {
  return isDebug() || isInfo() || constants.getLogLevel() === logLevels.WARNING;
}

function isError() {
  return isDebug() || isInfo() || isWarning() || constants.getLogLevel() === logLevels.ERROR;
}

function logDebug(className, objToBeLogged, obj) {
  if (isDebug()) {
    _log('DBG', className, objToBeLogged, obj);
  }
}

function logInfo(className, objToBeLogged, obj) {
  if (isInfo()) {
    _log('INF', className, objToBeLogged, obj);
  }
}

function logWarning(className, objToBeLogged, obj) {
  if (isWarning()) {
    _log('WRN', className, objToBeLogged, obj);
  }
}

function logError(className, objToBeLogged, obj) {
  if (isError()) {
    _log('ERR', className, objToBeLogged, obj);
  }
}

module.exports = {
  getLogLevels: getLogLevels,
  isDebug: isDebug,
  isInfo: isInfo,
  isWarning: isWarning,
  isError: isError,
  logDebug: logDebug,
  logInfo: logInfo,
  logWarning: logWarning,
  logError: logError
};
