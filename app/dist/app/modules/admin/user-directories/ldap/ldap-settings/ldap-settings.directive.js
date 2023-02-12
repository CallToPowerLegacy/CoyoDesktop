(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories.ldap')
      .component('oyocLdapSettings', ldapSettings())
      .controller('LdapSettingsController', LdapSettingsController);

  /**
   * @ngdoc directive
   * @name coyo.admin.userDirectories.ldap.oyocLdapSettings:oyocLdapSettings
   * @restrict E
   * @scope
   *
   * @description
   * Renders a form for LDAP settings.
   *
   * @param {object} ngModel The settings of the LDAP directory.
   * @param {object} syncJob The synchronization job that is associated with the directory.
   */
  function ldapSettings() {
    return {
      require: 'ngModel',
      templateUrl: 'app/modules/admin/user-directories/ldap/ldap-settings/ldap-settings.html',
      controller: 'LdapSettingsController',
      bindings: {
        form: '<',
        ngModel: '=',
        validationErrors: '<'
      }
    };
  }

  function LdapSettingsController($state, $stateParams, modalService, profileFieldsService) {
    var vm = this;
    var profileFieldGroups = [];

    vm.$onInit = _onInit;

    vm.openSyncJob = openSyncJob;
    vm.addProfileFieldConfiguration = addProfileFieldConfiguration;
    vm.removeProfileField = removeProfileField;
    vm.onProfileFieldSelect = onProfileFieldSelect;
    vm.setGroupSyncStatusChanged = setGroupSyncStatusChanged;

    /**
     * Opens the sync job modal.
     */
    function openSyncJob() {
      function go() {
        $state.go('admin.jobs.details', {
          name: vm.ngModel.syncJob.name,
          returnState: 'admin.user-directories.edit',
          returnStateOpts: {
            id: $stateParams.id
          }
        });
      }

      if (vm.form.$dirty) {
        modalService.confirm({
          title: 'ADMIN.USER_DIRECTORIES.LDAP.SYNC.LABEL.JUMP_TO_JOB.CONFIRM.TITLE',
          text: 'ADMIN.USER_DIRECTORIES.LDAP.SYNC.LABEL.JUMP_TO_JOB.CONFIRM.TEXT'
        }).result.then(go);
      } else {
        go();
      }
    }

    /**
     * When a profile field has been selected.
     *
     * @param {string} fieldName The field name
     * @param {string} selectedField The selected field
     */
    function onProfileFieldSelect(fieldName, selectedField) {
      removeProfileField(fieldName, false);
      vm.ngModel.settings.profileFields[selectedField.name] = '';
      vm.profileFieldsOrdered[_.findIndex(vm.profileFieldsOrdered, {name: fieldName})] = selectedField;
      _updateAvailableProfileFields();
    }

    /**
     * When a profile field configuration has been added.
     *
     * @param {string} e The event
     */
    function addProfileFieldConfiguration(e) {
      e.preventDefault();
      if (vm.availableProfileFields.length >= 0) {
        vm.ngModel.settings.profileFields[vm.availableProfileFields[0].name] = '';
        vm.profileFieldsOrdered[vm.profileFieldsOrdered.length] = vm.availableProfileFields[0];
        _updateAvailableProfileFields();
      }
    }

    /**
     * When a profile field has been removed.
     *
     * @param {string} fieldName The field name
     * @param {string} removeFromDisplay Boolean flag whether to remove the field from the display fields array
     */
    function removeProfileField(fieldName, removeFromDisplay) {
      if (_.has(vm.ngModel.settings.profileFields, fieldName)) {
        delete vm.ngModel.settings.profileFields[fieldName];
        if (removeFromDisplay) {
          _.remove(vm.profileFieldsOrdered, {name: fieldName});
        }
        _updateAvailableProfileFields();
      }
    }

    function setGroupSyncStatusChanged() {
      var syncJobHasBeenExecuted = (vm.ngModel.syncJob && vm.ngModel.syncJob.jobStatus !== null);
      var groupSyncSettingWasEnabledBefore = vm.initialGroupSyncEnabledSetting === true;
      var groupSyncIsDisabledNow = !vm.ngModel.settings.groupSyncEnabled;
      vm.hasGroupSyncStatusChanged = syncJobHasBeenExecuted
          && groupSyncIsDisabledNow
          && groupSyncSettingWasEnabledBefore;
    }

    // ----------

    /**
     * Updates the list of all available profile fields
     *
     * @private
     */
    function _updateAvailableProfileFields() {
      vm.availableProfileFields = _getAvailableProfileFields();
    }

    /**
     * Returns all profile fields.
     *
     * @returns {array} All profile fields
     * @private
     */
    function _getAllProfileFields() {
      var result = [];
      for (var i = 0; i < profileFieldGroups.length; ++i) {
        if (profileFieldGroups[i].fields) {
          for (var j = 0; j < profileFieldGroups[i].fields.length; ++j) {
            result.push(profileFieldGroups[i].fields[j]);
          }
        }
      }

      return result;
    }

    /**
     * Returns all currently available profile fields.
     *
     * @returns {array} All currently available profile fields
     * @private
     */
    function _getAvailableProfileFields() {
      var result = _getAllProfileFields();

      if (result.length > 0) {
        return _.sortBy(_.filter(result, function (val) {
          return !_.has(vm.ngModel.settings.profileFields, val.name);
        }), function (f) {
          return f.name;
        });
      }

      return [];
    }

    /**
     * Prepares the visual component of the profile fields.
     */
    function _prepareDisplay() {
      var allProfileFields = _getAllProfileFields();
      _.forEach(vm.ngModel.settings.profileFields, function (value, key) {
        vm.profileFieldsOrdered.push(_.find(allProfileFields, {name: key}));
      });
    }

    /**
     * Initializes the controller.
     * Loads the global profile field configuration.
     *
     * @private
     */
    function _onInit() {
      vm.availableProfileFields = [];
      vm.selectedProfileFields = [];
      vm.profileFieldsOrdered = [];
      vm.loading = true;
      vm.hasGroupSyncStatusChanged = false;
      vm.initialGroupSyncEnabledSetting = vm.ngModel.settings.groupSyncEnabled;

      if (!_.get(vm.ngModel, 'settings.profileFields')) {
        _.set(vm.ngModel, 'settings.profileFields', {});
      }

      profileFieldsService.getGroups().then(function (groups) {
        profileFieldGroups = groups;
        _updateAvailableProfileFields();
        _prepareDisplay();
        vm.loading = false;
      });
    }
  }

})(angular);
