(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('TimelineShareModel', TimelineShareModel);

  /**
   * @ngdoc service
   * @name coyo.domain.TimelineShareModel
   *
   * @description
   * Provides the timeline share model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function TimelineShareModel(restResourceFactory, coyoEndpoints) {
    var TimelineShareModel = restResourceFactory({
      url: coyoEndpoints.shares
    });

    angular.extend(TimelineShareModel.prototype, {
      getOriginalAuthor: function () {
        var url = this.$url('/' + this.id + '/originalauthor');
        return TimelineShareModel.$get(url);
      }
    });

    angular.extend(TimelineShareModel, {
      share: function (targetType, share) {
        var url = this.$url({
          targetType: targetType
        });
        return this.$post(url, share);
      }
    });

    return TimelineShareModel;
  }

})(angular);
