(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.userprofile')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          'WIDGET.USERPROFILE.DESCRIPTION': 'A widget to display a summary of a user\'s profile fields.',
          'WIDGET.USERPROFILE.NAME': 'User Profile',
          'WIDGET.USERPROFILE.SETTINGS.HELP': 'Please select a user to be displayed by the widget.',
          'WIDGET.USERPROFILE.SHOW.INFO': 'Info',
          'WIDGET.USERPROFILE.SHOW.INFO.LABEL': 'Show contact information',
          'WIDGET.USERPROFILE.SHOW.INFO.DESC': 'Display the user\'s contact information.',
          'WIDGET.USERPROFILE.USER': 'User',
          'WIDGET.USERPROFILE.USER.NOTFOUND': 'The previously selected user can not be displayed.'
        });
        /* eslint-enable quotes */
      });
})(angular);
