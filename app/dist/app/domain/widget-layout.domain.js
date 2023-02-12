(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('WidgetLayoutModel', WidgetLayoutModel);

  /**
   * @ngdoc service
   * @name coyo.domain.WidgetLayoutModel
   *
   * @description
   * Domain model representation of widget layout endpoint.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function WidgetLayoutModel(restResourceFactory, coyoEndpoints, WidgetModel) {
    var WidgetLayoutModel = restResourceFactory({
      url: coyoEndpoints.widgetLayouts,
      extensions: ['snapshots']
    });

    angular.extend(WidgetLayoutModel.prototype, {
      /**
       * @ngdoc function
       * @name coyo.domain.WidgetLayoutModel#getWithWidgets
       * @methodOf coyo.domain.WidgetLayoutModel
       *
       * @description
       * Load the widget layout with the corresponding widgets included. The widget will be stored in the WidgetModel
       * cache where they can be retrieved by the widget slot directive.
       *
       * @returns {promise} A promise resolving the widget layout.
       */
      getWithWidgets: function () {
        return this.getWithPermissions(undefined, {includeWidgets: true}, ['manage', 'manageWidgets']).then(function (layout) {
          var manageWidgets = _.get(layout, '_permissions.manageWidgets', false);
          if (layout.widgets) {
            _.toPairs(layout.widgets).forEach(function (pair) {
              var slot = pair[0];
              var widgets = pair[1];
              WidgetModel.cache(slot, _.map(widgets, function (widget) {
                widget._permissions = {manage: manageWidgets};
                return new WidgetModel(widget);
              }));
            });
          }
          return layout;
        });
      }
    });

    return WidgetLayoutModel;
  }

})(angular);
