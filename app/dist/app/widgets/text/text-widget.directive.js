(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.text')
      .directive('coyoTextWidget', textWidget);

  function textWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/text/text-widget.html',
      scope: {
        widget: '=',
        editMode: '<'
      }
    };
  }

})(angular);
