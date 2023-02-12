(function () {
  'use strict';

  angular
      .module('coyo.admin.statistics')
      .component('coyoAdminStatisticGraph', adminStatisticGraph())
      .controller('AdminStatisticGraphController', AdminStatisticGraphController);

  /**
   * @ngdoc directive
   * @name coyo.admin.statistics.coyoAdminStatisticGraph:coyoAdminStatisticGraph
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Draws a graph.
   * Requests the backend (StatisticsModel) on init and draws a line chart on large screens or a bar chart on xs devices.
   * Also creates a list of filters based on the possible datasets configured in chartOptions
   *
   * @param {string} statisticName
   * The name of the statistic to show
   *
   * @requires chartOptions
   * @requires StatisticsModel
   * @requires moment
   * @requires $rootScope
   * @requires $scope
   * @requires statisticsConfig
   * @requires $filter
   *
   */
  function adminStatisticGraph() {
    return {
      templateUrl: 'app/modules/admin/statistics/components/statistic-graph.html',
      bindings: {
        statisticName: '<'
      },
      controller: 'AdminStatisticGraphController'
    };
  }

  function AdminStatisticGraphController(chartOptions, StatisticsModel, moment, $rootScope, $scope, statisticsConfig,
                                         statisticService, $translate, dateRangePickerModalService) {
    var vm = this;
    var fontFamily = '"Source Sans Pro", sans-serif';

    vm.series = [];
    vm.data = [];
    vm.loading = false;
    vm.colors = chartOptions.colors;
    vm.dateRange = statisticService.getDateRange();

    vm.options = {
      responsive: true,
      maintainAspectRatio: false,
      hover: {
        animationDuration: 1
      },
      layout: {
        padding: {
          left: 0,
          right: 20,
          top: 20,
          bottom: 20
        }
      },
      tooltips: {
        bodyFontFamily: fontFamily,
        bodyFontSize: 14,
        bodySpacing: 5,
        xPadding: 10,
        yPadding: 10,
        callbacks: {
          label: _getLabelText,
          title: _getTitleText
        }
      }
    };

    vm.$onInit = init;
    vm.onClickFilter = onClickFilter;
    vm.hasData = hasData;
    vm.openDateRangePicker = openDateRangePicker;
    vm.handleFocus = handleFocus;

    function init() {
      vm.showFilters = statisticsConfig[vm.statisticName].showFilters;
      vm.data = [];

      var _unregister = $rootScope.$on('screenSize:changed', _setType);
      $scope.$on('$destroy', _unregister);

      vm.allSeries = statisticsConfig[vm.statisticName].dataSets;
      vm.series = vm.allSeries;

      vm.singleFilter = statisticsConfig[vm.statisticName].singleFilter;
      vm.alwaysBar = statisticsConfig[vm.statisticName].alwaysBar;

      _setType();
      _refreshData();
    }

    function onClickFilter(label) {
      if (!vm.loading) {
        var index = _.indexOf(vm.series, label);
        if (index > -1) {
          _.remove(vm.series, function (serie) {
            return serie === label;
          });
          vm.data.splice(index, 1);
          _setDatasetOverride();
        } else {
          _loadData(label);
        }
      }
    }

    function hasData() {
      return vm.data.length && !_.every(vm.data, function (element) {
        return _.isEmpty(element);
      });
    }

    function openDateRangePicker() {
      dateRangePickerModalService.open(vm.dateRange).then(function (dateRange) {
        vm.dateRange = dateRange;
        statisticService.setDateRange(dateRange);
        _refreshData();
      });
    }

    /**
     * Immediately removes focus from the input box so the user can only change the date by the provided date range
     * picker and not by manually entering data.
     *
     * @param {object} event the triggered focus event.
     */
    function handleFocus(event) {
      event.target.blur();
    }

    function _getLabelText(tooltipItem) {
      /* there is no padding option between the tooltip color and the label, so use spaces as preceding delimiter */
      var label = '  ' + $translate.instant(
          'ADMIN.STATISTICS.' + vm.statisticName + '.' + vm.series[tooltipItem.datasetIndex]);
      return (_isBarChart()) ? label : label + '  ' + tooltipItem.yLabel;
    }

    function _getTitleText(tooltipItem) {
      if (vm.statistic.labelType === 'DATE') {
        return (_isBarChart()) ? tooltipItem[0].yLabel : tooltipItem[0].xLabel;
      } else {
        return [vm.labels[tooltipItem[0].index]];
      }
    }

    function _loadData(label) {
      var index = _.indexOf(vm.allSeries, label);
      if (index < 0) {
        return;
      }

      var params = {
        from: vm.dateRange[0].format('YYYY-MM-DD') + 'T00:00:00',
        to: vm.dateRange[1].format('YYYY-MM-DD') + 'T23:59:59',
        dataSets: [label]
      };

      StatisticsModel.get({statisticName: vm.statisticName}, params).then(function (result) {
        if (vm.singleFilter) {
          vm.series = [];
          vm.data = [];
        }
        vm.series.push(label);
        vm.data.push(_.map(result.dataSets[0].dataPoints, _mapDataPoint));
        vm.labels = result.dataSets[0].labels;
        _setDatasetOverride();
        _setType();
      });
    }

    function _refreshData() {
      if (!vm.loading && vm.series.length) {
        vm.loading = true;
        vm.data = [];

        var params = {
          statisticName: vm.statisticName,
          from: vm.dateRange[0].format('YYYY-MM-DD') + 'T00:00:00',
          to: vm.dateRange[1].format('YYYY-MM-DD') + 'T23:59:59',
          dataSets: vm.singleFilter ? vm.series[0] : vm.series
        };

        StatisticsModel.get({statisticName: vm.statisticName}, params).then(function (result) {
          vm.statistic = result;

          vm.labels = vm.statistic.dataSets[0].labels;

          vm.series = _.map(vm.statistic.dataSets, function (elem) {
            return elem.name;
          });

          vm.data = _.map(vm.statistic.dataSets, function (elem) {
            return _.map(elem.dataPoints, _mapDataPoint);
          });

          _setDatasetOverride();
          _setType();
        }).finally(function () {
          vm.loading = false;
        });
      } else if (!vm.loading) {
        vm.data = [];
        vm.series = [];
      }
    }

    function _mapDataPoint(point) {
      return point.y;
    }

    function _setType() {
      if (_isBarChart()) {
        vm.type = 'horizontalBar';
        vm.options = angular.extend(vm.options, {
          animation: {
            duration: 1,
            onComplete: _drawValues
          }
        }, {
          scales: chartOptions.bar.scales
        });
        vm.options.scales.yAxes[0].ticks.callback = _barChartTickCallback;
        vm.style = {position: 'relative', height: _calculateHeight()};
      } else {
        vm.type = 'line';
        vm.options = angular.extend(vm.options, {
          animation: {
            onComplete: angular.noop
          }
        }, {
          scales: chartOptions.line.scales
        });
        vm.style = {position: 'relative', height: '500px'};
      }
    }

    function _drawValues() {
      // eslint-disable-next-line angular/controller-as-vm
      var chartInstance = this.chart,
          ctx = chartInstance.ctx;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 14px ' + fontFamily;
      // eslint-disable-next-line angular/controller-as-vm
      this.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        meta.data.forEach(function (bar, index) {
          var data = dataset.data[index];
          ctx.fillText(data, bar._model.x + 10, bar._model.y + bar._model.height / 2 + 2);
        });
      });
    }

    function _setDatasetOverride() {
      vm.datasetOverride = [];
      _.forEach(vm.series, function (elem) {
        var index = _.indexOf(vm.allSeries, elem);
        if (index < 0) {
          return;
        }
        vm.datasetOverride.push({
          borderColor: vm.colors[index].borderColor,
          borderWidth: 3,
          backgroundColor: vm.colors[index].backgroundColor,
          fill: false,
          pointBackgroundColor: '#FFFFFF',
          pointRadius: vm.data && vm.data[0].length < 40 ? 5 : 0,
          pointHitRadius: 10,
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: vm.colors[index].backgroundColor
        });
      });
    }

    function _calculateHeight() {
      if (!vm.data || vm.data.length === 0) {
        return '400px';
      } else {
        var height = _.reduce(vm.data, function (sum, n) {
          return sum + (n.length * (18 / 0.6));
        }, 60);
        return height + 'px';
      }
    }

    function _barChartTickCallback(value) {
      if (vm.statistic.labelType === 'DATE') {
        if ($translate.use() === 'de') {
          return moment(value).format('DD.MM.');
        } else {
          return moment(value).format('DD/MM');
        }
      } else if (vm.statistic.labelType === 'STRING') {
        if (value.length > 20) {
          value = value.substr(0, 20) + '...';
        }
        return value;
      } else {
        return value;
      }
    }

    function _isBarChart() {
      return $rootScope.screenSize.isXs || vm.alwaysBar;
    }

  }
})();
