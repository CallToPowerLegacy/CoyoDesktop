(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('StatisticsModel', StatisticsModel);

  /**
   * @ngdoc service
   * @name coyo.domain.StatisticsModel
   *
   * @description
   * Domain model representation of statistics endpoint.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function StatisticsModel(restResourceFactory, coyoEndpoints) {
    var Statistic = restResourceFactory({
      url: coyoEndpoints.statistics
    });

    // class members
    angular.extend(Statistic, {
    });

    return Statistic;
  }

})(angular);
