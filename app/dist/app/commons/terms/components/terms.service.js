(function (angular) {
  'use strict';

  angular
      .module('commons.terms')
      .factory('termsService', termsService)
      .controller('ShowTermsController', ShowTermsController);

  /**
   * @ngdoc service
   * @name commons.terms.termsService
   *
   * @description
   * This service provides a method for checking if the current user needs to accept the terms of use
   *
   * @requires $q
   * @requires commons.auth.authService
   * @requires coyo.domain.SettingsModel
   */
  function termsService($q, authService, SettingsModel, TermsModel, modalService) {
    var targetState;

    return {
      getTargetState: getTargetState,
      setTargetState: setTargetState,
      termsActive: termsActive,
      userNeedsToAcceptTerms: userNeedsToAcceptTerms,
      showModal: showModal
    };

    /**
     * @ngdoc method
     * @name commons.terms.termsService#userNeedsToAcceptTerms
     * @methodOf commons.terms.termsService
     *
     * @description
     * Checks if the current user needs to accept the terms of use.
     */
    function userNeedsToAcceptTerms() {
      return termsActive().then(function (required) {
        return required ? authService.getUser().then(function (user) {
          return user.termsAcceptance !== 'ACCEPTED';
        }) : $q.resolve(false);
      });
    }

    /**
     * @ngdoc method
     * @name commons.terms.termsService#termsActive
     * @methodOf commons.terms.termsService
     *
     * @description
     * Checks if the terms of use are activated;
     */
    function termsActive() {
      return SettingsModel.retrieve().then(function (settings) {
        return settings.termsRequired === 'true';
      });
    }

    /**
     * @ngdoc method
     * @name commons.terms.termsService#showModal
     * @methodOf commons.terms.termsService
     *
     * @description
     * Shows a modal with the terms of use
     */
    function showModal() {
      return SettingsModel.retrieve().then(function (settings) {
        return modalService.open({
          controller: 'ShowTermsController',
          size: 'lg',
          templateUrl: 'app/commons/terms/components/terms.modal.html',
          resolve: {
            terms: function () {
              return TermsModel.getByLanguage(settings.defaultLanguage);
            }
          }
        });
      });
    }

    function getTargetState() {
      return targetState ? targetState : {name: 'main', params: {}};
    }

    function setTargetState(state, params) {
      targetState = {name: state.name, params: params};
    }
  }

  function ShowTermsController(terms) {
    var vm = this;
    vm.terms = terms;
  }

})(angular);
