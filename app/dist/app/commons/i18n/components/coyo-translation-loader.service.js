(function (angular) {
  'use strict';

  angular
      .module('commons.i18n.custom')
      .factory('coyoTranslationLoader', coyoTranslationLoader);

  /**
   * @ngdoc service
   * @name commons.i18n.custom.coyoTranslationLoader
   *
   * @description
   * This factory provides a custom loader for angular-translate.
   * The loader fetches all translation tables provided in the translation registry.
   * These tables are extended with the custom translations the administrator provided.
   * The final translation tables are the returned to angular-translate
   *
   * @requires $q
   * @requires commons.i18n.custom.translationRegistry
   * @requires coyo.domain.LanguagesModel
   */
  function coyoTranslationLoader($q, LanguagesModel, translationRegistry, $localStorage) {
    var translationTables = translationRegistry.getTranslationTables();
    var overrideTables = [];

    return function (options) {
      var lang = options.key;
      var overrideLanguage = $localStorage.userLanguage ? $localStorage.userLanguage : lang;

      var promises = [];
      if (!overrideTables[lang]) {
        promises.push(LanguagesModel.getTranslations(lang).then(function (overrides) {
          overrideTables[lang] = handleOverrides(overrides);
        }));
      }
      if (overrideLanguage !== lang && !overrideTables[overrideLanguage]) {
        promises.push(LanguagesModel.getTranslations(overrideLanguage).then(function (overrides) {
          overrideTables[overrideLanguage] = handleOverrides(overrides);
        }));
      }

      return $q.all(promises).then(function () {
        return $q.resolve(angular.extend({}, translationTables[lang], overrideTables[lang], overrideTables[overrideLanguage]));
      }).catch(function () {
        return $q.resolve(translationTables[lang]);
      });
    };
  }

  function handleOverrides(overrides) {
    return _.chain(overrides).keyBy('key').mapValues('translation').value();
  }

})(angular);
