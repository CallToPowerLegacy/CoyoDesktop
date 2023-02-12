(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.code')
      .directive('coyoCodeWidget', coyoCodeWidget)
      .controller('CodeWidgetController', CodeWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.code:coyoCodeWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the code widget.
   */
  function coyoCodeWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/code/code-widget.html',
      scope: {},
      bindToController: {
        widget: '<',
        editMode: '<'
      },
      controller: 'CodeWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function CodeWidgetController($scope, $sce) {
    var vm = this;

    vm.$onInit = onInit;

    function _removeJs() {
      angular.element('#' + vm.widget.id + '-js').remove();
    }

    function _removeCss() {
      angular.element('#' + vm.widget.id + '-css').remove();
    }

    function _initJs() {
      _removeJs();
      angular.element('head').append('<script id="' + vm.widget.id + '-js" type="application/javascript">' + vm.widget.settings._js_content + '</script>');
    }

    function _initCss() {
      _removeCss();
      angular.element('head').append('<style id="' + vm.widget.id + '-css" type="text/css">' + vm.widget.settings._css_content + '</style>');
    }

    function _initHtml() {
      vm.html = $sce.trustAsHtml(vm.widget.settings._html_content);
      vm.refresh = true;
    }

    function onInit() {
      vm.valid = !_.isUndefined(vm.widget.id);
      if (vm.valid) {
        _initJs();
        _initCss();
        _initHtml();

        var widgetSettings = angular.copy(vm.widget.settings);

        $scope.$watch(function () {
          return vm.editMode;
        }, function (newVal) {
          if (!newVal) {
            var cssChanged = widgetSettings._css_content !== vm.widget.settings._css_content;
            var htmlChanged = widgetSettings._html_content !== vm.widget.settings._html_content;
            var jsChanged = widgetSettings._js_content !== vm.widget.settings._js_content;
            if (jsChanged) {
              _initJs();
            }
            if (cssChanged) {
              _initCss();
            }
            if (htmlChanged) {
              _initHtml();
            }
            if (cssChanged || htmlChanged || jsChanged) {
              widgetSettings = angular.copy(vm.widget.settings);
            }
          }
        });

        $scope.$on('$destroy', function () {
          _removeJs();
          _removeCss();
        });
      }
    }
  }
})(angular);
