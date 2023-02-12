(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('sidebarService', sidebarService);

  /**
   * @ngdoc service
   * @name commons.ui.sidebarService
   *
   * @description
   * Can be used to open, close or toggle sidebars.
   *
   * Sidebars which want to be managed by this service have to be registered first.
   * Therefore, an API has to be exposed containing a name and the methods <em>'open'</em> and <em>'close'</em>.
   *
   * @requires $rootScope
   * @requires $log
   * @requires commons.mobile.mobileEventsService
   */
  function sidebarService($rootScope, $log, mobileEventsService) {
    var sidebars = {};
    var lastState;

    $rootScope.$on('backdrop:hidden', function () {
      closeAll();
    });

    return {
      register: register,
      open: open,
      close: close,
      closeAll: closeAll
    };

    /**
     * @ngdoc function
     * @name commons.ui.sidebarService#register
     * @methodOf commons.ui.sidebarService
     *
     * @description
     * Registers a new sidebar to be managed with this service.
     *
     * The sidebar has to expose an api containing a name and the methods <em>'open'</em> and <em>'close'</em>.
     *
     * If one of the methods or the name are undefined, an error is logged and no service is registered.
     *
     * @param {object} api The api exposed by the sidebar.
     */
    function register(api) {
      $log.debug('[sidebarService] Register sidebar with name "' + api.name + '"');
      if (api && api.name && api.open && api.close && api.isOpen) {
        sidebars[api.name] = api;
      } else {
        $log.error('[sidebarService] Error while registering new sidebar. API not sufficient.', api);
      }
    }

    /**
     * @ngdoc function
     * @name commons.ui.sidebarService#open
     * @methodOf commons.ui.sidebarService
     *
     * @description
     * Opens the sidebar with the given name. If no sidebar with this name could be found, an error is logged.
     *
     * @param {string} name The name of the sidebar that should be openend. This may not be undefined or empty.
     */
    function open(name) {
      if (sidebars[name]) {
        sidebars[name].open();
        _notifyMobileApp();
      } else {
        $log.error('[sidebarService] Error while opening sidebar. Sidebar with name "' + name + '" could not be found.');
      }
    }

    /**
     * @ngdoc function
     * @name commons.ui.sidebarService#close2
     * @methodOf commons.ui.sidebarService
     *
     * @description
     * Closes the sidebar with the given name. If no sidebar with this name could be found, an error is logged.
     *
     * @param {string} name The name of the sidebar that should be closed. This may not be undefined or empty.
     */
    function close(name) {
      if (sidebars[name]) {
        sidebars[name].close();
        _notifyMobileApp();
      } else {
        $log.error('[sidebarService] Error while closing sidebar. Sidebar with name "' + name + '" could not be found.');
      }
    }

    /**
     * @ngdoc function
     * @name commons.ui.sidebarService#closeAll
     * @methodOf commons.ui.sidebarService
     *
     * @description
     * Closes all registered and open sidebars.
     */
    function closeAll() {
      _.each(sidebars, function (sidebar) {
        close(sidebar.name);
      });
      _notifyMobileApp();
    }

    function _notifyMobileApp() {
      var state = _.includes(_.map(sidebars, function (sidebar) {
        return sidebar.isOpen();
      }), true);
      if (state !== lastState) {
        mobileEventsService.propagate('pull-to-refresh:sidebar:' + (state ? 'disabled' : 'enabled'));
        lastState = state;
      }
    }
  }

})(angular);
