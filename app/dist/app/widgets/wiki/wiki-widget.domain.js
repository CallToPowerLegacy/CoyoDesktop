(function (angular) {
  'use strict';

  angular.module('coyo.widgets.wiki')
      .factory('WikiWidgetModel', WikiWidgetModel);

  /**
   * @ngdoc service
   * @name coyo.widgets.wiki.WikiWidgetModel
   *
   * @description
   * Domain model representation for the latest wiki articles shown in the wiki widget
   *
   * @requires restResourceFactory
   */
  function WikiWidgetModel(restResourceFactory) {
    var WikiWidget = restResourceFactory({
      url: '/web/widgets/wiki',
      httpConfig: {
        autoHandleErrors: false
      }
    });

    angular.extend(WikiWidget, {

      /**
       * @ngdoc function
       * @name coyo.widgets.wiki.WikiWidgetModel#getLatest
       * @methodOf coyo.widgets.wiki.WikiWidgetModel
       *
       * @description
       * Returns the list of of latest wiki articles.
       *
       * @param {int} count The (max) number of articles to retrieve
       * @param {string=} appId ID of the wiki app to limit the articles to. If empty, search will be global.
       *
       * @returns {promise} An $http promise resolving to the list of articles.
       */
      getLatest: function (count, appId) {
        return WikiWidget.get('latest', {count: count, appId: appId});
      }
    });

    return WikiWidget;
  }

})(angular);
