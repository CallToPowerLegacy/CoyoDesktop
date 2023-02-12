(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.media')
      .controller('MediaWidgetEditDescriptionModalController', MediaWidgetEditDescriptionModalController);

  function MediaWidgetEditDescriptionModalController(media) {
    var vm = this;
    vm.media = media;
  }
})(angular);
