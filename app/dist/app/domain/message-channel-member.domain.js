(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('MessageChannelMemberModel', MessageChannelMemberModel);

  /**
   * @ngdoc service
   * @name coyo.domain.MessageChannelMemberModel
   *
   * @description
   * Provides the message channel member model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function MessageChannelMemberModel(restResourceFactory, coyoEndpoints) {
    var MessageChannelMemberModel = restResourceFactory({
      url: coyoEndpoints.messaging.members,
      name: 'message-channel-member'
    });

    return MessageChannelMemberModel;
  }

})(angular);
