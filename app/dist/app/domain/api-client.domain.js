(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('ApiClientModel', ApiClientModel);

  /**
   * @ngdoc service
   * @name coyo.domain.ApiClientModel
   *
   * @description
   * <p>Domain model representation of API clients endpoint. Creates an API client object</p>
   *
   * @requires restResourceFactory
   * @requires coyoEndpoints
   */
  function ApiClientModel(restResourceFactory, coyoEndpoints) {
    var ApiClient = restResourceFactory({
      url: coyoEndpoints.apiClient.apiClients
    });

    return ApiClient;
  }

})(angular);
