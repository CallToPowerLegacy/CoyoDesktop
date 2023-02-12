(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.timeline
   *
   * @description
   * # Timeline module #
   * The timeline module contains components and views for timeline features.
   *
   * @requires $stateProvider
   */
  angular
      .module('coyo.timeline', [
        'coyo.base',
        'coyo.reports',
        'commons.auth',
        'commons.config',
        'commons.ui',
        'commons.i18n',
        'commons.shares',
        'commons.subscriptions',
        'commons.oembed'
      ])
      .config(ModuleConfig)
      .constant('timelineConfig', {
        templates: {
          item: 'app/modules/timeline/views/timeline.item.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, timelineConfig) {
    $stateProvider.state('main.timeline', {
      url: '/timeline'
    }).state('main.timeline.item', {
      url: '/item/:id',
      views: {
        '@main': {
          templateUrl: timelineConfig.templates.item,
          controller: 'TimelineItemController',
          controllerAs: 'ctrl'
        }
      },
      resolve: {
        item: function (TimelineItemModel, $stateParams) {
          return TimelineItemModel.getWithPermissions(
              {id: $stateParams.id}, {}, ['delete', 'manage', 'accessoriginalauthor', 'like', 'share', 'comment']);
        }
      },
      data: {
        pageTitle: 'MODULE.TIMELINE.ITEM.PAGE_TITLE'
      }
    });
  }

})(angular);
