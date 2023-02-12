(function (angular) {
  'use strict';

  angular
      /**
       * @ngdoc overview
       * @name coyo.widgets.poll
       *
       * @description
       * # Poll Widget #
       * Shows a poll with in a widget.
       *
       * Users having access to this widget can answer the poll
       */
      .module('coyo.widgets.poll', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerPollWidget);

  function registerPollWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'poll',
      name: 'WIDGET.POLL.NAME',
      description: 'WIDGET.POLL.DESCRIPTION',
      icon: 'zmdi-chart zmdi-hc-rotate-90',
      categories: 'dynamic',
      directive: 'coyo-poll-widget',
      settings: {
        controller: 'PollWidgetSettingsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/poll/poll-widget-settings.html'
      }
    });
  }

})(angular);
