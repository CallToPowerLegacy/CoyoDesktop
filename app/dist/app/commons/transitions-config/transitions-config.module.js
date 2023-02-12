(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.transitionsConfig
   *
   * @description
   * # Transitions module #
   * The transitions module registers handlers for ui router state transitions.
   *
   */
  angular
      .module('commons.transitionsConfig', [
        'coyo.base',
        'coyo.apps'
      ])
      .constant('transitionsConstants', {
        errorType: {
          transitionSuperseeded: 2,
          transitionAborted: 3,
          transitionIgnored: 5
        }
      })
      .run(registerTransitionHooks);

  function registerTransitionHooks($transitions) {
    var ALL_STATES = {};
    $transitions.onStart(ALL_STATES, _closeUiElements, {priority: 100});
    $transitions.onStart(ALL_STATES, _handleLockedStates, {priority: 90});
    $transitions.onStart(ALL_STATES, _handlePrivilegedStates, {priority: 80});
    $transitions.onStart(ALL_STATES, _handleGlobalPermissionStates, {priority: 70});
    $transitions.onStart(ALL_STATES, _handleStateRedirects, {priority: 60});

    $transitions.onSuccess(ALL_STATES, _populatePreviousState, {priority: 100});
    $transitions.onSuccess(ALL_STATES, _raiseGlobalEvent, {priority: 80});

    $transitions.onError(ALL_STATES, _handleStateError);
  }

  // cleanup ui elements that should disappear on all state changes
  function _closeUiElements(transition) {
    var coyoConfig = transition.injector().get('coyoConfig');
    transition.injector().get('$uibModalStack').dismissAll(coyoConfig.rejectReason.transitionStarted);
    transition.injector().get('sidebarService').closeAll();
  }

  // prevent state navigation when current state is locked (e.g. by edit mode)
  function _handleLockedStates(transition) {
    var stateLockService = transition.injector().get('stateLockService');
    var $rootScope = transition.injector().get('$rootScope');
    var widgetLayoutService = transition.injector().get('widgetLayoutService');
    var modalService = transition.injector().get('modalService');

    function onProceedTransition() {
      $rootScope.globalEditMode = false;
      widgetLayoutService.cancel($rootScope, true);
      stateLockService.unlockAll();
      return true;
    }

    function onCancelTransition() {
      return false;
    }

    if (stateLockService.isLocked()) {
      var promise = modalService.confirm({
        title: 'CONFIRMATION.LEAVE_STATE.TITLE',
        text: 'CONFIRMATION.LEAVE_STATE.TEXT',
        close: {title: 'OK'},
        dismiss: {title: 'CANCEL'}
      }).result;

      return promise.then(onProceedTransition, onCancelTransition);
    }
    return true;
  }

  // prevent access to privileged states for non-authenticated users
  function _handlePrivilegedStates(transition) {
    var deeplinkService = transition.injector().get('deeplinkService');
    var $log = transition.injector().get('$log');
    var $location = transition.injector().get('$location');
    var authenticated = transition.injector().get('authService').isAuthenticated();
    var authenticationRequired = _.get(transition.to(), 'data.authenticate', false);

    if (authenticationRequired && !authenticated) {
      deeplinkService.setReturnToState(transition.to(), transition.params());

      $log.debug('[CoyoMain] User is not authenticated or requested a restricted page, redirecting. '
                + 'Requested page: \'' + $location.path() + '\'');

      return transition.router.stateService.target('front.login');
    }
    return true;
  }

  // check access to states that require a global permission
  function _handleGlobalPermissionStates(transition) {
    var $log = transition.injector().get('$log');
    var coyoNotification = transition.injector().get('coyoNotification');
    var $translate = transition.injector().get('$translate');
    var errorService = transition.injector().get('errorService');
    var globalPermissions = _.get(transition.to(), 'data.globalPermissions');
    var globalPermissionsRequireAll = _.get(transition.to(), 'data.globalPermissionsRequireAll');

    if (globalPermissions) {
      return transition.injector().get('authService').getUser().then(function (user) {
        if (!user.hasGlobalPermissions(globalPermissions, globalPermissionsRequireAll)) {

          $log.error('[CoyoMain] user is not permitted to access state: ', transition.to().name);

          if (transition.from() && transition.from().name.length && transition.from().name !== 'front.login') {
            coyoNotification.error('ERRORS.FORBIDDEN');
          } else {
            $translate('ERRORS.FORBIDDEN').then(function (msg) {
              errorService.showErrorPage(msg, 403);
            });
          }
          return false;
        }
        return true;
      });
    }
    return true;
  }

  // check for state redirects
  function _handleStateRedirects(transition) {
    var $q = transition.injector().get('$q');
    var $log = transition.injector().get('$log');
    var $injector = transition.injector().get('$injector');
    var target = transition.router.stateService.target;

    function isRedirectFunction() {
      var isFunction = angular.isFunction(transition.to().redirect);
      var isAnnotatedFunction = angular.isArray(transition.to().redirect) &&
                angular.isFunction(transition.to().redirect[transition.to().redirect.length - 1]);

      return isFunction || isAnnotatedFunction;
    }

    if (transition.to().redirect) {
      if (isRedirectFunction()) {
        // dynamic target state
        var promiseOrValue = $injector.invoke(transition.to().redirect, undefined, {
          toState: transition.to(),
          toParams: transition.params()
        });

        return $q.when(promiseOrValue).then(function (state) {
          return target(state, transition.params(), transition.options());
        }).catch(function (err) {
          $log.error('[CoyoMain] redirect function did not return a state to navigate to.', err);
        });
      } else {
        // static target state
        return target(transition.to().redirect, transition.params(), transition.options());
      }
    }
    return true;
  }

  function _populatePreviousState(transition) {
    // make previous state available in $state
    var $state = transition.injector().get('$state');
    var fromState = transition.from();

    $state.previous = fromState && fromState.name ? {
      name: angular.copy(fromState.name),
      params: angular.copy(transition.params('from'))
    } : null;
  }

  // raise a global navigation event for analytics tools
  function _raiseGlobalEvent(transition) {
    var $window = transition.injector().get('$window');
    var globalEvent = $window.document.createEvent('Event');
    globalEvent.initEvent('stateChangeSuccess', true, true);
    globalEvent.data = {
      toState: transition.to(),
      toParams: transition.params(),
      fromState: transition.from(),
      fromParams: transition.params('from')
    };
    $window.document.dispatchEvent(globalEvent);
  }

  /**
   * @ngdoc function
   * @name commons.transitions.service:_handleStateError
   *
   * @description
   * Listener to handle state transition errors.
   * It disables the default error popups and display its own to handle the case that some errors do not result from
   * an http call. If there is no previous state then it redirects to a separate errors state and does not display the popup.
   * Http errors are intercepted and handled in commons.error.module.
   *
   */
  function _handleStateError(transition) {
    var $log = transition.injector().get('$log');
    var transitionsConstants = transition.injector().get('transitionsConstants');
    var errorService = transition.injector().get('errorService');
    var coyoNotification = transition.injector().get('coyoNotification');
    var $q = transition.injector().get('$q');
    var error = transition.error();

    $log.debug('[CoyoMain] Error transitioning to state ' + transition.to().name, error);

    if (error.type === transitionsConstants.errorType.transitionSuperseeded ||
        error.type === transitionsConstants.errorType.transitionIgnored ||
        error.type === transitionsConstants.errorType.transitionAborted) {
      return;
    }

    if (_handleAppError(transition)) {
      return;
    }

    if (angular.isObject(error)) {
      errorService.suppressNotification(error);
    }

    $q.when(angular.isObject(error) && error.detail ? errorService.getMessage(error.detail) : error).then(function (message) {
      if (!transition.from().name) {
        errorService.showErrorPage(message, error.detail.status);
      } else {
        coyoNotification.error(message, false);
      }
    });


  }

  function _handleAppError(transition) {
    var $log = transition.injector().get('$log');
    var appService = transition.injector().get('appService');
    var appRegistry = transition.injector().get('appRegistry');

    var transitionSenderType = _.find(appRegistry.getAppSenderTypes(), function (senderType) {
      return _.startsWith(transition.to().name, 'main.' + senderType + '.show.apps');
    });
    if (transitionSenderType) {
      $log.debug('[appRegistryErrorHandler] Error loading app, redirecting to sender.');
      appService.redirectToSender({typeName: transitionSenderType, slug: transition.params().idOrSlug});
      return true;
    }
    return false;
  }

})(angular);
