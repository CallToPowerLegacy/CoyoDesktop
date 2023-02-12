(function () {
  'use strict';

  angular
      .module('coyo.colleagues')
      .component('oyocProfileFieldPreview', profileFieldPreview())
      .controller('ProfileFieldPreviewController', ProfileFieldPreviewController);

  /**
   * @ngdoc directive
   * @name coyo.colleagues.oyocProfileFieldPreview:oyocProfileFieldPreview
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a list of all profile fields of a user that are flagged as "overview". This is used for the colleageus
   * view to preview all colleagues
   *
   * @param {object} user
   * The user to render the profile fields and their values for. The values are taken from the properties object of a
   * user.
   *
   * @param {object} profileGroups
   * All configured profile groups. These are needed to determine the fields that are flagged as "overview".
   */
  function profileFieldPreview() {
    return {
      templateUrl: 'app/modules/colleagues/components/profile-field-preview/profile-field-preview.html',
      bindings: {
        user: '<',
        profileGroups: '<'
      },
      controller: 'ProfileFieldPreviewController'
    };
  }

  function ProfileFieldPreviewController(profileFieldTemplates) {
    var vm = this;

    vm.$onInit = init;
    vm.getConfig = getConfig;

    function init() {
      vm.profileFields = _(vm.profileGroups)
          .flatMap('fields')
          .filter({overview: true})
          .value();
    }

    function getConfig(type) {
      return profileFieldTemplates[type];
    }
  }
})();
