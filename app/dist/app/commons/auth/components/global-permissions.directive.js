(function (angular) {
  'use strict';

  angular
      .module('commons.auth')
      .directive('coyoGlobalPermissions', GlobalPermissions);

  /**
   * @ngdoc directive
   * @name commons.auth:coyoGlobalPermissions
   * @restrict 'AE'
   *
   * @description
   * Directive to hide an element (via CSS) if the current user does not have the provided global permission.
   * Visibility status updates automatically when the current user is updated.
   * A custom class is used for hiding instead of a common one to avoid conflicts when the element is hidden by
   * a different directive.
   *
   * @param {string} coyoGlobalPermissions comma-separated list of global permissions names that allow access to this
   * element (if more than one permission is provided, any single permitted one will show the element).
   *
   * @param {boolean} [requireAllPermissions] flag if set then all provided permissions must be set, otherwise a single
   * one is sufficient.
   *
   * @requires commons.auth.authService
   */
  function GlobalPermissions(authService) {
    return {
      restrict: 'AE',
      scope: false,
      link: function (scope, element, attrs) {
        var permissionNames = attrs.coyoGlobalPermissions || attrs.permissions;
        var requireAll = attrs.requireAllPermissions;
        authService.onGlobalPermissions(permissionNames, function (permission) {
          element[permission ? 'removeClass' : 'addClass']('global-permissions-hidden');
        }, requireAll);
      }
    };
  }

})(angular);
