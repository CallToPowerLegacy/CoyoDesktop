(function () {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoWizard', coyoWizard);

  function coyoWizard() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        active: '=',
        states: '='
      },
      templateUrl: 'app/commons/ui/components/wizard/wizard.html'
    };
  }
})();
