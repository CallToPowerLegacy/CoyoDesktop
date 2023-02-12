(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('TimelineItemModel', TimelineItemModel);

  /**
   * @ngdoc service
   * @name coyo.domain.TimelineItemModel
   *
   * @description
   * Provides the timeline item model.
   *
   * @requires restResourceFactory
   * @requires restSerializer
   * @requires commons.config.coyoEndpoints
   */
  function TimelineItemModel(restResourceFactory, coyoEndpoints) {
    var TimelineItemModel = restResourceFactory({
      url: coyoEndpoints.timeline.items
    });

    // instance methods
    angular.extend(TimelineItemModel.prototype, {

      /**
       * @ngdoc method
       * @name coyo.domain.TimelineItemModel#markAsRead
       * @methodOf coyo.domain.TimelineItemModel
       *
       * @description
       * Mark the current timeline item as read for the current user.
       *
       * @returns {object} promise that resolved to the updated timeline item
       */
      markAsRead: function () {
        var item = this;
        return item.$post(item.$url('read'));
      },

      getShares: function () {
        return this.getWithPermissions('/shares', '', ['delete', 'accessoriginalauthor']);
      },

      getOriginalAuthor: function () {
        return this.$http({
          method: 'GET',
          url: this.$url('/originalauthor'),
          data: this
        });
      }
    });

    return TimelineItemModel;
  }

})(angular);
