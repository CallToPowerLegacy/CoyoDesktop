(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.jobs')
      .component('coyoJobStatus', jobStatus())
      .controller('JobStatusController', JobStatusController);

  /**
   * @ngdoc directive
   * @name coyo.admin.jobs.jobStatus:coyoJobStatus
   * @restrict E
   * @scope
   *
   * @description
   * Renders a job status component
   *
   * @param {object} jobStatus
   * The job status to render
   * @param {string} jobName
   * The job name
   * @param {string} labelUnknownProgress
   * The label to show when the progress is unknown
   * @param {string} labelNoStatus
   * The label to show when the status is undefined
   * @param {boolean} withoutTime
   * Omit rendering timestamps when set to true
   * @param {boolean} compact
   * Render a compact view
   * @param {boolean} linkToJobs
   * If set a click on the directive opens the job details
   */
  function jobStatus() {
    return {
      scope: {},
      controller: 'JobStatusController',
      controllerAs: '$ctrl',
      templateUrl: 'app/modules/admin/jobs/components/job-status/job-status.html',
      bindings: {
        jobStatus: '<',
        jobName: '<?',
        labelUnknownProgress: '@',
        labelNoStatus: '@',
        withoutTime: '<?',
        compact: '<?',
        linkToJobs: '<?'
      }
    };
  }

  function JobStatusController($state) {
    var vm = this;

    vm.goToJobs = goToJobs;
    vm.$onChanges = $onChanges;
    vm.$onInit = initStatus;

    function $onChanges(changes) {
      if (changes.jobStatus) {
        initStatus();
      }
    }

    function initStatus() {
      vm.isRunning = hasState('RUNNING');
      vm.hasProgress = hasState('RUNNING') && angular.isDefined(vm.jobStatus) && (vm.jobStatus.progress !== null);
      vm.progressPercent = vm.hasProgress ? Math.round(vm.jobStatus.progress * 100) : 100;
      vm.hasCustomProgress = hasState('RUNNING') && angular.isDefined(vm.jobStatus) && (vm.jobStatus.customProgress !== null);
      vm.isSuccess = hasState('COMPLETED_SUCCESS');
      vm.isFailure = hasState('COMPLETED_FAILURE');
    }

    function hasState(checkedState) {
      return vm.jobStatus && vm.jobStatus.state === checkedState;
    }

    function goToJobs() {
      if (vm.jobName && vm.linkToJobs) {
        $state.go('admin.jobs.details', {name: vm.jobName});
      }
    }
  }

})(angular);
