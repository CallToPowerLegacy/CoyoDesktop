(function () {
  'use strict';

  angular
      .module('commons.mobile')
      .factory('mobileStorageHandler', mobileStorageHandler);

  function mobileStorageHandler($rootScope, mobileServiceConfig, $log, $injector) {

    var mobileEventsService, mobileStorageService;

    return {
      getStorageValue: getStorageValue,
      setStorageValue: setStorageValue
    };

    /**
     * Persist a single value to the local storage. Parameter syntax:
     *
     *  {method: 'saveValue', argument: { key: 'The property name', value: 'The property value'}}
     *
     * For every change of a value, a broadcast "onMobileStorageValueChanged"
     * containing the new key-value-pair gets triggered.
     *
     * @param {object} argument
     * @private
     */
    function setStorageValue(argument) {
      if (!argument.key) {
        $log.error('[mobileStorageHandler::setStorageValue] The storage key is missing or invalid.');
        return;
      }
      mobileStorageService = mobileStorageService || $injector.get('mobileStorageService');
      mobileStorageService.set(argument.key, argument.value);
      $rootScope.$broadcast(mobileServiceConfig.mobileValueChangedEventName, {key: argument.key, value: argument.value});
    }

    /**
     * Read a single value from the local storage. Parameter syntax:
     *
     *  {method: 'getValue', argument: { key: 'The property name', default: 'The fallback value'}}
     *
     * The value will be propagated to the application with a postMessage event.
     *
     * @param {object} argument
     * @private
     */
    function getStorageValue(argument) {
      if (!argument.key) {
        $log.error('[mobileStorageHandler::getStorageValue] The storage key is missing or invalid.');
        return;
      }
      mobileStorageService = mobileStorageService || $injector.get('mobileStorageService');
      mobileEventsService = mobileEventsService || $injector.get('mobileEventsService');

      var value = mobileStorageService.get(argument.key, argument.default);
      mobileEventsService.propagate(mobileServiceConfig.getValueCallbackMethodName, {key: argument.key, value: value});
    }
  }
})();
