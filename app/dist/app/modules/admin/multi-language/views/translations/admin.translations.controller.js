(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.multiLanguage')
      .controller('AdminTranslationsController', AdminTranslationsController);

  function AdminTranslationsController($q, $translate, $timeout, $scope, $filter, LanguagesModel, translationRegistry,
                                       modalService, settings, languages, adminService) {
    var vm = this;
    vm.filter = {
      'status': {
        'language': filterLanguage,
        'translated': filterTranslatedKeys,
        'onlyTranslatedKeys': false
      },
      'languages': [],
      'search': searchFilter,
      'searchTerm': '',
      'activeFilterTranslated': false
    };

    var allTranslationKeys;
    var filteredTranslationKeys;

    vm.editKey = editKey;
    vm.saveKey = saveKey;
    vm.getTranslated = getTranslated;
    vm.currentPage = currentPage;
    vm.deleteAllKeys = deleteAllKeys;
    vm.onTranslateKeypress = onTranslateKeypress;
    vm.toggleLanguageMenu = toggleLanguageMenu;
    vm.isInAvailableLanguageKeys = isInAvailableLanguageKeys;
    vm.pageSize = 20;
    vm.page = 1;
    vm.reloadTable = false;
    vm.filterOpen = false;
    vm.currentEditValues = {};

    // need to know about screen size in ctrl to turn off infinite scrolling in desktop mode
    vm.mobile = adminService.initMobileCheck($scope, function (isMobile) {
      // move back to first page when switching between mobile and desktop view
      if (isMobile !== vm.mobile && vm.page > 1) {
        vm.page = 1;
      }
      vm.mobile = isMobile;
    });

    if (vm.mobile) {
      vm.page = 0;
    }

    // returns the index of the current page
    function currentPage() {
      return (vm.pageSize * (vm.page - 1));
    }

    function filterLanguage(languageKey) {
      vm.filter.activeLanguage = languageKey;
      _loadAllTranslations().then(function () {
        vm.filter.status.onlyTranslatedKeys = false;
        vm.filter.searchTerm = '';
        vm.filter.activeFilterTranslated = false;
        vm.page = 1;
        toggleLanguageMenu(false);
      });
    }

    function filterTranslatedKeys() {
      vm.filter.activeFilterTranslated = !vm.filter.activeFilterTranslated;
      var tableArray = [];
      vm.filter.searchTerm = '';

      if (vm.filter.activeFilterTranslated) {
        _.forEach(allTranslationKeys, function (value) {
          if (getTranslated(value.key)) {
            tableArray.push({key: value.key, value: value.value});
          }
        });
        vm.translationKeys = tableArray;
        filteredTranslationKeys = vm.translationKeys;
      } else {
        vm.translationKeys = allTranslationKeys;
        filteredTranslationKeys = vm.translationKeys;
      }
    }

    function toggleLanguageMenu(value) {
      $timeout(function () { // delay opening to avoid firing click-outside event
        vm.filterOpen = angular.isDefined(value) ? value : !vm.filterOpen;
        var fn = vm.filterOpen ? 'addClass' : 'removeClass';
        angular.element('#translation-language-menu')[fn]('active');
      });
    }

    function onTranslateKeypress($event) {
      if ($event.keyCode === 13) {
        angular.element($event.currentTarget).blur();
      }
    }

    function searchFilter(search) {
      var results = [];
      vm.filter.searchTerm = search;
      vm.translationKeys = filteredTranslationKeys;
      var i = 0;

      if (search) {
        _.forEach(vm.translationKeys, function (value) {
          var messageTranslation = getTranslated(value.key) ? getTranslated(value.key).translation : '';

          if (_.includes(_.lowerCase(value.key), _.lowerCase(search)) ||
              _.includes(_.lowerCase(value.value), _.lowerCase(search)) ||
              _.includes(_.lowerCase(messageTranslation), _.lowerCase(search))) {
            results[i] = value;
            i++;
          }
        });
        vm.translationKeys = results;
      }
    }

    function editKey($event, key) {
      angular.element($event.currentTarget.parentNode)
          .removeClass('override');
      angular.element($event.currentTarget)
          .addClass('edit')
          .find('.input')
          .focus()
          .select();

      if (!vm.currentEditValues[key]) {
        var translation = getTranslated(key);
        vm.currentEditValues[key] = _.get(translation, 'translation', '');
      }
    }

    function saveKey($event, key) {
      var messageKey = getTranslated(key) ? getTranslated(key) : null;
      // remove trailing whitespace with trim
      var value = vm.mobile ? $event.currentTarget.value.trim() : vm.currentEditValues[key].trim();
      // update value in table (without trailing whitespace)
      $event.currentTarget.value = value;
      var promise;

      if (value) {
        angular.element($event.currentTarget.parentNode.parentNode).addClass('override');
        if (messageKey) {
          promise = LanguagesModel.updateTranslation(vm.filter.activeLanguage, key, value);
        } else {
          promise = LanguagesModel.createTranslation(vm.filter.activeLanguage, key, value);
        }
      } else {
        angular.element($event.currentTarget.parentNode).removeClass('edit');
        if (messageKey) {
          promise = LanguagesModel.deleteTranslation(vm.filter.activeLanguage, key);
        } else {
          promise = $q.resolve();
        }
      }

      promise.then(function () {
        vm.currentEditValues[key] = null;
        _loadMessageKeys(vm.filter.activeLanguage).then(function () {
          searchFilter(vm.filter.searchTerm);
        });
      });
    }

    function deleteAllKeys() {
      modalService.confirm({
        title: 'ADMIN.TRANSLATIONS.MODAL.RESET.HEADLINE',
        text: 'ADMIN.TRANSLATIONS.MODAL.RESET.TEXT',
        close: {title: 'RESET_ALL', style: 'btn-danger'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        vm.reloadTable = true;
        LanguagesModel.deleteTranslations(vm.filter.activeLanguage).then(function () {
          _loadMessageKeys(vm.filter.activeLanguage).then(function () {
            if (vm.filter.activeFilterTranslated) {
              filterTranslatedKeys();
            }
            searchFilter(vm.filter.searchTerm);
            vm.filter.status.onlyTranslatedKeys = false;
            vm.reloadTable = false;
          });
        });
      });
    }

    function isInAvailableLanguageKeys(language) {
      var availableLanguageKeys = $translate.getAvailableLanguageKeys();
      return availableLanguageKeys.indexOf(language) > -1;
    }

    function getTranslated(key) {
      return _.find(vm.translatedKeys, function (messageKey) {
        return messageKey.key === key;
      });
    }

    function _loadMessageKeys(language) {
      return LanguagesModel.getTranslations(language).then(function (keys) {
        vm.translatedKeys = keys;
      });
    }

    function _getTranslationTable(language) {
      var tableObject = translationRegistry.getTranslationTable(language);
      var tableArray = [];

      _.forIn(tableObject, function (value, key) {
        tableArray.push({key: key, value: value});
      });
      return tableArray;
    }

    function _loadAllTranslations() {
      return LanguagesModel.getBackendTranslations(vm.filter.activeLanguage).then(function (translations) {
        var languageKey = isInAvailableLanguageKeys(vm.filter.activeLanguage) ? vm.filter.activeLanguage
          : $translate.preferredLanguage();
        var messagesArray = _getTranslationTable(languageKey);
        var tmpArray = [];

        _.forIn(translations.messages, function (value, key) {
          tmpArray.push({key: key, value: value});
        });

        vm.translationKeys = _.concat(messagesArray, tmpArray);
        allTranslationKeys = vm.translationKeys;
        filteredTranslationKeys = vm.translationKeys;

        _loadMessageKeys(vm.filter.activeLanguage);
      });
    }

    function mapLanguage(language) {
      var translationPrefix = 'LANGUAGE.LANGUAGES.';

      return {
        language: language.language.toLowerCase(),
        name: $translate.instant(translationPrefix + language.language)
      };
    }

    function sortLanguages(languages) {
      return $filter('orderBy')(languages, 'name');
    }

    (function _init() {
      // Available language keys
      var activeLanguages = languages.filter(function (language) {
        return language.active;
      }).map(mapLanguage);
      activeLanguages = sortLanguages(activeLanguages);
      var inactiveLanguages = languages.filter(function (language) {
        return !language.active;
      }).map(mapLanguage);
      inactiveLanguages = sortLanguages(inactiveLanguages);
      vm.filter.languages = activeLanguages.concat(inactiveLanguages);
      // current language
      vm.filter.activeLanguage = settings.defaultLanguage.toLowerCase();

      // translation table of current language
      _loadAllTranslations().then();
    })();
  }
})(angular);
