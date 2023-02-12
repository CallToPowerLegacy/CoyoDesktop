(function (angular) {
  'use strict';

  angular
      .module('commons.i18n')
      .factory('i18nService', i18nService);

  /**
   * @ngdoc service
   * @name commons.i18n.i18nService
   *
   * @description
   * This service provides a method for setting the current language.
   *
   * @requires $log
   * @requires $translate
   * @requires amMoment
   * @requires $numeraljsConfig
   */
  function i18nService($log, $translate, amMoment, $numeral) {

    /**
     * @ngdoc method
     * @name commons.i18n.i18nService#setInterfaceLanguage
     * @methodOf commons.i18n.i18nService
     *
     * @description
     * Sets a new current language if the given language is available.
     *
     * @param {string} language The new current language
     */
    function setInterfaceLanguage(language) {
      if (angular.isString(language)) {
        language = language.toLowerCase();

        try {
          $translate.use(language).then(function (resolvedLanguage) {
            if (resolvedLanguage !== language) {
              $translate.refresh(resolvedLanguage);
            }
            $numeral.locale(language);
            amMoment.changeLocale(language);
            $log.debug('[i18nService] Interface language changed to', language);
          }).catch(function () {
            $log.error('[i18nService] Interface language could not be set to', language);
          });
        } catch (error) {
          $log.error('[i18nService] Error setting interface language', language);
        }
      } else {
        $log.error('[i18nService] Invalid language: ', language);
      }
    }

    return {
      setInterfaceLanguage: setInterfaceLanguage
    };
  }

})(angular);
