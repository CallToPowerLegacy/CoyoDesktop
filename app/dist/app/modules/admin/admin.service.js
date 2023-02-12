(function (angular) {
  'use strict';

  angular
      .module('coyo.admin')
      .factory('adminService', adminService);

  /**
   * @ngdoc service
   * @name coyo.admin.adminService
   *
   * @description
   * General service for admin module.
   *
   * @requires $rootScope
   */
  function adminService($rootScope) {

    return {
      isMobile: isMobile,
      initMobileCheck: initMobileCheck
    };

    /**
     * @ngdoc function
     * @name coyo.admin.adminService#isMobile
     * @methodOf coyo.admin.adminService
     *
     * @description
     * Decides whether the page is displayed on mobile device.
     *
     * @param {object} screenSize
     * The screen size to examine.
     * @returns {boolean} Mobile or not.
     */
    function isMobile(screenSize) {
      return screenSize.isXs || screenSize.isSm;
    }

    /**
     * @ngdoc function
     * @name coyo.admin.adminService#initMobileCheck
     * @methodOf coyo.admin.adminService
     *
     * @description
     * Decides whether the page is displayed on mobile device and registers event handler.
     *
     * @param {object} $scope
     * The scope object passed by the controller using this method.
     * @param {function} callback
     * The callback to be executed on screen size change.
     *
     * @returns {boolean} Mobile or not.
     */
    function initMobileCheck($scope, callback) {
      var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
        if (angular.isFunction(callback)) {
          callback(isMobile(screenSize), screenSize, event);
        }
      });
      $scope.$on('$destroy', unsubscribe);

      return isMobile($rootScope.screenSize);
    }
  }

})(angular);
