(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.themes')
      .directive('oyocThemeOptions', themeOptions);

  /**
   * @ngdoc directive
   * @name coyo.admin.themes.oyocThemeOptions:oyocThemeOptions
   * @restrict 'E'
   *
   * @description
   * Context menu options for theme list.
   *
   * @param {object} actions actions
   * @param {object} theme theme
   */
  function themeOptions() {
    return {
      restrict: 'E',
      templateUrl: 'app/modules/admin/themes/components/theme-options/theme-options.html',
      scope: {},
      bindToController: {
        actions: '<',
        theme: '<'
      },
      controller: function () {},
      controllerAs: '$ctrl'
    };
  }

})(angular);
