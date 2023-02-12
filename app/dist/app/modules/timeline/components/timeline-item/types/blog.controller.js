(function (angular) {
  'use strict';

  angular
      .module('coyo.timeline')
      .controller('BlogTimelineItemController', BlogTimelineItemController);

  function BlogTimelineItemController(targetService) {
    var vm = this;

    vm.openArticle = openArticle;

    /**
     * Opens the detail view of an article using its target info.
     *
     * Please note that in some rare cases this data is missing and need to be generated manually. This is because
     * shares were persisted without this target data in the past - see COYOFOUR-6288.
     *
     * @param {object} article the article to open the detail view for.
     */
    function openArticle(article) {
      if (!article.published) {
        return;
      }

      var articleTarget = (article.articleTarget) ? article.articleTarget : {
        name: article.typeName,
        params: {
          id: article.id,
          appId: article.app.id,
          appKey: article.app.key,
          senderId: article.sender.id,
          senderType: article.sender.target.name
        }
      };
      targetService.go(articleTarget);
    }

  }

})(angular);
