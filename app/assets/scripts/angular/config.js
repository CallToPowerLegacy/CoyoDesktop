/**
 * COYO Desktop
 * 
 * (c) Copyright 2017 Denis Meyer. All rights reserved.
 */
'use strict';

let constants = require('./constants');
let i18n = require('./i18n');

let Config = {
  applicationName: i18n.get('APPLICATION.NAME'),
  debug: constants.isDebugAngular()
};
