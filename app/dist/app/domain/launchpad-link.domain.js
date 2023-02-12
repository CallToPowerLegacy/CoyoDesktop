(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('LaunchpadLinkModel', LaunchpadLinkModel);

  /**
   * @ngdoc service
   * @name coyo.domain.LaunchpadLinkModel
   *
   * @description
   * Domain model representing the launchpad links.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function LaunchpadLinkModel(restResourceFactory, coyoEndpoints) {
    var LaunchpadLink = restResourceFactory({
      url: coyoEndpoints.launchpad.links
    });

    angular.extend(LaunchpadLink.prototype, {
      /**
       * @ngdoc function
       * @name coyo.domain.LaunchpadLinkModel#order
       * @methodOf coyo.domain.LaunchpadLinkModel
       *
       * @description
       * Saves or updates the launchpad link
       *
       * @param {object} category The category to update the link in
       * @returns {promise} An $http promise
       */
      saveOrUpdate: function (category) {
        var url = coyoEndpoints.launchpad.links.replace('{owner}', category.id);
        if (this.id) {
          return this.$put(url + '/' + this.id);
        } else {
          return this.$post(url);
        }
      },
      /**
       * @ngdoc function
       * @name coyo.domain.LaunchpadLinkModel#order
       * @methodOf coyo.domain.LaunchpadLinkModel
       *
       * @description
       * Deletes the launchpad link
       *
       * @param {object} category The category to delete the link in
       * @returns {promise} An $http promise
       */
      delete: function (category) {
        var url = coyoEndpoints.launchpad.links.replace('{owner}', category.id);
        return this.$delete(url + '/' + this.id);
      }
    });

    return LaunchpadLink;
  }

})(angular);
