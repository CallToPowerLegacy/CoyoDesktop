(function (angular) {
  'use strict';

  angular
      .module('coyo.reports')
      .controller('ReportsListController', ReportsListController);

  function ReportsListController($scope, ReportModel, Pageable, targetService) {
    var vm = this;

    vm.loadMore = loadMore;
    vm.open = open;
    vm.resolve = resolve;

    function loadMore(reset) {
      if (vm.loading) {
        return;
      }

      if (!vm.reports || reset) {
        vm.reports = [];
      }
      if (reset) {
        delete vm.currentPage;
      }

      if (!vm.currentPage || !vm.currentPage.last) {
        vm.loading = true;

        var pageable = new Pageable((vm.currentPage ? vm.currentPage.number + 1 : 0), 20);

        ReportModel.pagedQuery(pageable).then(function (page) {
          vm.currentPage = page;

          // permission checks
          _.forEach(page.content, function (report) {
            targetService.onCanLinkTo(report.target, function (canLink) {
              report.target.canLinkTo = canLink;
            });
          });

          vm.reports.push.apply(vm.reports, page.content);
        }).finally(function () {
          vm.loading = false;
        });
      }
    }

    function open(report) {
      if (report.canLinkTo) {
        targetService.go(report.target);
      }
    }

    function resolve(report) {
      if (vm.loading || vm.loadingResolve) {
        return;
      }

      vm.loadingResolve = true;
      report.delete().then(function () {
        vm.loadMore(true);
      }).finally(function () {
        vm.loadingResolve = false;
      });
    }
  }

})(angular);
