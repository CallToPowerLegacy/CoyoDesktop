(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.api')
      .factory('appService', appService);

  /**
   * @ngdoc service
   * @name coyo.apps.api.appService
   *
   * @description
   * A service that helps managing the lifecycle of apps. It provides methods to add, update and delete apps to and
   * from sender as well as redirect to a sender and display a default app if present or reload an app after settings
   * were changed.
   *
   * @requires $log
   * @requires $state
   * @requires $stateParams
   * @requires $rootScope
   * @requires appRegistry
   * @requires appChooserModalService
   */
  function appService($log, $state, $stateParams, $transitions, appRegistry, appChooserModalService) {

    return {
      addApp: addApp,
      updateApp: updateApp,
      deleteApp: deleteApp,
      reloadApp: reloadApp,
      redirectToSender: redirectToSender,
      redirectToApp: redirectToApp,
      isCurrentApp: isCurrentApp,
      getCurrentAppIdOrSlug: getCurrentAppIdOrSlug,
      onAppChanged: onAppChanged
    };

    /**
     * @ngdoc method
     * @name coyo.apps.api.appService#addApp
     * @methodOf coyo.apps.api.appService
     *
     * @description
     * Opens the modal dialog for creating a new app for the given sender.
     *
     * @param {object} sender
     * The sender the new app should be added to.
     *
     * @param {object[]} apps
     * The apps of the given sender. the new app is added to this array.
     */
    function addApp(sender, apps) {
      appChooserModalService.open(sender).then(function (app) {
        apps.push(app);
        redirectToApp(sender, app, true);
      });
    }

    /**
     * @ngdoc method
     * @name coyo.apps.api.appService#updateApp
     * @methodOf coyo.apps.api.appService
     *
     * @description
     * Convenience method to update the given app in the array of apps.
     *
     * @param {object} app
     * The app which was changed or updated.
     *
     * @param {object[]} apps
     * The apps of the given sender. The updated app is replaced in this array. The app must be an element of this
     * array. If not, the update fails and an error is logged.
     */
    function updateApp(app, apps) {
      var index = _.findIndex(apps, {id: app.id});
      if (index >= 0) {
        $log.debug('[SenderService] Updated app at index ' + index, app);
        apps[index] = app;
      } else {
        $log.error('[SenderService] Could not update app, because it is not part of the sender', app);
      }
    }

    /**
     * @ngdoc method
     * @name coyo.apps.api.appService#deleteApp
     * @methodOf coyo.apps.api.appService
     *
     * @description
     * Convenience method to remove the app with the given id from the array of apps.
     *
     * @param {string} appId the id of the app to remove.
     * The sender the new app should be added to.
     *
     * @param {object[]} apps
     * The apps of the given sender. The deleted app is removed from this array. The app must be an element of this
     * array. If not, the deletion fails and an error is logged.
     */
    function deleteApp(appId, apps) {
      var index = _.findIndex(apps, {id: appId});
      var app = apps[index];

      if (index >= 0) {
        $log.debug('[SenderService] Removing app at index ' + index, app);
        apps.splice(index, 1);
      } else {
        $log.error('[SenderService] Could not delete app, because it is not part of the sender', app);
      }
    }

    /**
     * @ngdoc method
     * @name coyo.apps.api.appService#reloadApp
     * @methodOf coyo.apps.api.appService
     *
     * @description
     * Reloads the passed app if it is currently the active state (or one of its child states). Note that this is
     * not a complete page reload, but a partial reload of the app's root state itself.
     *
     * @param {object} app
     * The app to reload.
     */
    function reloadApp(app) {
      if (isCurrentApp(app)) {
        var state = 'main.' + _getCurrentSenderType() + '.show.apps.' + app.key;
        $log.debug('[appService] Reloading app ' + state);
        $state.go($state.current, $stateParams, {reload: state});
      }
    }

    /**
     * @ngdoc method
     * @name coyo.apps.api.appService#redirectToSender
     * @methodOf coyo.apps.api.appService
     *
     * @description
     * Redirects to the given sender's default app or to the sender itself if no apps are available.
     *
     * @param {object} sender
     * The sender to redirect to.
     *
     * @param {string} sender.id
     * The sender id. This can also be the sender's slug.
     *
     * @param {string} sender.typeName
     * The name of the sender's type. This must be a valid type name (e.g. 'page' or 'workspace').
     *
     * @param {array=} apps
     * The apps of the passed sender. This is needed to determine the default app.
     */
    function redirectToSender(sender, apps) {
      // sort apps by given app navigation
      var sortedApps = _.chain(sender.appNavigation).flatMap('apps').map(function (appId) {
        return _.find(apps, {id: appId});
      }).filter(angular.isDefined).value();
      // find first active app (fallback to first app if none active)
      var firstApp = _.find(sortedApps, {active: true}) || sortedApps[0];

      if (firstApp) {
        // redirect to first app if existent
        redirectToApp(sender, firstApp);
      } else {
        var state = 'main.' + sender.typeName + '.show';
        var params = {idOrSlug: sender.slug || sender.id};
        $log.debug('[appService] Redirecting to sender ' + state, params);
        $state.go(state, params, {location: 'replace', inherit: false});
      }
    }

    /**
     * @ngdoc method
     * @name coyo.apps.api.appService#redirectToApp
     * @methodOf coyo.apps.api.appService
     *
     * @description
     * Redirects to the given app within the given sender
     *
     * @param {object} sender
     * The sender to redirect to.
     *
     * @param {string} sender.id
     * The sender id. This can also be the sender's slug.
     *
     * @param {string} sender.typeName
     * The name of the sender's type. This must be a valid type name (e.g. 'page' or 'workspace').
     *
     * @param {object} app
     * The app to redirect to. The redirect points to the default state of the app.
     *
     * @param {boolean=} created
     * Flag to indicate that the app being redirected to has just been created.
     */
    function redirectToApp(sender, app, created) {
      var state = appRegistry.getDefaultStateName(app.key, sender.typeName);
      var params = {idOrSlug: (sender.slug || sender.id), appIdOrSlug: (app.slug || app.id), created: created || false};
      $log.debug('[appService] Redirecting to app ' + state, params);
      return $state.go(state, params, {location: 'replace', inherit: false});
    }

    /**
     * @ngdoc method
     * @name coyo.apps.api.appService#isCurrentApp
     * @methodOf coyo.apps.api.appService
     *
     * @description
     * Returns 'true' if the current state belongs to the given app or one of its child states.
     *
     * @param {object} app
     * The app to check.
     *
     * @returns {boolean}
     * 'true' if the current state belongs to the given app or one of its child states. 'false' otherwise.
     */
    function isCurrentApp(app) {
      var senderType = _getCurrentSenderType();
      return senderType &&
          ($state.includes('main.' + senderType + '.show.apps.' + app.key, {appIdOrSlug: app.slug}) ||
           $state.includes('main.' + senderType + '.show.apps.' + app.key, {appIdOrSlug: app.id}));
    }

    /**
     * @ngdoc method
     * @name coyo.apps.api.appService#getCurrentAppIdOrSlug
     * @methodOf coyo.apps.api.appService
     *
     * @description
     * Returns the ID or slug of the current app or null if no app is active.
     *
     * @returns {string|null} The ID of the current app.
     */
    function getCurrentAppIdOrSlug() {
      var senderType = _getCurrentSenderType();
      if (senderType && $state.includes('main.' + senderType + '.show.apps')) {
        return $stateParams.appIdOrSlug;
      }
      return null;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.api.appService#onAppChanged
     * @methodOf coyo.apps.api.appService
     *
     * @description
     * Registers a callback to be executed when the state has successfully been changed to an app state. Keep in mind
     * to use the returned handle to deregister the callback if it is not needed anymore (e.g. when the current scope
     * is destroyed).
     *
     * @param {function} callback The callback to be executed on state change.
     * @returns {function} The handle function to deregister the callback.
     */
    function onAppChanged(callback) {
      return $transitions.onSuccess({}, function () {
        callback(getCurrentAppIdOrSlug());
      });
    }

    function _getCurrentSenderType() {
      var activeStateName = $state.$current.name;
      return _.find(appRegistry.getAppSenderTypes(), function (senderType) {
        return _.startsWith(activeStateName, 'main.' + senderType);
      });
    }
  }

})(angular);
