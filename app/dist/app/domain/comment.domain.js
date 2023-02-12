(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('CommentModel', CommentModel);

  /**
   * @ngdoc service
   * @name coyo.domain.CommentModel
   *
   * @description
   * Provides the Coyo comment model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function CommentModel(restResourceFactory, coyoEndpoints) {
    var CommentModel = restResourceFactory({
      url: coyoEndpoints.comments.comments,
      name: 'comment'
    });

    // class members
    angular.extend(CommentModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.CommentModel#getInfo
       * @methodOf coyo.domain.CommentModel
       *
       * @description
       * Gets the general comment information about this target.
       *
       * @params {string} targetId The target being liked
       * @params {string} targetType The typeName of the target being liked
       * @params {string} senderId The context sender (from whose perspective to get the info)
       *
       * @returns {promise} A $http promise
       */
      getInfo: function (targetId, targetType) {
        return CommentModel.$http({
          method: 'GET',
          url: coyoEndpoints.comments.count,
          params: {
            targetId: targetId,
            targetType: targetType
          }
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.CommentModel#getInfos
       * @methodOf coyo.domain.CommentModel
       *
       * @description
       * Gets the comment information about the list of targets.
       *
       * @params {string} targetIds List of target ids
       * @params {string} targetType The typeName of the target being liked
       * @params {string} senderId The context sender (from whose perspective to get the info)
       *
       * @returns {promise} A $http promise
       */
      getInfos: function (targetIds, targetType) {
        return CommentModel.$http({
          method: 'GET',
          url: coyoEndpoints.comments.count,
          params: {
            targetIds: targetIds,
            targetType: targetType
          }
        });
      }
    });

    angular.extend(CommentModel.prototype, {

      /**
       * @ngdoc function
       * @name coyo.domain.CommentModel#getOriginalAuthor
       * @methodOf coyo.domain.CommentModel
       *
       * @description
       * Gets the original author of a comment.
       *
       * @returns {promise} A $http promise
       */
      getOriginalAuthor: function () {
        return CommentModel.$get(this.$url('/originalauthor'));
      }
    });

    return CommentModel;
  }
})(angular);
