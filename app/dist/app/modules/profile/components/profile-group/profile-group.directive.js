(function (angular) {
  'use strict';

  angular
      .module('coyo.profile')
      .directive('oyocProfileGroup', profileGroup)
      .controller('ProfileGroupController', ProfileGroupController);

  /**
   * @ngdoc directive
   * @name coyo.profile.oyocProfileGroup:oyocProfileGroup
   * @scope
   * @restrict 'E'
   * @element ANY
   *
   * @description
   * Renders a profile group with all of its properties.
   *
   * @param {object} user The user object
   * @param {object} group The profile field group containing all elements
   * @param {boolean} setHeader Boolean flag whether to set the header
   * @param {boolean} isEditable Boolean flag whether the form is currently editable
   * @param {string} linkPattern A regexp for validating links
   * @param {string} emailPattern A regexp for validating email addresses
   * @param {string} phonePattern A regexp for validating phone numbers
   * @param {function} onFormSubmit On form submit
   * @param {function} onFormCancel On form cancel
   *
   * @requires moment
   * @requires coyo.profile.profileFieldTemplates
   */
  function profileGroup() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/profile/components/profile-group/profile-group.html',
      scope: {},
      transclude: true,
      bindToController: {
        user: '=',
        group: '=',
        setHeader: '=',
        isEditable: '=',
        linkPattern: '<',
        emailPattern: '<',
        phonePattern: '<',
        onFormSubmit: '&',
        onFormCancel: '&'
      },
      controllerAs: 'profileGroupCtrl',
      controller: 'ProfileGroupController'
    };
  }

  function ProfileGroupController(moment, profileFieldTemplates) {
    var vm = this;
    var dateFormatMoment = 'YYYY-MM-DD';

    vm.dateFormat = 'yyyy-MM-dd';
    vm.formValid = true;

    vm.selectOption = selectOption;
    vm.readDate = readDate;
    vm.saveDate = saveDate;
    vm.validateDate = validateDate;
    vm.validatePattern = validatePattern;
    vm.getConfig = getConfig;
    vm.onSubmit = onSubmit;
    vm.onCancel = onCancel;

    function selectOption(field, choice) {
      vm.user.properties[field.name] = choice;
    }

    function readDate(data) {
      var date = moment.utc(data, dateFormatMoment).toDate();
      return _isValidJSDate(date) ? date : null;
    }

    function saveDate(date) {
      return _isValidJSDate(date) ? moment(date).format(dateFormatMoment) : null;
    }

    function validateDate(field) {
      var val = vm.user.properties[field.name];
      field.valid = val === '' || _.isNull(val) || _isValidJSDate(new Date(val));
      vm.formValid = _.every(vm.group.fields, {valid: true});
    }

    function validatePattern(field, pattern) {
      var val = vm.user.properties[field.name];
      field.valid = _.isEmpty(val) || (val && val.match(pattern) !== null);
      vm.formValid = _.every(vm.group.fields, {valid: true});
    }

    function getConfig(type) {
      return profileFieldTemplates[type];
    }

    function onSubmit(group) {
      vm.onFormSubmit(group);
    }

    function onCancel(group) {
      vm.onFormCancel().then(function (user) {
        vm.user = user;
        vm.isEditable = false;
        vm.form.$setPristine();
        group.editMode = false;

        _init();
      });
    }

    // ------------------------------------------------------------------------

    function _isValidJSDate(date) {
      return angular.isDate(date) && !isNaN(date.getTime());
    }

    function _init() {
      _.forEach(vm.group.fields, function (field) {
        field.valid = true;
        var value = vm.user.properties[field.name];
        if (field.type === 'CHECKBOX') {
          vm.user.properties[field.name] = value === 'true';
        }
      });
    }

    _init();
  }

})(angular);
