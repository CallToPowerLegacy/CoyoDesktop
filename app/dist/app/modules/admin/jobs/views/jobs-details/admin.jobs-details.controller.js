(function (angular) {
  'use strict';

  angular.module('coyo.admin.jobs')
      .controller('AdminJobsDetailsController', AdminJobsDetailsController);

  function AdminJobsDetailsController($rootScope, job, $stateParams, $state, JobModel, Pageable) {
    var vm = this;
    vm.job = job;

    vm.isMobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;
    vm.startJob = startJob;
    vm.close = close;
    vm.refresh = refresh;

    initPage();

    function startJob() {
      vm.job.start().then(function () {
        refresh();
      });
    }

    function close() {
      if ($stateParams.returnState) {
        $state.go($stateParams.returnState, $stateParams.returnStateOpts);
      } else {
        $state.go('^.list');
      }
    }

    function initPage() {
      if (vm.job && vm.job.jobStatuses && vm.job.jobStatuses.content) {
        setCurrentPage(vm.job.jobStatuses.number, vm.job.jobStatuses.size);

        vm.job.jobStatuses.content.forEach(function (jobStatus) {
          jobStatus.duration = Math.ceil((jobStatus.endTime - jobStatus.startTime) / 60000);
          jobStatus.durationUnit = 'minute';
          if (jobStatus.duration < 2) {
            jobStatus.duration = Math.ceil((jobStatus.endTime - jobStatus.startTime) / 1000);
            jobStatus.durationUnit = 'second';
          }
        });
        vm.job.jobStatuses._queryParams = vm.queryParams;
        vm.job.jobStatuses.page = function (newPage) {
          setCurrentPage(newPage);
          refresh();
        };

        vm.page = vm.job.jobStatuses;
      }
    }

    function setCurrentPage(page, pageSize) {
      var size = pageSize || vm.queryParams._pageSize;
      vm.queryParams = new Pageable(page, size).getParams();
    }

    function refresh() {
      vm.loading = true;
      JobModel.get({name: $stateParams.name}, vm.queryParams).then(function (job) {
        vm.job = job;
        initPage();
      }).finally(function () {
        vm.loading = false;
      });
    }
  }
})(angular);
