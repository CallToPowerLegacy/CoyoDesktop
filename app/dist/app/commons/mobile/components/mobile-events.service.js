(function () {
  'use strict';

  angular
      .module('commons.mobile')
      .factory('mobileEventsService', mobileEventsService)
      .run(registerMobileEvents);

  /**
   * @name commons.mobile.registerMobileEvents
   *
   * @description
   * Tells mobile applications about the initialization state and
   * registers a listener for messages that arrive from these mobile devices.
   *
   * Coyo can now receive messages by entering a location url like:
   * javascript:invokeMethod('{"method":"saveValue", "argument": { "key": "key-a", "value": "value-a"} }')
   *
   * (See message handler implementations for actually expected parameters.)
   *
   * @requires mobileEventsService
   */
  function registerMobileEvents($window, mobileEventsService) {
    mobileEventsService.propagate('onContextLoaded');

    // Takes messages from mobile apps and forwards them to the mobileEventsService.
    $window.invokeMethod = function () {
      mobileEventsService.evaluate.apply(this, arguments);
    };
  }

  /**
   * @ngdoc service
   * @name commons.mobile.mobileEventsService
   *
   * @description
   * Sends client events to native mobile apps. At the moment iOS and Android are supported. For iOS the events are
   * propagated to the $window object. iOS attaches a message handler to this object which is used. For Android the
   * a custom interface which is injected by the app is created / used.
   *
   * See: http://www.joshuakehn.com/2014/10/29/using-javascript-with-wkwebview-in-ios-8.html
   *
   * @requires $window
   * @requires $log
   */
  function mobileEventsService($window, $log, mobileRequestHandlerRegistry) {

    return {
      propagate: propagate,
      evaluate: evaluate
    };

    /**
     * @ngdoc method
     * @name commons.mobile.mobileEventsService#propagate
     * @methodOf commons.mobile.mobileEventsService
     *
     * @description
     * Propagate an event with the given name and optionally a payload to a native app which might call this application
     * from within a webview. Only if this is the case an event is propagated. The send event is wrapped in an object
     * containing the name and the payload.
     *
     * @param {string} eventName a unique descriptor of the event. It is convention to separate tokens of the events
     * name by colons, e.g. user:updated:success.
     * @param {object=} payload optional payload to send along with the event.
     */
    function propagate(eventName, payload) {
      /* eslint-disable no-undef, angular/definedundefined */
      if ($window.webkit || typeof AndroidJavascriptBridge !== 'undefined') {
        var eventData = {name: eventName};
        if (payload) {
          eventData.data = payload;
        }

        // 'coyo' property is undefined when using iOS chrome instead of safari
        if (_.get($window, 'webkit.messageHandlers.coyo')) {
          $log.info('[authService] Propagating event to iOS app.', eventData);
          $window.webkit.messageHandlers.coyo.postMessage(eventData);
        }

        if (typeof AndroidJavascriptBridge !== 'undefined') {
          $log.info('[authService] Propagating event to android app.', eventData);
          AndroidJavascriptBridge.postMessage(angular.toJson(eventData, false));
        }
      }
      /* eslint-enable no-undef, angular/definedundefined */
    }

    /**
     * @ngdoc method
     * @name commons.mobile.mobileEventsService#receive
     * @methodOf commons.mobile.mobileEventsService
     *
     * @description
     * Receives and handles data arriving from an iOS or Android app. This data is originally fetched by
     * a handler on global context and than forwarded to this method.
     *
     * The parameter needs to provide at least the 'method' property which says what's going to happen. Refer to the
     * single message handlers for information about their required information.
     *
     * @param {string} jsonString a string in json format containing all information that are required by this handler
     */
    function evaluate(jsonString) {
      var invocation;
      try {
        invocation = angular.fromJson(jsonString);
      } catch (e) {
        $log.error('[Invalid JSON]', e.message);
      }

      if (invocation && invocation.method) {
        (mobileRequestHandlerRegistry.getHandler(invocation.method) || _noRequestHandlerFound)(invocation.argument);
      }
    }

    function _noRequestHandlerFound(json) {
      $log.error('[MobileEventsService] No handler found for method: ' + json.method);
    }
  }
})();
