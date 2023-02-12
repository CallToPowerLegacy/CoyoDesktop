(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.coyoInfiniteScroll
   * @restrict 'A'
   *
   * @description Applies endless scrolling. Executed once during initialization and then whenever
   *              user scrolls near the end of the element. Execution on initialization can be turned off
   *              by setting coyo-infinite-scroll-no-initial-load. This is "true" by default.
   *
   *              Scroll on div:            <div coyo-infinite-scroll="loadMore()">...</div>
   *              Scroll on other element:  <div coyo-infinite-scroll="loadMore()" coyo-infinite-scroll-element=".selector">...</div>
   *              Scroll on window:         <div coyo-infinite-scroll="loadMore()" coyo-infinite-scroll-element="$window">...</div>
   *
   *              This directive only takes care of the scrolling event. Loading more data and stopping when the
   *              last page was reached is up to you.
   */
  angular.module('commons.ui')
      .directive('coyoInfiniteScroll', CoyoInfiniteScroll);

  function CoyoInfiniteScroll($timeout, $log) {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        var initialLoad = angular.isUndefined(attrs.coyoInfiniteScrollNoInitialLoad);

        // load first page if not turned off (inside correct digest)
        if (initialLoad) {
          $timeout(function () {
            $log.debug('[coyoInfiniteScroll] Performing initial load.');
            $scope.$apply(attrs.coyoInfiniteScroll);
          });
        }

        // pixels before end, default=200
        var threshold = 200;
        if (attrs.coyoInfiniteScrollThreshold) {
          threshold = parseInt(attrs.coyoInfiniteScrollThreshold);
        }

        var bindTo, raw;
        bindToScrollElement(attrs.coyoInfiniteScrollElement);
        // watch for changed in element to scroll
        attrs.$observe('coyoInfiniteScrollElement', bindToScrollElement);

        // determine element to watch for scroll event
        function bindToScrollElement(coyoInfiniteScrollElement) {
          if (bindTo) {
            bindTo.unbind('scroll', scrollHandler);
          }

          if (coyoInfiniteScrollElement === '$window') {
            bindTo = angular.element(window);
            raw = angular.element('body')[0];
          } else if (coyoInfiniteScrollElement) {
            bindTo = angular.element(coyoInfiniteScrollElement);
            raw = bindTo[0];
          } else {
            bindTo = element;
            raw = bindTo[0];
          }
          bindTo.bind('scroll', scrollHandler);
        }

        // watch for scroll events => every 100ms
        var blocked = false;

        function scrollHandler() {
          if (!blocked) {
            blocked = true;

            $timeout(function () {
              if ((raw.scrollTop + raw.offsetHeight + threshold) >= raw.scrollHeight) {
                $scope.$apply(attrs.coyoInfiniteScroll);
              }

              blocked = false;
            }, 100);
          }
        }

        $scope.$on('$destroy', function () {
          bindTo.unbind('scroll', scrollHandler);
        });
      }
    };
  }
})();
