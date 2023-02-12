(function (angular) {
  'use strict';

  angular
      .module('commons.target')
      .provider('targetService', targetService);

  /**
   * @ngdoc service
   * @name commons.target.targetService
   *
   * @description
   * Can resolve targets from the backend into correct frontend routing.
   * This service is responsible for loading the according target state.
   *
   * This provider/service works as follows:
   * 1. A backend may provide a target to open.
   * 2. The target and the way to resolve it have to be registered during configuration phase of this provider.
   * 3. After registration, this service is responsible for loading the according state and redirects accordingly.
   *
   * @requires $window
   * @requires $log
   */
  function targetService() {
    var targetTypes = {};

    /**
     * @ngdoc function
     * @name commons.target.targetService#register
     * @methodOf commons.target.targetService
     *
     * @description
     * # Provider configuration phase #
     * Registers a resolve function for a target type during the configuration phase of this provider.
     * The resolve function must return a promise that is fulfilled when the state has changed successfully.
     *
     * @param {string} name The name of the target
     * @param {function} goFn The function to be registered
     */
    this.register = function (name, goFn) {
      targetTypes[name] = goFn;
    };

    this.$get = function ($window, $log, $injector, $q, authService) {

      /**
       * @ngdoc function
       * @name commons.target.targetService#go
       * @methodOf commons.target.targetService
       *
       * @description
       * Resolves a given target and calls the registered function.
       *
       * @param {object} target The target
       */
      function go(target) {
        var goFn = targetTypes[target.name];
        if (goFn) {
          return $injector.invoke(goFn, undefined, {params: target.params});
        } else {
          $log.error('[targetService] Unknown target', target);
          throw '[targetService] Unknown target';
        }
      }

      /**
       * @ngdoc function
       * @name commons.target.targetService#onCanLinkTo
       * @methodOf commons.target.targetService
       *
       * @description
       * Checks whether the current user is allowed to open the link based on his global permissions.
       * The callback is called immediately and any time the current user is updated and the result of the permission check changes.
       *
       * @param {object} target The target
       * @param {function(boolean)} callback will be executed with the result of the permission check
       *
       * @return {object} promise that resolves to the de-registration function for the user change event (call this on scope destroy)
       */
      function onCanLinkTo(target, callback) {
        authService.getUser().then(function (currentUser) {
          var permissionName;
          switch (target.name) {
            case 'user':
              permissionName = currentUser.id === target.params.id ? 'ACCESS_OWN_USER_PROFILE' : 'ACCESS_OTHER_USER_PROFILE';
              break;
            case 'page':
              permissionName = 'ACCESS_PAGES';
              break;
            case 'workspace':
              permissionName = 'ACCESS_WORKSPACES';
              break;
            case 'event':
              permissionName = 'ACCESS_EVENTS';
              break;
          }
          if (permissionName) {
            authService.onGlobalPermissions(permissionName, callback);
          } else {
            callback(true);
          }
        });
      }

      return {
        go: go,
        onCanLinkTo: onCanLinkTo
      };
    };
  }

})(angular);
