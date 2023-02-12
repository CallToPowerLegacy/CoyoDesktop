(function (angular) {
  'use strict';

  angular
      .module('commons.startup')
      .provider('curtainService', curtainServiceProvider);

  /**
   * @ngdoc service
   * @name commons.startup.curtainServiceProvider
   *
   * @description
   * Modules can use the curtain service provider to register themselves as component to wait for. The curtain gets
   * released once all registered modules have called {@link commons.startup.curtainService curtainService#loaded}.
   */
  function curtainServiceProvider() {
    var waitingFor = [];

    return {
      $get: CurtainService,
      register: register
    };

    /**
     * @ngdoc service
     * @name commons.startup.curtainService
     *
     * @description
     * Provides methods for marking a component as loaded and for displaying and hiding the application curtain.
     *
     * The service can be used to
     * * mark a component as loaded,
     * * show the curtain and
     * * hide the curtain.
     *
     * @requires $rootScope
     * @requires $log
     */
    function CurtainService($rootScope, $log) {
      $rootScope.curtain = {loading: false, blankOnly: true};

      var service = {
        loaded: loaded,
        hide: hide,
        show: show,
        blankOnly: blankOnly
      };

      return service;

      /**
       * @ngdoc function
       * @name commons.startup.curtainService#loaded
       * @methodOf commons.startup.curtainService
       *
       * @description
       * Marks a given component as loaded. The passed key must be the same that was used when registering the
       * component via {@link commons.startup.curtainServiceProvider curtainServiceProvider#register}.
       *
       * @param {string} key The key of the component to be marked as loaded
       */
      function loaded(key) {
        $log.debug('[curtainService] Loaded component with name "' + key + '"');
        waitingFor = _.without(waitingFor, key);
        if (!waitingFor.length) {
          hide();
        }
      }

      /**
       * @ngdoc function
       * @name commons.startup.curtainService#show
       * @methodOf commons.startup.curtainService
       *
       * @description
       * Displays the application curtain.
       */
      function show() {
        $log.debug('[curtainService] Showing');
        $rootScope.curtain.loading = true;
      }

      /**
       * @ngdoc function
       * @name commons.startup.curtainService#hide
       * @methodOf commons.startup.curtainService
       *
       * @description
       * Hides the application curtain.
       */
      function hide() {
        $log.debug('[curtainService] Hiding');
        $rootScope.curtain.loading = false;
      }

      /**
       * @ngdoc function
       * @name commons.startup.curtainService#blankOnly
       * @methodOf commons.startup.curtainService
       *
       * @description
       * Enable "blank" mode for the curtain, where it (temporarily) only displays a blank screen until the custom css
       * is loaded.
       *
       * @param {boolean} isBlank
       * If true the curtain will be blank, if false the curtain will be visible normally.
       */
      function blankOnly(isBlank) {
        $rootScope.curtain.blankOnly = isBlank;
      }
    }

    /**
     * @ngdoc method
     * @name commons.startup.curtainServiceProvider#register
     * @methodOf commons.startup.curtainServiceProvider
     *
     * @description
     * Register as a component to wait for until the curtain gets released. The curtain is hidden if all registered
     * components have called {@link commons.startup.curtainService curtainService#loaded}. The component gets
     * identified by a certain key passed to the register method and the loaded method. This must be the same key.
     *
     * @param {string} key
     * A unique key to identify the component. The very same key must be passed to
     * {@link commons.startup.curtainService curtainService#loaded} to mark the registered component as ready.
     */
    function register(key) {
      // console.log('[CurtainServiceProvider] Registering component with key [' + key + ']');
      waitingFor.push(key);
    }

  }

})(angular);
