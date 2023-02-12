(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoConfirmButton', confirmButton)
      .controller('ConfirmButtonController', ConfirmButtonController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoConfirmButton:coyoConfirmButton
   * @scope
   * @restrict 'E'
   * @element ANY
   *
   * @description
   * Displays confirmation buttons.
   *
   * On the first click on the button, the user gets asked whether to to a specified task.
   *
   * If the user clicks again, the task will be executed.
   *
   * If the user does not click within specified seconds, the button resets to the initial state.
   *
   * @requires $translate
   * @requires $interval
   *
   * @param {string} cbIconClass The i tag (icon) class
   * @param {function} cbOnClick Function to call on confirmation (second) click
   * @param {string} cbStr The button name (i18n message key)
   * @param {string} cbStrOnClick The button name after a click (i18n message key)
   * @param {string} cbMillisecondsToReset The ms until the confirmation dialog resets. Default value is '5000' (ms)
   */
  function confirmButton() {
    return {
      restrict: 'E',
      replace: true,
      template: '<a ng-click="$ctrl.onCBClick($event)"><i class="{{ $ctrl.cbIconClass }}"></i>{{ $ctrl.btnStr }}</a>',
      scope: {},
      bindToController: {
        cbIconClass: '@',
        cbOnClick: '&',
        cbStr: '@',
        cbStrOnClick: '@',
        cbMillisecondsToReset: '@'
      },
      controller: 'ConfirmButtonController',
      controllerAs: '$ctrl'
    };
  }

  function ConfirmButtonController($translate, $interval) {
    var vm = this;

    var clicked = false;
    var msToReset = _.isUndefined(vm.cbMillisecondsToReset) ? 5000 : parseInt(vm.cbMillisecondsToReset);
    if (isNaN(msToReset)) {
      throw 'NumberFormatException (Not a number: ' + msToReset + ')';
    }

    vm.onCBClick = onCBClick;
    $translate(vm.cbStr).then(function (str) {
      vm.btnStr = str;
    });

    function onCBClick($event) {
      $event.stopPropagation();

      if (clicked) {
        vm.cbOnClick();
      }
      $translate(vm.cbStrOnClick).then(function (str) {
        vm.btnStr = str;
      });
      clicked = true;

      $interval(function () {
        $translate(vm.cbStr).then(function (str) {
          vm.btnStr = str;
        });
        clicked = false;
      }, msToReset, 1);
    }
  }

})(angular);
