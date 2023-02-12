(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin.statistics
   *
   * @description
   * # Admin statistics module #
   */
  angular
      .module('coyo.admin.statistics', [
        'commons.config',
        'chart.js'
      ])
      .config(registerStates)
      .config(chartDefaults)
      .constant('statisticsConfig', {
        templates: {
          accounts: 'app/modules/admin/statistics/views/accounts/admin.statistics.accounts.html',
          dailyactiveusers: 'app/modules/admin/statistics/views/dailyactiveusers/admin.statistics.dailyactiveusers.html',
          dailycreatedcontent: 'app/modules/admin/statistics/views/dailycreatedcontent/admin.statistics.createdcontent.html',
          search: 'app/modules/admin/statistics/views/search/admin.statistics.search.html'
        },
        ACCOUNT: {
          dataSets: ['ACTIVE', 'INACTIVE', 'DELETED', 'HIDDEN'],
          showCount: false,
          showFilters: true
        },
        DAILYACTIVEUSERS: {
          dataSets: ['DAILYACTIVEUSERS'],
          showCount: false,
          showFilters: false
        },
        DAILYCREATEDCONTENT: {
          dataSets: ['PAGES', 'WORKSPACES', 'LIKES', 'POSTS', 'COMMENTS', 'BLOGARTICLES', 'WIKIARTICLES', 'FILEUPLOADS',
            'EVENTS'],
          showCount: true,
          showFilters: true
        },
        SEARCH: {
          dataSets: ['TERMS', 'PHRASES'],
          showCount: false,
          showFilters: true,
          singleFilter: true,
          alwaysBar: true
        }
      })
      .constant('chartOptions', {
        line: {
          scales: {
            yAxes: [
              {
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left',
                ticks: {
                  beginAtZero: true,
                  fontColor: '#AAA',
                },
                gridLines: {
                  display: true
                }
              }
            ],
            xAxes: [{
              id: 'x-axis-1',
              type: 'time',
              time: {
                minUnit: 'day',
                displayFormats: {
                  day: 'L',
                  minute: 'LT',
                  hour: 'LT'
                },
                round: 'day',
                tooltipFormat: 'L'
              },
              gridLines: {
                display: false
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10,
                fontColor: '#AAA',
                maxRotation: 0,
                minRotation: 0
              }
            }]
          }
        },
        bar: {
          scales: {
            xAxes: [
              {
                id: 'x-axis-1',
                type: 'linear',
                position: 'top',
                gridLines: {
                  display: false
                },
                ticks: {
                  beginAtZero: true,
                  fontColor: '#AAA',
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  display: false
                },
                type: 'category',
                ticks: {
                  fontColor: '#AAA',
                },
                barThickness: 12,
                barPercentage: 0.6,
                categoryPercentage: 0.6
              }
            ]
          }
        },
        colors: [{
          borderColor: '#9BBF29',
          backgroundColor: '#9BBF29'
        }, {
          borderColor: '#313D4D',
          backgroundColor: '#313D4D'
        }, {
          borderColor: '#DC3912',
          backgroundColor: '#DC3912'
        }, {
          borderColor: '#FF9900',
          backgroundColor: '#FF9900'
        }, {
          borderColor: '#0099C6',
          backgroundColor: '#0099C6'
        }, {
          borderColor: '#990099',
          backgroundColor: '#990099'
        }, {
          borderColor: '#A8626C',
          backgroundColor: '#A8626C'
        }, {
          borderColor: '#AE8363',
          backgroundColor: '#AE8363'
        }, {
          borderColor: '#228829',
          backgroundColor: '#228829'
        }]
      });

  function registerStates($stateProvider, statisticsConfig) {
    $stateProvider.state('admin.statistics', {
      url: '/statistics',
      templateUrl: 'app/modules/admin/statistics/admin.statistics.html',

      resolve: {
        settings: function (SettingsModel) {
          return SettingsModel.retrieve();
        }
      },
      redirect: 'admin.statistics.accounts',
      data: {
        globalPermissions: 'MANAGE_STATISTICS',
        pageTitle: 'ADMIN.STATISTICS'
      }
    }).state('admin.statistics.accounts', {
      url: '/accounts',
      views: {
        '@admin.statistics': {
          templateUrl: statisticsConfig.templates.accounts
        }
      }
    }).state('admin.statistics.dailyactiveusers', {
      url: '/dailyactiveusers',
      views: {
        '@admin.statistics': {
          templateUrl: statisticsConfig.templates.dailyactiveusers
        }
      }
    }).state('admin.statistics.dailycreatedcontent', {
      url: '/dailycreatedcontent',
      views: {
        '@admin.statistics': {
          templateUrl: statisticsConfig.templates.dailycreatedcontent
        }
      }
    }).state('admin.statistics.search', {
      url: '/search',
      views: {
        '@admin.statistics': {
          templateUrl: statisticsConfig.templates.search
        }
      }
    });
  }

  function chartDefaults(ChartJsProvider) {
    ChartJsProvider.$get().Chart.defaults.global.defaultFontFamily = '"Source Sans Pro", sans-serif';
    ChartJsProvider.$get().Chart.defaults.global.defaultFontSize = 15;
  }
})(angular);
