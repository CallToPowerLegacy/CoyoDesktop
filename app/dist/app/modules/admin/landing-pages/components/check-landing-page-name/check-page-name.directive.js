(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.landingPages')
      .directive('coyoCheckLandingPageName', checkLandingPageName);

  /**
   * @ngdoc directive
   * @name coyo.admin.landingPages.coyoCheckLandingPageName:coyoCheckLandingPageName
   * @element A
   *
   * @description
   * Validates a landing page name.
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div ng-controller="ExampleCtrl">
   *       <input type="text" coyo-check-landing-page-name>
   *
   *       <input type="text" coyo-check-landing-page-name="pageId">
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', [])
   *       .controller('ExampleCtrl', ExampleCtrl);
   *
   *     function ExampleCtrl($scope) {
   *       $scope.pageId = 'LandingPageId';
   *     }
   *   </file>
   * </example>
   */
  function checkLandingPageName($http, $q, $window, coyoEndpoints) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, element, attrs, ngModel) {
        ngModel.$asyncValidators.pageName = function (modelValue) {
          if (modelValue) {
            return $http({
              method: 'GET',
              url: coyoEndpoints.landingPage.checkName.replace('{name}', $window.encodeURIComponent(modelValue))
                  .replace('{pageId}', attrs.coyoCheckLandingPageName)
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
