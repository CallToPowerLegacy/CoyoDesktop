(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoCountryFlag', countryFlag())
      .controller('CountryFlagController', CountryFlagController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCountryFlag:coyoCountryFlag
   * @scope
   * @restrict 'E'
   *
   * @description
   * Renders a country flag
   *
   * @param {string} country
   * Shortcut for country
   *
   * @param {string} form
   * Possible parameters: "rounded", "square"
   *
   * @param {boolean} dependentToTranslations
   * If 'true' the country flag is only visible when translations are activated in admin area
   */
  function countryFlag() {
    return {
      templateUrl: 'app/commons/ui/components/country-flag/country-flag.html',
      controller: 'CountryFlagController',
      controllerAs: '$ctrl',
      bindings: {
        country: '<',
        form: '@',
        dependentToTranslations: '<'
      }
    };
  }

  function CountryFlagController($filter, SettingsModel) {
    var vm = this,
        mapping = {
          en: 'gb',
          hy: 'am',
          da: 'dk',
          cs: 'cz',
          el: 'gr',
          et: 'ee',
          ja: 'jp',
          sv: 'se',
          sr: 'rs',
          sl: 'si',
          zh: 'cn'
        };
    vm.$onInit = init;

    vm.getCountry = getCountry;

    function getCountry() {
      var lang = $filter('lowercase')(vm.country);
      return mapping[lang] || lang;
    }

    function init() {
      if (vm.dependentToTranslations) {
        SettingsModel.retrieveByKey('multiLanguageActive').then(function (result) {
          vm.enabled = result;
        });
      } else {
        vm.enabled = true;
      }
    }
  }
})(angular);
