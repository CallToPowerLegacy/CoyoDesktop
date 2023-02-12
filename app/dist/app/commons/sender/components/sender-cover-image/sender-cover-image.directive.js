(function () {
  'use strict';

  angular
      .module('commons.sender')
      .directive('coyoSenderCoverImage', SenderCoverImage)
      .controller('senderCoverImageController', senderCoverImageController);

  /**
   * @ngdoc directive
   * @name commons.sender.coyoSenderCoverImage:coyoSenderCoverImage
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * This directive renders the cover image for a sender. Therefore it needs the url to the cover image and then takes
   * care that the correct image for the correct device width is requested from the server and rendered. It also takes
   * into consideration whether the display supports retina or not. This directive listens to a global resize event and
   * is notified of changes in the display's width.
   *
   * @param {string} imageUrl
   * The base url for the cover image without the imageSize parameter. This parameter is determined and set by the
   * directive.
   *
   * @param {boolean} showHighRes
   * Determines if cover image should be loaded in higher resolutions, mostly for detail views of senders, in contrast
   * to say lists, where it is sufficient to load smaller images to save bandwidth and keep response times fast.
   *
   * @requires $rootScope
   * @requires $scope
   * @requires commons.resource.backendUrlService
   */
  function SenderCoverImage() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/sender/components/sender-cover-image/sender-cover-image.html',
      scope: {},
      bindToController: {
        imageUrl: '<?',
        showHighRes: '<?'
      },
      controller: 'senderCoverImageController',
      controllerAs: '$ctrl'
    };
  }

  function senderCoverImageController($rootScope, $scope, backendUrlService) {
    var vm = this;
    vm.showHighRes = !_.isUndefined(vm.showHighRes) ? vm.showHighRes : true;
    vm.coverImageUrl = '';

    var backendUrl = backendUrlService.getUrl();

    // ---------------------- PRIVATE METHODS ------------------------

    function _setCover() {
      if (vm.showHighRes) {
        if ($rootScope.screenSize.isRetina && ($rootScope.screenSize.isLg || $rootScope.screenSize.isMd)) {
          vm.coverImageUrl = _createCoverUrl('ORIGINAL');
        } else {
          vm.coverImageUrl = _createCoverUrl('XXL');
        }
      } else {
        vm.coverImageUrl = _createCoverUrl('XL');
      }
    }

    function _createCoverUrl(size) {
      return vm.imageUrl ? 'url(' + backendUrl + vm.imageUrl + '&imageSize=' + size + ')' : 'none';
    }

    // ---------------------------- INIT ----------------------------

    (function _init() {
      // change cover image if image url changed
      $scope.$watch(function () {
        return vm.imageUrl;
      }, function () {
        _setCover();
      });

      // change cover if screen size changed
      var unsubscribe = $rootScope.$on('screenSize:changed', function () {
        _setCover();
      });
      $scope.$on('$destroy', unsubscribe);
    })();
  }
})();
