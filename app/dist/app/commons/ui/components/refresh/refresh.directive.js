(function () {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoRefresh', Refresh)
      .controller('RefreshController', RefreshController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoRefresh:coyoRefresh
   * @restrict E
   *
   * @description
   * Directive to refresh (=recompile) it's content whenever the object provided via the watch attribute is changed.
   * This is useful when a larger number of bindings need to be refreshed, but all the data changes at once
   * (e.g. though a backend call). Therefore, all the bindings inside this directive can be one-time bindings
   * that do not create their own watch, replacing them with a single watch expression.
   *
   * @param {string=} watch
   * The expression to be watched for changes. Will be compared on every digest cycle, so instead of complex objects
   * or collections it may be advisable to use the timestamp of the last modification.
   *
   * @param {string=} onRootScopeEvent
   * Event to watch on the $rootScope which triggers a refresh. If the attribute value starts with a single quote
   * character the attribute is evaluated as an expression against the current scope.
   *
   * @param {string=} onScopeEvent
   * Event to watch on the current $scope which triggers a refresh. If the attribute value starts with a single quote
   * character the attribute is evaluated as an expression against the current scope.
   *
   * @requires $scope
   * @requires $transclude
   * @requires $attrs
   * @requires $element
   * @requires $rootScope
   */
  function Refresh() {
    return {
      transclude: true,
      controller: 'RefreshController'
    };
  }

  function RefreshController($scope, $transclude, $attrs, $element, $rootScope, $parse) {
    var childScope;

    function refresh() {
      $element.empty();
      if (childScope) {
        childScope.$destroy();
        childScope = null;
      }
      $transclude(function (clone, newScope) {
        childScope = newScope;
        $element.append(clone);
      });
    }

    function evaluateAttribute(attribute) {
      if (attribute && attribute.length > 0 && attribute.indexOf('\'') === 0) {
        return $parse(attribute)($scope);
      }
      return attribute;
    }

    if (angular.isString($attrs.watch)) {
      $scope.$watch($attrs.watch, refresh);
    } else {
      refresh();
    }

    if (angular.isString($attrs.onRootScopeEvent)) {
      var unsubscribeRootFn = $rootScope.$on(evaluateAttribute($attrs.onRootScopeEvent), refresh);
      $scope.$on('$destroy', unsubscribeRootFn);
    }

    if (angular.isString($attrs.onScopeEvent)) {
      var unsubscribeFn = $scope.$on(evaluateAttribute($attrs.onScopeEvent), refresh);
      $scope.$on('$destroy', unsubscribeFn);
    }
  }

})();
