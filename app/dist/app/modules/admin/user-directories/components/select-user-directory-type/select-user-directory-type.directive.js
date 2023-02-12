(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories')
      .component('coyoSelectUserDirectoryType', selectUserDirectoryType())
      .controller('SelectUserDirectoryTypeController', SelectUserDirectoryTypeController);

  /**
   * @ngdoc directive
   * @name coyo.admin.userDirectories.coyoSelectUserDirectoryType:coyoSelectUserDirectoryType
   * @restrict E
   * @scope
   *
   * @description
   * Renders a UI select field for user directory type selection.
   *
   * @param {string} placeholder
   * The placeholder for the input field.
   * @param {boolean} ngDisabled
   * Marks this field as disabled.
   * @param {boolean} allowClear
   * Marks this field as clearable.
   *
   * @requires $rootScope
   * @requires $translate
   * @requires coyo.admin.userDirectories.api.userDirectoryTypeRegistry
   */
  function selectUserDirectoryType() {
    return {
      scope: {},
      require: 'ngModel',
      controller: 'SelectUserDirectoryTypeController',
      controllerAs: '$ctrl',
      templateUrl: 'app/modules/admin/user-directories/components/select-user-directory-type/select-user-directory-type.html',
      bindings: {
        placeholder: '@?',
        ngDisabled: '<?',
        allowClear: '<?'
      }
    };
  }

  function SelectUserDirectoryTypeController($rootScope, $scope, $element, $translate, userDirectoryTypeRegistry) {
    var vm = this;
    var ngModelCtrl = $element.controller('ngModel');

    vm.data = {
      directoryTypes: [],
      selected: null
    };

    vm.$onInit = _init;

    function _translate() {
      var directoryTypes = userDirectoryTypeRegistry.getAll();
      return $translate(_.flatMap(directoryTypes, function (directoryType) {
        return [directoryType.name, directoryType.description];
      })).then(function (data) {
        vm.data.directoryTypes = _.map(directoryTypes, function (directoryType) {
          return angular.extend(directoryType, {
            name: data[directoryType.name],
            description: data[directoryType.description]
          });
        });
      });
    }

    function _init() {
      _translate();

      // translate on language change
      var deregisterFn = $rootScope.$on('$translateChangeSuccess', function () {
        _translate();
      });
      $scope.$on('$destroy', deregisterFn);

      // model -> select
      ngModelCtrl.$render = function () {
        vm.data.selected = ngModelCtrl.$viewValue;
      };

      // select -> model
      $scope.$watch(function () {
        return vm.data.selected;
      }, function (newVal, oldVal) {
        if (newVal !== oldVal) {
          ngModelCtrl.$setViewValue(newVal);
        }
      });
    }
  }

})(angular);
