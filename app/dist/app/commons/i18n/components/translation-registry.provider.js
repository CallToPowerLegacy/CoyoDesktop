(function (angular) {
  'use strict';

  angular
      .module('commons.i18n.custom')
      .provider('translationRegistry', translationRegistry);

  /**
   * @ngdoc service
   * @name commons.i18n.custom.translationRegistryProvider
   *
   * @description
   * This provider is used to register translations to the system.T o register a new translation
   * table call `registerTranslations` at config phase. The provided table will extend the existing Tables
   * and therefore also override them.
   */

  /**
   * @ngdoc service
   * @name commons.i18n.custom.translationRegistry
   *
   * @description
   * A service to retrieve registered translations
   */
  function translationRegistry() {
    var translationTables = [];

    return {
      $get: [function () {
        return {
          /**
           * @ngdoc method
           * @name commons.i18n.custom.translationRegistry#getTranslationTables
           * @methodOf commons.i18n.custom.translationRegistry
           *
           * @description
           * Returns all the translations of all registered languages.
           *
           * @returns {array} list of translations of all registered languages.
           */
          getTranslationTables: function () {
            return translationTables;
          },

          /**
           * @ngdoc method
           * @name commons.i18n.custom.translationRegistry#getTranslationTable
           * @methodOf commons.i18n.custom.translationRegistry
           *
           * @description
           * Returns the translation of the language with the given key.
           *
           * @param {string} language
           * The key of the language of the language that should be returned.
           *
           * @returns {object} The translations of the language with the given key.
           */
          getTranslationTable: function (language) {
            return translationTables[language];
          }
        };
      }],

      /**
       * @ngdoc method
       * @name commons.i18n.custom.translationRegistryProvider#registerTranslations
       * @methodOf commons.i18n.custom.translationRegistry
       *
       * @description
       * This method is used to register translatins for the given language. The translations provided
       * will extend already registered translations of the same language.
       *
       * @param {string} language
       * The language the given translations should be registered for.
       *
       * @param {object} translations
       * The translations that should be registered. The translations are passed in as an object
       * and should have the message keys as keys and the translations as values. The same way angular-translate
       * handles translations.
       *
       * @returns {object} This registry for chaining.
       */
      registerTranslations: function (language, translations) {
        translationTables[language] = angular.extend({}, translationTables[language], translations);
        return this;
      }
    };
  }

})(angular);
