(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.button')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          'WIDGET.BUTTON.DESCRIPTION': 'Displays a single Button which redirects to an url with the styling of your choice.',
          'WIDGET.BUTTON.NAME': 'Link Button',
          'WIDGET.BUTTON.PLACEHOLDER': 'Button Title',
          "WIDGET.BUTTON.SETTINGS.LINK_TARGET": "Open in new window?",
          "WIDGET.BUTTON.SETTINGS.LINK_TARGET.HELP": "Choose to open the link in a new browser tab.",
          'WIDGET.BUTTON.SETTINGS.PREVIEW': 'Preview',
          'WIDGET.BUTTON.SETTINGS.STYLE': 'Style',
          'WIDGET.BUTTON.SETTINGS.STYLE.HELP': 'Select a button style.',
          'WIDGET.BUTTON.SETTINGS.TEXT': 'Title',
          'WIDGET.BUTTON.SETTINGS.TEXT.HELP': 'Enter the button title.',
          'WIDGET.BUTTON.SETTINGS.URL': 'URL',
          'WIDGET.BUTTON.SETTINGS.URL.HELP': 'Enter a valid link target URL.',
          'WIDGET.BUTTON.SETTINGS.URL.PLACEHOLDER': 'https://',
          'WIDGET.BUTTON.STYLE.DANGER': 'Danger',
          'WIDGET.BUTTON.STYLE.DEFAULT': 'Default',
          'WIDGET.BUTTON.STYLE.INFO': 'Info',
          'WIDGET.BUTTON.STYLE.PRIMARY': 'Primary',
          'WIDGET.BUTTON.STYLE.SUCCESS': 'Success',
          'WIDGET.BUTTON.STYLE.WARNING': 'Warning'
        });
        /* eslint-enable quotes */
      });
})(angular);
