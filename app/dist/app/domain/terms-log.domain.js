(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('TermsLogModel', TermsLogModel);

  /**
   * @ngdoc service
   * @name TermsLogModel
   *
   * @description
   * Provides the Coyo terms log model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function TermsLogModel(restResourceFactory, coyoEndpoints) {
    var TermsLog = restResourceFactory({
      url: coyoEndpoints.termsLog
    });

    return TermsLog;
  }

})(angular);
