(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps.list.fields
   *
   * @description
   * Defines and registers field types for the list app.
   */
  angular
      .module('coyo.apps.list.fields', [
        'coyo.base',
        'commons.i18n',
        'commons.ui'
      ])
      .config(registerCheckboxField)
      .config(registerDateField)
      .config(registerFileField)
      .config(registerLinkField)
      .config(registerNumberField)
      .config(registerOptionsField)
      .config(registerTextField)
      .config(registerUserField);

  function registerCheckboxField(fieldTypeRegistryProvider) {
    fieldTypeRegistryProvider.register({
      key: 'checkbox',
      title: 'APP.LIST.FIELDS.CHECKBOX.TITLE',
      description: 'APP.LIST.FIELDS.CHECKBOX.DESCRIPTION',
      icon: 'zmdi-check-square',
      sortOn: '',
      settings: {
        templateUrl: 'app/apps/list/fields/settings/checkbox-field-settings.html'
      },
      form: {
        templateUrl: 'app/apps/list/fields/form/checkbox-field.html'
      },
      render: {
        templateUrl: 'app/apps/list/fields/render/checkbox.html',
        controller: 'CheckboxRenderController'
      },
      inlineEdit: {
        templateUrl: 'app/apps/list/fields/inline-edit/checkbox.html'
      }
    });
  }

  function registerDateField(fieldTypeRegistryProvider) {
    fieldTypeRegistryProvider.register({
      key: 'date',
      title: 'APP.LIST.FIELDS.DATE.TITLE',
      description: 'APP.LIST.FIELDS.DATE.DESCRIPTION',
      icon: 'zmdi-calendar',
      sortOn: '',
      form: {
        templateUrl: 'app/apps/list/fields/form/date-field.html',
        controller: 'DateFieldController',
        controllerAs: '$ctrl'
      },
      render: {
        templateUrl: 'app/apps/list/fields/render/date.html'
      }
    });
  }

  function registerFileField(fieldTypeRegistryProvider) {
    fieldTypeRegistryProvider.register({
      key: 'file',
      title: 'APP.LIST.FIELDS.FILE.TITLE',
      description: 'APP.LIST.FIELDS.FILE.DESCRIPTION',
      icon: 'zmdi-file',
      sortOn: 'displayName.raw',
      settings: {
        templateUrl: 'app/apps/list/fields/settings/file-field-settings.html'
      },
      form: {
        templateUrl: 'app/apps/list/fields/form/file-field.html',
        controller: 'FileFieldController',
        controllerAs: '$ctrl'
      },
      render: {
        templateUrl: 'app/apps/list/fields/render/file.html',
        controller: 'FileFieldRenderController'
      }
    });
  }

  function registerLinkField(fieldTypeRegistryProvider) {
    fieldTypeRegistryProvider.register({
      key: 'link',
      title: 'APP.LIST.FIELDS.LINK.TITLE',
      description: 'APP.LIST.FIELDS.LINK.DESCRIPTION',
      icon: 'zmdi-link',
      sortOn: '',
      settings: {
        templateUrl: 'app/apps/list/fields/settings/link-field-settings.html'
      },
      form: {
        templateUrl: 'app/apps/list/fields/form/link-field.html'
      },
      render: {
        templateUrl: 'app/apps/list/fields/render/link.html'
      }
    });
  }


  function registerNumberField(fieldTypeRegistryProvider) {
    fieldTypeRegistryProvider.register({
      key: 'number',
      title: 'APP.LIST.FIELDS.NUMBER.TITLE',
      description: 'APP.LIST.FIELDS.NUMBER.DESCRIPTION',
      icon: 'zmdi-n-1-square',
      sortOn: '',
      settings: {
        templateUrl: 'app/apps/list/fields/settings/number-field-settings.html'
      },
      form: {
        templateUrl: 'app/apps/list/fields/form/number-field.html'
      },
      render: {
        templateUrl: 'app/apps/list/fields/render/number.html'
      }
    });
  }

  function registerOptionsField(fieldTypeRegistryProvider) {
    fieldTypeRegistryProvider.register({
      key: 'options',
      title: 'APP.LIST.FIELDS.OPTIONS.TITLE',
      description: 'APP.LIST.FIELDS.OPTIONS.DESCRIPTION',
      icon: 'zmdi-dns',
      sortOn: 'displayName.raw',
      settings: {
        templateUrl: 'app/apps/list/fields/settings/options-field-settings.html',
        controller: 'OptionsFieldSettingsController',
        controllerAs: '$ctrl'
      },
      form: {
        templateUrl: 'app/apps/list/fields/form/options-field.html'
      },
      render: {
        templateUrl: 'app/apps/list/fields/render/options.html',
        controller: 'OptionsFieldRenderController'
      }
    });
  }

  function registerTextField(fieldTypeRegistryProvider) {
    fieldTypeRegistryProvider.register({
      key: 'text',
      title: 'APP.LIST.FIELDS.TEXT.TITLE',
      description: 'APP.LIST.FIELDS.TEXT.DESCRIPTION',
      icon: 'zmdi-sort-amount-desc',
      sortOn: 'raw',
      settings: {
        templateUrl: 'app/apps/list/fields/settings/text-field-settings.html'
      },
      form: {
        templateUrl: 'app/apps/list/fields/form/text-field.html'
      },
      render: {
        templateUrl: 'app/apps/list/fields/render/text.html'
      }
    });
  }

  function registerUserField(fieldTypeRegistryProvider) {
    fieldTypeRegistryProvider.register({
      key: 'user',
      title: 'APP.LIST.FIELDS.USER.TITLE',
      description: 'APP.LIST.FIELDS.USER.DESCRIPTION',
      icon: 'zmdi-accounts',
      sortOn: 'displayName.raw',
      settings: {
        templateUrl: 'app/apps/list/fields/settings/user-field-settings.html'
      },
      form: {
        templateUrl: 'app/apps/list/fields/form/user-field.html'
      },
      render: {
        templateUrl: 'app/apps/list/fields/render/user.html'
      }
    });
  }

})(angular);
