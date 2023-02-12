(function (angular) {
  'use strict';

  angular.module('coyo.admin.jobs')
      .controller('AdminJobsListController', AdminJobsListController);

  function AdminJobsListController($rootScope, $scope, $sessionStorage, JobModel, filterFilter) {
    var vm = this;
    var jobs = [];

    vm.jobs = null;
    vm.isMobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;
    vm.actions = _buildActions();

    function onChangeName(term) {
      $sessionStorage.jobList = {name: term};
      vm.isFiltered = !!term;
      vm.jobs = term ? filterFilter(jobs, $sessionStorage.jobList) : jobs;
    }

    // ----------

    function _buildActions() {
      return {};
    }

    // ----------

    (function _init() {
      var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
        vm.isMobile = screenSize.isXs || screenSize.isSm;
      });
      $scope.$on('$destroy', unsubscribe);

      vm.loading = true;
      vm.queryParams = angular.extend({name: ''}, $sessionStorage.jobList);
      return JobModel.query().then(function (result) {
        jobs = result;
        onChangeName(vm.queryParams.name);
      }).finally(function () {
        vm.loading = false;
      });
    })();
  }
})(angular);
