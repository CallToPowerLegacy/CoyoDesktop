(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "APP.LIST.FIELDS.ERROR.REQUIRED": "This field is required",
          "APP.LIST.FIELDS.DATE.TITLE": "Date",
          "APP.LIST.FIELDS.DATE.DESCRIPTION": "Use this field to add a date to your list.",
          "APP.LIST.FIELDS.TEXT.TITLE": "Text",
          "APP.LIST.FIELDS.TEXT.DESCRIPTION": "A standard text field with one or multiple lines with a configurable minimum and maximum length.",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MULTILINE": "Multiline",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MULTILINE.LABEL": "This text field has multiple lines",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MULTILINE.HELP": "Enable this option to display a text field with multiple lines.",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MINLENGTH": "Minimum length",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MINLENGTH.HELP": "The minimum length of characters a user can type in.",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MAXLENGTH": "Maximum length",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MAXLENGTH.HELP": "The maximum length of characters a user can type in.",
          "APP.LIST.FIELDS.TEXT.ERROR.MINLENGTH": "Must have at least {minlength} characters.",
          "APP.LIST.FIELDS.TEXT.ERROR.MAXLENGTH": "Must not have more than {maxlength} characters.",
          "APP.LIST.FIELDS.CHECKBOX.TITLE": "Checkbox",
          "APP.LIST.FIELDS.CHECKBOX.DESCRIPTION": "A checkbox can be toggled between the states active and inactive.",
          "APP.LIST.FIELDS.CHECKBOX.SETTINGS.PRESELECT": "Default",
          "APP.LIST.FIELDS.CHECKBOX.SETTINGS.PRESELECT.LABEL": "This checkbox is preselected",
          "APP.LIST.FIELDS.CHECKBOX.SETTINGS.PRESELECT.HELP": "This setting decides whether the checkbox is selected by default or not.",
          "APP.LIST.FIELDS.FILE.TITLE": "File",
          "APP.LIST.FIELDS.FILE.DELETED": "deleted",
          "APP.LIST.FIELDS.FILE.DESCRIPTION": "Upload one or multiple files and attach them to a list entry.",
          "APP.LIST.FIELDS.FILE.SETTINGS.MULTI": "Multi upload",
          "APP.LIST.FIELDS.FILE.SETTINGS.MULTI.LABEL": "Multiple files can be uploaded",
          "APP.LIST.FIELDS.FILE.SETTINGS.MULTI.HELP": "This setting decides whether multiple files can be uploaded.",
          "APP.LIST.FIELDS.USER.TITLE": "User",
          "APP.LIST.FIELDS.USER.DESCRIPTION": "You can define whether the user is able to select one or multiple users.",
          "APP.LIST.FIELDS.USER.SETTINGS.MULTI": "Multi select",
          "APP.LIST.FIELDS.USER.SETTINGS.MULTI.LABEL": "Multiple users can be selected",
          "APP.LIST.FIELDS.USER.SETTINGS.MULTI.HELP": "This setting decides whether multiple users can be selected.",
          "APP.LIST.FIELDS.USER.ERROR.SINGLE": "Only one user should be selected.",
          "APP.LIST.FIELDS.OPTIONS.TITLE": "Options",
          "APP.LIST.FIELDS.OPTIONS.DESCRIPTION": "You can decide whether only one option or multiple options are selectable.",
          "APP.LIST.FIELDS.OPTIONS.SETTINGS.MULTI": "Multi select",
          "APP.LIST.FIELDS.OPTIONS.SETTINGS.MULTI.LABEL": "Multiple options can be selected",
          "APP.LIST.FIELDS.OPTIONS.SETTINGS.MULTI.HELP": "This setting decides whether multiple options can be selected.",
          "APP.LIST.FIELDS.OPTIONS.SETTINGS.OPTIONS": "Options",
          "APP.LIST.FIELDS.OPTIONS.SETTINGS.OPTIONS.HELP": "You can add, delete and sort options.",
          "APP.LIST.FIELDS.OPTIONS.PLACEHOLDER": "Please select",
          "APP.LIST.FIELDS.LINK.TITLE": "Link",
          "APP.LIST.FIELDS.LINK.DESCRIPTION": "Use this field to add a clickable link to your list.",
          "APP.LIST.FIELDS.LINK.SETTINGS.SAMEWINDOW": "Target",
          "APP.LIST.FIELDS.LINK.SETTINGS.SAMEWINDOW.LABEL": "The link is opened in the current window",
          "APP.LIST.FIELDS.LINK.SETTINGS.SAMEWINDOW.HELP": "Decide whether the link should be opened in the current window (checked) or in a new window (unchecked)",
          "APP.LIST.FIELDS.LINK.ERRORS.PATTERN": "This is not a valid link.",
          "APP.LIST.FIELDS.NUMBER.TITLE": "Number",
          "APP.LIST.FIELDS.NUMBER.DESCRIPTION": "A basic field for numbers. You can define a minimum and a maximum value.",
          "APP.LIST.FIELDS.NUMBER.SETTINGS.MIN": "Minimum",
          "APP.LIST.FIELDS.NUMBER.SETTINGS.MIN.HELP": "The lower limit for the number value. This can be left blank.",
          "APP.LIST.FIELDS.NUMBER.SETTINGS.MAX": "Maximum",
          "APP.LIST.FIELDS.NUMBER.SETTINGS.MAX.HELP": "The upper limit for the number value. This can be left blank.",
          "APP.LIST.FIELDS.NUMBER.ERROR.MIN": "Value must be greater than {min}.",
          "APP.LIST.FIELDS.NUMBER.ERROR.MAX": "Value must be less than {max}."
        });
        /* eslint-enable quotes */
      });
})(angular);
