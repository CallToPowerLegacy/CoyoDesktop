(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.i18n
   *
   * @description
   * # Internationalization (i18n) module #
   * The internationalization module initializes the translation module, provides an i18n service
   * and contains the message key files.
   *
   * @requires $translate
   * @requires $translateProvider
   * @requires commons.auth.authService
   * @requires commons.i18n.i18nService
   * @requires commons.i18n.custom.coyoTranslationLoader
   * @requires commons.startup.curtainService
   * @requires commons.startup.curtainServiceProvider
   * @requires ngNumeraljs
   */
  angular
      .module('commons.i18n', [
        'commons.auth',
        'commons.startup',
        'commons.i18n.custom',
        'coyo.base'
      ])
      .config(translationsConfig)
      .config(messageFormatIntlConfig)
      .config(numeralsConfig)
      .constant('numeralGlobal', numeral) // eslint-disable-line no-undef
      .run(initInterfaceLanguage)
      .run(listenOnBackendChange);

  /**
   * Translations configuration.
   */
  function translationsConfig($translateProvider, curtainServiceProvider) {
    // set available languages and make en the default alias
    $translateProvider.registerAvailableLanguageKeys(['en', 'de'],
        {'en_*': 'en', 'de_*': 'de', '*': 'en'});

    // set a sanitization strategy (default: null)
    $translateProvider.useSanitizeValueStrategy('escape');

    // log missing translations
    // $translateProvider.useMissingTranslationHandlerLog();

    // use english if message keys are missing for other language
    $translateProvider.fallbackLanguage('en');

    // use $translate's default strategy to determine browser language
    $translateProvider.determinePreferredLanguage();

    // use message interpolation
    $translateProvider.useMessageFormatInterpolation();

    // use custom coyo translation loader
    $translateProvider.useLoader('coyoTranslationLoader');

    // show curtain while translations are loading
    curtainServiceProvider.register('translations');
  }

  /**
   * Number formatting configurations
   */
  function numeralsConfig($numeralProvider) {
    // Register a new Locale
    $numeralProvider.registerLocale('de', {
      delimiters: {
        thousands: '.',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function () {
        return '.';
      },
      currency: {
        symbol: '€'
      }
    });
  }


  /**
   * Enable Intl Formatters for message formatting
   * see https://messageformat.github.io/guide/
   */
  function messageFormatIntlConfig($translateMessageFormatInterpolationProvider) {
    $translateMessageFormatInterpolationProvider.messageFormatConfigurer(function (messageFormat) {
      messageFormat.setIntlSupport(true);
    });
  }

  /**
   * Set user interface language if a user is available.
   */
  function initInterfaceLanguage(authService, i18nService, $rootScope) {
    function setInterfaceLanguage() {
      authService.getUser().then(function (user) {
        i18nService.setInterfaceLanguage(user.language);
      });
    }

    if (authService.isAuthenticated()) {
      setInterfaceLanguage();
    }

    $rootScope.$on('authService:login:success', setInterfaceLanguage);
  }

  /**
   * Listens on backend URL changes.
   */
  function listenOnBackendChange($rootScope, $translate, curtainService) {
    $rootScope.$on('backendUrlService:url:updated', function () {
      // refreshing the translations causes a deletion of all translations and a new fetch call to the loader
      // which then loads all overridden translations from the new backend
      $translate.refresh();
    });
    $translate.onReady(function () {
      $rootScope.translationsReady = true;
      curtainService.loaded('translations');
    });
  }

})(angular);
