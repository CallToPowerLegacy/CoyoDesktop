(function (angular) {
  'use strict';

  angular
      .module('commons.startup')
      .directive('oyocCurtain', curtain)
      .controller('CurtainController', CurtainController);

  /**
   * @ngdoc directive
   * @name commons.startup.oyocCurtain:oyocCurtain
   * @element ANY
   *
   * @description
   * The curtain is displayed before all other DOM elements and only hides once all required components
   * are loaded.
   *
   * The required components are listed as an array in <em>$rootScope.curtain.waitingFor</em>, which is
   * initialized in the main app.
   *
   * @requires $translate
   */
  function curtain() {
    return {
      replace: true,
      templateUrl: 'app/commons/startup/components/curtain/curtain.html',
      controller: 'CurtainController',
      controllerAs: '$ctrl'
    };
  }

  function CurtainController($translate) {
    var vm = this;

    $translate('CURTAIN.LOADING.TIP_' + _.random(1, 30)).then(function (tip) {
      vm.tip = tip;
    });
  }

})(angular);
