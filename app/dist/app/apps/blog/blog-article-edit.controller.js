(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.blog')
      .controller('BlogArticleEditController', BlogArticleEditController);

  /**
   * Controller for creating and editing a blog article.
   *
   * @requires $q
   * @requires $scope
   * @requires $state
   * @requires $timeout
   * @requires widgetLayoutService
   * @requires authService
   * @requires article
   * @requires app
   * @requires sender
   * @requires WidgetLayoutModel
   * @constructor
   */
  function BlogArticleEditController($q, $scope, $state, $timeout, widgetLayoutService, authService, article, app,
                                     sender, WidgetLayoutModel) {
    var vm = this,
        toBeDeleted = {};

    vm.$onInit = init;
    vm.article = article;
    vm.originalArticle = angular.copy(vm.article);
    vm.app = app;
    vm.sender = sender;
    vm.editMode = true;
    vm.activeTab = 0;
    vm.publishAs = (vm.article.publishAsAuthor) ? 'AUTHOR' : 'SENDER';
    vm.raiseNotification = true;
    vm.teaserImage = article.teaserImage;
    vm.teaserImageWide = article.teaserImageWide;
    vm.simpleMode = true;
    vm.isSenderTranslated = false;
    vm.defaultLanguage;
    vm.currentLanguage;
    vm.languages = {};
    vm.languageInitialised = {};

    /**
     * Wanted behaviour:
     * - User is publisher and creates a new article: Instant publishing
     * - User is publisher/editor and edits a draft: No instant publishing
     * - User is not publisher: No publishing possible
     */
    if (vm.article.publishDate) {
      vm.publishStatus = 'PUBLISHED_AT';
      vm.article.publishDate = new Date(vm.article.publishDate);
    } else if (vm.app._permissions.publishArticle && vm.article.isNew()) {
      vm.publishStatus = 'PUBLISHED';
    } else {
      vm.publishStatus = 'DRAFT';
    }

    vm.onLanguageChange = onLanguageChange;
    vm.onLanguageDeleted = onLanguageDeleted;
    vm.save = save;
    vm.cancel = cancel;
    vm.toggleAuthor = toggleAuthor;
    vm.isTranslationRequired = isTranslationRequired;
    vm.checkValidity = checkValidity;

    function onLanguageDeleted(language) {
      vm.languageInitialised[language] = false;
      return widgetLayoutService.collect($scope, vm.article.buildLayoutName(vm.app.id, language)).then(function (data) {
        if (!data.layout.isNew) {
          toBeDeleted[data.layout.name] = new WidgetLayoutModel({name: data.layout.name});
        }
      });
    }

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

    function save() {
      vm.article.teaserImage = vm.languages[vm.defaultLanguage].translations.teaserImage ? _.pick(
          vm.languages[vm.defaultLanguage].translations.teaserImage, ['fileId', 'senderId']) : null;
      vm.article.teaserImageWide = vm.languages[vm.defaultLanguage].translations.teaserImageWide ? _.pick(
          vm.languages[vm.defaultLanguage].translations.teaserImageWide, ['fileId', 'senderId']) : null;

      if (vm.publishStatus === 'DRAFT') {
        vm.article.publishDate = null;
      } else if (vm.publishStatus === 'PUBLISHED' || !vm.article.publishDate) {
        vm.article.publishDate = new Date();
      }

      prepareTranslations();

      return article.save(vm.raiseNotification).then(function () {
        $q.all(_.map(toBeDeleted, function (model) {
          return model.remove();
        })).then(function () {
          $timeout(function () { // wait for article ID to be synced to the widget layout and slots
            widgetLayoutService.save($scope).then(function () {
              $state.go('^.view', {id: vm.article.id});
            });
          });
        });
      });

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

        // -- flatten teaserImage/Wide objects and add/remove them to/from article model
        angular.forEach(vm.languages, function (value, key) {
          if (key !== vm.defaultLanguage && vm.article.translations[key]) {
            var articleTranslation = vm.article.translations[key];

            handleImages('teaserImage', value, key, articleTranslation);
            handleImages('teaserImageWide', value, key, articleTranslation);
          }
        });

        function handleImages(type, value, key, articleTranslation) {
          var currentImage = value.translations[type],
              fileId = type + 'FileId',
              senderId = type + 'SenderId';
          if (currentImage) {
            if (currentImage.hasOwnProperty('fileId') && currentImage.hasOwnProperty('senderId')) {
              articleTranslation[fileId] = currentImage.fileId;
              articleTranslation[senderId] = currentImage.senderId;
            }
            delete vm.article.translations[key][type];
          } else if (articleTranslation[fileId] || articleTranslation[senderId]) {
            delete articleTranslation[fileId];
            delete articleTranslation[senderId];
          }
        }
      }
    }

    function cancel() {
      widgetLayoutService.cancel($scope);
      if (article.isNew()) {
        $state.go('^');
      } else {
        $state.go('^.view', {id: vm.article.id});
      }
    }

    function toggleAuthor() {
      vm.article.publishAsAuthor = (vm.publishAs === 'AUTHOR');
    }

    function isTranslationRequired(language) {
      if (vm.defaultLanguage === 'NONE') {
        return language === 'NONE';
      } else if (vm.currentLanguage === language) {
        return true;
      } else {
        return (vm.languages[language].translations && Object.keys(vm.languages[language].translations).length !== 0);
      }
    }

    function checkValidity(key, valid) {
      vm.languages[key].valid = valid;
    }

    /* ===== PRIVATE METHODS ===== */

    function init() {
      widgetLayoutService.onload($scope).then(function () {
        widgetLayoutService.edit($scope);
      });

      authService.getUser().then(function (currentUser) {
        vm.currentUser = currentUser;
      });

      authService.onGlobalPermissions('ACT_AS_SENDER', function (canActAsSender) {
        vm.canActAsSender = canActAsSender;
      });

      initTranslations();
    }

    function initTranslations() {

      vm.isSenderTranslated = !!(vm.sender.defaultLanguage) && Object.keys(vm.sender.translations).length !== 0;
      vm.defaultLanguage = vm.sender.defaultLanguage !== null ? vm.sender.defaultLanguage : 'NONE';
      vm.currentLanguage = vm.defaultLanguage;

      if (!vm.article.defaultLanguage) {
        vm.article.defaultLanguage = vm.defaultLanguage;
      }

      // create translations with default values for all available languages
      var availableLanguages = _.concat(_.keys(vm.sender.translations), vm.defaultLanguage);
      vm.languages = _.zipObject(availableLanguages, _.map(availableLanguages, function () {
        return {active: true, translations: {}};
      }));
      // add default translations of blog article or init, if blog article not already translated
      vm.languages[(vm.article.defaultLanguage) ? vm.article.defaultLanguage : vm.currentLanguage] = {
        'active': true,
        'translations': {
          'title': article.title ? article.title : '',
          'teaserText': article.teaserText ? article.teaserText : '',
          'showTeaserWithText': article.showTeaserWithText ? article.showTeaserWithText : false,
          'teaserImage': article.teaserImage ? article.teaserImage : '',
          'teaserImageWide': article.teaserImageWide ? article.teaserImageWide : ''
        }
      };
      if (!vm.article.isNew()) {
        vm.languageInitialised[vm.article.defaultLanguage] = true;
      }
      // add all remaining translations of the blog article
      _.forEach(article.translations, function (value, key) {
        if (vm.languages[key]) {
          vm.languages[key].translations = value;

          // rebuild teaserImage objects with fileId and senderId
          if (value.teaserImageFileId && value.teaserImageSenderId) {
            vm.languages[key].translations.teaserImage =
                {'fileId': value.teaserImageFileId, 'senderId': value.teaserImageSenderId};
          }
          // rebuild teaserImageWide objects with fileId and senderId
          if (value.teaserImageWideFileId && value.teaserImageWideSenderId) {
            vm.languages[key].translations.teaserImageWide =
                {'fileId': value.teaserImageWideFileId, 'senderId': value.teaserImageWideSenderId};
          }
        }
      });
    }
  }

})(angular);
