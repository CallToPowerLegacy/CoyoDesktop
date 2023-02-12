(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('LikeModel', LikeModel);

  /**
   * @ngdoc service
   * @name coyo.domain.LikeModel
   *
   * @description
   * Provides the Coyo like model.
   *
   * @requires $http
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function LikeModel($http, restResourceFactory, coyoEndpoints) {
    var LikeModel = restResourceFactory({
      url: coyoEndpoints.likes.likes
    });

    // class members
    angular.extend(LikeModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.LikeModel#like
       * @methodOf coyo.domain.LikeModel
       *
       * @description
       * Creates a like.
       *
       * @params {string} targetId The ID of the target being liked
       * @params {string} targetType The typeName of the target being liked
       * @params {string} senderId The liking sender
       *
       * @returns {promise} A $http promise
       */
      like: function (targetId, targetType, senderId) {
        var url = this.$url({
          targetId: targetId,
          targetType: targetType,
          senderId: senderId
        });
        return this.$post(url);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.LikeModel#unlike
       * @methodOf coyo.domain.LikeModel
       *
       * @description
       * Reverts/deletes a like.
       *
       * @params {string} targetId The target being liked
       * @params {string} targetType The typeName of the target being liked
       * @params {string} senderId The liking sender
       *
       * @returns {promise} A $http promise
       */
      unlike: function (targetId, targetType, senderId) {
        var url = this.$url({
          targetId: targetId,
          targetType: targetType,
          senderId: senderId
        });
        return this.$delete(url);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.LikeModel#getInfo
       * @methodOf coyo.domain.LikeModel
       *
       * @description
       * Gets the general like information about this target.
       *
       * @params {string} targetId The target being liked
       * @params {string} targetType The typeName of the target being liked
       * @params {string} senderId The context sender (from whose perspective to get the info)
       *
       * @returns {promise} A $http promise
       */
      getInfo: function (targetId, targetType, senderId) {
        var url = coyoEndpoints.likes.info.replace('{{targetType}}', targetType).replace('{{targetId}}', targetId);
        return this.$get(url, {
          senderId: senderId
        });
      }
    });

    return LikeModel;
  }

})(angular);
