(function (angular) {
  'use strict';

  angular.module('commons.ui')
      .component('coyoUserChooser', userChooser())
      .controller('UserChooserController', UserChooserController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoUserChooser:coyoUserChooser
   * @restrict 'E'
   * @element OWN
   * @scope
   *
   * @description
   * Displays a button which opens a user chooser modal via the {@link commons.ui.userChooserModalService} modal on
   * click. Within this modal users and/or groups can be selected. The button acts as a form field with it's own
   * `ngModel`.
   * Note: when using required, ng-model-options="{allowInvalid: true}" has to be applied, too.
   *
   * @param {object} ngModel
   * This directive requires an ngModel to store the selected users/groups.
   *
   * @param {boolean} loading
   * A flag which implies whether a spinner should be displayed or not.
   *
   * @param {string} [btnTitle=USER_CHOOSER.BUTTON_TITLE.SELECT]
   * The message key for the button title.
   *
   * @param {boolean} [usersOnly=false]
   * Set this parameter to only select users in the chooser.
   *
   * @param {boolean} [groupsOnly=false]
   * Set this parameter to only select groups in the chooser.
   *
   * @param {string} [usersField=userIds|users]
   * The field name to store the selected users/userIDs in.
   *
   * @param {string} [groupsField=groupIds|groups]
   * The field name to store the selected groups/groupIDs in.
   *
   * @param {number} [min=0]
   * The minimum number of selected users
   *
   * @param {boolean} [single=false]
   * Activates single selection
   *
   * @requires commons.ui.userChooserModalService
   */
  function userChooser() {
    return {
      templateUrl: 'app/commons/ui/components/user-chooser/user-chooser.html',
      require: {
        'ngModel': '^ngModel'
      },
      bindings: {
        loading: '=',
        btnTitle: '@',
        usersOnly: '<?',
        groupsOnly: '<?',
        usersField: '@',
        groupsField: '@',
        min: '<?',
        single: '<?'
      },
      controller: 'UserChooserController'
    };
  }

  function UserChooserController(userChooserModalService) {
    var vm = this;

    vm.$onInit = init;

    vm.btnTitle = vm.btnTitle || 'USER_CHOOSER.BUTTON_TITLE.SELECT';
    vm.settings = {
      usersOnly: vm.usersOnly === true,
      groupsOnly: vm.groupsOnly === true,
      usersField: vm.usersField || 'userIds',
      groupsField: vm.groupsField || 'groupIds',
      single: vm.single === true
    };

    vm.openChooser = openChooser;

    function openChooser() {
      if (!vm.loading) {
        vm.ngModel.$setTouched(true);
        userChooserModalService.open(angular.copy(vm.ngModel.$modelValue), vm.settings).then(function (selection) {
          vm.ngModel.$setViewValue(angular.extend(vm.ngModel.$viewValue, selection));
          vm.ngModel.$validate();
        });
      }
    }

    function _assert(condition, message) {
      if (!condition) {
        throw new Error('[UserChooser] ' + message);
      }
    }

    /**
     * Initialize controller and check ngModel
     */
    function init() {
      if (_.isEmpty(vm.ngModel.$modelValue)) {
        vm.ngModel.$modelValue = {};
        if (!vm.settings.groupsOnly) {
          vm.ngModel.$modelValue[vm.settings.usersField] = [];
        }
        if (!vm.settings.usersOnly) {
          vm.ngModel.$modelValue[vm.settings.groupsField] = [];
        }
      }

      vm.ngModel.$render = function () {
        var model = vm.ngModel.$viewValue;
        _assert(vm.usersOnly !== true || vm.groupsOnly !== true, '"usersOnly" and "groupsOnly" must not both be set.');
        _assert(angular.isObject(model) && !angular.isArray(model), 'ngModel must be an object.');
        if (model[vm.settings.usersField]) {
          _assert(angular.isArray(model[vm.settings.usersField]), 'ngModel.' + vm.settings.usersField + ' must be an array.');
          _assert(_.every(model[vm.settings.usersField], angular.isString),
              'ngModel.' + vm.settings.usersField + ' must be an array of strings');
        }
        if (model[vm.settings.groupsField]) {
          _assert(angular.isArray(model[vm.settings.groupsField]), 'ngModel.' + vm.settings.groupsField + ' must be an array.');
          _assert(_.every(model[vm.settings.groupsField], angular.isString),
              'ngModel.' + vm.settings.groupsField + ' must be an array of strings');
        }

        vm.ngModel.$validators.min = function (value) {
          if (!vm.min) {
            return true;
          } else if (vm.usersOnly === true) {
            return validateMin(value, vm.settings.usersField);
          } else if (vm.groupsOnly === true) {
            return validateMin(value, vm.settings.groupsField);
          } else {
            return validateMin(value, vm.settings.usersField) || validateMin(value, vm.settings.groupsField);
          }
        };

        vm.ngModel.$validators.single = function (value) {
          if (!vm.single) {
            return true;
          } else if (vm.usersOnly === true) {
            return validateSingle(value, vm.settings.usersField);
          } else if (vm.groupsOnly === true) {
            return validateSingle(value, vm.settings.groupsField);
          } else {
            return validateSingle(value, vm.settings.usersField) && validateSingle(value, vm.settings.groupsField);
          }
        };
      };

      vm.ngModel.$isEmpty = function (value) {
        if (angular.isUndefined(value)) {
          return true;
        } else if (vm.usersOnly === true) {
          return checkEmpty(value, vm.settings.usersField);
        } else if (vm.groupsOnly === true) {
          return checkEmpty(value, vm.settings.groupsField);
        } else {
          return checkEmpty(value, vm.settings.usersField) && checkEmpty(value, vm.settings.groupsField);
        }
      };
    }

    function validateMin(value, key) {
      return angular.isArray(value[key]) && value[key].length >= vm.min;
    }

    function validateSingle(value, key) {
      return !angular.isArray(value[key]) || value[key].length <= 1;
    }

    function checkEmpty(value, key) {
      return angular.isUndefined(value[key]) || angular.isArray(value[key]) && value[key].length === 0;
    }
  }

})(angular);
