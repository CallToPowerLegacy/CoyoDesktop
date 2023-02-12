(function (angular) {
  'use strict';

  angular
      .module('coyo.pages')
      .controller('PagesCreateController', PagesCreateController);

  function PagesCreateController($q, $state, $timeout, currentUser, PageModel, coyoNotification,
                                 settings) {
    var vm = this;

    vm.languages = {};

    vm.back = back;
    vm.next = next;
    vm.translationIsRequired = translationIsRequired;
    vm.checkValidity = checkValidity;
    vm.$onInit = _init;

    function back() {
      vm.wizard.active = Math.max(0, vm.wizard.active - 1);
    }

    function next(form) {
      if (form && form.$valid) {
        if (vm.wizard.active < vm.wizard.states.length - 1) {
          return $q.resolve(vm.wizard.active++);
        } else {
          vm.page.categoryIds = _.map(vm.page.categories, 'id');

          // Add translations for default language to page model
          angular.forEach(vm.languages[vm.page.defaultLanguage].translations, function (value, key) {
            vm.page[key] = value;
          });

          // Add additional translations to page model
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
          if (vm.page.autoSubscribeType !== 'NONE') {
            cancel = $timeout(function () {
              vm.showAutoSubscribeInfo = true;
            }, 5000);
          }

          return vm.page.create().then(function (page) {
            $state.go('main.page.show', {idOrSlug: page.slug});
            coyoNotification.success('MODULE.PAGES.CREATE.SUCCESS');
          }).finally(function () {
            if (cancel) {
              $timeout.cancel(cancel);
            }
            vm.showAutoSubscribeInfo = false;
          });
        }
      }
      return $q.reject();
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

    function _init() {
      vm.wizard = {
        states: ['MODULE.PAGES.CREATE.GENERAL', 'MODULE.PAGES.CREATE.ACCESS'],
        active: 0
      };
      if (currentUser.hasGlobalPermissions('AUTO_SUBSCRIBE_PAGE')) {
        vm.wizard.states.push('MODULE.PAGES.AUTO_SUBSCRIBE.LABEL');
      }

      vm.page = new PageModel({
        visibility: (currentUser.hasGlobalPermissions('CREATE_PUBLIC_PAGE') && settings.defaultVisibilityPages === 'PUBLIC') ? 'PUBLIC' : 'PRIVATE',
        adminIds: [currentUser.id],
        adminGroupIds: [],
        memberIds: [],
        memberGroupIds: [],
        translations: {},
        autoSubscribeType: 'NONE'
      });

      vm.page.defaultLanguage = 'NONE';
      vm.currentLanguage = 'NONE';
      vm.languages[vm.currentLanguage] = {
        active: true
      };
    }
  }
})(angular);
