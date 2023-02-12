(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.content')
      .controller('ContentAppEditController', ContentAppEditController);
  /**
   * Controller to create, edit and translate a content app.
   *
   * @requires $q
   * @requires $scope
   * @requires $state
   * @requires $timeout
   * @requires app
   * @requires sender
   * @requires widgetLayoutService
   * @requires WidgetLayoutModel
   * @constructor
   */
  function ContentAppEditController($q, $scope, $state, $timeout, app, sender, widgetLayoutService, WidgetLayoutModel) {
    var vm = this,
        toBeDeleted = {};
    vm.$onInit = init;

    vm.app = app;
    vm.sender = sender;
    vm.isSenderTranslated = false;
    vm.defaultLanguage;
    vm.currentLanguage;
    vm.languages = {};

    vm.save = save;
    vm.cancel = cancel;
    vm.onLanguageDeleted = onLanguageDeleted;
    vm.onLanguageChange = onLanguageChange;
    vm.isTranslationRequired = isTranslationRequired;
    vm.buildLayoutName = buildLayoutName;

    function save() {
      $q.all(_.map(toBeDeleted, function (model) {
        return model.remove();
      })).then(function () {
        widgetLayoutService.save($scope).then(function () {
          return vm.app.updateExistingTranslations(createExistingTranslations());
        }).then(function () {
          $state.go('^', {created: false});
        });
      });

      function createExistingTranslations() {
        return _.filter(_.keys(_.pickBy(vm.languages, function (value) {
          return !_.isEmpty(value.translations);
        })), function (language) {
          return language !== 'NONE' && language !== vm.defaultLanguage;
        });
      }
    }

    function cancel() {
      widgetLayoutService.cancel($scope);
      $state.go('^', {created: false});
    }

    function onLanguageDeleted(language) {
      return widgetLayoutService.collect($scope, vm.buildLayoutName(language)).then(function (data) {
        if (!data.layout.isNew) {
          toBeDeleted[data.layout.name] = new WidgetLayoutModel({name: data.layout.name});
        }
      });
    }

    function onLanguageChange(copyFromDefault) {
      if (copyFromDefault) {
        var defaultLayoutName = vm.buildLayoutName();
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
          vm.languages[vm.currentLanguage] = createDummyTranslationObject();
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

    function init() {
      initTranslations();

      widgetLayoutService.onload($scope).then(function () {
        widgetLayoutService.edit($scope);
      });
    }

    function initTranslations() {
      vm.isSenderTranslated = !!(vm.sender.defaultLanguage) && Object.keys(vm.sender.translations).length !== 0;
      vm.defaultLanguage = vm.sender.defaultLanguage !== null ? vm.sender.defaultLanguage : 'NONE';
      vm.currentLanguage = vm.defaultLanguage;

      // create translations with default values for all available languages
      var availableLanguages = _.concat(_.keys(vm.sender.translations), vm.defaultLanguage);
      vm.languages = _.zipObject(availableLanguages, _.map(availableLanguages, function () {
        return {active: true, translations: {}};
      }));
      // add a default translations
      vm.languages[vm.defaultLanguage] = createDummyTranslationObject();
      // mark existing translations
      _.forEach(vm.app.getTranslatedContent(), function (language) {
        if (vm.languages[language]) {
          vm.languages[language] = createDummyTranslationObject();
        }
      });
    }

    function createDummyTranslationObject() {
      return {
        'active': true,
        'translations': {
          'anyPlaceholder': 'anyValue'
        }
      };
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

    function buildLayoutName(key) {
      var name = 'app-content-' + vm.app.id;
      if (!!key && !!sender.defaultLanguage && key !== 'NONE' && sender.defaultLanguage !== key) {
        name += '-' + key;
      }
      return name;
    }
  }

})(angular);
