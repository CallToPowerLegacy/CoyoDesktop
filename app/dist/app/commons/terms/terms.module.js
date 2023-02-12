(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.terms
   *
   * @description
   * # Terms module that handles the display of the terms of use
   *
   * @requires $rootScope
   * @requires $state
   * @requires authService
   */
  angular
      .module('commons.terms', [
        'coyo.base'
      ])
      .run(checkTerms);

  /**
   * Check the terms of conditions and redirect to the state if an acceptance is needed
   *
   * @param {object} $rootScope The rootScope
   * @param {object} $state The state provider
   * @param {object} authService The authService
   * @param {object} termService The termsService
   */
  function checkTerms($transitions, $state, authService, termsService) {
    var transitionCriteria = {
      to: function (state) {
        return state.name !== 'front.terms';
      }
    };

    $transitions.onStart(transitionCriteria, function (transition) {
      if (transition.to().data.authenticate && authService.isAuthenticated()) {
        termsService.userNeedsToAcceptTerms().then(function (shouldDisplay) {
          if (shouldDisplay) {
            termsService.setTargetState(transition.to(), transition.params());
            $state.go('front.terms');
          }
        });
      }
    });
  }
})(angular);
