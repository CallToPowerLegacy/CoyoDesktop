(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.api')
      .directive('oyocWidgetConfigChooser', widgetConfigChooser)
      .controller('WidgetConfigChooserController', WidgetConfigChooserController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.api.oyocWidgetConfigChooser:oyocWidgetConfigChooser
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders a component for selecting a widget configuration out of all registered and enabled configurations. This
   * directive is utilized by the {@link coyo.widgets.api.widgetChooserModalService widgetChooserModalService}.
   *
   * @requires $filter
   * @requires widgetRegistry
   * @requires WidgetConfigurationModel
   * @requires authService
   *
   */
  function widgetConfigChooser($filter, widgetRegistry, WidgetConfigurationModel, authService) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: 'app/widgets/api/components/widget-chooser/widget-config-chooser.html',
      scope: {},
      link: function (scope, elem, attrs, ngModelCtrl) {
        scope.loading = true;
        scope.widgetConfigs = [];
        scope.widgetCategories = [];

        scope.selectConfig = function (config) {
          ngModelCtrl.$setViewValue(config);
        };

        authService.getUser().then(function (user) {
          WidgetConfigurationModel.query().then(function (result) {
            scope.widgetConfigs = _.filter(widgetRegistry.getAll(), function (config) {
              if (angular.isArray(config.categories)) {
                angular.forEach(config.categories, function (value) {
                  if (scope.widgetCategories.indexOf(value) === -1) {
                    scope.widgetCategories.push(value);
                  }
                });
              } else if (scope.widgetCategories.indexOf(config.categories) === -1) {
                scope.widgetCategories.push(config.categories);
              }
              // Add Translation to Object for frontend sorting by name
              config.translation = $filter('translate')(config.name);
              var widgetConfig = _.find(result, {key: config.key});
              return angular.isDefined(widgetConfig) && (!widgetConfig.moderatorsOnly || user.moderatorMode);
            });
          }).finally(function () {
            scope.loading = false;
          });
        });
      },
      controller: 'WidgetConfigChooserController',
      controllerAs: '$ctrl'
    };
  }

  function WidgetConfigChooserController($document) {
    var vm = this;
    vm.filterActive = false;
    vm.filterWidgets = filterWidgets;

    var tabActive = undefined;
    var tabAll = undefined;

    function filterWidgets(value) {
      if (value === '' || value === ' ') {
        vm.filterActive = false;
        tabActive.tab('show');
      } else {
        if (!vm.filterActive) {
          tabActive = angular.element($document[0].querySelector('#tabs-widget-config .active a'));
        }
        vm.filterActive = true;
        tabAll = angular.element($document[0].querySelector('#tab-all-widgets'));
        tabAll.tab('show');
      }
    }
  }
})(angular);
