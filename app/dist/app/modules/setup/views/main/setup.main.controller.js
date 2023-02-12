(function (angular) {
  'use strict';

  angular
      .module('coyo.setup')
      .controller('SetupController', SetupController);

  function SetupController($state, $q, setupService, coyoNotification, curtainService, backendUrlService,
                           isSetUp, passwordPattern, emailPattern) {
    var vm = this;
    if (backendUrlService.isConfigurable()) {
      vm.backendUrl = backendUrlService.getUrl();
    }

    vm.isSetUp = isSetUp;
    vm.emailPattern = emailPattern;
    vm.passwordPattern = passwordPattern;
    vm.settingUp = false;

    vm.inputTypes = {
      password: 'password',
      passwordconfirm: 'password'
    };

    vm.model = {
      networkName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      demoData: true
    };
    vm.passwordConfirm = '';
    vm.demoData = undefined;
    vm.confirmEmptyInstallation = 'FALSE';

    // Wizard
    vm.back = back;
    vm.next = next;
    vm.resetBackendUrl = resetBackendUrl;

    function back() {
      vm.wizard.active = Math.max(-1, vm.wizard.active - 1);
    }

    function next(form, model) {
      if (form && form.$valid) {
        if (vm.wizard.active < vm.wizard.states.length - 1) {
          return $q.resolve(++vm.wizard.active);
        } else {
          return setUp(model);
        }
      }
      return $q.reject();
    }

    function resetBackendUrl() {
      if (backendUrlService.isConfigurable()) {
        backendUrlService.clearUrl();
        $state.transitionTo('front.configure');
      }
    }

    function setUp(model) {
      vm.settingUp = true;
      vm.model.demoData = vm.demoData === 'TRUE';
      return setupService
          .setUp(model).then(function () {
            coyoNotification.success('MODULE.SETUP.SUCCESS');
            $state.go('main.default');
          })
          .catch(function () { // Don't do this in the finally block to avoid flickering
            vm.settingUp = false;
          });
    }

    (function () {
      if (isSetUp) {
        $state.go('main.default');
      } else {
        curtainService.hide();

        vm.wizard = {
          states: [
            'MODULE.SETUP.WIZARD.NETWORKNAME',
            'MODULE.SETUP.WIZARD.INITIAL_USER',
            'MODULE.SETUP.WIZARD.DEMODATA'
          ],
          active: -1
        };
      }
    })();
  }

})(angular);
