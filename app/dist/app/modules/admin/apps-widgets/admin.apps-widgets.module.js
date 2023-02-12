(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.apps-widgets', [
        'coyo.domain',
        'coyo.apps.api',
        'coyo.widgets.api'
      ])
      .config(ModuleConfig)
      .constant('adminAppsWidgetsConfig', {
        templates: {
          home: 'app/modules/admin/apps-widgets/admin.apps-widgets.html',
          appList: 'app/modules/admin/apps-widgets/views/app-list/admin.app-list.html',
          widgetList: 'app/modules/admin/apps-widgets/views/widget-list/admin.widget-list.html'
        }
      });

  /**
   * @ngdoc overview
   * @name coyo.admin.apps-widgets
   *
   * @description
   * This module contains controllers for managing apps and widgets in the admin backend.
   *
   * @requires $stateProvider
   * @requires adminAppsWidgetsConfig
   */
  function ModuleConfig($stateProvider, adminAppsWidgetsConfig) {
    $stateProvider.state('admin.apps-widgets', {
      url: '/apps-widgets',
      templateUrl: adminAppsWidgetsConfig.templates.home,
      redirect: 'admin.apps-widgets.apps',
      data: {
        pageTitle: 'ADMIN.MENU.APPS_WIDGETS',
        globalPermissions: 'MANAGE_APPS_WIDGETS'
      }
    }).state('admin.apps-widgets.apps', {
      url: '/apps',
      resolve: {
        appConfigs: function (AppConfigurationModel) {
          return AppConfigurationModel.query();
        }
      },
      views: {
        '@admin.apps-widgets': {
          templateUrl: adminAppsWidgetsConfig.templates.appList,
          controller: 'AdminAppListController',
          controllerAs: '$ctrl'
        }
      }
    }).state('admin.apps-widgets.widgets', {
      url: '/widgets',
      resolve: {
        widgetConfigs: function (WidgetConfigurationModel) {
          return WidgetConfigurationModel.query();
        }
      },
      views: {
        '@admin.apps-widgets': {
          templateUrl: adminAppsWidgetsConfig.templates.widgetList,
          controller: 'AdminWidgetListController',
          controllerAs: '$ctrl'
        }
      }
    });
  }

})(angular);
