(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.api')
      .factory('widgetEditService', widgetEditService);

  /**
   * @ngdoc service
   * @name coyo.widgets.api.widgetEditService
   *
   * @description
   * This service determines the 'switchability' of the global "Edit View"-mode. The mode is switchable if the current
   * state contains widget layouts or widget slots that can be toggled via the "Edit View" button and if the current
   * user has the permissions to do so. Calls to this service are handled internally by the widget layout directive and
   * the widget slot directive. There is no need to call this service explicitly.
   *
   * @requires commons.auth.authService
   */
  function widgetEditService(authService) {
    var manageGlobal = false;
    var registry = {};

    var ViewEditService = {
      switchable: false,
      isSwitchable: isSwitchable,
      register: register,
      deregister: deregister,
      reset: reset
    };

    _init();

    return ViewEditService;

    // ----------

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetEditService#isSwitchable
     * @methodOf coyo.widgets.api.widgetEditService
     *
     * @description
     * Returns the current state of the 'switchability' of the "Edit View"-mode.
     *
     * @returns {boolean} true if the "Edit View"-mode is currently switchable.
     */
    function isSwitchable() {
      return ViewEditService.switchable;
    }

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetEditService#register
     * @methodOf coyo.widgets.api.widgetEditService
     *
     * @description
     * Registers the widget layout or slot with the given name.
     *
     * @params {string} the name of the layout or slot
     */
    function register(name, global) {
      registry[name] = !!global;
      _assign();
    }

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetEditService#deregister
     * @methodOf coyo.widgets.api.widgetEditService
     *
     * @description
     * Deregisters the widget layout or slot with the given name.
     *
     * @params {string} the name of the layout or slot
     */
    function deregister(name) {
      delete registry[name];
      _assign();
    }

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetEditService#reset
     * @methodOf coyo.widgets.api.widgetEditService
     *
     * @description
     * Resets the registry of this service.
     */
    function reset() {
      registry = {};
      _assign();
    }

    // ----------

    function _assign() {
      var globals = _.values(registry);
      ViewEditService.switchable = !_.every(globals) || _.some(globals) && manageGlobal;
    }

    function _init() {
      authService.onGlobalPermissions('MANAGE_GLOBAL_WIDGETS', function (value) {
        manageGlobal = !!value;
        _assign();
      });
    }
  }

})(angular);
