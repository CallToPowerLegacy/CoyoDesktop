(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('VideoInfoModel', VideoInfoModel);

  /**
   * @ngdoc service
   * @name coyo.domain.VideoInfoModel
   *
   * @description
   * Domain model representation of video info endpoint.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function VideoInfoModel(restResourceFactory, coyoEndpoints) {
    var VideoInfo = restResourceFactory({
      url: coyoEndpoints.webPreviews.generate
    });

    // class members
    angular.extend(VideoInfo, {

      /**
       * @ngdoc function
       * @name coyo.domain.VideoInfoModel#generateVideoInfos
       * @methodOf coyo.domain.VideoInfoModel
       *
       * @description
       * Find urls and generate video infos for them.
       *
       * @params {string} urls The urls e.g. found in a post
       *
       * @returns {promise} A $http promise
       */
      generateVideoInfos: function (urls) {
        return this.$post(coyoEndpoints.webPreviews.generate, {
          urls: urls
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.VideoInfoModel#generateVideoInfo
       * @methodOf coyo.domain.VideoInfoModel
       *
       * @description
       * Find urls and generate video infos for them.
       *
       * @params {string} url the url found e.g. in a post
       *
       * @returns {promise} A $http promise
       */
      generateVideoInfo: function (url) {
        return this.$post(coyoEndpoints.webPreviews.generate, {
          urls: [url]
        });
      }
    });

    return VideoInfo;
  }

})(angular);
