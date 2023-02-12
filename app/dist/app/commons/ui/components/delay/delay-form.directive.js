(function () {
  'use strict';

  angular.module('commons.ui')
      .directive('coyoDelayForm', CoyoDelayForm);

  function CoyoDelayForm($parse) {
    return {
      restrict: 'A',
      require: 'form',
      link: function (scope, elem, attrs) {
        var snapshot = null;

        // watch model reference - no deep watch!
        // to manually trigger copy, use angular.extend({}, model)
        scope.$watch(attrs.coyoDelayForm, function (newVal) {
          if (newVal && newVal.restangularized === true) {
            // restangular can't handle angular.copy! :-(
            snapshot = newVal.clone();
          } else {
            snapshot = angular.copy(newVal);
          }
        });

        var unsubscribe = scope.$on('coyo.base:coyoDelayForm-refreshModel', function (e, newModel) {
          if (newModel && newModel.restangularized === true) {
            // restangular can't handle angular.copy! :-(
            snapshot = newModel.clone();
          } else {
            snapshot = angular.copy(newModel);
          }
        });

        scope.$on('$destroy', unsubscribe);

        elem.on('reset', function (event) {
          event.preventDefault();
          scope.$eval(attrs.ngReset);
          scope.$apply(function () {
            $parse(attrs.coyoDelayForm).assign(scope, snapshot);
          });
        });
      }
    };
  }

})();
