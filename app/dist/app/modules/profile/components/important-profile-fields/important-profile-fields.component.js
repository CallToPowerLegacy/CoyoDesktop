(function () {
  'use strict';

  angular
      .module('coyo.profile')
      .component('oyocImportantProfileFields', importantProfileFields())
      .controller('ImportantProfileFieldsController', ImportantProfileFieldsController);

  /**
   * @ngdoc directive
   * @name coyo.profile.oyocImportantProfileFields:oyocImportantProfileFields
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a list of all profile fields of a user that are flagged as "important". This is used in the sidebar of
   * the activity tab of any user's profile. If a field has a flag but was not set by a user it will be hidden. In
   * addition to all important profile fields the email address of a user is always shown.
   *
   * @param {object} user
   * The user to render the profile fields and their values for. The values are taken from the properties object of a
   * user.
   *
   * @param {object} profileGroups
   * All configured profile groups. These are needed to determine the fields that are flagged as "important".
   */
  function importantProfileFields() {
    return {
      templateUrl: 'app/modules/profile/components/important-profile-fields/important-profile-fields.html',
      bindings: {
        user: '<',
        profileGroups: '<'
      },
      controller: 'ImportantProfileFieldsController'
    };
  }

  function ImportantProfileFieldsController(profileFieldTemplates) {
    var vm = this;

    vm.$onInit = init;
    vm.getConfig = getConfig;

    function init() {
      vm.importantFields = _(vm.profileGroups)
          .flatMap('fields')
          .filter({important: true})
          .filter(_filterEmptyValues)
          .value();
    }

    function getConfig(type) {
      return profileFieldTemplates[type];
    }

    function _filterEmptyValues(field) {
      return _.get(vm.user.properties, field.name);
    }

  }
})();
