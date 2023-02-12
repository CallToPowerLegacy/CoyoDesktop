(function () {
  'use strict';

  angular
      .module('coyo.admin.statistics')
      .component('coyoStatisticFilterList', statisticFilterList())
      .controller('StatisticFilterListController', StatisticFilterListController);

  /**
   * @ngdoc directive
   * @name coyo.admin.statistics.coyoStatisticFilterList:coyoStatisticFilterList
   * @element ANY
   * @restrict AE
   * @scope
   *
   * @description
   * Renders an filter list. Calls a Callback after a filter is clicked. Also renders the total count of actual data.
   *
   * @param {array} labels
   * The labels to show as filter
   *
   * @param {array} activeLabels
   * The labels of datasets currently shown in the graph to filter
   *
   * @param {string} statisticName
   * The name of the statistic. Needed for translation.
   *
   * @param {array} colors
   * The colors of the datasets in the graph
   *
   * @param {expression} onClickLabel
   * Callback that is called when a filter is clicked
   *
   * @param {object} data
   * Current graph data. Needed for data count calculation
   *
   */
  function statisticFilterList() {
    return {
      templateUrl: 'app/modules/admin/statistics/components/statistic-filter-list.html',
      bindings: {
        labels: '<',
        activeLabels: '<',
        statisticName: '<',
        colors: '<',
        onClickLabel: '&',
        data: '<'
      },
      controller: 'StatisticFilterListController'
    };
  }

  function StatisticFilterListController($scope, statisticsConfig) {
    var vm = this;
    vm.buttonStyle = _.map(vm.colors, function (color) {
      return {'background-color': color.borderColor};
    });

    vm.$onInit = init;
    vm.clicked = clicked;
    vm.isDisabled = isDisabled;
    vm.calculateCountForSeries = calculateCountForSeries;
    vm.getTotalCurrentData = getTotalCurrentData;

    function init() {
      vm.showCount = statisticsConfig[vm.statisticName].showCount;
      vm.counts = {};
      vm.totalCount = 0;

      var unregisterWatcher = $scope.$watch(function () {
        return vm.data;
      }, calculateCounts, true);

      $scope.$on('$destroy', unregisterWatcher);
    }

    function clicked(label) {
      vm.onClickLabel({label: label});
    }

    function isDisabled(label) {
      return _.indexOf(vm.activeLabels, label) < 0;
    }

    function calculateCounts() {
      _.forEach(vm.activeLabels, function (label) {
        vm.counts[label] = calculateCountForSeries(label);
        vm.totalCount = getTotalCurrentData();
      });
    }

    function calculateCountForSeries(label) {
      var index = _.indexOf(vm.activeLabels, label);
      if (index < 0) {
        return 0;
      } else {
        return vm.data[index] && vm.data[index].length ? _.sum(vm.data[index]) : 0;
      }
    }

    function getTotalCurrentData() {
      return _.reduce(vm.activeLabels, function (sum, x) {
        return sum + calculateCountForSeries(x);
      }, 0);
    }
  }
})();
