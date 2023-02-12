(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories')
      .component('oyocUserDirectoryOptions', userDirectoryOptions());

  /**
   * @ngdoc directive
   * @name coyo.admin.userDirectories.oyocUserDirectoryOptions:oyocUserDirectoryOptions
   * @restrict 'E'
   *
   * @description
   * Context menu options for user directory list.
   *
   * @param {object} actions the available user actions
   * @param {object} directory the user directory
   */
  function userDirectoryOptions() {
    return {
      scope: {},
      controller: angular.noop,
      controllerAs: '$ctrl',
      templateUrl: 'app/modules/admin/user-directories/components/user-directory-options/user-directory-options.html',
      bindings: {
        actions: '<',
        directory: '<'
      }
    };
  }

})(angular);
