(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.apiClients')
      .directive('oyocApiClientOptions', apiClientOptions);

  /**
   * @ngdoc directive
   * @name coyo.admin.apiClients.oyocApiClientOptions:oyocApiClientOptions
   * @restrict 'E'
   *
   * @description
   * Context menu options for api client list.
   *
   * @param {object} actions actions
   * @param {object} apiClient api client
   */
  function apiClientOptions() {
    return {
      restrict: 'E',
      templateUrl: 'app/modules/admin/api-clients/components/api-client-options/api-client-options.html',
      scope: {},
      bindToController: {
        actions: '<',
        apiClient: '<'
      },
      controller: function () {},
      controllerAs: '$ctrl'
    };
  }

})(angular);
