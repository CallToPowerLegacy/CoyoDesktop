(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.hashtag')
      .directive('coyoHashtagWidget', coyoHashtagWidget)
      .controller('HashtagWidgetController', HashtagWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.hashtag:coyoHashtagWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to display a hashtag cloud.
   *
   * @param {object} widget
   * The widget configuration
   */
  function coyoHashtagWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/hashtag/hashtag-widget.html',
      scope: {},
      bindToController: {
        widget: '<'
      },
      controller: 'HashtagWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function HashtagWidgetController($http, $state, coyoEndpoints) {
    var vm = this;

    var MIN_FONT_SIZE = 12;
    var MAX_FONT_SIZE = 24;
    var MIN_OPACITY = 0.25;
    var MAX_OPACITY = 1;

    vm.onClick = onClick;

    // ========================================

    function onClick(data) {
      $state.go('main.search', {term: data.tag});
    }

    // ========================================

    function _weight(count, minCount, maxCount, length, minTarget, maxTarget) {
      var norm = (count - minCount) / (maxCount - minCount);
      return (norm || 1 / length) * (maxTarget - minTarget) + minTarget;
    }

    (function _init() {
      vm.loading = true;
      $http.get(coyoEndpoints.hashtags.trending, {
        params: {
          period: vm.widget.settings.period,
          limit: 20
        }
      }).then(function (response) {
        var counts = _.values(response.data);
        var minCount = _.min(counts) || 0;
        var maxCount = _.max(counts) || 1;
        vm.hashtags = _.chain(response.data).map(function (count, tag) {
          return {
            tag: tag,
            text: _.truncate(tag, {'length': 16}),
            count: count,
            size: _weight(count, minCount, maxCount, counts.length, MIN_FONT_SIZE, MAX_FONT_SIZE),
            color: 'rgba(55,69,85,' + _weight(count, minCount, maxCount, counts.length, MIN_OPACITY, MAX_OPACITY) + ')'
          };
        }).orderBy(['count', 'tag'], ['desc', 'asc']).value();
      }).finally(function () {
        vm.loading = false;
      });
    })();
  }

})(angular);
