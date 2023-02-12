(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.welcome')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          'WIDGET.WELCOME.DESCRIPTION': 'This widget displays the user\'s name, avatar and cover image along with a warm welcome.',
          'WIDGET.WELCOME.NAME': 'Welcome',
          'WIDGET.WELCOME.TEXT': 'Welcome!',
          'WIDGET.WELCOME.SETTINGS.SHOW_COVER.LABEL': 'Show Cover Image',
          'WIDGET.WELCOME.SETTINGS.SHOW_COVER.HELP': 'Displays the users\'s cover image in the background.',
          'WIDGET.WELCOME.SETTINGS.TEXT.LABEL': 'Welcome Text',
          'WIDGET.WELCOME.SETTINGS.TEXT.HELP': 'Choose a welcome text to display.'
        });
        /* eslint-enable quotes */
      });
})(angular);
