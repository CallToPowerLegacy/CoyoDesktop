(function (angular) {
  'use strict';

  angular
      .module('commons.resource')
      .factory('backendUrlService', backendUrlService);

  /**
   * @ngdoc service
   * @name commons.resource.backendUrlService
   *
   * @description
   * Service for getting and setting the backend URL. This service takes the outside configuration parameter
   * commons.config.coyoConfig#backendUrlStrategy which can be any of:
   *
   * 'relative': No absolute backend URL will be prepended to backend URL calls. Calls will be made to /web/...
   * 'static': A configured backend URL will be prepended to backend URL calls.
   * 'configurable': The user can configure the backend URL in the frontend client upon login.
   *
   * @requires commons.config.coyoConfig
   * @requires $localStorage
   * @requires $rootScope
   * @requires $log
   */
  function backendUrlService(coyoConfig, $localStorage, $rootScope, $log) {

    var currentStrategy;

    setStrategy(coyoConfig.backendUrlStrategy || 'configurable');

    return {
      getUrl: getUrl,
      setUrl: setUrl,
      clearUrl: clearUrl,
      isConfigurable: isConfigurable,
      isSet: isSet,
      setStrategy: setStrategy
    };

    /**
     * @ngdoc method
     * @name commons.resource.backendUrlService#getUrl
     * @methodOf commons.resource.backendUrlService
     *
     * @description
     * Gets the backend URL either from the config, the local storage or returns an empty string if the backend URL
     * strategy is 'relative'.
     *
     * @return {string} Backend URL.
     */
    function getUrl() {
      if (isConfigurable()) {
        return $localStorage.backendUrl;
      } else if (currentStrategy === 'static') {
        return coyoConfig.backendUrl;
      } else if (currentStrategy === 'relative') {
        return '';
      }

      return null;
    }

    /**
     * @ngdoc method
     * @name commons.resource.backendUrlService#setUrl
     * @methodOf commons.resource.backendUrlService
     *
     * @description
     * Sets a new backend URL in the local storage. This will only work if no global backend URL is already defined
     * via the config.js.
     *
     * @param {string} url Backend URL.
     */
    function setUrl(url) {
      if (isConfigurable()) {
        $localStorage.backendUrl = url;
        $rootScope.$emit('backendUrlService:url:updated', url);
      }
    }

    /**
     * @ngdoc method
     * @name commons.resource.backendUrlService#clearUrl
     * @methodOf commons.resource.backendUrlService
     *
     * @description
     * Clears the (dynamic) backend URL. This will only work if no global backend URL is already defined
     * via the config.js.
     */
    function clearUrl() {
      if (isConfigurable()) {
        delete $localStorage.backendUrl;
        $rootScope.$emit('backendUrlService:url:cleared');
      }
    }

    /**
     * @ngdoc method
     * @name commons.resource.backendUrlService#isConfigurable
     * @methodOf commons.resource.backendUrlService
     *
     * @description
     * Checks if the current backend URL is configurable, meaning it can be configured by the user.
     */
    function isConfigurable() {
      return currentStrategy === 'configurable';
    }

    /**
     * @ngdoc method
     * @name commons.resource.backendUrlService#isSet
     * @methodOf commons.resource.backendUrlService
     *
     * @description
     * Checks if a backend URL is set.
     */
    function isSet() {
      var url = getUrl();
      return angular.isDefined(url) && url !== null;
    }

    /**
     * @ngdoc method
     * @name commons.resource.backendUrlService#setStrategy
     * @methodOf commons.resource.backendUrlService
     *
     * @description
     * Updates the backend URL resolutions strategy.
     *
     * @param {string} strategy The new strategy. One of 'relative', 'static' or 'configurable'.
     */
    function setStrategy(strategy) {
      strategy = _.lowerCase(strategy);

      if (strategy === 'static' && (angular.isUndefined(coyoConfig.backendUrl) || coyoConfig.backendUrl === '')) {
        $log.error('[backendUrlService] No backend URL configured. Please make sure to configure a backend URL when ' +
            'using strategy \'static\'. Defaulting to strategy \'configurable\'.');
        strategy = 'configurable';
      }

      $log.info('[backendUrlService] Using backend URL strategy:', strategy);

      currentStrategy = strategy;
    }
  }

})(angular);
