(function (angular) {
  'use strict';

  angular
      .module('commons.auth')
      .factory('deeplinkService', deeplinkService);

  /**
   * @ngdoc service
   * @name commons.auth.deeplinkService
   *
   * @description
   * Provides methods for deep-linking feature. When a state is called and the user is not logged in, the state can
   * be stored with this service and be restored after a successful login. The state will be persisted in the session
   * so that it can be retrieved even after the app was re-loaded, e.g. due to a SAML login redirect.
   *
   * @required $sessionStorage
   */
  function deeplinkService($sessionStorage) {
    return {
      getReturnToState: getReturnToState,
      getReturnToStateParams: getReturnToStateParams,
      setReturnToState: setReturnToState,
      clearReturnToState: clearReturnToState
    };

    /**
     * @ngdoc method
     * @name commons.auth.deeplinkService#getReturnToState
     * @methodOf commons.auth.deeplinkService
     *
     * @description
     * Get the name of the state that was previously stored.
     *
     * @return {string} The state that should be returned to or null
     */
    function getReturnToState() {
      return $sessionStorage.returnToState;
    }

    /**
     * @ngdoc method
     * @name commons.auth.deeplinkService#getReturnToStateParams
     * @methodOf commons.auth.deeplinkService
     *
     * @description
     * Get the state parameters that were previously stored.
     *
     * @return {object} The state parameters or null
     */
    function getReturnToStateParams() {
      return $sessionStorage.returnToStateParams;
    }

    /**
     * @ngdoc method
     * @name commons.auth.deeplinkService#setReturnToState
     * @methodOf commons.auth.deeplinkService
     *
     * @description
     * Sets the state and its parameters that should be returned to after a successful login.
     *
     * @param {string|object} state The state name or the state object from which its name is taken
     * @param {object} params The state parameters
     */
    function setReturnToState(state, params) {
      $sessionStorage.returnToState = angular.isString(state) ? state : (state && state.name ? state.name : null);
      $sessionStorage.returnToStateParams = params;
    }

    /**
     * @ngdoc method
     * @name commons.auth.deeplinkService#clearReturnToState
     * @methodOf commons.auth.deeplinkService
     *
     * @description
     * Clears the stored state and its parameters.
     */
    function clearReturnToState() {
      setReturnToState(null, null);
    }
  }

})(angular);
