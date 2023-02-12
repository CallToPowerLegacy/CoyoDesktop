(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('titleService', titleService)
      .run(initTitleService);

  /**
   * @ngdoc service
   * @name commons.ui.titleService
   *
   * @description
   * Manages the page title, listens to the event <em>'$transitions.onSuccess'</em> and sets the page title accordingly.
   *
   * @requires $translate
   * @requires $q
   */
  function titleService($document, $translate, $q) {
    var prefix;
    var title;

    return {
      set: set,
      setPrefix: setPrefix
    };

    /**
     * @ngdoc function
     * @name commons.ui.titleService#set
     * @methodOf commons.ui.titleService
     *
     * @description
     * Sets the new title of the page.
     *
     * @param {string} newTitle The new title of the page
     * @param {boolean} [translate=true] true if the title should be translated, otherwise false
     */
    function set(newTitle, translate) {
      var useI18n = newTitle && (translate || angular.isUndefined(translate));
      (useI18n ? $translate(newTitle) : $q.resolve(newTitle)).then(function (newTitle) {
        title = newTitle;
        _setPageTitle(prefix, title);
      });
    }

    /**
     * @ngdoc function
     * @name commons.ui.titleService#setPrefix
     * @methodOf commons.ui.titleService
     *
     * @description
     * Sets the new prefix of the page title.
     *
     * @param {string} newPrefix The new prefix of the page title
     * @param {boolean} [translate=true] true if the prefix should be translated, otherwise false
     */
    function setPrefix(newPrefix, translate) {
      var useI18n = newPrefix && (translate || angular.isUndefined(translate));
      (useI18n ? $translate(newPrefix) : $q.resolve(newPrefix)).then(function (newPrefix) {
        prefix = newPrefix;
        _setPageTitle(prefix, title);
      });
    }

    function _setPageTitle(prefix, title) {
      $document.find('title').html((prefix || '') + (prefix && title ? ' | ' : '') + (title || ''));
    }
  }

  /**
   * Initialize the page title service and watch for state changes to set title accordingly.
   */
  function initTitleService($transitions, titleService) {
    $transitions.onSuccess({}, function (transition) {
      if (transition.targetState() && transition.targetState().state() && transition.targetState().state().data) {
        if (transition.targetState().state().data.pageTitle) {
          titleService.set(transition.targetState().state().data.pageTitle);
        } else if (transition.targetState().state().data.pageTitle === false) {
          return;
        }
      }
      titleService.set('');
    });
  }

})(angular);
