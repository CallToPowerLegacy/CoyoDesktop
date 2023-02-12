(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('userGuideService', userGuideService);

  /**
   * @ngdoc service
   * @name commons.ui.userGuideService
   *
   * @description
   * Service for rendering user guides.
   *
   * @requires modalService
   * @requires commons.resource.backendUrlService
   * @requires $q
   * @requires $http
   * @requires $translate
   */
  function userGuideService(modalService, backendUrlService, $q, $http, $translate) {

    var guides;

    return {
      getGuideUrl: getGuideUrl,
      getUserGuideMainUrl: getUserGuideMainUrl,
      getGuideDefinition: getGuideDefinition,
      open: open,
      notFound: notFound
    };

    function buildUrl(path) {
      // for testing: 'http://localhost:3200';
      return backendUrlService.getUrl() + path;
    }

    function language() {
      return $translate.use();
    }

    /**
     * @ngdoc function
     * @name commons.ui.userGuideService#getGuideUrl
     * @methodOf commons.ui.userGuideService
     *
     * @description
     * Builds a url depending on the resolved backend url and the provided key.
     *
     * @param {string} key
     * Key of the guide that should be loaded, e.g. 'misc_markdown'.
     *
     * @return {string} Full url to the markdown-file in the docs.
     */
    function getGuideUrl(key) {
      return buildUrl('/docs/guides/user/' + language() + '/' + key + '.md');
    }

    /**
     * @ngdoc function
     * @name commons.ui.userGuideService#getUserGuideMainUrl
     * @methodOf commons.ui.userGuideService
     *
     * @description
     * Builds a url with the users current language to the main user guide.
     *
     * @return {string} Localized url to user documentation.
     */
    function getUserGuideMainUrl() {
      return buildUrl('/docs/guide/user/?lang=' + language());
    }

    /**
     * @ngdoc function
     * @name commons.ui.userGuideService#getGuideDefinition
     * @methodOf commons.ui.userGuideService
     *
     * @description
     * Loads the guide definition.
     *
     * @param {string} guideKey
     * Key of the guide that should be loaded, e.g. 'misc_markdown'.
     *
     * @return {object} Promise resolving to the guide definition tree.
     */
    function getGuideDefinition(guideKey) {
      var deferred = $q.defer();

      if (guides) {
        deferred.resolve(guides[language()][guideKey]);
      } else {
        $http({
          method: 'GET',
          url: buildUrl('/docs/guides/user-guides.json'),
          autoHandleErrors: false
        }).then(function (response) {
          guides = response.data;
          deferred.resolve(guides[language()][guideKey]);
        }).catch(function (e) {
          deferred.reject(e);
        });
      }

      return deferred.promise;
    }

    /**
     * @ngdoc function
     * @name commons.ui.userGuideService#open
     * @methodOf commons.ui.userGuideService
     *
     * @description
     * Open a modal with the given user guide.
     *
     * @param {string} guideKey
     * Key of the guide that should be loaded, e.g. 'misc_markdown'.
     */
    function open(guideKey) {
      modalService.open({
        controller: 'UserGuideController',
        size: 'lg',
        templateUrl: 'app/commons/ui/components/user-guide/user-guide.modal.html',
        resolve: {
          key: function () {
            return guideKey;
          }
        }
      });
    }

    /**
     * @ngdoc function
     * @name commons.ui.userGuideService#notFound
     * @methodOf commons.ui.userGuideService
     *
     * @description
     * Open a modal informing that a guide was not found.
     */
    function notFound() {
      modalService.open({
        templateUrl: 'app/commons/ui/components/user-guide/user-guide.modal.html',
        controller: function () {
          var vm = this;
          vm.notFound = true;
          vm.userGuideUrl = getUserGuideMainUrl();
        }
      });
    }
  }

})(angular);
