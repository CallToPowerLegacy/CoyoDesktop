(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.events
   *
   * @description
   * Events module
   *
   * @requires $stateProvider
   * @requires main.event.eventsConfig
   */
  angular
      .module('coyo.events', [
        'coyo.base',
        'commons.resource',
        'commons.target'
      ])
      .config(ModuleConfig)
      .config(registerTarget)
      .constant('eventsConfig', {
        templates: {
          list: 'app/modules/events/views/events.list.html',
          create: 'app/modules/events/views/events.create.html',
          settings: 'app/modules/events/views/events.settings.html',
          event: {
            show: 'app/modules/events/views/events.show.html',
            timeline: 'app/modules/events/views/events.show.timeline.html',
            information: 'app/modules/events/views/events.show.information.html',
            participants: 'app/modules/events/views/events.show.participants.html'
          }
        },
        list: {
          paging: {
            pageSize: 20
          }
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, eventsConfig) {
    $stateProvider.state('main.event', {
      url: '/events?:term&:from&:to',
      templateUrl: eventsConfig.templates.list,
      controller: 'EventsListController',
      controllerAs: '$ctrl',
      data: {
        globalPermissions: 'ACCESS_EVENTS',
        pageTitle: 'MODULE.EVENTS.PAGE_TITLE'
      },
      resolve: {
        currentUser: function (authService) {
          return authService.getUser();
        }
      }
    }).state('main.event.create', {
      url: '/create?:host',
      views: {
        '@main': {
          templateUrl: eventsConfig.templates.create,
          controller: 'EventsCreateController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        host: function ($q, $stateParams, SenderModel, currentUser) {
          if ($stateParams.host) {
            return SenderModel.getWithPermissions($stateParams.host, {}, ['manage']).then(function (sender) {
              return sender._permissions.manage ? sender : null;
            }).catch(function () {
              return null;
            });
          }
          return $q.resolve(currentUser);
        }
      }
    }).state('main.event.show', {
      url: '/{idOrSlug}',
      redirect: 'main.event.show.timeline',
      views: {
        '@main': {
          templateUrl: eventsConfig.templates.event.show,
          controller: 'EventsShowController',
          controllerAs: '$ctrl'
        }
      },
      data: {
        senderParam: 'idOrSlug',
        pageTitle: false
      },
      resolve: {
        event: function ($stateParams, EventModel) {
          return EventModel.getWithPermissions({id: $stateParams.idOrSlug}, {}, ['manage', 'canParticipate']);
        },
        senderId: function (event) {
          return event.id;
        }
      },
      onEnter: function (event, titleService) {
        titleService.set(event.displayName, false);
      }
    }).state('main.event.show.settings', {
      url: '/settings',
      views: {
        '@main': {
          templateUrl: eventsConfig.templates.settings,
          controller: 'EventsSettingsController',
          controllerAs: '$ctrl'
        }
      }
    }).state('main.event.show.timeline', {
      url: '/timeline',
      views: {
        '@main.event.show': {
          templateUrl: eventsConfig.templates.event.timeline
        }
      }
    }).state('main.event.show.information', {
      url: '/information',
      views: {
        '@main.event.show': {
          templateUrl: eventsConfig.templates.event.information
        }
      }
    }).state('main.event.show.participants', {
      url: '/participants',
      views: {
        '@main.event.show': {
          templateUrl: eventsConfig.templates.event.participants
        }
      }
    });
  }

  function registerTarget(targetServiceProvider) {
    /* register event links for activity notifications */
    targetServiceProvider.register('event', /*@ngInject*/ function (params, $state) {
      $state.go('main.event.show', {idOrSlug: params.slug || params.id}, {reload: true});
    });
    targetServiceProvider.register('event_overview', /*@ngInject*/ function (params, $state) {
      $state.go('main.event');
    });
  }

})(angular);
