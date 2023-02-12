(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.api')
      .factory('appResourceFactory', appResourceFactory);

  /**
   * @ngdoc service
   * @name coyo.apps.api.appResourceFactory
   *
   * @description
   * The factory creating app specific REST resources.
   * Adds URL prefixing and app properties initialization to the default commons.resource.RestResourceFactory.
   *
   * The configured url will be automatically prefixed with `/senders/{senderId}/apps/{appId}/<appKey>`
   *
   * @param {object} config
   * Resource configuration (see https://github.com/FineLinePrototyping/angularjs-rails-resource#config-options)
   *
   * @param {string=} config.appKey
   * App key (will become part of the url)
   *
   * @requires commons.resource.RestResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function appResourceFactory(restResourceFactory, coyoEndpoints) {
    return function (config) {
      var baseUrl = coyoEndpoints.sender.apps.base;
      if (config.appKey) {
        baseUrl += '/' + config.appKey;
      }
      config.url = baseUrl + config.url;
      var AppResource = restResourceFactory(config);

      // class members
      angular.extend(AppResource, {

        /**
         * @ngdoc method
         * @name coyo.apps.api.appResourceFactory#fromApp
         * @methodOf coyo.apps.api.appResourceFactory
         *
         * @description
         * Create a new resource instance and initialize app properties needed for base url replacement.
         *
         * @param {object} app
         * The app object needed to initialize appId and senderId properties.
         *
         * @param {*} context
         * A context object with additional properties to be set on the resulting object.
         *
         * @returns {object} Resource instance
         */
        fromApp: function (app, context) {
          var appResource = new AppResource({senderId: app.senderId, appId: app.id});
          angular.extend(appResource, context);
          return appResource;
        }
      });

      // instance members
      angular.extend(AppResource.prototype, {});

      return AppResource;
    };
  }

})(angular);
