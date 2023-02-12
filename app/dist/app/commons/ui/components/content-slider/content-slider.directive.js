(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoContentSlider', contentSlider())
      .controller('ContentSliderController', ContentSliderController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoContentSlider:coyoContentSlider
   * @restrict 'E'
   *
   * @description
   * Renders a content slider based on anguler-swiper.
   *
   * @param {object} settings
   * Overrides for the default settings of the slider.
   * More infos to all settings in the official swiper api on http://idangero.us/swiper/api/#.WGZMQbbhBdh
   *
   * @param {boolean} showPagination
   * If true the slider contains a pagination. Default value false.
   *
   * @param {string} size
   * The relation of the teaser widget. Accepted strings are 'sm', 'md', 'lg'
   *
   * @param {array} slides
   * Array with all slide objects.
   * Parameters of the slide array:
   * [string] _image
   * [string] _url
   * [headline] headline
   * [headline] subheadline
   * [bool] _newTab
   *
   * @require $scope
   * @require $timeout
   */
  function contentSlider() {
    return {
      scope: {},
      controller: 'ContentSliderController',
      controllerAs: '$ctrl',
      templateUrl: 'app/commons/ui/components/content-slider/content-slider.html',
      bindings: {
        settings: '<',
        showPagination: '<',
        size: '<',
        slides: '='
      }
    };
  }

  function ContentSliderController($scope, $timeout) {
    var vm = this;
    vm.onReadySwiper = onReadySwiper;

    // ReInit Slick Slider when slides changed
    $scope.$watch(function () {
      return vm.slides;
    }, function () {
      _reInitSwiper();
    });

    // ReInit Slick Slider when exit EditMode
    $scope.$watch(function () {
      return vm.editMode;
    }, function () {
      _reInitSwiper();
    });

    function onReadySwiper(swiper) {
      // Fix faulty initialization when coming from another side
      $timeout(function () {
        swiper.update();
      }, 250);
    }

    function _reInitSwiper() {
      vm.update = true;
      $timeout(function () {
        vm.update = false;
      });
    }
  }
})(angular);
