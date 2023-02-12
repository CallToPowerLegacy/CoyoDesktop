(function () {
  'use strict';

  angular
      .module('commons.sender')
      .directive('coyoAvatarImage', avatarImage)
      .controller('AvatarImageController', AvatarImageController);

  /**
   * @ngdoc directive
   * @name commons.sender.coyoAvatarImage:coyoAvatarImage
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the image element for a sender's avatar and takes care, that the correct image sizes is set as src. The
   * image size depends on the passed size for the avatar. The directive also takes into consideration whether the
   * display supports retina.
   *
   * @param {string} imageUrl
   * The base url for the avatar image without the imageSize parameter. This parameter is determined and set by the
   * directive.
   *
   * @param {string=} avatarSize
   * Desired size of the avatar. Possible values are xs, sm, md, lg and xl. Default: md.
   *
   * @requires $scope
   * @requires $rootScope
   * @requires commons.resource.backendUrlService
   */
  function avatarImage() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/sender/components/avatar-image/avatar-image.html',
      scope: {},
      bindToController: {
        imageUrl: '<?',
        avatarSize: '@?',
        avatarBackground: '@?',
        onError: '&'
      },
      controller: 'AvatarImageController',
      controllerAs: '$ctrl'
    };
  }

  function AvatarImageController($rootScope, $scope, backendUrlService) {
    var vm = this;

    /**
     * Defines the translation from avatar sizes (bootstrap style) to available image sizes in backend.
     */
    var imageSizes = {
      'xs': {'sd': 'XS', 'retina': 'S'},
      'sm': {'sd': 'XS', 'retina': 'S'},
      'md': {'sd': 'S', 'retina': 'M'},
      'lg': {'sd': 'M', 'retina': 'L'},
      'xl': {'sd': 'M', 'retina': 'L'}
    };

    vm.imageSrc = '';
    vm.imageSize = imageSizes[vm.avatarSize || 'md'];
    vm.imageStyle = vm.avatarBackground ? {'background-color': vm.avatarBackground} : {};

    (function _init() {
      $scope.$watch(function () {
        return vm.imageUrl;
      }, function () {
        if (vm.imageUrl) {
          var baseUrl = backendUrlService.getUrl() + vm.imageUrl;
          var size = ($rootScope.screenSize.isRetina) ? vm.imageSize.retina : vm.imageSize.sd;
          vm.imageSrc = baseUrl + (baseUrl.indexOf('?') < 0 ? '?' : '&') + 'imageSize=' + size;
        } else {
          vm.imageSrc = '';
        }
      });
    })();
  }
})();
