(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('JobModel', JobModel);

  /**
   * @ngdoc service
   * @name coyo.domain.JobModel
   *
   * @description
   * Provides the Coyo job model.
   *
   * @requires $http
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function JobModel(restResourceFactory, coyoEndpoints) {
    var JobModel = restResourceFactory({
      url: coyoEndpoints.job.jobs
    });

    // instance members
    angular.extend(JobModel.prototype, {

      /**
       * @ngdoc function
       * @name coyo.domain.JobModel#start
       * @methodOf coyo.domain.JobModel
       *
       * @description
       * Start the job manually
       *
       * @returns {promise} An $http promise
       */
      start: function () {
        return this.$put(this.$url('start'));
      }
    });

    return JobModel;
  }

})(angular);
