(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.login
   *
   * @description
   * # Login module #
   * The login module renders the login page and handles everything login-related.
   *
   * @requires $stateProvider
   */
  angular
      .module('coyo.login', [
        'coyo.base',
        'commons.auth',
        'commons.ui',
        'commons.i18n'
      ])
      .config(ModuleConfig)
      .constant('loginConfig', {
        templates: {
          configure: 'app/modules/login/views/configure/login.configure.html',
          reset: 'app/modules/login/views/reset/login.reset.html',
          terms: 'app/modules/login/views/terms/login.terms.html',
          main: 'app/modules/login/views/main/login.main.html',
          logout: {
            success: 'app/modules/login/views/logout/logout.success.html'
          }
        },
        signals: {
          loginError: 'LOGIN_ERROR',
          resetError: 'RESET_ERROR'
        },
        misc: {
          shakeAfterTimes: 1
        },
        autoLoginDelay: 2000,
        maintenance: {
          types: {
            global: 'GLOBAL_MAINTENANCE',
            tenant: 'TENANT_MAINTENANCE'
          }
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, loginConfig) {
    $stateProvider.state('front.configure', {
      url: '/configure',
      templateUrl: loginConfig.templates.configure,
      controller: 'LoginConfigureController',
      controllerAs: '$ctrl',
      data: {
        authenticate: false
      }
    }).state('front.reset', {
      url: '/reset?token',
      templateUrl: loginConfig.templates.reset,
      controller: 'LoginResetController',
      controllerAs: '$ctrl',
      data: {
        authenticate: false
      },
      resolve: {
        passwordPattern: function (SettingsModel) {
          return SettingsModel.retrieveByKey('passwordPattern');
        },
        token: function ($stateParams) {
          return $stateParams.token;
        }
      }
    }).state('front.login', {
      url: '/login',
      templateUrl: loginConfig.templates.main,
      controller: 'LoginMainController',
      controllerAs: '$ctrl',
      data: {
        authenticate: false
      },
      params: {
        errorCode: null
      },
      resolve: {
        authenticationProviderConfigs: function (AuthenticationProviderModel, backendUrlService) {
          if (!backendUrlService.isSet()) {
            return [];
          }
          return AuthenticationProviderModel.query({}, 'public');
        },
        maintenance: function (MaintenanceModel, backendUrlService, $state, $q) {
          if (!backendUrlService.isSet()) {
            return $q.resolve();
          } else {
            return MaintenanceModel.getPublic().then(function (maintenance) {
              if (maintenance && maintenance.type === loginConfig.maintenance.types.global) {
                $state.go('front.maintenance', null, {location: false});
                return $q.reject();
              }
              return $q.resolve();
            });
          }
        }
      }
    }).state('front.sso-login-success', {
      url: '/sso-login-success',
      onEnter: function ($state, authService, deeplinkService) {
        authService.ssoLoginSuccess();
        $state.go(deeplinkService.getReturnToState() || 'main', deeplinkService.getReturnToStateParams());
        deeplinkService.clearReturnToState();
      },
      data: {
        authenticate: false
      }
    }).state('front.sso-login-error', {
      url: '/sso-login-error?errorCode',
      onEnter: function ($state, errorService, $stateParams) {
        if ($stateParams.errorCode === 'SSO_LOGIN_DENIED' || $stateParams.errorCode === 'SSO_USER_NOT_FOUND') {
          $state.go('front.login', {errorCode: $stateParams.errorCode});
        } else {
          errorService.getMessage(_.set({}, 'data.errorStatus', $stateParams.errorCode)).then(function (message) {
            errorService.showErrorPage(message, 401);
          });
        }
      }
    }).state('front.terms', {
      url: '/terms',
      templateUrl: loginConfig.templates.terms,
      controller: 'LoginTermsController',
      controllerAs: '$ctrl',
      data: {
        authenticate: true
      },
      resolve: {
        settings: function (SettingsModel) {
          return SettingsModel.retrieve();
        }
      }
    }).state('front.logout-success', {
      url: '/logout-success',
      templateUrl: loginConfig.templates.logout.success,
      controller: 'LogoutSuccessController',
      controllerAs: '$ctrl',
      data: {
        authenticate: false
      }
    });
  }

})(angular);
