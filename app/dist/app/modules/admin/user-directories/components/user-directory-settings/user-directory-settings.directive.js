(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories')
      .component('oyocUserDirectorySettings', userDirectorySettings())
      .controller('UserDirectorySettingsController', UserDirectorySettingsController);

  /**
   * @ngdoc directive
   * @name coyo.admin.userDirectories.oyocUserDirectorySettings:oyocUserDirectorySettings
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the settings form of the given user directory.
   *
   * @param {string} type
   * The type of the user directory to display the options for.
   * @param {object} settings
   * The settings of the user directory to display the options for.
   * @param {object} syncJob
   * The synchronization job that is associated with the directory.
   *
   * @requires $compile
   * @requires coyo.admin.userDirectories.api.userDirectoryTypeRegistryProvider
   */
  function userDirectorySettings() {
    return {
      scope: {},
      controller: 'UserDirectorySettingsController',
      controllerAs: '$ctrl',
      template: '<div></div>',
      bindings: {
        form: '<',
        directory: '=',
        validationErrors: '<'
      }
    };
  }

  function UserDirectorySettingsController($compile, $element, $scope, userDirectoryTypeRegistry) {
    var vm = this;

    var initSettings = angular.copy(vm.directory.settings);
    var allSettings = {};

    $scope.$watch(function () {
      return vm.directory.type;
    }, function (newVal, oldVal) {
      if (!newVal) {
        return;
      }
      if (oldVal) {
        allSettings[oldVal] = angular.copy(vm.directory.settings);
      }
      _.set(vm, 'directory.settings', allSettings[newVal] || angular.copy(initSettings));

      var userDirectory = userDirectoryTypeRegistry.get(newVal);
      var childDirective = angular.element('<' + userDirectory.directive + ' form="$ctrl.form" ng-model="$ctrl.directory" validation-errors="$ctrl.validationErrors"></' + userDirectory.directive + '>');
      $element.html(childDirective);
      $compile($element.contents())($scope);
    });
  }

})(angular);
