(function (angular) {
  'use strict';

  angular.module('coyo.widgets.api')
      .provider('widgetRegistry', widgetRegistry);

  /**
   * @ngdoc service
   * @name coyo.widgets.api.widgetRegistryProvider
   *
   * @description
   * This provider is used to register widgets to the system. This makes them available and manageable in the admin
   * configuration (see `Apps and Widgets` tab). To register a new widget call `widgetRegistryProvider#register` at
   * config phase.
   */

  /**
   * @ngdoc service
   * @name coyo.widgets.api.widgetRegistry
   *
   * @description
   * A service to retrieve registered widgets and their configurations.
   *
   * @requires $q
   * @requires coyo.domain.WidgetConfigurationModel
   */
  function widgetRegistry() {
    var widgets = {};
    var enabledWidgets = null;

    return {
      $get: function ($q, WidgetConfigurationModel) {
        return {

          /**
           * @ngdoc method
           * @name coyo.widgets.api.widgetRegistry#getAll
           * @methodOf coyo.widgets.api.widgetRegistry
           *
           * @description
           * Returns all the configurations of all registered widgets (including disabled widgets).
           *
           * @returns {array} list of configurations of all registered widgets.
           */
          getAll: function () {
            return _.map(widgets, _extract);
          },

          /**
           * @ngdoc method
           * @name coyo.widgets.api.widgetRegistry#get
           * @methodOf coyo.widgets.api.widgetRegistry
           *
           * @description
           * Returns the configuration of the widget with the given key.
           *
           * @param {string} key
           * The key of the widget of the configuration that should be returned.
           *
           * @returns {object} The configuration of the widget with the given key.
           */
          get: function (key) {
            return _extract(widgets[key]);
          },

          /**
           * @ngdoc method
           * @name coyo.widgets.api.widgetRegistry#getEnabled
           * @methodOf coyo.widgets.api.widgetRegistry
           *
           * @description
           * Returns a promise containing a list of all enabled widgets. Please note that this promise is cached. If an
           * error occurs while retrieving the list the promise is rejected and the cache is reset.
           *
           * @returns {object} promise containing a list of all enabled widgets.
           */
          getEnabled: function () {
            if (!enabledWidgets) {
              enabledWidgets = WidgetConfigurationModel.query().catch(function (error) {
                enabledWidgets = null;
                return $q.reject(error);
              });
            }
            return enabledWidgets;
          }
        };
      },

      /**
       * @ngdoc method
       * @name coyo.widgets.api.widgetRegistryProvider#register
       * @methodOf coyo.widgets.api.widgetRegistryProvider
       *
       * @description
       * This method is used to register a widget to the widget registry at config phase. Every widget
       * is defined by it's config and can then be retrieved using the service at runtime. All registered widgets can
       * be enabled or disabled in the admin area. All enabled widgets are listed within the widget chooser modal and
       * can then added to any slot.
       *
       * @param {object} widgetConfig
       * The widgets's configuration to register to the provider.
       *
       * @param {string} widgetConfig.key
       * A distinct key for the widget. This key must be unique and must not be null. Use a plain
       * lowercase string without special characters and whitespaces. This key is used to register / identify the
       * widget.
       *
       * @param {string} widgetConfig.name
       * The name of this widget. This can be a proper name or an i18n key. The name will be visible to the user and is
       * used in UI context. It must not be null nor empty.
       *
       * @param {string} widgetConfig.description
       * The textual description of this widget. This can be a proper description or an i18n key.
       *
       * @param {string} widgetConfig.directive
       * The name of a directive representing the actual widget. The name must be provided in snake case
       * (e.g. `my-directive`). The directive itself is a common angular directive which must be known to the injector.
       *
       * It underlies two restrictions:
       *
       * * It must not use `require` since this would result in an error.
       * * It must be able to be rendered as an element. Therefore setting `restrict: A` or something similar would
       * result in an error.
       *
       * The directive gets the actual widget model injected into its scope as `widget`. If you are using an isolated
       * scope define a parameter `widget` to be able to access the model.
       *
       * So for example defining a directive `my-widget` would be rendered as follows:
       *
       * ```
       * <my-widget widget="widgetModel"></my-widget>
       * ```
       *
       * It could have the following definition:
       * ```
       * return {
       *   restrict: 'E',
       *   templateUrl: 'my-widget.html',
       *   scope: {},
       *   bindToController: {
       *     widget: '='
       *   },
       *   controller: 'MyWidgetController',
       *   controllerAs: '$ctrl'
       * };
       * ```
       *
       * @param {string=} widgetConfig.icon
       * An optional zmdi icon class for the widget. This is used by the widget chooser modal.
       *
       * @param {array} widgetConfig.titles
       * An optional title for the widget. This is shown in the headline of some widgets.
       *
       * @param {array} widgetConfig.categories
       * All categories where the widget will be mapped to. There can be added custom categories.
       * 'static', 'dynamic' and 'personal' are the standard categories
       *
       * @param {object=} widgetConfig.settings
       * With the settings object it is possible to add additional settings to an widget. These settings can be
       * accessed when the slot is edited.
       *
       * @param {string=} widgetConfig.settings.templateUrl
       * URL to a template rendering form fields to add the additional settings. This template is provided with the
       * current widget.
       *
       * @param {object=} widgetConfig.settings.controller
       * An angular controller for the assigned settings template.
       *
       * @param {boolean=} widgetConfig.settings.skipOnCreate
       * If true the settings dialog will not be shown when creating the widget.
       * Instead the widget will be directly added to the slot.
       *
       * @param {object=} widgetConfig.inlineOptions
       * With the inlineOptions object it is possible to add additional options to the edit menu bar in the widget.
       *
       * @param {string} widgetConfig.inlineOptions.templateUrl
       * URL of the template to be included in the menu bar.
       *
       * @param {string} widgetConfig.inlineOptions.controller
       * Name of the controller to back the template
       *
       * @param {string=} widgetConfig.inlineOptions.controllerAs
       * Controller alias.
       *
       * @param {object=} widgetConfig.renderOptions
       * Configuration options that affect the rendering of the widget.
       *
       * @param {object=} widgetConfig.renderOptions.panels
       * Options that are applied if the widget resides in a context with the 'panel per widget' render style.
       *
       * @param {boolean=} widgetConfig.renderOptions.panels.noPanel
       * If true no panel is rendered and the widget is responsible for providing a panel or equivalent.
       */
      register: function (widgetConfig) {
        _assert(widgetConfig.key, 'Config property "key" is required', widgetConfig);
        _assert(widgetConfig.name, 'Config property "name" is required', widgetConfig);
        _assert(widgetConfig.description, 'Config property "description" is required', widgetConfig);
        _assert(widgetConfig.directive, 'Config property "directive" is required', widgetConfig);
        _assert(!widgetConfig.icon || _.startsWith(widgetConfig.icon, 'zmdi-'), 'Config property "icon" must be a Material Design Iconic Font class.', widgetConfig);
        _assert(widgetConfig.categories, 'Config property "categories" is required', widgetConfig);
        _assert(angular.isUndefined(widgetConfig.settings) || angular.isUndefined(widgetConfig.settings.skipOnCreate) || _.isBoolean(widgetConfig.settings.skipOnCreate),
            'Config property "skipOnCreate" must be a boolean');
        _assert(!widgets[widgetConfig.key], 'Config property "key" must be unique', widgetConfig);

        widgetConfig.icon = widgetConfig.icon || 'zmdi-globe';
        widgetConfig.titles = widgetConfig.titles || [];
        widgets[widgetConfig.key] = widgetConfig;
      }
    };

    function _assert(condition, message, config) {
      if (!condition) {
        if (config) {
          console.error('[widgetRegistry] Invalid config', config); //eslint-disable-line
        }
        console.log('[widgetRegistry] ' + message); //eslint-disable-line
        throw new Error('[widgetRegistry] ' + message);
      }
    }

    function _extract(config) {
      return config ? _.pick(config, ['key', 'name', 'description', 'icon', 'categories', 'titles', 'directive', 'settings', 'inlineOptions', 'renderOptions']) : null;
    }
  }

})(angular);
