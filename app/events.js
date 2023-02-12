/**
 * COYO Desktop
 * 
 * (c) Copyright 2017 Denis Meyer. All rights reserved.
 */
'use strict';

const events = require('events');

const logger = require('./logger');

let mainEventEmitter = new events.EventEmitter();
let mainEvents = [];
let mainEventFunctions = {};

let trayEventEmitter = new events.EventEmitter();
let trayEvents = [];
let trayEventFunctions = {};

function getMainEventEmitter() {
  logger.logDebug('events', 'getMainEventEmitter');

  return mainEventEmitter;
}

function onMainEvent(event, func) {
  logger.logDebug('events', 'onMainEvent', event);

  mainEventEmitter.on(event, func);
  mainEvents.push(event);
  mainEventFunctions[event] = func;
}

function emitToMain(key, msg) {
  logger.logDebug('events', 'emitToMain');

  mainEventEmitter.emit(key, msg);
}

function getTrayEventEmitter() {
  logger.logDebug('events', 'getTrayEventEmitter');

  return trayEventEmitter;
}

function onTrayEvent(event, func) {
  logger.logDebug('events', 'onTrayEvent');

  trayEventEmitter.on(event, func);
  trayEvents.push(event);
  trayEventFunctions[event] = func;
}

function emitToTray(key, msg) {
  logger.logDebug('events', 'emitToTray');

  trayEventEmitter.emit(key, msg);
}

function getPostsEventEmitter() {
  logger.logDebug('events', 'getPostsEventEmitter');

  return postsEventEmitter;
}

function onPostsEvent(event, func) {
  logger.logDebug('events', 'onPostsEvent');

  postsEventEmitter.on(event, func);
  postsEvents.push(event);
  postsEventFunctions[event] = func;
}

function emitToPosts(key, msg) {
  logger.logDebug('events', 'emitToPosts');

  postsEventEmitter.emit(key, msg);
}

function destroy() {
  logger.logDebug('events', 'destroy');

  mainEvents.forEach(function(event) {
    mainEventEmitter.removeListener(event, mainEventFunctions[event]);
  });
  mainEvents = [];
  mainEventFunctions = {};

  trayEvents.forEach(function(event) {
    trayEventEmitter.removeListener(event, trayEventFunctions[event]);
  });
  trayEvents = [];
  trayEventFunctions = {};
}

module.exports = {
  getMainEventEmitter: getMainEventEmitter,
  onMainEvent: onMainEvent,
  emitToMain: emitToMain,
  getTrayEventEmitter: getTrayEventEmitter,
  onTrayEvent: onTrayEvent,
  emitToTray: emitToTray,
  destroy: destroy
};
