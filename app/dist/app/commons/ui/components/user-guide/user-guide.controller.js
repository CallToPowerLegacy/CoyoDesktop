(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .controller('UserGuideController', UserGuideController);

  /**
   * @ngdoc service
   * @name commons.ui.UserGuideController
   *
   * @description
   * Renders a user guide or error/not found pages.
   *
   * @requires $http
   * @requires commons.ui.userGuideService
   * @requires key
   */
  function UserGuideController($http, userGuideService, key) {
    var vm = this;

    vm.key = key;
    vm.loading = true;
    vm.userGuideUrl = userGuideService.getUserGuideMainUrl();

    userGuideService.getGuideDefinition(key).then(function (guide) {
      vm.guide = guide;

      $http({
        method: 'GET',
        url: userGuideService.getGuideUrl(key),
        autoHandleErrors: false
      }).then(function (response) {
        vm.content = response.data;
      }).catch(function () {
        vm.notFound = true;
      }).finally(function () {
        vm.loading = false;
      });
    }).catch(function () {
      vm.error = true;
      vm.loading = false;
    });
  }

})(angular);
