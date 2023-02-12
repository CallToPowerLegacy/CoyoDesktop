(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('WidgetModel', WidgetModel);

  /**
   * @ngdoc service
   * @name coyo.domain.WidgetModel
   *
   * @description
   * Domain model representation of widget endpoint.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function WidgetModel(restResourceFactory, coyoEndpoints, $q) {
    var Widget = restResourceFactory({
      url: coyoEndpoints.widgets,
      extensions: ['snapshots']
    });

    var cache = {};

    // class members
    angular.extend(Widget, {
      fromConfig: function (config) {
        return new Widget({
          key: config.key,
          settings: {}
        });
      },
      order: function (slot, parent, widgetIds) {
        var data = {
          widgetIds: widgetIds
        };

        if (parent) {
          angular.extend(data, {
            parentId: parent.id,
            parentType: parent.typeName
          });
        }

        var url = this.$url({slot: slot}, 'action/order');
        var params = Widget.applyPermissions(['manage']);
        return Widget.$put(url, data, {}, params);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WidgetModel#cache
       * @methodOf coyo.domain.WidgetModel
       *
       * @description
       * Load the widgets for the qiven slot. If they exist in the (one-time) cache filled by bulk loading via
       * widget layout, then no request is performed and the content of the cache is returned.
       *
       * @params (object) params query params
       * @params (string) name of the widget slot
       *
       * @returns {promise} A promise resolving the list of widgets.
       */
      queryWithCache: function (params, slot) {
        if (cache[slot]) {
          var result = $q.resolve(cache[slot]);
          delete cache[slot];
          return result;
        }
        return this.queryWithPermissions(params, {slot: slot}, ['manage']);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.WidgetModel#cache
       * @methodOf coyo.domain.WidgetModel
       *
       * @description
       * Store the widgets for the given slot in a (one-time) cache to support bulk loading inside widget layouts.
       *
       * @params (string) slot name of the widget slot
       * @params (object[]) array of widget resources
       */
      cache: function (slot, widgets) {
        cache[slot] = widgets;
      }
    });

    return Widget;
  }

})(angular);
