(function () {
  'use strict';

  angular
      .module('coyo.apps.wiki')
      .component('coyoWikiArticleTitle', wikiArticleTitle())
      .controller('WikiArticleTitleController', WikiArticleTitleController);

  /**
   * @ngdoc directive
   * @name coyo.app.wiki.coyoArticleTitle:coyoArticleTitle
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays the title of an article along with a label showing its status (new, modified or nothing). An article is
   * displayed as "new" if it was created at least 5 days ago. It is displayed as modified, if it's last modification
   * was at least 5 days ago.
   *
   * @param {object} article
   * The article to display the title and the status of.
   */
  function wikiArticleTitle() {
    return {
      templateUrl: 'app/apps/wiki/wiki-article-title.html',
      bindings: {
        article: '<'
      },
      controller: 'WikiArticleTitleController'
    };
  }

  function WikiArticleTitleController() {
    var vm = this;

    var newArticleThreshold = 5 * 24 * 60 * 60 * 1000; // 5 days in ms
    var updatedArticleThreshold = 5 * 24 * 60 * 60 * 1000; // 5 days in ms

    vm.$onInit = init;

    function init() {
      // new when created date equals modified date and not older than newArticleThreshold
      vm.article.isNew = (vm.article.created === vm.article.modified)
          && (new Date().getTime() - vm.article.created < newArticleThreshold);

      // updated when not new and updated within updatedArticleThreshold
      vm.article.isUpdated = (vm.article.created !== vm.article.modified)
          && (new Date().getTime() - vm.article.modified < updatedArticleThreshold);
    }

  }

})();
