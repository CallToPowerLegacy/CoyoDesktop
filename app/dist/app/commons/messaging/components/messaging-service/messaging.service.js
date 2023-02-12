(function (angular) {
  'use strict';

  angular
      .module('commons.messaging')
      .factory('messagingService', messagingService);

  /**
   * @ngdoc service
   * @name coyo.messaging.messagingService
   *
   * @description
   * This service makes messaging functionality available to the outside.
   *
   * @requires $rootScope
   * @requires authService
   * @requires MessageChannelModel
   */
  // TODO: Move to 'coyo.messaging' module (not currently possible due to circular dependencies)
  function messagingService($rootScope, authService, MessageChannelModel) {

    return {
      toggle: toggle,
      start: start,
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.messaging.messagingService#toggle
     * @methodOf coyo.messaging.messagingService
     *
     * @description
     * Toggles the compact view mode of the messaging sidebar.
     *
     * @param {boolean} compact True to switch to compact mode, false otherwise.
     *
     * @returns {object} An event object
     */
    function toggle(compact) {
      return $rootScope.$emit('messaging:toggle', compact);
    }

    /**
     * @ngdoc method
     * @name coyo.messaging.messagingService#start
     * @methodOf coyo.messaging.messagingService
     *
     * @description
     * Starts a new chat with another user.
     *
     * @param {string} partnerId The ID of the conversation partner.
     *
     * @returns {promise} An event object promise
     */
    function start(partnerId) {
      return authService.getUser().then(function (currentUser) {
        new MessageChannelModel({
          type: 'SINGLE',
          creatorId: currentUser.id,
          memberIds: [partnerId]
        }).save().then(function (channel) {
          return $rootScope.$emit('messaging:start', channel);
        });
      });
    }

    /**
     * @ngdoc method
     * @name coyo.messaging.messagingService#open
     * @methodOf coyo.messaging.messagingService
     *
     * @description
     * Opens given channel in the messaging sidebar.
     *
     * @param {string} channelId The ID of the channel that should be opened.
     *
     * @returns {promise} An event object promise
     */
    function open(channelId) {
      return new MessageChannelModel({id: channelId}).get().then(function (channel) {
        return $rootScope.$emit('messaging:start', channel);
      });
    }
  }

})(angular);
