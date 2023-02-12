(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.wiki')
      .controller('WikiMainController', WikiMainController);

  function WikiMainController($state, $timeout, app) {
    /*
     * We need a timeout here because the state has to be written into the browsers history first before we proceed
     * with the redirect. Otherwise we would overwrite the last history entry.
     */
    $timeout(function () {
      if (app.settings.home) {
        $state.go('^.list.view', {id: app.settings.home}, {location: 'replace'});
      } else {
        $state.go('^.list', {}, {location: 'replace'});
      }
    });
  }

})(angular);
