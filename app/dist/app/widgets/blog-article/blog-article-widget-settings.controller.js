(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blogarticle')
      .controller('BlogArticleWidgetSettingsController', BlogArticleWidgetSettingsController);

  function BlogArticleWidgetSettingsController($scope, $translate, BlogArticleWidgetModel) {
    var vm = this;

    vm.model = $scope.model;
    vm.loading = false;

    $scope.$watch(function () { return vm.selectedArticle; }, function (newVal, oldVal) {
      if (newVal !== oldVal) {
        vm.model.settings._articleId = vm.selectedArticle.id;
      }
    });

    (function _init() {
      if (!vm.model.settings._articleId) {
        return;
      }
      vm.loading = true;

      BlogArticleWidgetModel.getArticle(vm.model.settings._articleId).then(function (article) {
        vm.selectedArticle = {
          id: article.id,
          displayName: article.title
        };
      }).catch(function () {
        $translate('WIDGETS.BLOGARTICLE.SETTINGS.PERMISSION_ERROR').then(function (msg) {
          vm.selectedArticle = {displayName: '<' + msg + '>'};
        });
      }).finally(function () {
        vm.loading = false;
      });
    })();
  }

})(angular);
