(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps
   *
   * @description
   * This module contains all apps and the API used by apps.
   */
  angular
      .module('coyo.apps', [
        'coyo.base',
        'coyo.apps.blog',
        'coyo.apps.content',
        'coyo.apps.events',
        'coyo.apps.file-library',
        'coyo.apps.forum',
        'coyo.apps.list',
        'coyo.apps.task',
        'coyo.apps.timeline',
        'coyo.apps.wiki'
      ]);

})(angular);
