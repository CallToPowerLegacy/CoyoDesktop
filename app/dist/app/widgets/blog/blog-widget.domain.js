(function (angular) {
  'use strict';

  angular.module('coyo.widgets.blog')
      .factory('BlogWidgetModel', BlogWidgetModel);

  /**
   * @ngdoc service
   * @name coyo.widgets.blog.BlogWidgetModel
   *
   * @description
   * Domain model representation for the latest blog articles shown in the blog widget
   *
   * @requires restResourceFactory
   * @requires CoyoEndpoints
   */
  function BlogWidgetModel(restResourceFactory) {
    var BlogWidget = restResourceFactory({
      url: '/web/widgets/blog',
      httpConfig: {
        autoHandleErrors: false
      }
    });

    angular.extend(BlogWidget, {

      /**
       * @ngdoc function
       * @name coyo.widgets.blog.BlogWidgetModel#getLatest
       * @methodOf coyo.widgets.blog.BlogWidgetModel
       *
       * @description
       * Returns the list of of latest blog articles.
       *
       * @param {int} count The (max) number of articles to retrieve
       * @param {string=} appId ID of the blog app to limit the articles to. If empty, search will be global.
       *
       * @returns {promise} An $http promise resolving to the list of articles.
       */
      getLatest: function (count, appId) {
        return BlogWidget.get('latest', {count: count, appId: appId});
      }
    });

    return BlogWidget;
  }

})(angular);
