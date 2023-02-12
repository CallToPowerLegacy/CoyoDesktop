(function (angular) {
  'use strict';

  angular
      .module('commons.auth')
      .factory('authService', authService);

  /**
   * @ngdoc service
   * @name commons.auth.authService
   *
   * @description
   * Provides methods for authentication and retrieving authentication information.
   *
   * The service can be used to
   * * log in and log out,
   * * check if the user is currently authenticated,
   * * get the current user.
   *
   * @requires $http
   * @requires $q
   * @requires $log
   * @requires $rootScope
   * @requires $state
   * @requires $localStorage
   * @required $sessionStorage
   * @requires $window
   * @requires $document
   * @requires $location
   * @requires commons.config.coyoEndpoints
   * @requires coyo.domain.UserModel
   * @requires commons.resource.backendUrlService
   * @requires commons.resource.csrfService
   */
  function authService($http, $q, $log, $rootScope, $state, $translate, $localStorage, $sessionStorage, $filter,
                       $window, $document, $timeout, $location, $httpParamSerializerJQLike, backendUrlService,
                       errorService, mobileEventsService, coyoEndpoints, UserModel, csrfService) {
    var currentUser = null;
    var currentUserPromise = null;
    var LOGIN_NAME_KEY = 'lastLoginName';

    return {
      getLastLogin: getLastLogin,
      login: login,
      logout: logout,
      clearSession: clearSession,
      requestPassword: requestPassword,
      resetPassword: resetPassword,
      isAuthenticated: isAuthenticated,
      getUser: getUser,
      onGlobalPermissions: onGlobalPermissions,
      ssoLoginSuccess: ssoLoginSuccess
    };

    /**
     * @ngdoc method
     * @name commons.auth.authService#login
     * @methodOf commons.auth.authService
     *
     * @description
     * Tries to log in the user with the given username and password.
     *
     * @param {string} username The username
     * @param {string} password The password
     * @return {object} An $http promise
     */
    function login(username, password) {
      var deferred = $q.defer();
      var data = $httpParamSerializerJQLike({username: username, password: password});
      var headers = {'Content-Type': 'application/x-www-form-urlencoded'};

      $http.post(coyoEndpoints.login, data, {
        headers: headers
      }).then(function (result) {
        $localStorage.isAuthenticated = true;
        $log.info('[authService] Login succeeded');
        csrfService.clearToken();
        localStorage.setItem(LOGIN_NAME_KEY, username);
        _propagateEvent('authService:login:success');
        deferred.resolve(result);
      }).catch(function (e) {
        $localStorage.isAuthenticated = false;
        $log.error('[authService] Login failed', e);
        _propagateEvent('authService:login:failed', e);
        deferred.reject(e);
        clearSession();
      });

      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name commons.auth.authService#getLastLogin
     * @methodOf commons.auth.authService
     *
     * @description
     * Returns the username of the last successful login
     *
     * @return {string} username of the last successful login
     */
    function getLastLogin() {
      return localStorage.getItem(LOGIN_NAME_KEY);
    }

    function ssoLoginSuccess() {
      var loginSuccessParams = angular.fromJson($location.search().params) || {};
      $localStorage.isAuthenticated = true;
      $sessionStorage.isSsoLogin = true;
      $sessionStorage.isGlobalLogout = loginSuccessParams.logoutMethod === 'GLOBAL';
      csrfService.clearToken();
      _propagateEvent('authService:login:success');
    }

    /**
     * @ngdoc method
     * @name commons.auth.authService#clearSession
     * @methodOf commons.auth.authService
     *
     * @description
     * Clears all user session data.
     *
     * @return {object} promise that is resolved when session data is removed from local storage.
     */
    function clearSession() {
      $localStorage.isAuthenticated = false;
      delete $localStorage.clientId;
      $sessionStorage.$reset();
      currentUser = null;
      currentUserPromise = null;
      csrfService.clearToken();

      return $timeout(_.noop);
    }

    /**
     * @ngdoc method
     * @name commons.auth.authService#logout
     * @methodOf commons.auth.authService
     *
     * @description
     * Logs out the user and clears all data (tokens and user data).
     * Note that this function might never return due to a possible
     * redirection.
     *
     * After logging out the user is redirected to the login page.
     *
     */
    function logout() {
      var isSsoLogin = $sessionStorage.isSsoLogin;
      var isGlobalLogout = $sessionStorage.isGlobalLogout;

      clearSession();

      if (isSsoLogin) {
        _ssoLogout(isGlobalLogout);
      } else {
        _logout();
      }
    }

    /**
     * @ngdoc method
     * @name commons.auth.authService#requestPassword
     * @methodOf commons.auth.authService
     *
     * @description
     * Requests a password reset link via email for the user with the given username.
     *
     * @param {string} username The username
     * @return {object} An $http promise
     */
    function requestPassword(username) {
      return $http.post(coyoEndpoints.reset, {
        username: username
      }, {
        autoHandleErrors: false
      });
    }

    /**
     * @ngdoc method
     * @name commons.auth.authService#resetPassword
     * @methodOf commons.auth.authService
     *
     * @description
     * Resets the user's password using the given password reset token.
     *
     * @param {string} token    the password reset token
     * @param {string} password the new password
     * @return {object} An $http promise containing the updated user
     */
    function resetPassword(token, password) {
      return $http.put(coyoEndpoints.reset, {
        token: token,
        password: password
      }, {
        autoHandleErrors: false
      }).then(function (response) {
        return response.data;
      });
    }

    /**
     * @ngdoc method
     * @name commons.auth.authService#isAuthenticated
     * @methodOf commons.auth.authService
     *
     * @description
     * Returns whether the user is authenticated.
     *
     * @returns {boolean} True if the user is authenticated, false else
     */
    function isAuthenticated() {
      return $localStorage.isAuthenticated === true;
    }

    /**
     * @ngdoc method
     * @name commons.auth.authService#getUser
     * @methodOf commons.auth.authService
     *
     * @description
     * Returns the current user and caches the current user during application lifetime.
     *
     * This method should be called to retrieve the current user in any service.
     *
     * @params {boolean} forceRefresh [optional, default: false] Boolean flag whether forcing a user refresh
     *
     * @returns {promise} The current user
     */
    function getUser(forceRefresh) {
      if (isAuthenticated()) {
        if (forceRefresh) {
          currentUserPromise = null;
        }

        if (!currentUserPromise) {
          $log.debug('[authService] Loading current user...');

          currentUserPromise =
              UserModel.getWithPermissions({id: 'me'}, {with: 'globalPermissions'}, ['manage', 'createFile'])
                  .then(function (user) {
                    $log.debug('[authService] Loaded current user:', user);
                    $rootScope.$emit('currentUser:updated', user, angular.copy(currentUser));
                    if (currentUser) {
                      angular.extend(currentUser, user);
                    } else {
                      currentUser = user;
                    }
                    $localStorage.userLanguage = currentUser.language;
                    return currentUser;
                  })
                  .catch(function (error) {
                    currentUserPromise = null;
                    return _onUserLoadingError(error);
                  });
        }

        return currentUserPromise;
      } else {
        return $q.reject('Not signed in.');
      }
    }

    /**
     * @ngdoc method
     * @name commons.auth.authService#onGlobalPermissions
     * @methodOf commons.auth.authService
     *
     * @description
     * Checks provided global permissions against the current user and executed the provided callback with the result.
     *
     * @deprecated
     * Live updates of global permissions are no longer supported, user UserModel.hasGlobalPermission instead.
     *
     * @param {string|string[]} permissionNames array or comma-separated list of global permission names
     * @param {function(boolean, object)} callback will be executed with the result of the permission check and the current user
     * @param {boolean?} requireAll flag if set then all provided permissions must be set, otherwise a single one will be enough
     *
     * @returns {function()} de-registration function for the change event (call this on scope destroy)
     */
    function onGlobalPermissions(permissionNames, callback, requireAll) {
      this.getUser().then(function (user) {
        callback(user.hasGlobalPermissions(permissionNames, requireAll), user);
        _applyDateFormats(user);
      });
    }

    function _onUserLoadingError(error) {
      $log.error('[authService] Could not load current user', error);

      var buttons = [];
      buttons.push('RETRY');
      if (backendUrlService.isConfigurable()) {
        buttons.push('CONFIGURE_BACKEND');
      }

      if (error.status >= 400 && error.status < 500) {
        logout();
      } else if (error.status < 0) {
        $translate('ERRORS.BACKEND.FAILED_CONTACT').then(function (translation) {
          errorService.showErrorPage(translation, null, buttons);
        });
      } else {
        $translate('ERRORS.USERS.FAILED_LOADING_CURRENT_USER').then(function (translation) {
          errorService.showErrorPage(translation, null, buttons);
        });
      }

      return $q.reject('Error loading current user.');
    }

    function _logout() {
      $http({
        url: coyoEndpoints.logout,
        method: 'POST',
        autoHandleErrors: false
      }).then(function (response) {
        localStorage.removeItem(LOGIN_NAME_KEY);
        $log.info('[authService] Logout succeeded');
        _propagateEvent('authService:logout:success');
        if (response.data) {
          var data = angular.fromJson(response.data);
          if (data.redirectTo) {
            $window.location.href = data.redirectTo;
          }
        }
      }).catch(function (error) {
        $log.error('[authService] Logout failed', error);
        _propagateEvent('authService:logout:failed', error);
      }).finally(function () {
        $state.go('front.logout-success');
      });
    }

    function _ssoLogout(global) {
      csrfService.getToken().then(function (token) {
        var globalLogoutParam = global ? 'global=true&' : '';
        var url = backendUrlService.getUrl() + coyoEndpoints.ssoLogout + '?' + globalLogoutParam + '_csrf=' + token;
        _post(url);
      }).catch(function () {
        $log.warn('[socketService] Connection failed: No CSRF token.');
        _logout();
      });
    }

    function _post(url) {
      var form = angular.element('<form/>').attr('method', 'post').attr('action', url);
      $document.find('body').eq(0).append(form);
      form.submit();
    }

    function _applyDateFormats(user) {
      $rootScope.timezone = user.timezone;

      $rootScope.dateFormat = {
        long: $filter('translate')('DATE_FORMAT_LONG'),
        medium: $filter('translate')('DATE_FORMAT_MEDIUM'),
        short: $filter('translate')('DATE_FORMAT_SHORT')
      };

      $rootScope.timeFormat = {
        medium: $filter('translate')('TIME_FORMAT_MEDIUM'),
        short: $filter('translate')('TIME_FORMAT_SHORT')
      };
    }

    function _propagateEvent(eventName, payload) {
      $timeout(function () {
        $rootScope.$emit(eventName);
        mobileEventsService.propagate(eventName, payload);
      });
    }

  }

})(angular);
