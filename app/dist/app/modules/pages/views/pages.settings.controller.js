(function (angular) {
  'use strict';

  angular
      .module('coyo.pages')
      .controller('PageSettingsController', PageSettingsController);

  /**
   * Controller for the page edit view
   */
  function PageSettingsController($state, modalService, coyoNotification, page, members, $timeout) {
    var vm = this;

    vm.save = savePage;
    vm.delete = deletePage;
    vm.translationIsRequired = translationIsRequired;
    vm.checkValidity = checkValidity;
    vm.$onInit = onInit;

    function savePage() {
      vm.page.categoryIds = _.map(vm.page.categories, 'id');

      // Add translations for default language to page model
      vm.page.defaultLanguage = page.defaultLanguage !== null ? page.defaultLanguage : 'NONE';
      angular.forEach(vm.languages[vm.page.defaultLanguage].translations, function (value, key) {
        vm.page[key] = value;
      });

      // Add additional translations to page model
      vm.page.translations = {};
      angular.forEach(vm.languages, function (value, key) {
        if (value.active) {
          vm.page.translations[key] = value.translations ? value.translations : {};
        }
      });
      delete vm.page.translations[vm.page.defaultLanguage];
      if (vm.page.defaultLanguage === 'NONE') {
        vm.page.defaultLanguage = null;
      }

      // show help text if auto-subscribe + saving takes more than a few seconds
      var cancel;
      if (vm.page.autoSubscribeType !== 'NONE' || vm.page.autoSubscribeType !== vm.oldAutoSubscribeType) {
        cancel = $timeout(function () {
          vm.showAutoSubscribeInfo = true;
        }, 5000);
      }

      return vm.page.update().then(function (page) {
        coyoNotification.success('MODULE.PAGES.EDIT.SUCCESS');

        if ($state.is('main.page.show.settings')) {
          $state.go('main.page.show', {idOrSlug: page.slug}, {reload: 'main.page.show'});
        }
      }).finally(function () {
        if (cancel) {
          $timeout.cancel(cancel);
        }

        vm.showAutoSubscribeInfo = false;
      });
    }

    function deletePage() {
      modalService.confirm({title: 'PAGE.DELETE', text: 'PAGE.DELETE.CONFIRM'}).result.then(function () {
        vm.page.delete().then(function () {
          $state.go('main.page');
          coyoNotification.success('PAGE.DELETE.SUCCESS');
        });
      });
    }

    function translationIsRequired(language) {
      if (vm.page.defaultLanguage === 'NONE') {
        return language === 'NONE';
      } else {
        return (vm.languages[language].translations && Object.keys(vm.languages[language].translations).length) ||
               (vm.currentLanguage === language);
      }
    }

    function checkValidity(key, valid) {
      vm.languages[key].valid = valid;
    }

    function onInit() {
      vm.page = angular.extend(page, members);
      vm.baseUrl = $state.href('main.page', {}) + '/';
      vm.oldName = page.displayName;
      vm.oldSlug = page.slug;
      vm.oldAutoSubscribeType = page.autoSubscribeType;

      vm.currentLanguage = page.defaultLanguage !== null ? page.defaultLanguage : 'NONE';
      vm.page.defaultLanguage = page.defaultLanguage !== null ? page.defaultLanguage : 'NONE';
      vm.languages = {};
      vm.languages[vm.currentLanguage] = {
        'active': true,
        'translations': {
          'name': page.name,
          'description': page.description
        }
      };
      _.forEach(page.translations, function (value, key) {
        vm.languages[key] = {
          'active': true,
          'translations': value
        };
      });

      _.forEach(vm.page.categories, function (category) {
        category.displayName = category.name;
      });
    }
  }
})(angular);
