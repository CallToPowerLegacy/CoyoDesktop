(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('GlobalAppModel', GlobalAppModel);

  /**
   * @ngdoc service
   * @name coyo.domain.GlobalAppModel
   *
   * @description
   * <p>Domain model representation of app endpoint not dependent on a sender. Creates an App object with the
   * following properties.</p>
   *
   * <pre>
   *  {string} key;
   *  {string} name;
   *  {string} senderId;
   *  {boolean} active;
   *  {object} settings;
   * </pre>
   *
   * @requires restResourceFactory
   * @requires restSerializer
   * @requires coyoEndpoints
   *
   * @see coyo.domain.AppModel
   */
  function GlobalAppModel(restResourceFactory, coyoEndpoints) {
    return restResourceFactory({
      url: coyoEndpoints.apps.global
    });
  }

})(angular);
