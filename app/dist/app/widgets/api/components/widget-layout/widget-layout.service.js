(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.api')
      .factory('widgetLayoutService', widgetLayoutService);

  /**
   * @ngdoc service
   * @name coyo.widgets.api.widgetLayoutService
   *
   * @description
   * Manages the edit, save and cancel action for the widget layout as well as all widgets slots contained inside it.
   *
   * Since a widget layout is composed of multiple independent widget slots the actions are broadcast via events
   * up and down the scope hierarchy (therefore limiting the events to only the widgets slots contained inside the layout)
   *
   * @requires $q
   * @requires $timeout
   * @requires $rootScope
   * @requires commons.error.stateLockService
   */
  function widgetLayoutService($q, $timeout, $rootScope, stateLockService) {

    return {
      edit: edit,
      save: save,
      collect: collect,
      fill: fill,
      cancel: cancel,
      onload: onload
    };

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetLayoutService#edit
     * @methodOf coyo.widgets.api.widgetLayoutService
     *
     * @description
     * Tells the layout and all widgets slots to enable their edit mode and to save their current state.
     *
     * @param {object} $scope
     * The scope the layout is contained in. Used to broadcast events down the scope hierarchy.
     *
     * @param {boolean} global
     * Determines whether this is a global or local event. Global should be set `false` if the event is triggered in
     * a contained scope like a blog app, wiki app or content app. It should be set 'true' if the event is coming from
     * the root scope to handle all global layouts and slots.
     *
     * @param {boolean} keepUnlocked
     * Whether the container should be locked. Set to 'true' if no warning should appear on page transitions.
     */
    function edit($scope, global, keepUnlocked) {
      if (global) {
        $rootScope.globalEditMode = true;
      }
      if (!keepUnlocked) {
        stateLockService.lock();
      }
      $scope.$broadcast('widget-slot:edit', global);
    }

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetLayoutService#save
     * @methodOf coyo.widgets.api.widgetLayoutService
     *
     * @description
     * Tells the layout and all widgets slots to save their state to the backend.
     * The event that is sent contains a list to where the layout and the widget slots add their backend call promises
     * so that the called can get feedback on the backend calls.
     *
     * @param {object} $scope
     * The scope the layout is contained in. Used to broadcast events down the scope hierarchy.
     *
     * @param {boolean} global
     * Determines whether this is a global or local event. Global should be set `false` if the event is triggered in
     * a contained scope like a blog app, wiki app or content app. It should be set 'true' if the event is coming from
     * the root scope to handle all global layouts and slots.
     *
     * @param {boolean} keepUnlocked
     * Whether the container should be locked. Set to 'true' if no warning should appear on page transitions.
     *
     * @returns {object} promise that is resolved/rejected when all update calls are completed.
     * Chain to this to disable edit controls outside the layout (then) and to deactivate an outside loading indicator (finally).
     */
    function save($scope, global, keepUnlocked) {
      var deferred = $q.defer();
      var savingPromises = [];
      var errorDuringSave = false;
      var unsubscribeErrorHandler = $scope.$on('widget-slot:save-error', function () {
        errorDuringSave = true;
      });

      $scope.$broadcast('widget-slot:save', savingPromises, global);
      $timeout(function () { // wait for all promises to be queued
        $q.all(savingPromises).then(function () {
          // with the nested calls when saving the widget slots the promise is not always rejected
          // when an error occurs during a nested call.
          if (errorDuringSave) {
            deferred.reject();
          } else {
            deferred.resolve();
            if (global) {
              $rootScope.globalEditMode = false;
            }
            if (!keepUnlocked) {
              stateLockService.unlock();
            }
          }
        }).catch(function () {
          deferred.reject();
        }).finally(function () {
          unsubscribeErrorHandler();
          if (errorDuringSave) {
            errorDuringSave = false;
            edit($scope);
          }
        });
      });
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetLayoutService#collect
     * @methodOf coyo.widgets.api.widgetLayoutService
     *
     * @description
     * Collect the current data from layouts and widgets slots.
     *
     * @param {object} $scope
     * The scope the layout is contained in. Used to broadcast events down the scope hierarchy.
     *
     * @param {string} name
     * Determines the name of the targeted entities.
     *
     * @returns {object} promise that is resolved when all data is collected.
     */
    function collect($scope, name) {
      var deferred = $q.defer(),
          promises = [],
          data = {layout: {}, slots: []};
      $scope.$broadcast('widget-slot:collect', data, name, promises);
      $timeout(function () {
        $q.all(promises).then(function () {
          deferred.resolve(data);
        });
      });
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetLayoutService#fill
     * @methodOf coyo.widgets.api.widgetLayoutService
     *
     * @description
     * Tells either the layout or all widgets slots to fill with the given data.
     *
     * @param {object} $scope
     * The scope the layout is contained in. Used to broadcast events down the scope hierarchy.
     *
     * @param {string} name
     * Determines the name of the targeted entities.
     *
     * @param {string} type
     * Determines whether to trigger the layout or the slots.
     *
     * @param {object} data
     * Contains either the layout or widgets slots data.
     *
     * @returns {object} promise that is resolved when events are triggered.
     */
    function fill($scope, type, name, data) {
      var deferred = $q.defer();
      $scope.$broadcast('widget-slot:fill-' + type, data, name);
      $timeout(function () {
        deferred.resolve();
      });
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetLayoutService#cancel
     * @methodOf coyo.widgets.api.widgetLayoutService
     *
     * @description
     * Tells the layout and all widgets slots to disable their edit mode and restore their original state.
     *
     * @param {object} $scope
     * The scope the layout is contained in. Used to broadcast events down the scope hierarchy.
     *
     * @param {boolean} global
     * Determines whether this is a global or local event. Global should be set `false` if the event is triggered in
     * a contained scope like a blog app, wiki app or content app. It should be set 'true' if the event is coming from
     * the root scope to handle all global layouts and slots.
     *
     * @param {boolean} keepUnlocked
     * Whether the container should be locked. Set to 'true' if no warning should appear on page transitions.
     */
    function cancel($scope, global, keepUnlocked) {
      if (global) {
        $rootScope.globalEditMode = false;
      }
      if (!keepUnlocked) {
        stateLockService.unlock();
      }
      $scope.$broadcast('widget-slot:cancel', global);
    }

    /**
     * @ngdoc method
     * @name coyo.widgets.api.widgetLayoutService#onload
     * @methodOf coyo.widgets.api.widgetLayoutService
     *
     * @description
     * Listens to the widget layout loaded / load error event and resolves / rejects the returned promise accordingly.
     *
     * @param {object} $scope
     * The scope the layout is contained in. Used to broadcast events down the scope hierarchy.
     *
     * @return {object} promise that is resolved when the layout was loaded or rejected if the load failed.
     */
    function onload($scope) {
      var deferred = $q.defer();

      var unsubscribeLoaded = $scope.$on('widget-layout:loaded', function () {
        deferred.resolve();
      });
      var unsubscribeLoadError = $scope.$on('widget-layout:loadError', function (event, error) {
        deferred.reject(error);
      });

      $scope.$on('$destroy', unsubscribeLoaded);
      $scope.$on('$destroy', unsubscribeLoadError);

      return deferred.promise;
    }
  }

})(angular);
