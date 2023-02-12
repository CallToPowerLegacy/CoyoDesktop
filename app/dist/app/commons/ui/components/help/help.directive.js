(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoHelp', help)
      .controller('HelpController', HelpController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoHelp:coyoHelp
   * @restrict 'E'
   *
   * @description
   * Renders a help icon with an info text in a tooltip.
   *
   * @param {string} tip The tooltip text
   * @param {string} placement Where to place the tooltop (see uib)
   * @param {string} link The external link to open when the help icon is clicked
   * @param {string} guide The user guide to open when the help icon is clicked
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div ng-controller="ExampleCtrl">
   *       <coyo-help tip="tooltip" placement="top" link="http://www.google.de"></coyo-help>
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', [])
   *       .controller('ExampleCtrl', ExampleCtrl);
   *
   *     function ExampleCtrl($scope) {
   *       $scope.tooltip = 'Some tooltip';
   *     }
   *   </file>
   * </example>
   */
  function help() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/help/help.html',
      replace: false, // not working inside ng-repeat with replace: true
      scope: true,
      bindToController: {
        tip: '@',
        placement: '@',
        link: '@',
        guide: '@'
      },
      controller: 'HelpController',
      controllerAs: '$ctrl'
    };
  }

  function HelpController(userGuideService) {
    var vm = this;

    vm.placement = vm.placement || 'left';

    vm.click = click;

    function click($event) {
      if (vm.guide) {
        $event.preventDefault();
        userGuideService.open(vm.guide);
      }
    }
  }

})(angular);
