(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoCheckAppSlug', checkAppSlug);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCheckSenderSlug:coyoCheckAppSlug
   * @element A
   *
   * @description
   * Validates an app slug.
   *
   * @requires $http
   * @requires $q
   * @requires commons.config.coyoEndpoints
   *
   * @params {string} coyo-check-sender-slug-context The sender ID of the app
   * @params {string} [coyo-check-sender-slug] The app ID
   */
  function checkAppSlug($http, $q, coyoEndpoints) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, element, attrs, ngModel) {
        ngModel.$asyncValidators.appSlug = function (modelValue) {
          if (modelValue) {
            return $http({
              method: 'GET',
              url: coyoEndpoints.sender.apps.checkSlug
                  .replace('{senderId}', attrs.coyoCheckAppSlugContext)
                  .replace('{slug}', modelValue)
                  .replace('{appId}', attrs.coyoCheckAppSlug || '')
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
