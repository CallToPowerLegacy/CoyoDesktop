(function () {
  'use strict';

  angular.module('coyo.admin.themes')
      .factory('themeService', themeService);

  /**
   * @ngdoc service
   * @name coyo.admin.themes.themeService
   *
   * @description
   * Service to manage the custom css theme
   *
   * @requires $http
   * @requires $q
   * @requires commons.resource.backendUrlService
   * @requires commons.mobile.mobileEventsService
   */
  function themeService($http, $q, $window, backendUrlService, mobileEventsService, coyoEndpoints) {

    return {
      applyTheme: applyTheme,
      removeTheme: removeTheme
    };

    /**
     * @ngdoc method
     * @name coyo.admin.themes.themeService#applyTheme
     * @methodOf coyo.admin.themes.themeService
     *
     * @description
     * Loads the custom theme css from the backend and applies it to the page.
     *
     * @returns {object} empty promise to be resolved after the css has been applied to the page
     */
    function applyTheme() {
      var backendUrl = backendUrlService.getUrl();
      if (angular.isUndefined(backendUrl)) {
        removeTheme();
        _onCustomThemeChanged();
        return $q.resolve();
      }
      var url = backendUrl + coyoEndpoints.theme.download;
      return $http({
        url: url,
        method: 'GET' // don't attempt to parse json
      }).then(function (response) {
        removeTheme();
        mobileEventsService.propagate('theme:applied', response.data.variables);
        angular.element('head').append('<style id="customTheme" type="text/css">' + response.data.css + '</style>');
        _replaceFavicon(response.data.variables['image-coyo-favicon']);
      }).finally(function () {
        _onCustomThemeChanged();
      });
    }

    /**
     * @ngdoc method
     * @name coyo.admin.themes.themeService#removeTheme
     * @methodOf coyo.admin.themes.themeService
     *
     * @description
     * Removes the applied theme from the page (if exists).
     */
    function removeTheme() {
      angular.element('#customTheme').remove();
    }

    function _replaceFavicon(icon) {
      if (icon && !_detectIE()) { // IE can't handle it...
        angular.element('head').find('link[rel="shortcut icon"]').remove();
        angular.element('head').append('<link rel="shortcut icon" type="image/x-icon" href="' + icon.split('\'').join('') + '" />');
        angular.element('head').append(angular.element('head').find('link[rel="apple-touch-icon"]'));
      }
    }

    function _onCustomThemeChanged() {
      angular.element('body').removeClass('custom-theme-pending');
    }

    function _detectIE() {
      var ua = $window.navigator.userAgent;

      var msie = ua.indexOf('MSIE ');
      if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }

      var trident = ua.indexOf('Trident/');
      if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }

      var edge = ua.indexOf('Edge/');
      if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }

      // other browser
      return false;
    }
  }

})();
