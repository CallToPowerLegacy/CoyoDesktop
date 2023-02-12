(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.subscriptions')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          'WIDGET.SUBSCRIPTIONS.DESCRIPTION': 'Displays the current user\'s subscriptions to pages and workspaces.',
          'WIDGET.SUBSCRIPTIONS.NAME': 'Subscriptions',
          'WIDGET.SUBSCRIPTIONS.PAGE': 'My Pages',
          'WIDGET.SUBSCRIPTIONS.WORKSPACE': 'My Workspaces',
          'WIDGET.SUBSCRIPTIONS.EMPTY': 'You are not subscribed to any pages or workspaces.'
        });
        /* eslint-enable quotes */
      });
})(angular);
