(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.code')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.CODE.DESCRIPTION": "Allows users to create interactive content with HTML, JavaScript and CSS",
          "WIDGET.CODE.SETTINGS.INVALID": "Please refresh the site to see your initial settings.",
          "WIDGET.CODE.NAME": "Code",
          "WIDGET.CODE.SETTINGS.HTML.TEXT": "HTML",
          "WIDGET.CODE.SETTINGS.HTML.HELP": "Enter the HTML code to be rendered here",
          "WIDGET.CODE.SETTINGS.JS.TEXT": "JavaScript",
          "WIDGET.CODE.SETTINGS.JS.HELP": "Enter the JavaScript code to be executed here",
          "WIDGET.CODE.SETTINGS.CSS.TEXT": "CSS",
          "WIDGET.CODE.SETTINGS.CSS.HELP": "Enter the CSS stylings to provide styling definitions here",
          "WIDGET.CODE.TITLE": "Code",
          "WIDGET.CODE.WARNING": "Attention: All code is allowed in here. No code will be stripped or escaped. Please think twice whether you need to insert code via this widget. Consider an alternative if possible."
        });
        /* eslint-enable quotes */
      });
})(angular);
