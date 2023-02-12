(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('ReportModel', ReportModel);

  /**
   * @ngdoc service
   * @name coyo.domain.ReportModel
   *
   * @description
   * Provides the report model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function ReportModel(restResourceFactory, coyoEndpoints) {
    var ReportModel = restResourceFactory({
      url: coyoEndpoints.reports
    });

    return ReportModel;
  }

})(angular);
