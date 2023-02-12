(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.rss')
      /**
       * @ngdoc directive
       * @name coyo.widgets.rss.coyoRssWidget
       * @restrict 'E'
       *
       * @description
       * A widget which contains a rss feed
       *
       * @param {object} widget - rss widget
       * @param {object} editMode - true when widget editing is activated
       * @param {object} settingsMode - true when widget is shown in settings dialog
       */
      .component('coyoRssWidget', {
        templateUrl: 'app/widgets/rss/rss-widget.html',
        bindings: {
          widget: '=',
          editMode: '<',
          settingsMode: '<'
        },
        controller: 'rssWidgetController'
      })
      .controller('rssWidgetController', rssWidgetController);

  function rssWidgetController($scope, RssWidgetModel) {
    var vm = this;
    vm.$onInit = init;
    vm.loadEntries = loadEntries;

    vm.emptyEntries = false;
    vm.loadData = undefined;

    function loadEntries() {
      if (!vm.widget.id || vm.editMode) {
        vm.loadData = RssWidgetModel
            .getEntriesForPreview(vm.widget.settings.rssUrl, vm.widget.settings.displayImage, vm.widget.settings.maxCount)
            .then(handleFeed);
      } else {
        vm.loadData = RssWidgetModel.getEntries(vm.widget.id).then(handleFeed);
      }

      return vm.loadData;
    }

    function handleFeed(entries) {
      vm.entries = entries;
      return entries;
    }

    function init() {
      var unregisterWatch = $scope.$watch(function () {
        return vm.widget.settings;
      }, function (before, after) {
        if (before !== after) {
          loadEntries();
        }
      });
      $scope.$on('$destroy', unregisterWatch);
      loadEntries();
    }
  }
})(angular);
