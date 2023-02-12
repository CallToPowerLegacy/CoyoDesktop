(function (angular, Config) {
  'use strict';

  angular
      .module('coyo.apps.api')
      .provider('appRegistry', appRegistry);

  /**
   * @ngdoc service
   * @name coyo.apps.api.appRegistryProvider
   *
   * @description
   * This provider is used to register apps to the system. This makes them available in configured sender types
   * (by default: `pages` and `workspaces`) and manageable in the admin configuration. To register a new app call
   * `appRegistryProvider#register` at config phase.
   *
   * To extend the list of sender types that allow apps (e.g. for a custom sender type), add a list of types to
   * the global config object:
   * ```
   * Config.additionalAppSenderTypes = ['customSenderType']
   * ```
   *
   * @requires $stateProvider
   */

  /**
   * @ngdoc service
   * @name coyo.apps.api.appRegistry
   *
   * @description
   * A service to retrieve registered apps.
   *
   * @requires $stateProvider
   */
  function appRegistry($stateProvider) {
    var apps = {};
    var appSenderTypes = _.union(['page', 'workspace'], Config.additionalAppSenderTypes);

    /* Register abstract states for app sender types */
    angular.forEach(appSenderTypes, function (senderType) {
      $stateProvider.state('main.' + senderType + '.show.apps', {
        abstract: true,
        url: '/apps',
        template: '<ui-view></ui-view>'
      });
    });

    return {
      $get: function () {

        return {

          /**
           * @ngdoc method
           * @name coyo.apps.api.appRegistry#getAll
           * @methodOf coyo.apps.api.appRegistry
           *
           * @description
           * Returns all apps that have been registered during config phase via
           * {@link coyo.apps.api.appRegistryProvider appRegistryProvider}.
           *
           * @returns {array} Array of all registered apps.
           */
          getAll: function () {
            return _.map(apps, _extract);
          },

          /**
           * @ngdoc method
           * @name coyo.apps.api.appRegistry#get
           * @methodOf coyo.apps.api.appRegistry
           *
           * @description
           * Returns an app by key.
           *
           * @param {string} key The app's key to be returned. Must not be empty or undefined.
           * @returns {object} Returns the app with the passed key
           */
          get: function (key) {
            return _extract(apps[key]);
          },

          /**
           * @ngdoc method
           * @name coyo.apps.api.appRegistry#getIcon
           * @methodOf coyo.apps.api.appRegistry
           *
           * @description
           * Convenience method which returns the icon class (from the zmdi icon set) of an app.
           *
           * @param {object} app
           * The app to return the icon for.
           *
           * @returns {string} the zmdi class for the icon of the given app.
           */
          getIcon: function (app) {
            return _extract(apps[app.key]).icon;
          },

          /**
           * @ngdoc method
           * @name coyo.apps.api.appRegistry#getAppSenderTypes
           * @methodOf coyo.apps.api.appRegistry
           *
           * @description
           * Returns the sender types that can have apps.
           *
           * @returns {string[]} The sender types.
           */
          getAppSenderTypes: function () {
            return appSenderTypes;
          },

          /**
           * @ngdoc method
           * @name coyo.apps.api.appRegistry#getRootStateName
           * @methodOf coyo.apps.api.appRegistry
           *
           * @description
           * Returns the root state name for a given app key and sender type. Note that this method will not check the
           * validity of the given app key or sender type.
           *
           * @param {string} key
           * The app key.
           *
           * @param {string} senderType
           * The sender type for the given app.
           *
           * @returns {string} The root state name.
           */
          getRootStateName: function (key, senderType) {
            return 'main.' + senderType + '.show.apps.' + key;
          },

          /**
           * @ngdoc method
           * @name coyo.apps.api.appRegistry#getDefaultStateName
           * @methodOf coyo.apps.api.appRegistry
           *
           * @description
           * Returns the name of the default state of an app. This is either a state which has the property 'default' set
           * to 'true' or the root state, which is a state without 'url' and 'name' property.
           *
           * @param {string} key The key of the app to return the default state for.
           * @param {string} senderType The sender type which will be part of the state.
           * @returns {string} The absolute name of the default state.
           */
          getDefaultStateName: function (key, senderType) {
            var appConfig = apps[key];
            _assert(appConfig, 'App with key "' + key + '" could not be found');
            var rootState = this.getRootStateName(key, senderType);
            var defaultState = appConfig.defaultStateName;
            return defaultState ? rootState + '.' + defaultState : rootState;
          }
        };
      },

      /**
       * @ngdoc method
       * @name coyo.apps.api.appRegistryProvider#register
       * @methodOf coyo.apps.api.appRegistryProvider
       *
       * @description
       * This method accomplishes two tasks.
       *
       * <p>Firstly it registers an app to the app registry at config phase. Every app
       * is defined by it's config. Registered apps can then be retrieved using the service at runtime.</p>
       *
       * <p>Secondly this provider generates absolute URLs and states for all passed relative app states. For every
       * relative state passed, multiple absolute ones are generated (one for each configured sender type).
       * E.g. if you have a state 'example.index', the appRegistry will generate the states
       * 'main.<senderType>.show.apps.example.index' for you.</p>
       *
       * <p>Whenever an app is actually created, updated or deleted, events will be emitted on the $rootScope. The
       * following events and their events params are available:</p>
       *
       * <ul>
       * <li>app:created (app)</li>
       * <li>app:updated (app)</li>
       * <li>app:deleted (appId, app)</li>
       * </ul>
       *
       * @param {object} appConfig
       * The app's configuration to register to the provider.
       *
       * @param {string} appConfig.key
       * A distinct key for the app. This key must be unique and must not be null. Use a plain
       * lowercase string without special characters and whitespaces. This key is used to register / identify the app
       * and to generate states for this app.
       *
       * @param {string} appConfig.name
       * The name of this app. This can be a proper name or an i18n key. The name will be visible to the user and is
       * used in UI context. It must not be null nor empty.
       *
       * @param {string=} appConfig.description
       * An optional description as i18n message key for a description. This is also
       * displayed to the user and used in an UI context.
       *
       * @param {string=} appConfig.icon
       * An optional zmdi icon class for the app. This is used in the navigation and the app chooser.
       *
       * @param {integer=} appConfig.allowedInstances
       * An optional number of allowed instances of the app per page or workspace. 0 or negative value for unlimited.
       *
       * @param {string=} appConfig.allowedInstancesErrorMessage
       * An optional error message for the allowed instances.
       *
       * @param {array} appConfig.states
       * A list of states for the app. Properties and syntax of the states are the same as passed to angular's
       * {@link http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$stateProvider $stateProvider}.
       * All states must be relative to the app context. There must be <b>one</b> (and only one) default state, which
       * can't be abstract. This can be a root state without a 'name' and an 'url' property or a state with the
       * property 'default' set to 'true'. This serves as the main entrance point for the system to the app and must
       * be provided by the caller. For the default state a template must be provided. This template gets called, when
       * the app is opened. For the root template the app object is resolved and therefore present in the scope of all
       * children.
       *
       * @param {object=} appConfig.states.views
       * An object of views per state for the app. Properties and syntax of the views are the same as passed to
       * angular's {@link http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$stateProvider $stateProvider}.
       *
       * In addition it is possible to reference states relative to the app's root state by using the placeholder
       * `$appRoot` in the view's name. So, if you are in a child state and you want to reference a view "example" in
       * the app's root state you can do this as follows:
       *
       * ```
       * views : {
       *   example@$appRoot: {
       *     templateUrl: ...
       *   }
       * }
       * ```
       *
       * Another placeholder you can use is `$sender` which gets replaced by the sender name (e.g. page or workspace).
       * Use this placeholder if you want to reference a view in the sender's state.
       * ```
       * views : {
       *   example@main.$sender.show: {
       *     templateUrl: ...
       *   }
       * }
       * ```
       *
       * @param {object} appConfig.settings
       * With the settings object it is possible to add additional settings to an app. These settings are
       * displayed in the configuration dialog along with the app's name and active flag.
       *
       * @param {string} appConfig.settings.templateUrl
       * URL to a template rendering form fields to add the additional settings. This template is provided with the
       * current app.
       *
       * @param {object=} appConfig.settings.controller
       * An angular controller for the assigned settings template. The controller has the app (`$scope.model`), the form
       * (`$scope.settingsForm`) for validation and a callback object (`$scope.saveCallbacks`) in its scope. All
       * properties stored in $scope.model.settings are automatically saved, when the user hits the save button.
       *
       * If you need to modify settings before they is saved, you can use the `saveCallbacks` object. It contains an
       * `onBeforeSave` method which needs to return a promise. If the promise is rejected the save operation is
       * canceled. See the example below on how to modify a property before save.
       *
       * ```
       * function MyAppSettingsController() {
       *   var vm = this;
       *   vm.app = $scope.model;
       *
       *   // this would be stored on save
       *   vm.app.settings.optionA = 'EVERYTHING';
       *
       *   $scope.saveCallbacks.onBeforeSave = function () {
       *   // add something to optionA before it is saved
       *   vm.app.settings.optionA += ' IS AWESOME';
       *     return $q.resolve();
       *   };
       * });
       * ```
       */
      register: function (appConfig) {
        _assert(appConfig.key, 'Config property "key" is required', appConfig);
        _assert(appConfig.name, 'Config property "name" is required', appConfig);
        _assert(appConfig.description, 'Config property "description" is required', appConfig);
        _assert(appConfig.states, 'Config property "states" is required', appConfig);
        _assert(!appConfig.icon || _.startsWith(appConfig.icon, 'zmdi-'), 'Config property "icon" must be a Material Design Iconic Font class.', appConfig);
        _assert(!apps[appConfig.key], 'Config property "key" must be unique', appConfig);

        appConfig.allowedInstances = appConfig.allowedInstances || 0;
        appConfig.allowedInstancesErrorMessage = appConfig.allowedInstancesErrorMessage || 'APPS.SETTINGS.NUMBEROFAPPS.ERROR';
        appConfig.icon = appConfig.icon || 'zmdi-globe';
        appConfig.defaultStateName = _buildDefaultState(appConfig).name || '';
        angular.forEach(appSenderTypes, function (senderType) {
          var appRoot = 'main.' + senderType + '.show.apps.' + appConfig.key;
          angular.forEach(appConfig.states, function (state) {
            _registerState(appConfig, appRoot, senderType, state);
          });
        });

        apps[appConfig.key] = appConfig;
      }
    };

    function _assert(condition, message, config) {
      if (!condition) {
        if (config) {
          console.error('[appRegistry] Invalid config', config); //eslint-disable-line
        }
        console.log('[appRegistry] ' + message); //eslint-disable-line
        throw new Error('[appRegistry] ' + message);
      }
    }

    function _extract(config) {
      return config ? _.pick(config, ['key', 'name', 'description', 'icon', 'settings', 'allowedInstances', 'allowedInstancesErrorMessage']) : null;
    }

    function _buildAbsoluteState(appRoot, state) {
      return (state.name) ? appRoot + '.' + state.name : appRoot;
    }

    function _buildDefaultState(appConfig) {
      var defaultState = _.filter(appConfig.states, {default: true});
      _assert(defaultState.length < 2, 'Config must not contain more than one default state.', appConfig);

      if (!defaultState.length) {
        defaultState = _.filter(appConfig.states, function (state) {
          return !state.name && !state.url;
        });
      }
      _assert(defaultState.length === 1, 'Config must contain exactly one default state. A default state is either explicitly flagged as "default" or has an "name" and "url".', appConfig);
      _assert(!defaultState[0].abstract, 'Config must not contain an abstract default state.', appConfig);

      return defaultState[0];
    }

    function _transformViews(appRoot, senderType, state) {
      angular.forEach(state.views, function (view, viewName) {
        var newViewName = viewName;
        if (viewName.indexOf('@') > -1) {
          if (viewName.indexOf('$appRoot') > -1) {
            newViewName = _.replace(newViewName, '$appRoot', appRoot);
          }
          if (viewName.indexOf('$sender') > -1) {
            newViewName = _.replace(newViewName, '$sender', senderType);
          }
          if (viewName !== newViewName) {
            state.views[newViewName] = view;
            delete state.views[viewName];
          }
        }
      });
    }

    function _registerState(appConfig, appRoot, senderType, stateParam) {
      var state = angular.copy(stateParam);
      var isRootState = !state.url && !state.name;
      if (isRootState) {
        state.url = '/' + appConfig.key + '/:appIdOrSlug';
      }

      state.name = _buildAbsoluteState(appRoot, state);

      if (isRootState) {
        if (!state.resolve) {
          state.resolve = {};
        }
        angular.extend(state.resolve, {
          app: /*@ngInject*/ function (SenderModel, $stateParams, senderId) {
            return new SenderModel({id: senderId}).getApp($stateParams.appIdOrSlug);
          }
        });
      }

      if (state.views && angular.isObject(state.views)) {
        _transformViews(appRoot, senderType, state);
      }

      $stateProvider.state(state.name, state);
    }
  }

})(angular, Config);
