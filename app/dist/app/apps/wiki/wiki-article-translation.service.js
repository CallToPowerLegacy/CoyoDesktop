(function () {
  'use strict';

  angular.module('coyo.apps.wiki')
      .factory('wikiArticleTranslationService', wikiArticleTranslationService);

  /**
   * @ngdoc service
   * @name coyo.apps.wiki.wikiArticleTranslationService
   *
   * @description
   * This service provides methods to handle translations.
   *
   * @requires $q
   * @requires $timeout
   * @requires coyo.widgets.api.widgetLayoutService
   * @requires coyo.domain.WidgetLayoutModel
   */
  function wikiArticleTranslationService($q, $timeout, widgetLayoutService, WidgetLayoutModel) {
    var $scope, vm, toBeDeleted;

    return {
      init: init,
      cleanup: cleanup,
      prepareTranslations: prepareTranslations,
      onLanguageDeleted: onLanguageDeleted,
      onLanguageChange: onLanguageChange,
      isTranslationRequired: isTranslationRequired,
      updateValidity: updateValidity
    };

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleTranslationService#init
     * @methodOf coyo.apps.wiki.wikiArticleTranslationService
     *
     * @description
     * Setup the service for the current controller (prepare the language/translations).
     *
     * @param {object} scope
     * The current scope.
     *
     * @param {object} viewModel
     * The view model to operate on.
     *
     * @param {object} sender
     * The sender, that the article belongs to.
     */
    function init(scope, viewModel, sender) {
      $scope = scope;
      vm = viewModel;
      toBeDeleted = {};
      vm.languages = {};
      vm.languageInitialised = {};

      vm.isSenderTranslated = !!(sender.defaultLanguage) && Object.keys(sender.translations).length !== 0;
      vm.defaultLanguage = sender.defaultLanguage !== null ? sender.defaultLanguage : 'NONE';
      vm.currentLanguage = vm.defaultLanguage;

      if (!vm.article.defaultLanguage) {
        vm.article.defaultLanguage = vm.defaultLanguage;
      }

      // create translations with default values for all available languages
      var availableLanguages = _.concat(_.keys(sender.translations), vm.defaultLanguage);
      vm.languages = _.zipObject(availableLanguages, _.map(availableLanguages, function () {
        return {active: true, translations: {}};
      }));
      // add default translations of article or init, if article not already translated
      vm.languages[(vm.article.defaultLanguage) ? vm.article.defaultLanguage : vm.currentLanguage] = {
        'active': true,
        'translations': {
          'title': vm.article.title ? vm.article.title : ''
        }
      };
      if (!vm.article.isNew()) {
        vm.languageInitialised[vm.article.defaultLanguage] = true;
      }
      // add all remaining translations of the article
      _.forEach(vm.article.translations, function (value, key) {
        if (vm.languages[key]) {
          vm.languages[key].translations = value;
        }
      });

      vm.onLanguageChange = onLanguageChange;
      vm.onLanguageDeleted = onLanguageDeleted;
      vm.isTranslationRequired = isTranslationRequired;
      vm.updateValidity = updateValidity;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleTranslationService#cleanup
     * @methodOf coyo.apps.wiki.wikiArticleTranslationService
     *
     * @description
     * Delete all marked layouts before storing new once.
     *
     * @returns {object} A promise which is resolved once all marked layouts are deleted.
     */
    function cleanup() {
      return $q.all(_.map(toBeDeleted, function (model) {
        return model.remove();
      }));
    }

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleTranslationService#prepareTranslations
     * @methodOf coyo.apps.wiki.wikiArticleTranslationService
     *
     * @description
     * Prepare the translations before saving the article.
     */
    function prepareTranslations() {
      vm.article.defaultLanguage = (vm.defaultLanguage === 'NONE') ? null : vm.defaultLanguage;

      // -- add translations for default language to article model
      if (vm.languages[vm.defaultLanguage]) {
        angular.forEach(vm.languages[vm.defaultLanguage].translations, function (value, key) {
          vm.article[key] = value;
        });
      }
      // -- add additional translations to article model
      vm.article.translations = {};
      angular.forEach(vm.languages, function (value, key) {
        if (value.active) {
          vm.article.translations[key] = value.translations ? value.translations : {};
        }
      });
      delete vm.article.translations[vm.defaultLanguage];
    }

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleTranslationService#onLanguageDeleted
     * @methodOf coyo.apps.wiki.wikiArticleTranslationService
     *
     * @description
     * Callback for when a language has been removed. The layout for the given language is being collected and then
     * marked to be deleted (will be deleted, once 'save' is triggered).
     *
     * @param {object} language
     * The language key.
     *
     * @returns {object} A promise which is resolved once the layout is being collected and marked as 'to be deleted'.
     */
    function onLanguageDeleted(language) {
      vm.languageInitialised[language] = false;
      return widgetLayoutService.collect($scope, vm.article.buildLayoutName(vm.app.id, language)).then(function (data) {
        if (!data.layout.isNew) {
          toBeDeleted[data.layout.name] = new WidgetLayoutModel({name: data.layout.name});
        }
      });
    }

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleTranslationService#onLanguageChange
     * @methodOf coyo.apps.wiki.wikiArticleTranslationService
     *
     * @description
     * Callback for when a language has been added. If the param is true, the default layout & widgets are being
     * collected and copied to the new language. If the param is false, it starts with an empty layout.
     *
     * @param {boolean} copyFromDefault
     * Whether to copy the content from the default language or not.
     */
    function onLanguageChange(copyFromDefault) {
      vm.languageInitialised[vm.currentLanguage] = true;
      if (copyFromDefault) {
        var defaultLayoutName = vm.article.buildLayoutName(vm.app.id);
        widgetLayoutService.collect($scope, defaultLayoutName).then(function (data) {
          var layout = data.layout,
              slots = extractSlots(data);
          layout.name = defaultLayoutName + '-' + vm.currentLanguage;
          _.forEach(layout.rows, function (row) {
            _.forEach(row.slots, function (slot) {
              slot.name = translate(slot.name, defaultLayoutName);
            });
          });

          widgetLayoutService.fill($scope, 'layout', layout.name, {
            layout: layout
          }).then(function () {
            widgetLayoutService.fill($scope, 'slots', layout.name, {
              slots: _.map(slots, function (widget) {
                var copy = _.cloneDeep(widget);
                delete copy.$$hashKey;// eslint-disable-line angular/no-private-call
                delete copy.model.$snapshots;
                delete copy.model.id;
                copy.model.slot = translate(copy.model.slot, defaultLayoutName);
                return copy;
              })
            }).then(function () {
              widgetLayoutService.edit($scope, false, true);
            });
          });
        });
      } else {
        $timeout(function () {
          widgetLayoutService.edit($scope, false, true);
        });
      }
    }

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleTranslationService#isTranslationRequired
     * @methodOf coyo.apps.wiki.wikiArticleTranslationService
     *
     * @description
     * Check whether translation is required for the given language.
     *
     * @param {object} language
     * The language key.
     *
     * @returns {boolean} A bool indicating whether translation is required or not.
     */
    function isTranslationRequired(language) {
      if (vm.defaultLanguage === 'NONE') {
        return language === 'NONE';
      } else if (vm.currentLanguage === language) {
        return true;
      } else {
        return (vm.languages[language].translations && Object.keys(vm.languages[language].translations).length !== 0);
      }
    }

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleTranslationService#updateValidity
     * @methodOf coyo.apps.wiki.wikiArticleTranslationService
     *
     * @description
     * Update the validation state of the language for the given key.
     *
     * @param {string} key
     * The language key.
     *
     * @param {boolean} valid
     * The validation state.
     */
    function updateValidity(key, valid) {
      vm.languages[key].valid = valid;
    }

    /******************* PRIVATE METHODS *******************/

    function translate(text, layoutName) {
      return _.replace(text, new RegExp(layoutName, 'g'), layoutName + '-' + vm.currentLanguage);
    }

    function extractSlots(data) {
      var slotNames = _.flatten(_.map(data.layout.rows, function (row) {
        return _.map(row.slots, function (slot) {
          return slot.name;
        });
      }));
      return _.filter(data.slots, function (slot) {
        var name = slot.model.slot;
        return _.filter(slotNames, function (slotName) {
          return _.endsWith(name, slotName);
        }).length;
      });
    }
  }
})();
