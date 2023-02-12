(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.target
   *
   * @description
   * # Target module #
   * The target module solves target URLs and redirects the user to the given target.
   *
   * @requires $stateProvider
   */
  angular
      .module('commons.target', [
        'coyo.base'
      ])
      .config(targetsConfig)
      .config(stateConfig)
      .constant('targetConfig', {
        targetPrefix: '/target',
        templates: {
          main: 'app/commons/target/views/target.html'
        }
      });

  /**
   * Registers the different targets.
   *
   * @param {object} targetServiceProvider
   */
  function targetsConfig(targetServiceProvider) {
    targetServiceProvider.register('user', /*@ngInject*/ function (params, $state) {
      return $state.go('main.profile', {userId: params.slug});
    });

    targetServiceProvider.register('page', /*@ngInject*/ function (params, $state) {
      return $state.go('main.page.show', {idOrSlug: params.id});
    });

    targetServiceProvider.register('app', /*@ngInject*/ function (params, appService) {
      return appService.redirectToApp({
        id: params.senderId,
        slug: params.senderSlug,
        typeName: params.senderType
      }, {
        id: params.id,
        key: params.key
      });
    });

    targetServiceProvider.register('timeline_item', /*@ngInject*/ function (params, $state) {
      return $state.go('main.timeline.item', params);
    });

    targetServiceProvider.register('message-channel', /*@ngInject*/ function (params, messagingService) {
      return messagingService.open(params.id);
    });

    targetServiceProvider.register('email_activation', /*@ngInject*/ function (params, $state) {
      return $state.go('main.account-email-activation', params);
    });

    targetServiceProvider.register('landing-page', /*@ngInject*/ function (params, $state) {
      return $state.go('main.landing-page.show', {idOrSlug: params.slug});
    });

    targetServiceProvider.register('file', /*@ngInject*/ function (params, fileDetailsModalService) {
      return fileDetailsModalService.open(params.senderId, params.id, true);
    });
  }

  /**
   * State configuration.
   *
   * @param {object} $stateProvider
   * @param {object} targetConfig
   */
  function stateConfig($stateProvider, targetConfig) {
    $stateProvider.state('main.target', {
      url: targetConfig.targetPrefix + '/:targetID',
      templateUrl: targetConfig.templates.main,
      controller: 'TargetController',
      controllerAs: 'vm'
    });
  }

})(angular);
