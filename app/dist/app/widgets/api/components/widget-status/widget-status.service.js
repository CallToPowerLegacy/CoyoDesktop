(function () {
  'use strict';

  angular.module('coyo.widgets.api')
      .factory('widgetStatusService', widgetStatusService);

  /**
   * @ngdoc service
   * @name coyo.widgets.api.widgetStatusService
   *
   * @description
   * Service to trigger a reload of data loaded by coyo.widgets.api.coyoWidgetStatus directive.
   */
  function widgetStatusService() {

    return {
      refresh: refresh,
      refreshOnSettingsChange: refreshOnSettingsChange
    };

    /**
     * @ngdoc method
     * @name coyo.widgets.api#refresh
     * @methodOf coyo.widgets.api
     *
     * @description
     * Triggers the event that will cause any widget status directive inside the scope hierarchy to reload it's data.
     *
     * @param {object} $scope
     * The scope that contains the widget status directive.
     */
    function refresh($scope) {
      $scope.$broadcast('widgetStatus:refresh');
    }

    /**
     * @ngdoc method
     * @name coyo.widgets.api#refreshSettingsOnChange
     * @methodOf coyo.widgets.api
     *
     * @description
     * Registers an event listener so that when the settings of a widget change, it's data loaded though the
     * widget status directive is automatically refreshed.
     *
     * @param {object} $scope
     * The scope that contains the widget status directive.
     */
    function refreshOnSettingsChange($scope) {
      var unsubscribeFn = $scope.$on('widget:settingsChanged', function () {
        refresh($scope);
      });
      $scope.$on('$destroy', unsubscribeFn);
    }
  }
})();
