(function () {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoOptionsField', optionsField())
      .controller('OptionsFieldController', OptionsFieldController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoOptionsField:coyoOptionsField
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders an options field. The user can add, edit and delete options. The order can be changed with drag and drop.
   * At least one option with a none empty name must be set. Otherwise this field is not valid (setting a
   * $error.options validation error for the given form).
   *
   * @param {object} ngModel
   * Array of objects to store the options. An option consists of an id and a name.
   *
   * @requires $scope
   * @requires coyo.base.utilService
   */
  function optionsField() {
    return {
      templateUrl: 'app/commons/ui/components/options-field/options-field.html',
      bindings: {},
      require: {
        ngModel: '^ngModel'
      },
      controller: 'OptionsFieldController',
      controllerAs: '$ctrl'
    };
  }

  function OptionsFieldController($scope, utilService) {
    var vm = this;

    vm.options = [];
    vm.treeOptions = {};
    vm.focusedOption = '';

    vm.$onInit = init;
    vm.handleKeyPress = handleKeyPress;
    vm.addOption = addOptionAndFocus;
    vm.deleteOption = deleteOption;

    function init() {
      vm.ngModel.$render = function () {
        vm.options = angular.copy(vm.ngModel.$viewValue);
        if (vm.options.length <= 0) {
          _addOption();
        }

        // model is valid if at least one option was selected
        vm.ngModel.$validators.noOptions = function (modelValue, viewValue) {
          return viewValue.length > 0;
        };
      };

      $scope.$watch(function () {
        return vm.options;
      }, function (newValue, oldValue) {
        if (!_.isEqual(newValue, oldValue)) {
          vm.ngModel.$setViewValue(_.filter(newValue, function (value) {
            return !_.isEmpty(value.name);
          }));
        }
      }, true);
    }

    function addOptionAndFocus() {
      vm.focusedOption = _addOption().id;
    }

    function deleteOption(index) {
      if (index !== -1 && vm.options.length > 1) {
        vm.options.splice(index, 1);
      }
    }

    function handleKeyPress(event, option) {
      if (event && event.which === 13 && option.name) {
        event.preventDefault();
        event.stopPropagation();
        addOptionAndFocus();
      } else if (event && event.which === 8 && !option.name) {
        var previousOption = vm.options[vm.options.length - 2];
        if (previousOption) {
          deleteOption(vm.options.indexOf(option));
          vm.focusedOption = previousOption.id;
        }
      }
    }

    function _addOption() {
      var id = utilService.uuid();
      var option = {
        id: id,
        name: ''
      };
      vm.options.push(option);
      return option;
    }
  }
})();
