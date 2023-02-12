(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoCheckMatches', checkMatches);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCheckMatches:coyoCheckMatches
   * @scope
   * @restrict 'A'
   * @element ANY
   *
   * @description
   * Matches model values in forms using a regexp (adds <em>'matches'</em> to the validation).
   *
   * @requires $parse
   *
   * @param {string} coyo-check-matches The regular expression
   */
  function checkMatches($parse) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$validators.matches = function (modelValue) {
          if (!modelValue || modelValue === '') {
            return true;
          }
          return modelValue.match($parse(attrs.coyoCheckMatches)(scope)) !== null;
        };
      }
    };
  }

})(angular);
