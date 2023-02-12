(function (angular, Config) {
  'use strict';

  angular
      .module('commons.config')
      .constant('coyoConfig', (function () {
        var entityTypes = {
          'default': {icon: 'circle-o', color: '#999', label: '-', plural: '-'},
          'workspace': {icon: 'apps', color: '#FFA800', label: 'ENTITY_TYPE.WORKSPACE', plural: 'ENTITY_TYPE.WORKSPACES'},
          'page': {icon: 'layers', color: '#C16AA5', label: 'ENTITY_TYPE.PAGE', plural: 'ENTITY_TYPE.PAGES'},
          'user': {icon: 'account', color: '#444', label: 'ENTITY_TYPE.USER', plural: 'ENTITY_TYPE.USERS'},
          'file': {icon: 'file', color: '#43b19e', label: 'ENTITY_TYPE.FILE', plural: 'ENTITY_TYPE.FILES'},
          'timeline-item': {icon: 'comment-text', color: '#e02a6f', label: 'ENTITY_TYPE.TIMELINE_ITEM', plural: 'ENTITY_TYPE.TIMELINE_ITEMS'},
          'timeline-share': {label: 'ENTITY_TYPE.TIMELINE_SHARE'},
          'app': {icon: 'puzzle-piece', label: 'ENTITY_TYPE.APP', color: '#317DC1'},
          'event': {icon: 'calendar', label: 'ENTITY_TYPE.EVENT', plural: 'ENTITY_TYPE.EVENTS', color: '#990066'},
          'message': {icon: 'comments', label: 'ENTITY_TYPE.MESSAGE', color: '#1ec3cd'},
          'message-channel': {icon: 'comments', label: 'ENTITY_TYPE.MESSAGE_CHANNEL', color: '#1ec3cd'},
          'comment': {label: 'ENTITY_TYPE.COMMENT'},
          'email-activation': {label: 'ENTITY_TYPE.EMAIL_ACTIVATION'},
          'file-library': {label: 'ENTITY_TYPE.FILE_LIBRARY'},
          'landing-page': {label: 'ENTITY_TYPE.LANDING_PAGE', plural: 'ENTITY_TYPE.LANDING_PAGES', icon: 'globe', color: '#317DC1'},
          'language': {label: 'ENTITY_TYPE.LANGUAGE'},
          'like': {label: 'ENTITY_TYPE.LIKE'},
          'role': {label: 'ENTITY_TYPE.ROLE'},
          'subscription': {label: 'ENTITY_TYPE.SUBSCRIPTION'},
          'user-push-device': {label: 'ENTITY_TYPE.USER_PUSH_DEVICE'},
          'widget': {label: 'ENTITY_TYPE.WIDGET'}
        };

        return {
          backendUrl: Config.backendUrl,
          backendUrlStrategy: Config.backendUrlStrategy,
          applicationName: Config.applicationName,
          version: {
            major: 5,
            minor: 0,
            patch: 4,
            qualifier: 'BETA'
          },
          debug: Config.debug !== false,
          autoRefreshTokens: true,
          cookies: {
            user: 'coyoUser'
          },
          entityTypes: entityTypes,
          notificationTypeIcons: {
            'blog-article': {icon: 'collection-text', color: '#000'},
            'default': {icon: 'notifications', color: '#000'},
            'file': {icon: 'file', color: '#000'},
            'report': {icon: 'alert-circle', color: '#000'},
            'user-follow': {icon: 'account-add', color: '#000'},
            'wiki-article': {icon: 'library', color: '#000'},
            'forum-thread': {icon: 'help', color: '#000'},
            'workspace-approved': {icon: 'check', color: '#000'},
            'workspace-invited': {icon: 'account-add', color: '#000'},
            'workspace-joined': {icon: 'plus-circle-o', color: '#000'},
            'workspace-rejected': {icon: 'close-circle-o', color: '#000'},
            'workspace-removed': {icon: 'close-circle-o', color: '#000'},
            'workspace-requested': {icon: 'hourglass-alt', color: '#000'},
            'event-invited': {icon: 'account-add', color: '#000'},
            'event-attending': {icon: 'plus-circle-o', color: '#000'},
            'event-maybe-attending': {icon: 'help-outline', color: '#000'},
            'list-entry': {icon: 'view-list', color: '#000'},
            'task': {icon: 'assignment-check', color: '#000'}
          },
          fileLibrary: {
            senderTypes: [
              angular.extend({
                permission: 'ACCESS_LANDING_PAGES',
                query: /*@ngInject*/ function (LandingPageModel, Pageable, page, pageSize) {
                  var pageable = new Pageable(page, pageSize, 'name');
                  return LandingPageModel
                      .pagedQueryWithPermissions(pageable, {}, {}, ['createFile']);
                }
              }, entityTypes['landing-page']),
              angular.extend({
                permission: 'ACCESS_PAGES',
                query: /*@ngInject*/ function (PageModel, Pageable, page, pageSize) {
                  var pageable = new Pageable(page, pageSize, 'displayName.sort');
                  return PageModel.pagedQueryWithPermissions(pageable, {}, {}, ['createFile']);
                }
              }, entityTypes.page),
              angular.extend({
                permission: 'ACCESS_WORKSPACES',
                query: /*@ngInject*/ function (WorkspaceModel, Pageable, page, pageSize) {
                  var pageable = new Pageable(page, pageSize, 'displayName.sort');
                  return WorkspaceModel.pagedQueryWithPermissions(pageable, {}, {}, ['createFile']);
                }
              }, entityTypes.workspace)
            ]
          },
          rejectReason: {
            transitionStarted: 'state-transition-started'
          },
          i18n: {
            path: '/assets/messages/',
            suffix: '.json'
          },
          pushDevices: {
            types: {
              smartphone: 'SMARTPHONE',
              tablet: 'TABLET'
            }
          }
        };
      })());

})(angular, Config);
