(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories')
      .component('coyoCheckUserDirectoryConnection', checkUserDirectoryConnection())
      .controller('CheckUserDirectoryConnectionController', CheckUserDirectoryConnectionController);

  /**
   * @ngdoc directive
   * @name coyo.admin.userDirectories.coyoCheckUserDirectoryConnection:coyoCheckUserDirectoryConnection
   * @restrict E
   * @scope
   *
   * @description
   * Renders a button to check the connection settings for the user directory with the given type.
   *
   * @param {string} type
   * The type of the directory.
   * @param {object} settings
   * The connection settings of the directory.
   *
   * @requires $timeout
   * @requires coyo.domain.UserDirectoryModel
   */
  function checkUserDirectoryConnection() {
    return {
      scope: {},
      controller: 'CheckUserDirectoryConnectionController',
      controllerAs: '$ctrl',
      templateUrl: 'app/modules/admin/user-directories/components/check-user-directory-connection/check-user-directory-connection.html',
      bindings: {
        directory: '<',
        type: '@',
        settings: '<'
      }
    };
  }

  function CheckUserDirectoryConnectionController($timeout, UserDirectoryModel) {
    var vm = this;
    var stateDefault = {iconClass: 'zmdi-wifi-alt', btnClass: 'btn-default'};
    var stateLoading = {iconClass: 'zmdi-spinner zmdi-hc-spin', btnClass: 'btn-default'};
    var stateSuccess = {iconClass: 'zmdi-check', btnClass: 'btn-success'};
    var stateError = {iconClass: 'zmdi-alert-circle', btnClass: 'btn-danger'};

    vm.state = stateDefault;
    vm.error = null;

    vm.checkConnection = checkConnection;

    function checkConnection() {
      if (vm.state !== stateDefault) {
        return;
      }

      vm.loading = true;
      vm.state = stateLoading;
      if (vm.directory.id) {
        checkForExistingDirectory();
      } else {
        checkForNewDirectory();
      }
    }

    function checkForExistingDirectory() {
      vm.directory.checkConnection(vm.settings)
          .then(handleSuccess)
          .catch(handleError)
          .finally(finalize);
    }

    function checkForNewDirectory() {
      UserDirectoryModel.checkConnection(vm.type, vm.settings)
          .then(handleSuccess)
          .catch(handleError)
          .finally(finalize);
    }

    function handleError(msg) {
      vm.state = stateError;
      vm.error = msg;
    }
    function finalize() {
      vm.loading = false;
      $timeout(function () {
        vm.state = stateDefault;
      }, 1000);
    }

    function handleSuccess() {
      vm.state = stateSuccess;
      vm.error = null;
    }
  }

})(angular);
