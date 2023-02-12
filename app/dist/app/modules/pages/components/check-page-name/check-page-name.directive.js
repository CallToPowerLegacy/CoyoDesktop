(function (angular) {
  'use strict';

  angular
      .module('coyo.pages')
      .directive('coyoCheckPageName', checkPageName);

  /**
   * @ngdoc directive
   * @name coyo.pages.coyoCheckPageName:coyoCheckPageName
   * @element A
   *
   * @description
   * Validates a page name.
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div ng-controller="ExampleCtrl">
   *       <input type="text" coyo-check-page-name>
   *
   *       <input type="text" coyo-check-page-name="pageId">
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', [])
   *       .controller('ExampleCtrl', ExampleCtrl);
   *
   *     function ExampleCtrl($scope) {
   *       $scope.pageId = 'PageId';
   *     }
   *   </file>
   * </example>
   */
  function checkPageName($http, $q, $window, coyoEndpoints) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, element, attrs, ngModel) {
        ngModel.$asyncValidators.pageName = function (modelValue) {
          if (modelValue) {
            return $http({
              method: 'GET',
              url: coyoEndpoints.page.checkName.replace('{name}', $window.encodeURIComponent(modelValue))
                  .replace('{pageId}', attrs.coyoCheckPageName)
            }).then(function (r) {
              return r.data.taken ? $q.reject() : true;
            });
          } else {
            return $q.resolve(true);
          }
        };
      }
    };
  }

})(angular);
