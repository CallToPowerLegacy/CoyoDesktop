(function () {
  'use strict';

  angular.module('commons.tour')
      .factory('tourService', tourService);

  /**
   * @ngdoc service
   * @name commons.tour.tourService
   *
   * @description
   * This service helps with integrating the user tour with the application. It provides method to check if a step
   * should be displayed, starts the tour and handles events.
   *
   * @requires $rootScope
   * @requires $log
   * @requires $q
   * @requires $timeout
   * @requires uiTourService
   * @requires commons.auth.authService
   * @requires commons.tour.tourServiceConfig
   */
  function tourService($rootScope, $log, $q, $timeout, $window, authService, uiTourService) {

    var uiTour;
    var loadedStepKeys = [];
    var registeredSteps = [];

    return {
      init: init,
      restart: restart,
      isEnabled: isEnabled,
      markVisited: markVisited,
      registerStep: registerStep,
      unregisterStep: unregisterStep,
      isStepRegistered: isStepRegistered,
      getTopics: getTopics
    };

    /**
     * @ngdoc method
     * @name commons.tour.tourService#start
     * @methodOf commons.tour.tourService
     *
     * @description
     * Initializes the service and displays it if any enabled tours exist for the current state. The tour is started
     * after all steps where added. This is done by a timeout, which is reset every time a new step was found. The
     * method also registers event handlers which take care of marking tour steps as "seen".
     */
    function init() {
      // create tours
      uiTourService.createDetachedTour('mobileTour', {orphan: true});
      uiTourService.createDetachedTour('desktopTour', {orphan: false});

      // listen to login and logout events
      $rootScope.$on('authService:login:success', _clear);
      $rootScope.$on('authService:logout:success', _clear);
      $rootScope.$on('authService:logout:failed', _clear);
      $rootScope.$on('backendUrlService:url:updated', _clear);
      $rootScope.$on('backendUrlService:url:cleared', _clear);

      $timeout(function () {
        _start();
      });
    }

    /**
     * @ngdoc method
     * @name commons.tour.tourService#restart
     * @methodOf commons.tour.tourService
     *
     * @description
     * Restarts a part of the tour regardless whether the user has alredy seen it.
     *
     * @param {String} key
     * The key defines the part of the tour to restart. In general this is the topic of the tour steps. The
     * topic is defined by the tour step directive. In addition it is possible to pass "mobile" as a key,
     * which restart the mobile tour for the given page.
     */
    function restart(key) {
      $rootScope.$emit('tour.restart', key);
      if (uiTour) {
        $timeout(function () {
          uiTour.start();
        });
      }
    }

    /**
     * @ngdoc method
     * @name commons.tour.tourService#isEnabled
     * @methodOf commons.tour.tourService
     *
     * @description
     * Returns a promise with a boolean that determines whether the a step with the given key is active or not. A step
     * is active (and therefore will be shown) if its DOM element is currently visible and if the current user hasn't
     * seen it, yet.
     *
     * @param {string} key the key of the step to check the status for. Multiple steps can have the same key. If one step
     * of this group has been seen by the user, all those steps won't be displayed anymore in the future.
     *
     * @returns {object} returns a promise with a boolean that determines whether the a step with the given key is
     * active or not.
     */
    function isEnabled(key) {
      return authService.getUser().then(function (user) {
        var visited = _.get(user, 'tourData.visited', []);
        return _.indexOf(visited, key) < 0;
      });
    }

    /**
     * @ngdoc method
     * @name commons.tour.tourService#registerStep
     * @methodOf commons.tour.tourService
     *
     * @description
     * Registers a step with the given id and topic. Only one step with the passed id will be rendered on a page. Note
     * that you need to unregister the step again via {link commons.tour.tourService#unregisterStep}, if it becomes
     * invisible or a new page is rendered.
     *
     * @param {object} step
     * The step to register
     *
     * @param {string} step.id
     * The id of the given step. A step with a given id should be displayed only once per page.
     *
     * @param {string} step.topic
     * The topic the step belongs to. A topic determines the group a tour step belongs to.
     */
    function registerStep(step) {
      if (!isStepRegistered(step.id)) {
        registeredSteps.push(step);
        $log.debug('[Tour] Registered step with ID [' + step.id + ']');
      }
    }

    /**
     * @ngdoc method
     * @name commons.tour.tourService#unregisterStep
     * @methodOf commons.tour.tourService
     *
     * @description
     * Removes a step from the registry. Please note that you need to unregister all steps that where registered
     * formerly via {link commons.tour.tourService#registerStep}.
     *
     * @param {string} stepId
     * The id of the step to unregister.
     */
    function unregisterStep(stepId) {
      if (_.remove(registeredSteps, {id: stepId}).length > 0) {
        $log.debug('[Tour] Unregistered step with ID [' + stepId + ']');
      }
    }

    /**
     * @ngdoc method
     * @name commons.tour.tourService#isStepRegistered
     * @methodOf commons.tour.tourService
     *
     * @description
     * Returns 'true' if the step with the given id is already registered. Only one step with a given id should be
     * rendered on a page.
     *
     * @param {string} id of the step to check
     * @returns {boolean} 'true' if the step with the given id is already registered. 'false' otherwise.
     */
    function isStepRegistered(id) {
      return _.some(registeredSteps, {id: id});
    }

    /**
     * @ngdoc method
     * @name commons.tour.tourService#markVisited
     * @methodOf commons.tour.tourService
     *
     * @description
     * Stores a tour step (or multiple steps) as visited by the current user. Those steps won't be
     * displayed in the future anymore. Usually this method does not need to be called directly.
     *
     * @param {Array} keys array of keys of the steps that should be stored as already seen by the user.
     *
     * @returns {object} returns a promise that is resolved when the keys are stored as "visited" successfully.
     */
    function markVisited(keys) {
      return authService.getUser().then(function (user) {
        var visited = _.get(user, 'tourData.visited', []);
        var updated = _.union(visited, keys);

        if (!_.isEqual(visited, updated)) {
          $log.debug('[Tour] Marking tour steps [' + updated + '] as visited.');
          _.set(user, 'tourData.visited', updated);
          return user.setTourData(user.tourData);
        }
        return $q.reject('All keys already marked as visited.');
      });
    }

    /**
     * @ngdoc method
     * @name commons.tour.tourService#getTopics
     * @methodOf commons.tour.tourService
     *
     * @description
     * Returns a list of topics of all tour steps of the current page or an empty array if none are available.
     *
     * @returns {Array} A list of topics of all steps of the current page.
     */
    function getTopics() {
      return _.uniq(_.map(registeredSteps, 'topic'));
    }

    /* ---------- PRIVATE ---------- */

    function _start() {
      // show the desktop or mobile tour
      var mobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;
      uiTour = (mobile) ? uiTourService.getTourByName('mobileTour') : uiTourService.getTourByName('desktopTour');

      if (uiTour) {
        uiTour.on('stepChanged', _adjustWindow);
        uiTour.on('started', _adjustWindow);

        uiTour.on('stepAdded', function (step) {
          $log.debug('[Tour] Found new tour step "' + step.title + '" [' + step.stepId + '].');

          loadedStepKeys = _.union(loadedStepKeys, [step.stepId]);

          $timeout(function () {
            if (uiTour.getStatus() === 0 && uiTour._getSteps().length > 0) {
              $log.debug('[Tour] Starting tour.', uiTour);
              uiTour.start();
            } else {
              $log.debug('[Tour] Tour already running or no enabled steps found. Skipped start.');
            }
          });
        });

        uiTour.on('stepRemoved', function () {
          if (uiTour.getStatus() === 1 && uiTour._getSteps() < 1) {
            $log.debug('[Tour] The last step was removed. Stopping tour.');
            uiTour.end();
          }
        });

        uiTour.on('ended', function () {
          markVisited(loadedStepKeys).then(function () {
            loadedStepKeys = [];
          }).catch(function (message) {
            $log.debug('[Tour] Did not mark any new keys as visited: ' + message);
          });

          // notify all directives that the tour was ended
          $rootScope.$emit('tour.ended');
        });
      } else {
        $log.error('[Tour] Could not find tour object.');
      }
    }

    /**
     * Clears the tour steps and registered ids when a user logs out and a new user logs in.
     */
    function _clear() {
      loadedStepKeys = [];
      registeredSteps = [];
    }

    /**
     * Before we scroll to the next tour step, we need to reset the scroll position. Otherwise the position of the
     * step is calculated incorrectly due to a bug in $uibPosition of angular-ui.
     */
    function _adjustWindow(step) {
      if (step && step.enabled && step.fixed) {
        $window.scrollTo(0, 0);
      }
    }

  }

})();
