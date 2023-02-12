(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps.list
   *
   * @description
   * # List app module #
   * The list app module contains the list app objects.
   *
   * @requires coyo.apps.api.appRegistryProvider
   */
  angular
      .module('coyo.apps.list', [
        'coyo.apps.list.fields',
        'coyo.base',
        'coyo.apps.api',
        'commons.config',
        'commons.ui',
        'commons.i18n'
      ])
      .config(registerApp)
      .config(registerTarget)
      .config(configureSearch);

  function registerApp(appRegistryProvider, coyoConfig) {
    appRegistryProvider.register({
      name: 'APP.LIST.NAME',
      description: 'APP.LIST.DESCRIPTION',
      key: 'list',
      icon: 'zmdi-view-list',
      states: [
        {
          abstract: true,
          templateUrl: 'app/apps/list/list-frame.html',
          controller: 'ListFrameController',
          controllerAs: '$ctrl'
        },
        {
          name: 'list',
          url: '',
          default: true,
          templateUrl: 'app/apps/list/list.html',
          controller: 'ListController',
          controllerAs: '$ctrl',
          resolve: {
            fields: /*@ngInject*/ function (ListFieldModel, app) {
              var context = {
                senderId: app.senderId,
                appId: app.id
              };
              return ListFieldModel.get(context);
            }
          }
        }, {
          name: 'list.details',
          url: '/details/:id',
          params: {
            mode: undefined
          },
          resolve: {
            entry: /*@ngInject*/ function (ListEntryModel, $stateParams, app) {
              var context = {
                senderId: app.senderId,
                appId: app.id,
                id: $stateParams.id
              };
              return ListEntryModel.get(context, {
                _permissions: 'edit,comment'
              });
            }
          },
          onEnter: /*@ngInject*/ function ($state, $stateParams, listDetailModalService, app, entry) {
            function leaveState(reason) {
              if (reason !== coyoConfig.rejectReason.transitionStarted) {
                $state.go('^');
              }
            }
            listDetailModalService.open(app, entry, $stateParams.mode).then(leaveState, leaveState);
          }
        },
        {
          name: 'configure',
          url: '/configure',
          views: {
            '@$appRoot': {
              templateUrl: 'app/apps/list/list-configure-fields.html',
              controller: 'ConfigureFieldsController',
              controllerAs: '$ctrl'
            }
          },
          resolve: {
            fields: /*@ngInject*/ function (ListFieldModel, app) {
              var context = {
                senderId: app.senderId,
                appId: app.id
              };
              return ListFieldModel.get(context);
            }
          }
        }
      ],
      settings: {
        templateUrl: 'app/apps/list/list-settings.html',
        controller: 'ListSettingsController',
        controllerAs: '$ctrl'
      }
    });
  }

  function registerTarget(targetServiceProvider) {
    targetServiceProvider.register('list-entry', /*@ngInject*/ function (params, $state, appRegistry) {
      $state.go(appRegistry.getRootStateName(params.appKey, params.senderType) + '.list.details',
          {idOrSlug: params.senderId, appIdOrSlug: params.appId, id: params.id});
    });
  }

  function configureSearch(coyoConfig) {
    angular.extend(coyoConfig.entityTypes, {
      'list-entry': {icon: 'view-list', label: 'ENTITY_TYPE.LIST_ENTRY', plural: 'ENTITY_TYPE.LIST_ENTRIES'}
    });
  }

})(angular);
