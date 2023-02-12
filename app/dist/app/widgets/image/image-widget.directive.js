(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.image')
      .directive('coyoImageWidget', ImageWidget)
      .run(registerWidgetCreateListener);

  /**
   * @ngdoc directive
   * @name coyo.widgets.image:coyoImageWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to display a single image.
   *
   * @param {object} widget
   * The widget configuration
   */
  function ImageWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/image/image-widget.html',
      scope: {},
      bindToController: {
        widget: '<'
      },
      controller: angular.noop,
      controllerAs: '$ctrl'
    };
  }

  function registerWidgetCreateListener($rootScope, imageWidgetSelectionService) {
    $rootScope.$on('widget:created', function (event, model) {
      if (model.key === 'image') {
        imageWidgetSelectionService.selectImage(model);
      }
    });
  }
})(angular);
