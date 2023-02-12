(function (angular) {
  'use strict';

  angular
      .module('coyo.login')
      .controller('LoginMainController', LoginMainController);

  /**
   * Controller for the login process
   */
  function LoginMainController($scope, $state, $stateParams, $translate, $interval, $window, themeService,
                               setupService, authService, curtainService, backendUrlService, errorService,
                               coyoEndpoints, authenticationProviderConfigs, loginConfig, moment, deeplinkService) {
    var vm = this;

    vm.status = null;
    vm.user = null;
    vm.signal = loginConfig.signals.loginError;
    vm.cssShakeClass = 'shake';
    vm.authenticationProviderConfigs = authenticationProviderConfigs;

    vm.login = login;
    vm.resetBackendUrl = resetBackendUrl;
    vm.cancelAutoLogin = cancelAutoLogin;
    vm.getLoginUrl = getLoginUrl;
    vm.$onInit = init;

    var autoLoginInterval = null;

    function resetBackendUrl() {
      if (backendUrlService.isConfigurable()) {
        backendUrlService.clearUrl();
        $state.go('front.configure');
      }
    }

    /**
     * Tries to log in the user via the authService
     */
    function login() {
      vm.status.loggingIn = true;
      authService.login(vm.user.username, vm.user.password).then(function () {
        _clearErrorMessage();
        curtainService.show();
        return themeService.applyTheme();
      }).then(function () {
        // redirect to origin state requested
        $state.go(deeplinkService.getReturnToState() || 'main', deeplinkService.getReturnToStateParams())
            .then(function () {
              vm.status.loggingIn = false;
            });
        deeplinkService.clearReturnToState();
      }).catch(function (errorResponse) {
        if (errorResponse.status === 403) {
          errorService.suppressNotification(errorResponse);
          vm.status.nrOfErrors++;
          _updateErrorMessage(errorResponse.data);
          if (vm.status.nrOfErrors > loginConfig.misc.shakeAfterTimes) {
            $scope.$broadcast(vm.signal);
          }
        }
        vm.status.loggingIn = false;
      });
    }

    function cancelAutoLogin() {
      vm.autoLogin = false;
      $interval.cancel(autoLoginInterval);
    }

    function getLoginUrl(slug) {
      return (vm.backendUrl ? vm.backendUrl : '') + coyoEndpoints.ssoLogin.replace('{configIdOrSlug}', slug);
    }

    /**
     * Resets the controller status
     */
    function _resetStatus() {
      vm.status = {
        error: false,
        nrOfErrors: 0,
        message: '',
        loggingIn: false,
        user: null
      };
    }

    /**
     * Resets the user credentials by retrieving the username from localstorage
     */
    function _resetUser() {
      vm.user = {
        username: authService.getLastLogin() || '',
        password: ''
      };
    }

    /**
     * Sets the error state to true and sets the error message
     */
    function _setErrorMessage(msg) {
      vm.status.error = true;
      vm.status.message = msg;
    }

    /**
     * Checks whether an error occured and sets an internationalized error message
     */
    function _updateErrorMessage(error) {
      if (vm.status.nrOfErrors > 0) {

        if (error.errorCode === 'USER_BLOCKED') {
          _setBlockedUserErrorMessage(error);
        } else {
          $translate('MODULE.LOGIN.AUTHENTICATION_FAILED').then(function (str) {
            _setErrorMessage(str);
          });
        }
      }
    }

    function _setBlockedUserErrorMessage(error) {
      if (error.blockingTimeLeft) {
        var date = moment(new Date(Date.now() + error.blockingTimeLeft * 1000)).locale($translate.use());
        $translate('MODULE.LOGIN.AUTHENTICATION_BLOCK.ERROR_WITH_TIME', {time: date.fromNow()}).then(function (str) {
          _setErrorMessage(str);
        });
      } else {
        $translate('MODULE.LOGIN.AUTHENTICATION_BLOCK.ERROR').then(function (str) {
          _setErrorMessage(str);
        });
      }
    }

    /**
     * Sets the error state to false and clears the error message
     */
    function _clearErrorMessage() {
      vm.status.nrOfErrors = 0;
      vm.status.error = false;
      vm.status.message = '';
    }

    /**
     * Main method
     */
    function init() {
      if (!backendUrlService.isSet()) {
        $state.go('front.configure');
        return;
      } else {
        vm.backendUrl = backendUrlService.getUrl();
      }

      if (authService.isAuthenticated()) {
        $state.go('main');
        return;
      }

      // Explicitly check the setup here.
      // We can't do it in resolve since it's possible that the backend URL has not been set, yet,
      // and that's intercepted (and forbidden) by the http interceptor.
      setupService.check().then(function (setUp) {
        if (!setUp) {
          $state.go('setup');
        } else {
          _resetStatus();
          _resetUser();
          curtainService.hide();
          curtainService.blankOnly(false);
          if ($stateParams.errorCode) {
            vm.status.nrOfErrors++;
            _updateErrorMessage({errorCode: $stateParams.errorCode});
          }
        }
      });

      var autoLoginConfig = _.find(authenticationProviderConfigs, {autoLogin: true});
      vm.autoLogin = !!autoLoginConfig && !$stateParams.errorCode;
      if (vm.autoLogin) {
        autoLoginInterval = $interval(function () {
          $interval.cancel(autoLoginInterval);
          vm.autoLoginStarted = true;
          $window.location = getLoginUrl(autoLoginConfig.slug);
        }, loginConfig.autoLoginDelay);
      }
    }
  }

})(angular);
