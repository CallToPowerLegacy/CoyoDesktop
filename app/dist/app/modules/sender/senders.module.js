(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.senders
   *
   * @description
   * This is an module for common views and controllers which can be applied to different senders
   * (like pages and workspaces).
   */
  angular
      .module('coyo.senders', [])
      .constant('sendersConfig', {
        templates: {
          files: 'app/modules/sender/views/sender.files.html'
        }
      });

})(angular);
