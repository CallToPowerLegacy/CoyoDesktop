(function () {
  'use strict';

  angular.module('coyo.apps.list')
      .factory('listEntryDetailsService', ListEntryDetailsService);

  /**
   * @ngdoc service
   * @name coyo.apps.list.listEntryDetailsService
   *
   * @description
   * Service for common functions of the list entry detail view that must be shared between different controllers
   */
  function ListEntryDetailsService() {

    var currentContext;
    var editCompleteHandler = function () {
    };

    return {
      setCurrentContext: setCurrentContext,
      getCurrentContext: getCurrentContext,
      editComplete: editComplete,
      registerEditCompleteHandler: registerEditCompleteHandler
    };

    /**
     * @ngdoc method
     * @name coyo.apps.list.listEntryDetailsService#setCurrentContext
     * @methodOf coyo.apps.list.listEntryDetailsService
     *
     * @description
     * Sets the context of the list entry
     *
     * @param {Object} {senderId, appId, entryId}
     */
    function setCurrentContext(context) {
      currentContext = context;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.list.listEntryDetailsService#getCurrentContext
     * @methodOf coyo.apps.list.listEntryDetailsService
     *
     * @description
     * Returns the context of the currently viewed list entry
     *
     * @returns {Object} requestCallback {senderId, appId, entryId}}
     */
    function getCurrentContext() {
      return currentContext;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.list.listEntryDetailsService#registerEditCompleteHandler
     * @methodOf coyo.apps.list.listEntryDetailsService
     *
     * @description
     * Registers a callback that is called when the opened list entry has been edited
     *
     * @param {requestCallback} handler is called when edit complete event is thrown
     */
    function registerEditCompleteHandler(handler) {
      editCompleteHandler = handler;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.list.listEntryDetailsService#registerEditCompleteHandler
     * @methodOf coyo.apps.list.listEntryDetailsService
     *
     * @description
     * Calls the registered edit callback
     *
     * @param {Object} entry the edited list entry
     */
    function editComplete(entry) {
      editCompleteHandler(entry);
    }
  }
})();
