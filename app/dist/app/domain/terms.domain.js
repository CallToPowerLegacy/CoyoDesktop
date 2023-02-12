(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('TermsModel', TermsModel);

  /**
   * @ngdoc service
   * @name coyo.domain.TermsModel
   *
   * @description
   * Provides the terms.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function TermsModel(restResourceFactory, coyoEndpoints) {
    var Terms = restResourceFactory({
      url: coyoEndpoints.terms
    });

    angular.extend(Terms, {

      /**
       * @ngdoc function
       * @name coyo.domain.TermsModel#activate
       * @methodOf coyo.domain.TermsModel
       *
       * @description
       * Activates the terms of use feature in the backend
       *
       * @returns {promise} An $http promise
       */
      activate: function (hiddenUsers) {
        return Terms.$put(Terms.$url('activate'), {hiddenUsers: hiddenUsers});
      },

      /**
       * @ngdoc function
       * @name coyo.domain.TermsModel#deactivate
       * @methodOf coyo.domain.TermsModel
       *
       * @description
       * Deactivates the terms of use feature in the backend
       *
       * @returns {promise} An $http promise
       */
      deactivate: function () {
        return Terms.$put(Terms.$url('deactivate'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.TermsModel#getByLanguage
       * @methodOf coyo.domain.TermsModel
       *
       * @description
       * Return the terms for the given language
       *
       * @params {string} The language to search the terms for
       *
       * @returns {promise} An $http promise
       */
      getByLanguage: function (lang) {
        return Terms.$get(Terms.$url(), {language: lang});
      },

      /**
       * @ngdoc function
       * @name coyo.domain.TermsModel#accept
       * @methodOf coyo.domain.TermsModel
       *
       * @description
       * Accepts the terms of use for the given user
       *
       * @params {string} The user id
       * @params {string} The language of the accepted terms
       *
       * @returns {promise} An $http promise
       */
      accept: function (userId, language) {
        return Terms.$put(
            coyoEndpoints.user.user.replace('{id}', userId) + '/terms/accept', null, null, {language: language});
      },

      /**
       * @ngdoc function
       * @name coyo.domain.TermsModel#accept
       * @methodOf coyo.domain.TermsModel
       *
       * @description
       * Decline the terms of use for the given user
       *
       * @params {string} The user id
       * @params {string} The language of the declined terms
       *
       * @returns {promise} An $http promise
       */
      decline: function (userId, language) {
        return Terms.$put(
            coyoEndpoints.user.user.replace('{id}', userId) + '/terms/decline', null, null, {language: language});
      },

      /**
       * @ngdoc function
       * @name coyo.domain.TermsModel#reset
       * @methodOf coyo.domain.TermsModel
       *
       * @description
       * Reset the terms of use acceptance for all users.
       *
       * @returns {promise} An $http promise
       */
      reset: function () {
        return Terms.$put(Terms.$url('reset'));
      }
    });
    return Terms;
  }

})(angular);
