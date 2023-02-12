(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.base
   *
   * @description
   * # Base module #
   * The base module includes every 3rd-party library as a dependency.
   *
   * New Coyo modules should
   * 1. Add coyo.base as a dependency and
   * 2. Add 3rd-party libraries to this base module and not to the own modules dependency list
   */
  angular
      .module('coyo.base', [
        'angular-click-outside',
        'angular-loading-bar',
        'angularMoment',
        'ui.tree',
        'ngDraggable',
        'summernote',
        'ngAnimate',
        'ngCookies',
        'ngFileUpload',
        'uiCropper',
        'ngMessages',
        'ngPicturefill',
        'ngSanitize',
        'ngStorage',
        'ngError',
        'ui.bootstrap',
        'ui.router',
        'ui-notification',
        'pascalprecht.translate',
        'monospaced.elastic',
        'rails',
        'ngFileUpload',
        'contenteditable',
        'focus-if',
        'luegg.directives',
        'colorpicker.module',
        'mentio',
        'pdfjsViewer',
        'angularTinycon',
        'ngAudio',
        'ui.select',
        'ui.bootstrap.datetimepicker',
        'ngclipboard'
      ])
      .config(configMsdElastic)
      .config(configPdfJsViewer);

  /**
   * Appends whitespace to autosize textareas to fix IE style glitches.
   */
  function configMsdElastic(msdElasticConfig) {
    msdElasticConfig.append = ' ';
  }

  /**
   * Load local PDFJs worker.
   */
  function configPdfJsViewer(pdfjsViewerConfigProvider) {
    pdfjsViewerConfigProvider.setWorkerSrc('/scripts/pdf.worker.js');
  }

})(angular);
