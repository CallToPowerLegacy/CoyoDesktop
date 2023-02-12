(function (angular) {
  'use strict';

  angular.module('coyo.widgets.rss')
      .factory('RssWidgetModel', RssWidgetModel);

  /**
   * @ngdoc service
   * @name coyo.widgets.rss.RssWidgetModel
   *
   * @description
   * Domain model representation for a rss feed shown in the rss widget
   *
   * @requires restResourceFactory
   */
  function RssWidgetModel(restResourceFactory) {
    var Widget = restResourceFactory({
      url: '/web/widgets/rss',
    });

    angular.extend(Widget, {

      /**
       * @ngdoc function
       * @name coyo.widgets.rss.RssWidgetModel#verifyUrl
       * @methodOf coyo.widgets.rss.RssWidgetModel
       *
       * @description
       * Returns a boolean whether the Url is verified rss feed url
       *
       * @param {string} rssUrl Url of the rss feed.
       *
       * @returns {promise} An $http promise resolving the rss url.
       */
      verifyUrl: function (rssUrl, userName, password) {
        return this.$post(this.$url() + '/verify', {rssUrl: rssUrl, userName: userName, password: password});
      },

      /**
       * @ngdoc function
       * @name coyo.widgets.rss.RssWidgetModel#getEntries
       * @methodOf coyo.widgets.rss.RssWidgetModel
       *
       * @description
       * Returns the entries for the clarified rss url
       *
       * @param {string} widgetId ID of the rss feed.
       *
       * @returns {promise} An $http promise resolving the entries.
       */
      getEntries: function (id) {
        return Widget.get(id + '/entries');
      },

      /**
       * @ngdoc function
       * @name coyo.widgets.rss.RssWidgetModel#getEntriesForPreview
       * @methodOf coyo.widgets.rss.RssWidgetModel
       *
       * @description
       * Returns the preview entries for the clarified rss url
       *
       * @returns {promise} An $http promise resolving the entries.
       */
      getEntriesForPreview: function (url, image, size) {
        return Widget.get('/entries', {url: url, images: image, size: size});
      }
    });
    return Widget;
  }
})(angular);
