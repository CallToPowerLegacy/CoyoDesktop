(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('MessageModel', MessageModel);

  /**
   * @ngdoc service
   * @name coyo.domain.MessageModel
   *
   * @description
   * Provides the message model.
   *
   * @requires restResourceFactory
   * @requires $http
   * @requires commons.config.coyoEndpoints
   */
  function MessageModel(restResourceFactory, $http, coyoEndpoints) {
    var MessageModel = restResourceFactory({
      url: coyoEndpoints.messaging.messages,
      name: 'message',
      httpConfig: {
        ignoreLoadingBar: true
      }
    });

    // class members
    angular.extend(MessageModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.MessageModel#getUnreadCount
       * @methodOf coyo.domain.MessageModel
       *
       * @description
       * Get the total number of unread messages for given user.
       *
       * @param {string} userId ID of user
       *
       * @returns {promise} An $http promise
       */
      getUnreadCount: function (userId) {
        return $http({
          method: 'GET',
          url: coyoEndpoints.messaging.unreadCount.replace('{{userId}}', userId)
        });
      }
    });

    return MessageModel;
  }

})(angular);
