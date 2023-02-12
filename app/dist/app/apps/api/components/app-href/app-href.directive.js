(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.api')
      .directive('coyoAppHref', appHref);

  /**
   * @ngdoc directive
   * @name coyo.apps.api.coyoAppHref:coyoAppHref
   * @element ANY
   * @restrict A
   * @scope
   *
   * @description This directive creates a link to an app, based on its sender type. To create the link the default
   * state is read from the app configuration. Since this directive creates a ui-sref attribute, parent elements
   * can use the 'ui-sref-active' directive.
   *
   * @param {object} coyoAppHref The app to create a link for. The app must at least contain a key and an ID. This must
   * not be null or undefined.
   * @param {string} senderType The sender's type this app belongs to. This must be either "pages" or "workspaces".
   * The sender type becomes part of the generated URL. Must not be null.
   *
   * @requires $compile
   * @requires coyo.apps.api.appRegistry
   */
  function appHref($compile, appRegistry) {
    return {
      restrict: 'A',
      scope: {
        app: '=coyoAppHref',
        senderType: '@'
      },
      link: function (scope, el) {
        var stateName = appRegistry.getDefaultStateName(scope.app.key, scope.senderType);
        var state = stateName + '({appIdOrSlug: "' + (scope.app.slug || scope.app.id) + '"})';
        el.attr('ui-sref', state);
        el.removeAttr('coyo-app-href');
        $compile(el)(scope);
      }
    };
  }

})(angular);
