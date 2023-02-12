(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoCheckSenderSlug', checkSenderSlug);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCheckSenderSlug:coyoCheckSenderSlug
   * @element A
   *
   * @description
   * Validates a sender slug.
   *
   * @requires $http
   * @requires $q
   * @requires commons.config.coyoEndpoints
   *
   * @params {string} [coyo-check-sender-slug] The sender ID
   */
  function checkSenderSlug($http, $q, coyoEndpoints) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, element, attrs, ngModel) {
        ngModel.$asyncValidators.senderSlug = function (modelValue) {
          if (modelValue) {
            return $http({
              method: 'GET',
              url: coyoEndpoints.sender.checkSlug
                  .replace('{slug}', modelValue)
                  .replace('{senderId}', attrs.coyoCheckSenderSlug || '')
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
