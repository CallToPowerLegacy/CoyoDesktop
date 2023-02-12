(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.teaser')
      .component('coyoTeaserWidget', teaserWidget())
      .controller('TeaserWidgetController', TeaserWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.teaser:coyoTeaserWidget
   * @restrict 'E'
   *
   * @description
   * Renders a teaser widget which includes a content slider.
   *
   * @param {object} widget
   * The widget configuration
   */
  function teaserWidget() {
    return {
      templateUrl: 'app/widgets/teaser/teaser-widget.html',
      scope: {},
      bindings: {
        widget: '<',
        editMode: '<'
      },
      controller: 'TeaserWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function TeaserWidgetController() {
    var vm = this;
    vm.swiperSettings = {
      loop: true,
      autoplay: 5000,
      paginationClickable: true
    };
  }
})(angular);
