(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoManageTranslations', manageTranslations())
      .controller('ManageTranslationsController', ManageTranslationsController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoManageTranslations:coyoManageTranslations
   * @restrict 'EA'
   * @element OWN
   *
   * @description
   * Renders a ui-select with all available translation languages.
   *
   * @param {string}  default The language shortcode for the default language.
   * @param {string}  current The language shortcode for the slected language.
   * @param {object}  languages A object with all available languages.
   * @param {boolean} hideValidation The option to hide the validation icons.
   * @param {boolean} disableConfig The option to disable the configuration.
   * @param {function} onChange A callback to be notified when language changes.
   * @param {function} onDelete A callback to be notified when a language is being deleted.
   * @param {string} styleClass An individual class name that will applied to the ui-select.
   */
  function manageTranslations() {
    return {
      templateUrl: 'app/commons/ui/components/manage-translations/manage-translations.html',
      bindings: {
        default: '=',
        current: '=',
        languages: '=',
        hideValidation: '<',
        disableConfig: '<',
        onChange: '=',
        onDelete: '=',
        styleClass: '@'
      },
      controller: 'ManageTranslationsController',
      controllerAs: '$ctrl'
    };
  }

  function ManageTranslationsController($filter, manageTranslationsModalService, modalService, SettingsModel) {
    var vm = this;

    vm.$onInit = init;
    vm.open = open;
    vm.checkTranslation = checkTranslation;
    vm.deleteTranslation = deleteTranslation;
    vm.applyTranslations = applyTranslations;
    vm.checkValidity = checkValidity;

    function open() {
      vm.enabled = false;

      manageTranslationsModalService.open(vm.default, vm.languages).then(function (result) {
        vm.default = result.default;
        vm.languages = result.languages;
      }).finally(function () {
        // Enable when default language is set
        vm.enabled = isMultiLanguage();

        if (!vm.languages[vm.current] || !vm.languages[vm.current].active) {
          vm.current = vm.default;
        }
        updateSelectableLanguages();
      });
    }

    function isMultiLanguage() {
      return vm.default !== 'NONE' && vm.default !== null && Object.keys(vm.languages).length > 1;
    }

    function checkTranslation(language) {
      // Check if translation is active
      return (!vm.languages[language].translations || !Object.keys(vm.languages[language].translations).length);
    }

    function checkValidity() {
      var invalid = false;
      angular.forEach(vm.languages, function (value) {
        if (value.active && value.valid === false) {
          invalid = true;
        }
      });

      return invalid;
    }

    function deleteTranslation($event, translation) {
      $event.stopPropagation();

      modalService.confirm({
        title: 'COMMONS.TRANSLATIONS.DELETE.MODAL.TITLE',
        text: 'COMMONS.TRANSLATIONS.DELETE.MODAL.TEXT',
        translationContext: {language: $filter('translate')('LANGUAGE.LANGUAGES.' + $filter('uppercase')(translation))},
        close: {title: 'YES', style: 'btn-danger'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        var key = $filter('uppercase')(translation);
        if (vm.onDelete) {
          vm.onDelete(key).then(function () {
            doDelete(key);
          });
        } else {
          doDelete(key);
        }
      });

      function doDelete(key) {
        vm.languages[key].translations = {};
        delete vm.languages[key].valid;
        vm.current = vm.default;
      }
    }

    function applyTranslations(language) {
      if (vm.languages[vm.default].translations &&
          (!vm.languages[language].translations ||
              !Object.keys(vm.languages[language].translations).length)) {
        modalService.confirm({
          title: 'COMMONS.TRANSLATIONS.APPLY.MODAL.TITLE',
          text: 'COMMONS.TRANSLATIONS.APPLY.MODAL.TEXT',
          translationContext: {language: $filter('translate')('LANGUAGE.LANGUAGES.' + language)},
          close: {title: 'YES'},
          dismiss: {title: 'NO'}
        }).result.then(function () {
          vm.languages[language].translations = {};
          angular.forEach(vm.languages[vm.default].translations, function (value, key) {
            vm.languages[language].translations[key] = value;
          });
          if (vm.onChange) {
            vm.onChange(true);
          }
        }, function () {
          if (vm.onChange) {
            vm.onChange(false);
          }
        }).finally(function () {
          if (!vm.languages[language].translations || !Object.keys(vm.languages[language].translations).length) {
            vm.languages[language].translations = {};
          }
        });
      }
    }

    function init() {
      vm.enabled = isMultiLanguage();
      _.set(vm, 'config.config.active', !vm.disableConfig);
      updateSelectableLanguages();

      SettingsModel.retrieveByKey('multiLanguageActive').then(function (result) {
        vm.multiLanguageActive = result;
      });
    }

    function updateSelectableLanguages() {
      _.forOwn(vm.languages, function (language, key) {
        if (!language.name && key !== 'NONE') {
          language.name = $filter('translate')('LANGUAGE.LANGUAGES.' + key);
        }
      });
      vm.selectableLanguages = _.merge(_.cloneDeep(vm.languages), vm.config);
    }
  }
})(angular);
