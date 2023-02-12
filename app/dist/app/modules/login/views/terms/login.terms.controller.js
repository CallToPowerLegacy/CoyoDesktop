(function (angular) {
  'use strict';

  angular
      .module('coyo.login')
      .controller('LoginTermsController', LoginTermsController);

  function LoginTermsController(curtainService, termsService, $state, TermsModel, authService, settings) {
    var vm = this;

    vm.accept = accept;
    vm.decline = decline;

    vm.accepting = false;
    vm.declining = false;

    function accept() {
      vm.accepting = true;

      authService.getUser().then(function (user) {
        TermsModel.accept(user.id, settings.defaultLanguage).then(function () {
          authService.getUser(true).then(function () {
            var targetState = termsService.getTargetState();
            $state.go(targetState.name, targetState.params);
          });
        });
      });
    }

    function decline() {
      vm.declining = true;

      authService.getUser().then(function (user) {
        TermsModel.decline(user.id, settings.defaultLanguage).then(function () {
          authService.logout();
        });
      });
    }

    function _fetchTerms(lang) {
      return TermsModel.getByLanguage(lang).then(function (terms) {
        vm.terms = terms;
      });
    }

    (function _init() {
      termsService.userNeedsToAcceptTerms().then(function (showTerms) {
        if (showTerms) {
          _fetchTerms(settings.defaultLanguage).then(function () {
            curtainService.hide();
          });
        } else {
          var targetState = termsService.getTargetState();
          $state.go(targetState.name, targetState.params);
        }
      });
    })();
  }

})(angular);
