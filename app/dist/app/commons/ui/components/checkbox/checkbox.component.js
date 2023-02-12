(function () {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoCheckbox', checkbox())
      .controller('CheckboxController', CheckboxController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCheckbox:coyoCheckbox
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a styled checkbox that has configurable values for 'true' and 'false'. If not defined the default boolean
   * values are used. Additionally it supports ngRequired. A checkbox value only fulfills 'required' if the checkbox is
   * marked.
   *
   * @param {string|boolean|object=} trueValue
   * The value to use for representation of 'true'. Default is the boolean value 'true'.
   *
   * @param {string|boolean|object=} falseValue
   * The value to use for representation of 'false'. Default is the boolean value 'false'.
   *
   * @param {expression} ngRequired
   * Support for ngRequired which turns on the required validation if the given expression is 'true'. The validation is
   * fulfilled if the checkbox is marked.
   */
  function checkbox() {
    return {
      templateUrl: 'app/commons/ui/components/checkbox/checkbox.html',
      require: {
        ngModel: '^ngModel'
      },
      bindings: {
        trueValue: '<',
        falseValue: '<',
        ngRequired: '&',
        ngDisabled: '<'
      },
      controller: 'CheckboxController'
    };
  }

  function CheckboxController() {
    var vm = this;

    vm.$onInit = init;
    vm.toggleValue = toggleValue;

    function init() {
      vm.trueValue = vm.trueValue || true;
      vm.falseValue = vm.falseValue || false;

      vm.ngModel.$formatters.push(function (value) {
        return _isTrue(value);
      });

      vm.ngModel.$parsers.push(function (value) {
        return _isTrue(value) ? vm.trueValue : vm.falseValue;
      });

      vm.ngModel.$render = function () {
        vm.ngModel.$validators.required = function (value) {
          return vm.ngRequired() ? _isTrue(value) : true;
        };
      };
    }

    function toggleValue() {
      vm.ngModel.$setViewValue(!vm.ngModel.$viewValue);
      vm.ngModel.$setDirty();
    }

    function _isTrue(value) {
      return value === true || value === 'true' || value === vm.trueValue;
    }
  }

})();
