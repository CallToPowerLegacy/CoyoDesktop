(function (angular) {
  'use strict';

  angular
      .module('commons.sockets')
      .factory('socketService', socketService)
      .constant('socketConfig', {
        /* Whether or not the service should attempt to connect immediately upon instantiation. */
        autoConnect: true,
        /* The number of milliseconds to delay before attempting to reconnect. */
        reconnectionSleep: 10000,
        /* The maximum number of reconnection attempts to make (1st attempt will trigger instantly). Unlimited if null. */
        reconnectionLimit: 4
      });

  /**
   * @ngdoc service
   * @name commons.sockets.socketService
   *
   * @description Service to establishes and manages the WebSocket connection of the current user.
   *
   * @requires $log
   * @requires $q
   * @requires $rootScope
   * @requires $timeout
   * @requires SockJS
   * @requires Stomp
   * @requires authService
   * @requires backendUrlService
   * @requires coyoEndpoints
   * @requires csrfService
   */
  function socketService($log, $q, $rootScope, $timeout, SockJS, Stomp, authService, backendUrlService, coyoEndpoints,
                         csrfService, socketConfig, utilService, $localStorage) {
    var client;                      // the underlying stomp client
    var subscriptions = [];          // all registered stomp subscriptions
    var pendingRequests = [];

    var headers = null;              // the response headers of the last successful connection attempt
    var connecting = false;          // the state of the current connection attempt
    var reconnectionTimeout = null;  // the current reconnection $timeout
    var reconnectionAttempts = null; // the current number of reconnection attempts

    // register auto-connect
    if (socketConfig.autoConnect) {
      connect();
    }

    // register auth / logout listeners
    $rootScope.$on('authService:login:success', connect);
    $rootScope.$on('authService:logout:success', disconnect);
    $rootScope.$on('authService:logout:failed', disconnect);
    $rootScope.$on('backendUrlService:url:updated', disconnect);
    $rootScope.$on('backendUrlService:url:cleared', disconnect);

    return {
      isConnected: isConnected,
      connect: connect,
      disconnect: disconnect,
      subscribe: subscribe,
      sendTo: sendTo,
      receiveFrom: receiveFrom
    };

    // ------------------------------------------------------------------------

    /**
     * @ngdoc function
     * @name commons.sockets.socketService#isConnected
     * @methodOf commons.sockets.socketService
     *
     * @description
     * Checks the WebSocket connection.
     *
     * @return {boolean} True if the WebSocket is connected, false otherwise.
     */
    function isConnected() {
      return !!client && client.connected;
    }

    /**
     * @ngdoc function
     * @name commons.sockets.socketService#connect
     * @methodOf commons.sockets.socketService
     *
     * @description
     * Connects to the WebSocket.
     *
     * @return {object} A promise that resolves when the WebSocket is connected.
     */
    function connect() {
      var deferred = $q.defer();
      pendingRequests.push(deferred);
      _abortReconnect();
      _connect();
      return deferred.promise;
    }

    /**
     * @ngdoc function
     * @name commons.sockets.socketService#disconnect
     * @methodOf commons.sockets.socketService
     *
     * @description
     * Disconnects to the WebSocket.
     */
    function disconnect() {
      _abortReconnect();
      if (isConnected()) {
        client.disconnect();
      }
      client = null;
    }

    /**
     * @ngdoc function
     * @name commons.sockets.socketService#subscribe
     * @methodOf commons.sockets.socketService
     *
     * @description
     * Subscribes to the given destination and executes the given callback for every incoming message. Subscriptions are
     * persistent meaning that they are a) postponed until the WebSocket connection has been fully established and b)
     * reattached when the WebSocket connection is recovered after a loss of connection. It is therefore necessary to
     * unsubscribe when the subscription is not needed any longer. Subscribing to the same destination more than once
     * will only create a single shared subscription that delegates events to all subscribers.
     *
     * @param {string} destination A RabbitMQ topic exchange routing key (e.g. 'user.*' or 'timeline.sender.*' or '#').
     * @param {function} callback The callback to be executed with the event body.
     * @param {string|function|object=} eventFilter A eventFilter applied to every incoming message. Can be either a function that must TODO
     * return a boolean or an object whose properties are matched against the event object.
     *
     * @return {function} A function to terminate the subscription.
     */
    function subscribe(destination, callback, eventFilter) {
      if (angular.isString(eventFilter)) {
        eventFilter = {event: eventFilter};
      }
      var subscriberId = utilService.uuid();
      var subscription = _.find(subscriptions, {destination: destination});
      var subscriber = {callback: callback, filter: eventFilter, id: subscriberId, destination: destination};
      if (subscription) {
        $log.debug('[socketService] Reusing existing subscription to ' + subscription.destination);
        subscription.subscribers.push(subscriber);
      } else {
        subscription = {
          destination: destination,
          callback: function (event) {
            $log.debug('[socketService] Incoming message', destination, event);
            this.subscribers.forEach(function (sub) {
              if (angular.isDefined(sub.filter)) {
                if (angular.isUndefined(_.find([event], sub.filter))) {
                  return;
                }
              }
              sub.callback(event);
            });
          },
          subscribers: [subscriber],
          state: null
        };
        subscriptions.push(subscription);
        _subscribe(subscription);
      }

      return function () {
        _.remove(subscription.subscribers, function (sub) {
          return sub.id === subscriberId;
        });
        if (subscription.subscribers.length === 0) {
          if (subscription && subscription.state) {
            $log.debug('[socketService] Unsubscribing from ' + subscription.destination);
            subscription.state.unsubscribe();
          }
          subscriptions.splice(_.indexOf(subscriptions, subscription), 1);
        }
      };
    }

    /**
     * @ngdoc function
     * @name commons.sockets.socketService#sendTo
     * @methodOf commons.sockets.socketService
     *
     * @description
     * Sends a message to the backend service via web-socket.
     *
     * @param {string} destination A RabbitMQ topic exchange routing key (e.g. 'user.*' or 'timeline.sender.*' or '#')
     * @param {object} headers Stomp headers
     * @param {string} message Stomp message
     */
    function sendTo(destination, headers, message) {
      return connect().then(function () {
        return client.send(destination, headers, angular.toJson(message));
      }).catch(function (error) {
        $log.warn('[socketService] Could not sent to ' + destination + '.', error);
        return $q.reject(error);
      });
    }

    /**
     * @ngdoc function
     * @name commons.sockets.socketService#receiveFrom
     * @methodOf commons.sockets.socketService
     *
     * @description
     * STOMP supports receiving a single message from the socket server. Actually, this works through subscribing to
     * given destination once. The server automatically takes care of closing the subscription.
     *
     * This method is just an alias for subscribe(...).
     *
     * @param {string} destination A RabbitMQ topic exchange routing key (e.g. 'user.*' or 'timeline.sender.*' or '#')
     *
     * @returns {promise} Promise resolved with body of the message
     */
    function receiveFrom(destination) {
      return connect().then(function () {
        var c = client;
        var deferred = $q.defer();
        var subscription = client.subscribe(destination, function (message) {
          delete c.subscriptions[subscription.id];
          deferred.resolve(message.body ? angular.fromJson(message.body) : undefined);
        });
        return deferred.promise;
      }).catch(function (error) {
        $log.warn('[socketService] Could not receive from ' + destination + '.', error);
        return $q.reject(error);
      });
    }

    // ------------------------------------------------------------------------

    function _connect() {
      $log.debug('[socketService] Connecting...');

      if (connecting) {
        $log.debug('[socketService] Already connecting...');
        return;
      } else if (isConnected()) {
        $log.debug('[socketService] Already connected.', headers);
        _resolve(headers);
        return;
      } else if (!authService.isAuthenticated()) {
        $log.warn('[socketService] Connection failed for good: Not authenticated.');
        $rootScope.$emit('socketService:offline', null);
        _abortReconnect();
        _reject(null);
        return;
      }

      $rootScope.$emit('socketService:connecting', reconnectionAttempts, socketConfig.reconnectionLimit);
      connecting = true;
      csrfService.getToken().then(function (token) {
        var url = backendUrlService.getUrl() + coyoEndpoints.socket.replace('{token}', token);
        var ws = new SockJS(url);
        client = Stomp.over(ws);
        client.debug = false;
        client.connect({
          login: '',
          passcode: '',
          'X-CSRF-TOKEN': token,
          'X-Coyo-Client-ID': $localStorage.clientId
        }, _onConnect, _onError);
      }).catch(function (error) {
        $log.warn('[socketService] Connection failed for good: No CSRF token.');
        $rootScope.$emit('socketService:offline', error);
        connecting = false;
        _abortReconnect();
        _reject(error);
      });
    }

    function _onConnect(response) {
      headers = response.headers;
      $log.info('[socketService] Connected.', headers);
      $rootScope.$emit('socketService:connected');
      connecting = false;
      _abortReconnect();
      angular.forEach(subscriptions, _subscribe);
      _resolve(headers);
    }

    function _onError(error) {
      if (isConnected()) {
        $log.error('[socketService] Websocket error: ', error);
        return;
      }
      $rootScope.$emit('socketService:disconnected');
      connecting = false;

      if (socketConfig.reconnectionLimit === null || reconnectionAttempts < socketConfig.reconnectionLimit) {
        var sleep = !reconnectionAttempts ? 0 : socketConfig.reconnectionSleep;
        $log.debug('[socketService] Connection failed, reconnecting in ' + sleep + 'ms.');
        $rootScope.$emit('socketService:sleep', sleep);
        reconnectionTimeout = $timeout(function () {
          reconnectionAttempts += 1;
          _connect();
        }, sleep, false);
      } else {
        $log.warn('[socketService] Connection failed for good: Timed out.', error);
        $rootScope.$emit('socketService:offline', error);
        _abortReconnect();
        _reject(error);
      }
    }

    function _resolve(headers) {
      _.forEach(pendingRequests, function (request) {
        request.resolve(headers);
      });
      pendingRequests = [];
    }

    function _reject(error) {
      _.forEach(pendingRequests, function (request) {
        request.reject(error);
      });
      pendingRequests = [];
    }

    function _abortReconnect() {
      reconnectionAttempts = null;
      if (reconnectionTimeout !== null) {
        $timeout.cancel(reconnectionTimeout);
        reconnectionTimeout = null;
      }
    }

    function _subscribe(subscription) {
      if (isConnected()) {
        $log.debug('[socketService] Subscribing to ' + subscription.destination);
        subscription.state = client.subscribe(subscription.destination, function (message) {
          return subscription.callback(message.body ? angular.fromJson(message.body) : undefined);
        });
      }
    }
  }

})(angular);
