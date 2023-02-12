(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.wiki')
      .controller('WikiListController', WikiListController);

  /**
   * Controller for wiki article listing.
   *
   * @requires $log
   * @requires $state
   * @requires coyo.apps.wiki.WikiArticleService
   * @requires coyo.apps.wiki.WikiArticleModel
   * @requires app
   * @constructor
   */
  function WikiListController($log, $state, wikiArticleService, WikiArticleModel, app) {
    var vm = this;
    vm.app = app;
    vm.articleCount = 0;
    vm.initialLoading = true;
    vm.loading = true;
    vm.wikiArticles = [];
    vm.oldParent = undefined;

    vm.toggle = toggle;
    vm.loadSubArticles = loadSubArticles;
    vm.deleteArticle = deleteArticle;
    vm.openView = openView;
    vm.treeOptions = {
      dropped: dropped,
      dragMove: dragMove
    };

    _init();

    function toggle(article) {
      article.collapsed = !article.collapsed;
    }

    function loadSubArticles(article) {
      if (vm.initialLoading || !vm.loading) {
        vm.loading = true;
        if (angular.isDefined(article)) {
          article.loading = true;
        }
        return WikiArticleModel
            .getSubArticlesWithPermissions(app, _.get(article, 'id'))
            .then(function (result) {
              if (vm.wikiArticles.length === 0) {
                vm.wikiArticles = result;
                _initializeNodes(vm.wikiArticles);
              } else {
                article.nodesLoaded = true;
                article.collapsed = false;
                article.nodes = result;
                _initializeNodes(article.nodes);
              }
            }).finally(function () {
              vm.loading = false;
              vm.initialLoading = false;
              if (angular.isDefined(article)) {
                article.loading = true;
              }
            });
      }

      return null;
    }

    function deleteArticle(article) {
      wikiArticleService.deleteArticle(vm.app, article).then(function () {
        $state.reload($state.current.name);
      });
    }

    function openView(article) {
      if (!vm.loading) {
        $state.go('.view', {id: article.id});
      }
    }

    function dragMove(event) {
      // Add class to current parent element for highlighting
      var destNode = _(event.dest.nodesScope.$nodeScope).get('$element[0].firstElementChild');
      if (destNode) {
        if (!vm.oldParent) {
          vm.oldParent = destNode;
        } else if (destNode !== vm.oldParent) {
          angular.element(vm.oldParent).removeClass('ui-tree-is-parent');
        }
        angular.element(destNode).addClass('ui-tree-is-parent');
        vm.oldParent = destNode;
      } else if (!destNode && vm.oldParent) {
        angular.element(vm.oldParent).removeClass('ui-tree-is-parent');
        vm.oldParent = undefined;
      }
    }

    function dropped(event) {
      if (!vm.loading) {
        vm.loading = true;

        // Remove highlight-class from current parent element
        if (vm.oldParent) {
          angular.element(vm.oldParent).removeClass('ui-tree-is-parent');
          vm.oldParent = undefined;
        }

        var sourceNode = event.source.nodeScope.$modelValue;
        var destNode = event.dest.nodesScope.$nodeScope ? event.dest.nodesScope.$nodeScope.$modelValue : null;
        var destIndex = event.dest.index;
        var parentId = destNode ? destNode.id : null;
        var oldParentId = (sourceNode.parentId) ? sourceNode.parentId : null;

        if (destNode) {

          // Check Parent Node to dragg new Child into closed Parent
          if (!destNode.nodesLoaded && destNode.wikiArticles > 0) {
            destNode.collapsed = true;
          // Check Parent Node to toggle arrow when pull in first child
          } else if (destNode.wikiArticles === 0) {
            destNode.nodesLoaded = true;
          }
        }

        // if the article wasn't moved, do nothing
        if (parentId === oldParentId && destIndex === sourceNode.sortOrder) {
          vm.loading = false;
          return;
        }

        sourceNode.move(parentId, destIndex).catch(function () {
          $log.error('[WikiList] Could not re-order wiki article source node',
              sourceNode, 'into destination node', destNode, 'at index', destIndex);
          $state.go($state.current, {}, {reload: $state.current});
        }).finally(function () {
          vm.loading = false;
        });
      }
    }

    /******************* Helper methods *******************/
    function _init() {
      WikiArticleModel.count(vm.app).then(function (data) {
        vm.articleCount = data;
      });
      loadSubArticles();
    }

    function _initializeNodes(nodes) {
      // initialize nodes to be able to drop nodes as sub-nodes into this one
      _.forEach(nodes, function (node) {
        node.nodes = [];
        node.nodesLoaded = false;
        node.collapsed = false;
      });
    }
  }

})(angular);
