(function (angular) {
  'use strict';

  angular
      .module('coyo.login')
      .controller('LoginResetController', LoginResetController);

  function LoginResetController($scope, $state, authService, backendUrlService, curtainService, i18nService,
                                coyoNotification, loginConfig, passwordPattern, token) {
    var vm = this;

    var errorCount = 0;

    vm.cssShakeClass = 'shake';
    vm.signal = loginConfig.signals.resetError;
    vm.passwordPattern = passwordPattern;
    vm.token = token;
    vm.sent = false;
    vm.error = null;

    vm.request = request;
    vm.reset = reset;

    function request(username) {
      vm.loading = true;
      authService.requestPassword(username).then(function () {
        _clearError();
        vm.sent = true;
      }).catch(function () {
        _setError('MODULE.LOGIN.RESET.REQUEST_ERROR');
      }).finally(function () {
        vm.loading = false;
      });
    }

    function reset(token, password) {
      vm.loading = true;
      authService.resetPassword(token, password).then(function (user) {
        coyoNotification.success('PASSWORD.CHANGE.SUCCESS');
        return authService.login(user.loginName, password).then(function () {
          _clearError();
          authService.getUser().then(function (user) {
            i18nService.setInterfaceLanguage(user.language);
          });
          $state.go('main');
        }).catch(function () {
          _setError('MODULE.LOGIN.AUTHENTICATION_FAILED');
        });
      }).catch(function (error) {
        _setError(error.status === 404 ? 'MODULE.LOGIN.RESET.RESET_ERROR' : 'PASSWORD.CHANGE.ERROR');
      });
    }
    function _setError(errorMsg) {
      vm.loading = false;
      vm.error = errorMsg;
      if (++errorCount > loginConfig.misc.shakeAfterTimes) {
        $scope.$broadcast(vm.signal);
      }
    }

    function _clearError() {
      errorCount = 0;
      vm.error = null;
    }

    (function _init() {
      if (authService.isAuthenticated()) {
        $state.go('main');
      } else if (!backendUrlService.isSet()) {
        $state.transitionTo('front.configure');
      } else {
        curtainService.hide();
      }
    })();
  }

})(angular);
