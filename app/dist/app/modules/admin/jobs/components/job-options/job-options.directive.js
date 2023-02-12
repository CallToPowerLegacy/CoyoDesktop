(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.jobs')
      .component('oyocJobOptions', jobOptions());

  /**
   * @ngdoc directive
   * @name coyo.admin.jobs.oyocJobOptions:oyocJobOptions
   * @restrict 'E'
   *
   * @description
   * Context menu options for job list.
   *
   * @param {object} actions the available user actions
   * @param {object} job the job
   */
  function jobOptions() {
    return {
      scope: {},
      controller: angular.noop,
      controllerAs: '$ctrl',
      templateUrl: 'app/modules/admin/jobs/components/job-options/job-options.html',
      bindings: {
        actions: '<',
        job: '<'
      }
    };
  }

})(angular);
