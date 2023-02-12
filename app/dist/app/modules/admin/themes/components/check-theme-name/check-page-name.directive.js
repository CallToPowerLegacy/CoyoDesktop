(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.themes')
      .directive('coyoCheckThemeName', checkThemeName);

  /**
   * @ngdoc directive
   * @name coyo.admin.themes.coyoCheckThemeName:coyoCheckThemeName
   * @element A
   *
   * @description
   * Validates a theme name.
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div ng-controller="ExampleCtrl">
   *       <input type="text" coyo-check-theme-name>
   *
   *       <input type="text" coyo-check-theme-name="themeId">
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', [])
   *       .controller('ExampleCtrl', ExampleCtrl);
   *
   *     function ExampleCtrl($scope) {
   *       $scope.themeId = 'themeId';
   *     }
   *   </file>
   * </example>
   */
  function checkThemeName($http, $q, $window, coyoEndpoints) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, element, attrs, ngModel) {
        ngModel.$asyncValidators.themeName = function (modelValue) {
          if (modelValue) {
            return $http({
              method: 'GET',
              url: coyoEndpoints.theme.checkName.replace('{name}', $window.encodeURIComponent(modelValue))
                  .replace('{themeId}', attrs.coyoCheckThemeName)
            }).then(function (r) {
              if (r.data.taken) {
                return $q.reject();
              }
              return true;
            });
          } else {
            return $q.resolve(true);
          }
        };
      }
    };
  }

})(angular);
