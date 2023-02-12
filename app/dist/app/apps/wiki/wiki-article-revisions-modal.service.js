(function () {
  'use strict';

  angular.module('coyo.apps.wiki')
      .factory('wikiArticleRevisionsModal', wikiArticleRevisionsModal)
      .controller('WikiArticleRevisionsModalController', WikiArticleRevisionsModalController);

  /**
   * @ngdoc service
   * @name coyo.apps.wiki.wikiArticleRevisionsModal
   *
   * @description
   * Displays a modal with all revisions of the given article. The revisions are displayed in a bulk of 10. If more
   * revisions exist, a "Load More" button is displayed. The user can click on each of the revisions to close the
   * modal and return the selected revision.
   *
   * @requires modalService
   */
  function wikiArticleRevisionsModal(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleRevisionsModal#open
     * @methodOf coyo.apps.wiki.wikiArticleRevisionsModal
     *
     * @description
     * Opens the modal which displays a list of revisions. Supports pagination.
     *
     * @param {object} article
     * The article to display the revisions for.
     *
     * @returns {object} a promise which returns the selected revision.
     */
    function open(article) {
      return modalService.open({
        size: 'md',
        templateUrl: 'app/apps/wiki/wiki-article-revisions-modal.html',
        controller: 'WikiArticleRevisionsModalController',
        resolve: {
          article: function () {
            return article;
          }
        }
      }).result;
    }
  }

  function WikiArticleRevisionsModalController(Pageable, article) {
    var vm = this;
    vm.loading = false;
    vm.currentPage = {};
    vm.revisions = [];
    vm.currentRevisionNumber = article.revisionNumber;

    vm.loadMore = loadMore;

    function loadMore() {
      if (vm.loading) {
        return;
      }

      if (!vm.currentPage || !vm.currentPage.last) {
        vm.loading = true;

        var pageable = new Pageable((vm.currentPage ? vm.currentPage.number + 1 : 0), 10);
        article.getRevisions(pageable).then(function (page) {
          vm.currentPage = page;
          vm.revisions.push.apply(vm.revisions, page.content);
        }).finally(function () {
          vm.loading = false;
        });
      }
    }

    (function _init() {
      loadMore();
    })();
  }

})();
