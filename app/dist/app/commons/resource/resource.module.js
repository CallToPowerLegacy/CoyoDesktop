(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.resource
   *
   * @description
   * Module for managing the REST resources based on the
   * {@link https://github.com/FineLinePrototyping/angularjs-rails-resource angularjs-rails-resource} component.
   *
   * @requires rails
   */
  angular
      .module('commons.resource', [
        'coyo.base',
        'commons.config',
        'commons.auth',
        'commons.error'
      ])
      .config(railsResourceConfig)
      .factory('restSerializer', restSerializer)
      .run(checkBackendUrl);

  function railsResourceConfig(RailsResourceProvider, railsSerializerProvider) {
    RailsResourceProvider.rootWrapping(false);
    railsSerializerProvider.underscore(function (v) {
      return v;
    });
    railsSerializerProvider.camelize(function (v) {
      return v;
    });
  }

  function restSerializer(railsSerializer) {
    return railsSerializer;
  }

  function checkBackendUrl(authService, backendUrlService) {
    if (authService.isAuthenticated() && angular.isUndefined(backendUrlService.getUrl())) {
      authService.logout();
    }
  }

})(angular);
