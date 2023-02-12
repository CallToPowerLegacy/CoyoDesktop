/**
 * COYO Desktop
 * 
 * (c) Copyright 2017 Denis Meyer. All rights reserved.
 */
'use strict';

const path = require('path');
const loadJsonFile = require('load-json-file');
const _ = require('lodash');

const constants = require('./constants');
const logger = require('./logger');

let currentLanguage;
let translations = {};

function getFilePath(filename) {
  logger.logDebug('i18n', 'getFilePath', 'filename = ' + filename);

  let filePath;
  if (constants.isWindows()) {
    if (process.execPath.endsWith('electron.exe')) {
      filePath = filename;
    } else {
      filePath = path.join(process.resourcesPath, 'app', filename);
    }
  } else {
    if (process.execPath.endsWith('Electron')) {
      filePath = filename;
    } else {
      filePath = path.join(process.resourcesPath, 'app', filename);
    }
  }

  return filePath;
}

function get(key) {
  // logger.logDebug('i18n', 'get', key);

  let value = _.get(translations[currentLanguage], key);
  return value ? value : key;
}

function init(locale, callback) {
  logger.logDebug('i18n', 'init', 'locale = ' + locale);

  locale = _.replace(locale, new RegExp('-', 'g'), '_');

  if (translations[locale]) {
    return translations[locale];
  }

  currentLanguage = 'en_US';
  if (locale === 'de_DE') {
    currentLanguage = 'de_DE';
  }
  logger.logDebug('i18n', 'parsed language = \'' + currentLanguage + '\'');
  const fileName = 'i18n/' + currentLanguage + '.json';

  let filePath = getFilePath(fileName);
  logger.logDebug('i18n', 'Trying to get file = \'' + filePath + '\'');

  loadJsonFile(filePath).then((json) => {
    logger.logDebug('i18n', 'loadJsonFile');

    translations[currentLanguage] = json;
    if (callback) {
      callback(json);
    }
  });
}

module.exports = {
  init: init,
  get: get
};
