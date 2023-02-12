(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .controller('ManageTranslationsModalController', ManageTranslationsModalController);

  /**
   * @ngdoc service
   * @name commons.ui.ManageTranslationsModalController
   *
   * @description
   * The controller of the manage translation modal.
   *
   * @requires $translate
   * @requires $filter
   * @requires $uibModalInstance
   * @requires defaultLanguage
   * @requires SettingsModel
   * @requires languages
   * @requires availableLanguages
   */
  function ManageTranslationsModalController($translate, $filter, $uibModalInstance, modalService, defaultLanguage,
                                             SettingsModel, languages, availableLanguages) {
    var vm = this;

    vm.$onInit = init;
    vm.availableLanguages = [];
    vm.save = save;
    vm.updateLanguages = updateLanguages;
    vm.handleLanguageChange = handleLanguageChange;

    function updateLanguages() {
      vm.data.default = $filter('uppercase')(vm.data.default);
      vm.data.languages[vm.data.default] = vm.data.languages[vm.data.default] ? vm.data.languages[vm.data.default] : {};
      vm.data.languages[vm.data.default].active = true;
    }

    /**
     * Opens a confirmation popup if the user is going to remove a language which leads to a removal of all affected
     * translations.
     *
     * @param {string} language the affected language
     */
    function handleLanguageChange(language) {
      language = $filter('uppercase')(language);
      var lang = vm.data.languages[language];
      if (!lang.active && !!lang.translations) {
        modalService.confirm({
          title: 'COMMONS.TRANSLATIONS.REMOVE.LANGUAGE.MODAL.TITLE',
          text: 'COMMONS.TRANSLATIONS.REMOVE.LANGUAGE.MODAL.TEXT',
          translationContext: {
            language: $filter('translate')('LANGUAGE.LANGUAGES.' + language)
          },
          close: {title: 'YES', style: 'btn-danger'},
          dismiss: {title: 'NO'}
        }).result.catch(function () {
          lang.active = !lang.active;
        });
      }
    }

    function save() {
      if (vm.data.languages.NONE) {
        vm.data.languages[vm.data.default] = vm.data.languages.NONE;
        delete vm.data.languages.NONE;
      }
      _.forOwn(vm.data.languages, function (language, key) {
        if (!language.active) {
          delete vm.data.languages[key];
        }
      });
      $uibModalInstance.close(vm.data);
    }

    function init() {
      vm.loading = true;
      vm.data = {
        'default': angular.copy(defaultLanguage),
        'languages': angular.copy(languages)
      };

      // Get all available languages
      _.forEach(_.uniq(_.remove(availableLanguages.concat(Object.keys(languages)), function (language) {
        return language !== 'NONE';
      })), function (language) {
        vm.availableLanguages.push(
            {language: language.toLowerCase(), name: $translate.instant('LANGUAGE.LANGUAGES.' + language)}
        );
      });

      // Set default language
      SettingsModel.retrieveByKey('defaultLanguage').then(function (result) {
        if (vm.data.default === 'NONE' || vm.data.default === null) {
          vm.defaultLanguageExists = false;
          vm.data.default = result;
          vm.data.languages[result] = {
            'active': true
          };
        } else {
          vm.defaultLanguageExists = true;
        }
        vm.loading = false;
      });
    }
  }
})(angular);
