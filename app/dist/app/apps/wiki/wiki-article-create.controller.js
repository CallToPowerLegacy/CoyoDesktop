(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.wiki')
      .controller('WikiArticleCreateController', WikiArticleCreateController);

  /**
   * Controller for creating a wiki article.
   *
   * @constructor
   */
  function WikiArticleCreateController($q, $scope, $state, $timeout, widgetLayoutService, article, app, sender,
                                       wikiArticleTranslationService) {
    var vm = this;

    vm.$onInit = init;
    vm.article = article;
    vm.app = app;
    vm.originalArticle = angular.copy(vm.article);
    vm.editMode = true;
    vm.loading = true;
    vm.simpleMode = true;

    vm.cancel = cancel;
    vm.save = save;

    function cancel() {
      widgetLayoutService.cancel($scope);
      vm.loading = false;
      vm.editMode = false;

      $state.go('^');
    }

    function save() {
      wikiArticleTranslationService.prepareTranslations();

      var deferred = $q.defer();
      if (vm.loading) {
        deferred.resolve();
      } else {
        vm.loading = true;

        if (article.id === article.parentId) {
          article.parentId = null;
        }

        vm.article.create().then(function () {
          $timeout(function () { // wait to sync id to widget layout and slots
            widgetLayoutService.save($scope).then(function () {
              vm.editMode = false;
              $state.go('^.view', {id: vm.article.id}).then(function () {
                deferred.resolve();
              });
            }).catch(function () {
              widgetLayoutService.edit($scope);
              deferred.reject();
            }).finally(function () {
              vm.loading = false;
            });
          });
        }).catch(function () {
          deferred.reject();
          vm.loading = false;
        });
      }

      return deferred.promise;
    }

    /* ===== PRIVATE METHODS ===== */

    function init() {

      widgetLayoutService.onload($scope).then(function () {
        widgetLayoutService.edit($scope);
      }).finally(function () {
        vm.loading = false;
      });

      _initTranslations();
    }

    function _initTranslations() {
      wikiArticleTranslationService.init($scope, vm, sender);
    }
  }

})(angular);
