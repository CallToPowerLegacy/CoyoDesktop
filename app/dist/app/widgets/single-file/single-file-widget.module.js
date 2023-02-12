(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.widgets.singlefile
   *
   * @description
   * # Single file widget #
   * Show a single file in a widget
   */
  angular
      .module('coyo.widgets.singlefile', [
        'coyo.widgets.api',
        'commons.i18n',
        'commons.ui'
      ])
      .config(registerSingleFileWidget);

  function registerSingleFileWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGET.SINGLEFILE.NAME',
      key: 'singlefile',
      description: 'WIDGET.SINGLEFILE.DESCRIPTION',
      icon: 'zmdi-file',
      categories: 'static',
      directive: 'coyo-single-file-widget',
      settings: {
        templateUrl: 'app/widgets/single-file/single-file-widget-settings.html',
        controller: 'SingleFileWidgetSettingsController',
        controllerAs: '$ctrl'
      }
    });
  }

})(angular);
