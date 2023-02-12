(function (angular) {
  'use strict';

  /**
   * screen width break points to determine screen size constants.
   */
  var breakPoints = {
    sm: 768,
    md: 992,
    lg: 1200
  };

  /**
   * Unified values for input/search debounce.
   */
  var debounceValues = {
    sm: 750, // should not use coyo-update-on-enter
    lg: 1500 // should use coyo-update-on-enter
  };

  /**
   * List of states to be considered as the 'main' state of the application (e.g. after login).
   * The list is traversed until a state is found for which the user matches the required permission.
   * The list is exposed as a constant to allow extending it in customizing.
   */
  var mainStates = [
    {
      state: 'main.landing-page',
      globalPermission: 'ACCESS_LANDING_PAGES'
    }, {
      state: 'main.page',
      globalPermission: 'ACCESS_PAGES'
    }, {
      state: 'main.workspace',
      globalPermission: 'ACCESS_WORKSPACES'
    }, {
      state: 'main.profile.current',
      globalPermission: 'ACCESS_OWN_USER_PROFILE'
    }, {
      state: 'main.colleagues',
      globalPermission: 'ACCESS_COLLEAGUE_LIST'
    }, {
      state: 'main.event',
      globalPermission: 'ACCESS_EVENTS'
    }
  ];

  angular
      .module('coyo.app', [
        'commons.error',
        'commons.auth',
        'commons.i18n',
        'commons.layout',
        'commons.sender',
        'commons.target',
        'commons.config',
        'commons.markdown',
        'commons.browsernotifications',
        'commons.mobile',
        'commons.sockets',
        'commons.tour',
        'commons.terms',
        'commons.shares',
        'commons.subscriptions',
        'commons.transitionsConfig',
        'coyo.setup',
        'coyo.login',
        'coyo.maintenance',
        'coyo.account',
        'coyo.profile',
        'coyo.messaging',
        'coyo.admin',
        'coyo.search',
        'coyo.notifications',
        'coyo.colleagues',
        'coyo.pages',
        'coyo.landing-pages',
        'coyo.workspaces',
        'coyo.timeline',
        'coyo.apps',
        'coyo.widgets',
        'coyo.launchpad',
        'coyo.events'
      ])
      .constant('breakPoints', breakPoints)
      .constant('mainStates', mainStates)
      .constant('debounceValues', debounceValues)
      .config(configureLogProvider)
      .config(configureCompileProvider)
      .config(configureLocationProvider)
      .config(configureRouteProvider)
      .config(configureAnimateProvider)
      .config(configureNotificationsProvider)
      .config(configureUiSelect)
      .config(configureLoadingBarProvider)
      .config(configureHttpProvider)
      .config(configureQProvider)
      .config(registerThemeAtCurtainProvider)
      .run(setGlobalVariables)
      .run(registerKeyEvents)
      .run(setPageTitle)
      .run(applyTrackingCode)
      .run(prepareMobileAppClient)
      .run(checkBackendUrl)
      .run(initErrorLogService)
      .run(addResizeListener)
      .run(requestBrowserNotificationsPermissions)
      .run(setCurrentlyActiveTab)
      .run(applyTheme)
      .run(setDebounceValues);

  function configureLogProvider($logProvider, coyoConfig) {
    $logProvider.debugEnabled(coyoConfig.debug);
  }

  function configureCompileProvider($compileProvider, coyoConfig) {
    $compileProvider.debugInfoEnabled(coyoConfig.debug);
    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(false);

    $compileProvider.preAssignBindingsEnabled(true);
  }

  function configureLocationProvider($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }

  function configureAnimateProvider($animateProvider) {
    $animateProvider.classNameFilter(/(animate-|ui-select-)/);
  }

  function configureRouteProvider($stateProvider, mainStates) {
    $stateProvider.state('front', {
      url: '/f',
      templateUrl: 'app/layout.front.html',
      data: {
        authenticate: false
      },
      onEnter: function (curtainService) {
        curtainService.show();
      }
    }).state('main', {
      url: '',
      redirectTo: 'main.default',
      templateUrl: 'app/layout.main.html',
      controller: 'LayoutMainController',
      controllerAs: '$ctrl',
      resolve: {
        landingPages: /*@ngInject*/ function ($q, authService, LandingPageModel) {
          return authService.getUser().then(function (currentUser) {
            return currentUser.hasGlobalPermissions('ACCESS_LANDING_PAGES')
              ? LandingPageModel.queryWithPermissions({all: true}, {}, ['manage', 'manageSlots'])
              : $q.resolve([]);
          });
        }
      },
      data: {
        authenticate: true
      },
      onEnter: function (curtainService) {
        curtainService.show();
      }
    }).state('main.default', {
      url: '/',
      redirect: /*@ngInject*/ function (authService) {
        return authService.getUser().then(function (currentUser) {
          var redirectState = _.find(mainStates, function (adminState) {
            return currentUser.hasGlobalPermissions(adminState.globalPermission);
          });
          return _.get(redirectState, 'state', 'main.empty');
        });
      }
    }).state('main.empty', {
      template: '<p class="text-center text-muted" translate="ERRORS.NO_MAIN_STATE"></p>'
    });
  }

  function configureNotificationsProvider(NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 3500,
      startTop: 20,
      startRight: 20,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'left',
      positionY: 'bottom'
    });
  }

  function configureUiSelect(uiSelectConfig) {
    uiSelectConfig.appendToBody = true;
  }

  function configureLoadingBarProvider(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.parentSelector = '.loading-bar-container';
    cfpLoadingBarProvider.loadingBarTemplate = '<div id="loading-bar"><div class="bar"></div></div>';
  }

  function configureHttpProvider($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';
  }

  function configureQProvider($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }

  function applyTheme(themeService, curtainService, $rootScope) {
    themeService.applyTheme().finally(function () {
      curtainService.loaded('theme');
    });
    $rootScope.$on('backendUrlService:url:updated', function () {
      themeService.applyTheme();
    });
    $rootScope.$on('backendUrlService:url:cleared', function () {
      themeService.removeTheme();
    });
  }

  function registerThemeAtCurtainProvider(curtainServiceProvider) {
    curtainServiceProvider.register('theme');
  }

  function setGlobalVariables($rootScope, $state) {
    $rootScope.$state = $state;
    $rootScope.globalEditMode = false;
  }

  function registerKeyEvents($rootScope, $document) {
    $document.on('keyup', function ($event) {
      if ($event.keyCode === 27) {
        $rootScope.$emit('keyup:esc', $event);
      }
    });

    $document.on('keydown', function ($event) {
      if ($event.keyCode === 27) {
        $rootScope.$emit('keydown:esc', $event);
      }
    });
  }

  function applyTrackingCode($rootScope, $timeout, $sce, SettingsModel) {
    var _applyTrackingCode = function () {
      $timeout(function () {
        SettingsModel.retrieveByKey('trackingCode').then(function (trackingCode) {
          if (trackingCode) {
            $rootScope.trackingCode = $sce.trustAsHtml(trackingCode);
          }
        });
      });
    };

    $rootScope.$on('backendUrlService:url:updated', _applyTrackingCode);
    $rootScope.$on('authService:login:success', _applyTrackingCode);

    _applyTrackingCode();
  }

  function setPageTitle($rootScope, $timeout, titleService, SettingsModel, coyoConfig) {
    var _setDefaultTitle = function () {
      $timeout(function () {
        titleService.setPrefix(coyoConfig.applicationName, false);
      });
    };
    var _setTitle = function () {
      $timeout(function () {
        SettingsModel.retrieveByKey('networkName').then(function (networkName) {
          if (!networkName) {
            _setDefaultTitle();
          } else {
            titleService.setPrefix(networkName, false);
          }
        }).catch(_setDefaultTitle);
      });
    };

    $rootScope.$on('backendUrlService:url:cleared', _setDefaultTitle);
    $rootScope.$on('backendUrlService:url:updated', _setTitle);

    _setTitle();
  }

  function prepareMobileAppClient($rootScope, mobileService) {
    $rootScope.app = mobileService.getInfo();
  }

  function checkBackendUrl(backendUrlService, $state) {
    if (!backendUrlService.isSet()) {
      $state.transitionTo('front.configure');
    }
  }

  function initErrorLogService(errorLogService) {
    errorLogService.init();
  }

  /**
   * Add a resize listener that applies the current display size to the rootScope. Is initially triggered once. It also
   * contains information about the screen supports retina or not.
   */
  function addResizeListener($window, $rootScope, $timeout, breakPoints) {

    var isRetina = ($window.devicePixelRatio > 1 || ($window.matchMedia && $window.matchMedia('(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5),(min-resolution: 192dpi),(min-resolution: 2dppx)').matches));

    var _setScreenSize = function (width, $rootScope, breakPoints) {
      var screenSize = {
        isXs: width < breakPoints.sm,
        isSm: width >= breakPoints.sm && width < breakPoints.md,
        isMd: width >= breakPoints.md && width < breakPoints.lg,
        isLg: width >= breakPoints.lg,
        isRetina: isRetina
      };

      // equals & event
      if (!angular.equals($rootScope.screenSize, screenSize)) {
        var oldScreenSize = $rootScope.screenSize;
        $rootScope.screenSize = screenSize;
        $rootScope.$emit('screenSize:changed', screenSize, oldScreenSize);
      }
    };

    // add listener
    angular.element($window).on('resize.doResize', _.throttle(function () {
      $timeout(function () {
        _setScreenSize($window.innerWidth, $rootScope, breakPoints);
      });
    }, 50));

    angular.element($window).on('orientationchange', function () {
      $timeout(function () {
        _setScreenSize($window.innerWidth, $rootScope, breakPoints);
      });
    });

    // set once initially
    _setScreenSize($window.innerWidth, $rootScope, breakPoints);
  }

  /**
   * Checks whether the user needs to grant browser notifications permissions and requests it if that's the case.
   */
  function requestBrowserNotificationsPermissions(browserNotificationsService) {
    browserNotificationsService.permissionRequestNeeded().then(function (check) {
      if (check) {
        browserNotificationsService.requestPermission();
      }
    });
  }

  /**
   * Sets the currently active tab:
   * - Generates a UID for the currently active tab.
   * - Registers a (throttled) mouse move event
   * - Sets this tab as the currently active tab in the local storage to be able to check the currently active tab
   *   across tabs
   */
  function setCurrentlyActiveTab($rootScope, $localStorage, utilService) {
    if (!$rootScope.tabId) {
      $rootScope.tabId = utilService.uuid();
    }
    angular.element('body').on('mousemove', _.throttle(function () {
      $localStorage.activeTabId = $rootScope.tabId;
    }, 1000, {leading: true, trailing: false}));
  }

  function setDebounceValues($rootScope, debounceValues) {
    $rootScope.debounce = debounceValues;
  }

})(angular);
