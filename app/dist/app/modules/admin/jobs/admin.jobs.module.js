(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.jobs', [
        'coyo.base',
        'coyo.domain'
      ])
      .constant('adminJobsConfig', {
        templates: {
          list: 'app/modules/admin/jobs/views/jobs-list/admin.jobs-list.html',
          details: 'app/modules/admin/jobs/views/jobs-details/admin.jobs-details.html'
        },
        detailsNumJobStatuses: 10
      })
      .config(ModuleConfig);

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, adminJobsConfig) {
    $stateProvider.state('admin.jobs', {
      abstract: true,
      url: '/jobs',
      template: '<ui-view></ui-view>',
      data: {
        globalPermissions: 'MANAGE_JOBS',
        pageTitle: 'ADMIN.MENU.JOBS'
      }
    }).state('admin.jobs.list', {
      url: '',
      views: {
        '@admin.jobs': {
          templateUrl: adminJobsConfig.templates.list,
          controller: 'AdminJobsListController',
          controllerAs: '$ctrl'
        }
      }
    }).state('admin.jobs.details', {
      url: '/details/{name}',
      params: {
        returnState: null,
        returnStateOpts: null
      },
      views: {
        '@admin.jobs': {
          templateUrl: adminJobsConfig.templates.details,
          controller: 'AdminJobsDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        job: function (JobModel, $stateParams, Pageable) {
          var queryParams = new Pageable(0, adminJobsConfig.detailsNumJobStatuses).getParams();
          return JobModel.get({name: $stateParams.name}, queryParams);
        }
      }
    });
  }
})(angular);
