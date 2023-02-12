(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('oyocSettingsView', SettingsView);

  /**
   * @ngdoc directive
   * @name commons.ui.oyocSettingsView:oyocSettingsView
   * @restrict E
   * @scope
   *
   * @description
   * Creates the view for the app or widget settings. These settings have to be defined when registering the app or
   * widget using the {@link coyo.apps.api.appRegistry appRegistry} or
   * {@link coyo.widgets.api.widgetRegistry widgetRegistry}. When registering an app or widget one can define a
   * template and a controller, which gets dynamically compiled and rendered by this directive.
   *
   * @param {string} model
   * The actual app to store the settings for. The model is passed into the controller's scope.
   *
   * @param {string} config
   * The settings for the app or widget.
   *
   *
   * @param {string} settingsProperty
   * The property inside the config object that holds the settings
   *
   * @param {string} settings.templateUrl
   * An URL pointing to a template to render. This must be a valid URL and must neither be empty nor undefined.
   *
   * @param {object=} settings.controller
   * A controller for the given template if more complex logic has to be processed.
   *
   * @param {object} settingsForm
   * The settingsForm controller, needed for proper validation inside custom settings. The form controller is passed
   * into the controller's scope.
   *
   * @param {object} saveCallbacks
   * A callbacks object which can be used to modify the settings object before saving. This object is passed into the
   * controller's scope to be set with a callback method.
   *
   * @requires $compile
   */
  function SettingsView($compile) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        model: '=',
        config: '=',
        settingsProperty: '@',
        settingsForm: '=formCtrl',
        saveCallbacks: '='
      },
      link: function (scope, elem) {
        var settingsProperty = scope.settingsProperty || 'settings';
        if (scope.config[settingsProperty] && scope.config[settingsProperty].templateUrl) {
          var html = '<div ng-include="\'' + scope.config[settingsProperty].templateUrl + '\'"';
          if (scope.config[settingsProperty].controller) {
            var controller = scope.config[settingsProperty].controller;
            if (scope.config[settingsProperty].controllerAs) {
              controller += ' as ' + scope.config[settingsProperty].controllerAs;
            }
            html += 'ng-controller="' + controller + '"';
          }
          html += '></div>';
          elem.append($compile(html)(scope));
        } else {
          var htmlEmpty = '';
          elem.append($compile(htmlEmpty)(scope));
        }
      }
    };
  }

})(angular);
