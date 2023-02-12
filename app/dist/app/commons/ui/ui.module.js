(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.ui
   *
   * @description
   * # User interface module #
   * The user interface module contains many Coyo-specific UI components.
   */
  angular
      .module('commons.ui', [
        'coyo.base',
        'commons.auth',
        'commons.sockets',
        'commons.config',
        'commons.target',
        'commons.i18n',
        'commons.error',
        'commons.shares',
        'coyo.apps.api',
        'ksSwiper'
      ])
      .constant('marked', marked); // eslint-disable-line no-undef

})(angular);
