(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.rte')
      .directive('coyoRteWidget', rteWidget)
      .controller('RteController', RteController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.rte:coyoRteWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to display a Rich Text Editor.
   */
  function rteWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/rte/rte-widget.html',
      scope: {},
      bindToController: {
        widget: '=',
        options: '<',
        editMode: '<'
      },
      controller: 'RteController',
      controllerAs: '$ctrl'
    };
  }

  function RteController($scope, $compile, $element, $timeout) {
    var vm = this;
    vm.height = _.get(vm, 'options.rte.height', 350);

    $scope.$watch('vm.editMode', function (newVal) {
      if (!newVal) {
        $timeout(function () {
          // re-compile coyo-download directives to update file URLs after exit of edit mode
          $element.find('.note-file-link[coyo-download]').replaceWith(function () {
            var elem = angular.element(this); // eslint-disable-line angular/controller-as-vm
            elem.attr('coyo-download', '\'' + elem.attr('coyo-download') + '\'');
            return $compile(elem)($scope);
          });
        });
      }
    });
  }
})(angular);
