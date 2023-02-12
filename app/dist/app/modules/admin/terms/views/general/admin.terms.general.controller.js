(function (angular) {
  'use strict';

  angular.module('coyo.admin.terms')
      .controller('AdminTermsGeneralController', AdminTermsGeneralController);

  function AdminTermsGeneralController(TermsModel, SettingsModel, modalService, coyoNotification, languages, settings, translations) {
    var vm = this;

    vm.settings = settings;
    vm.language = settings.defaultLanguage;
    vm.languages = languages;
    vm.translations = _.keyBy(translations, 'language');

    vm.isActive = isActive;
    vm.canActivate = canActivate;
    vm.save = save;
    vm.reset = reset;

    vm.active = isActive();
    vm.hiddenUsers = isHiddenUsers();

    function isActive() {
      return vm.settings.termsRequired === 'true';
    }

    function isHiddenUsers() {
      return vm.settings.hiddenUsers === 'true';
    }

    function canActivate() {
      var translation = vm.translations[vm.settings.defaultLanguage];
      return isActive() || (translation && !_.isEmpty(translation.title) && !_.isEmpty(translation.text));
    }

    function save(language) {
      return _saveTerms(language).then(function (terms) {
        return (vm.active !== isActive() || vm.hiddenUsers !== isHiddenUsers()) ? _saveActivation() : terms;
      }).then(function () {
        coyoNotification.success('ADMIN.TERMS.GENERAL.SAVE.SUCCESS');
      });
    }

    function reset() {
      return modalService.confirm({
        title: 'ADMIN.TERMS.MODAL.RESET.HEADLINE',
        text: 'ADMIN.TERMS.MODAL.RESET.TEXT',
        close: {title: 'RESET_ALL', style: 'btn-danger'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        return TermsModel.reset().then(function () {
          coyoNotification.success('ADMIN.TERMS.GENERAL.RESET.SUCCESS');
        });
      });
    }

    // --------------------

    function _saveTerms(language) {
      var terms;
      if (!vm.translations[language].id) {
        terms = new TermsModel(vm.translations[language]);
        terms.language = language;
      } else {
        terms = vm.translations[language];
      }
      return terms.save().then(function (terms) {
        vm.translations[language] = terms;
        return terms;
      });
    }

    function _saveActivation() {
      var promise = vm.active ? TermsModel.activate(vm.hiddenUsers) : TermsModel.deactivate();
      return promise.then(function () {
        return SettingsModel.retrieve(true).then(function (settings) {
          vm.settings = settings;
          vm.active = isActive();
          vm.hiddenUsers = isHiddenUsers();
          return settings;
        });
      });
    }
  }

})(angular);
