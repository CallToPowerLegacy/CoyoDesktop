(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('manageTranslationsModalService', manageTranslationsModalService);

  /**
   * @ngdoc service
   * @name commons.ui.manageTranslationsModalService
   *
   * @description
   * The service extends modalService#open to provide a modal to choose default and additional languages for translation.
   *
   * @requires modalService
   */
  function manageTranslationsModalService(modalService, LanguagesModel) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name commons.ui.manageTranslationsModalService#open
     * @methodOf commons.ui.manageTranslationsModalService
     *
     * @description
     * Opens the modal to choose default and additional languages for translation.
     *
     * @param {string} defaultLanguage
     * The default language of the sender
     *
     * @param {object} additionalLanguages
     * A Object with all additional languages.
     *
     * @returns {promise} The modal instance
     */
    function open(defaultLanguage, additionalLanguages) {
      return modalService.open({
        size: 'lg',
        templateUrl: 'app/commons/ui/components/manage-translations/manage-translations-modal.html',
        controller: 'ManageTranslationsModalController',
        controllerAs: '$ctrl',
        resolve: {
          defaultLanguage: function () {
            return defaultLanguage;
          },
          availableLanguages: function () {
            return LanguagesModel.retrieve().then(function (languages) {
              return _.map(languages, function (language) {
                return language.language;
              });
            });
          },
          languages: function () {
            return additionalLanguages;
          }
        }
      }).result;
    }
  }
})(angular);
