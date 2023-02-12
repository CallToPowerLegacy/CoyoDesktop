(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.hashtag')
      .directive('coyoHashtagCloud', hashtagCloud)
      .controller('HashtagCloudController', HashtagCloudController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.hashtag.coyoHashtagCloud:coyoHashtagCloud
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a word cloud.
   *
   * @requires $scope
   * @requires $element
   * @requires $attrs
   * @requires coyo.widgets.hashtag.d3
   *
   * @param {object} words The like target.
   * @param {number} [width] A fixed width for the tag cloud.
   * @param {number} [height] A fixed height for the tag cloud.
   * @param {number} [maxWidth] The maximum width for the tag cloud.
   * @param {number} [maxHeight] The maximum height for the tag cloud.
   * @param {function} [onClick] A callback to be execute when a word is clicked.
   */
  function hashtagCloud() {
    return {
      restrict: 'E',
      template: '<div></div>',
      scope: true,
      bindToController: {
        words: '<',
        width: '<?',
        height: '<?',
        maxWidth: '<?',
        maxHeight: '<?',
        onClick: '<?'
      },
      controller: 'HashtagCloudController',
      controllerAs: '$ctrl'
    };
  }

  function HashtagCloudController($scope, $element, $attrs, d3) {
    var vm = this;

    /* istanbul ignore next */
    var fill = (d3.hasOwnProperty('scale')) ? d3.scale.category20() : d3.scaleOrdinal(d3.schemeCategory20);

    /**
     * layout generator by d3 and use drawListener to generator word cloud.
     */
    var layout = d3.layout.cloud()
        .fontSize(function (d) {
          return d.size;
        })
        .on('end', drawListener);

    // ========================================

    var params = _.pick(vm, ['words', 'width', 'height']);
    $scope.$watch(function () {
      return _.pick(vm, ['words', 'width', 'height']);
    }, paramListener, true);

    if (angular.isUndefined($attrs.width)) {
      widthListener($element.parent().width(), undefined);
      $scope.$watch(function () {
        return $element.parent().width();
      }, _.throttle(widthListener, 500));
    }

    // ========================================

    function drawListener(words) {
      var wordsCloudSVGDiv = d3.select($element[0]);
      var width = layout.size()[0];
      var height = layout.size()[1];
      wordsCloudSVGDiv.select('svg').remove();
      wordsCloudSVGDiv.append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
          .selectAll('text')
          .data(words)
          .enter().append('text')
          .on('click', _onClick)
          .style('font-size', _getFontSize)
          .style('font-family', '"Source Sans Pro", sans-serif')
          .style('font-weight', '800')
          .style('fill', _getFill)
          .attr('text-anchor', 'middle')
          .attr('cursor', _getCursor)
          .attr('transform', _getTransform)
          .text(_getText);
    }

    function paramListener(newVal) {
      var newParams = angular.copy(newVal);
      updateLayout(
          angular.isDefined($attrs.width) ? newParams.width : params.width,
          angular.isDefined($attrs.height) ? newParams.height : params.height,
          newParams.words);
    }

    function widthListener(newVal, oldVal) {
      if (oldVal !== newVal) {
        params.width = newVal;
        params.height = angular.isDefined($attrs.height) ? vm.height : Math.round(newVal / 2);
        updateLayout(params.width, params.height, params.words);
      }
    }

    // ========================================

    function _onClick(data) {
      if (vm.onClick) {
        vm.onClick(data);
      }
    }

    function _getFontSize(data) {
      return data.size + 'px';
    }

    function _getFill(data, index) {
      return data.color || fill(index);
    }

    function _getCursor() {
      return vm.onClick ? 'pointer' : 'auto';
    }

    function _getTransform(data) {
      return 'translate(' + [data.x, data.y] + ')';
    }

    function _getText(data) {
      return data.text;
    }

    function updateLayout(width, height, words) {
      var w = width || 480;
      var h = height || Math.round(w / 2) || 240;
      w = vm.maxWidth ? Math.min(vm.maxWidth, w) : w;
      h = vm.maxHeight ? Math.min(vm.maxHeight, h) : h;

      layout.size([w, h])
          .rotate(0)
          .padding(4)
          .words(words || []);
      layout.start();
    }
  }

})(angular);
