(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('MaintenanceModel', MaintenanceModel);

  /**
   * @ngdoc service
   * @name coyo.domain.MaintenanceModel
   *
   * @description
   * <p>Domain model representation of API clients endpoint. Creates an API client object</p>
   *
   * @requires restResourceFactory
   * @requires coyoEndpoints
   */
  function MaintenanceModel(restResourceFactory, coyoEndpoints) {
    var Maintenance = restResourceFactory({
      url: coyoEndpoints.maintenance.base
    });

    // class members
    angular.extend(Maintenance, {

      /**
       * @ngdoc method
       * @name coyo.domain.MaintenanceModel#getLatest
       * @methodOf coyo.domain.MaintenanceModel
       *
       * @description
       * Retrieves the most recent tenant maintenance.
       *
       * @returns {promise} containing the maintenance information
       */
      getLatest: function () {
        return Maintenance.get('latest');
      },

      /**
       * @ngdoc method
       * @name coyo.domain.MaintenanceModel#getPublic
       * @methodOf coyo.domain.MaintenanceModel
       *
       * @description
       * Gets the public maintenance information for currently active
       * global or tenant maintenance.
       *
       * @returns {promise} containing the maintenance information
       */
      getPublic: function () {
        return Maintenance.get('public');
      }
    });

    return Maintenance;

  }

})(angular);
