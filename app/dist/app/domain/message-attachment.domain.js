(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('MessageAttachmentModel', MessageAttachmentModel);

  /**
   * @ngdoc service
   * @name coyo.domain.MessageAttachmentModel
   *
   * @description
   * Provides the message attachment model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function MessageAttachmentModel(restResourceFactory, coyoEndpoints) {
    var MessageAttachmentModel = restResourceFactory({
      url: coyoEndpoints.messaging.attachments
    });

    return MessageAttachmentModel;
  }

})(angular);
