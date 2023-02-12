(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.video')
      .controller('VideoWidgetSettingsController', VideoWidgetSettingsController);

  function VideoWidgetSettingsController($scope, $http, $q, $timeout, coyoEndpoints) {
    var vm = this;

    vm.model = $scope.model;
    vm.safeUrl = true;

    vm.checkUrl = checkUrl;

    function checkUrl() {
      // use s.substring() because s.startsWith() is not supported by older IE versions
      vm.safeUrl = !vm.model.settings.url || vm.model.settings.url.substring(0, 8) === 'https://';
    }

    function onBeforeSave() {
      vm.model._loading = true;
      return $http.get(coyoEndpoints.webPreviews.generate, {
        params: {url: vm.model.settings.url},
        autoHandleErrors: false
      }).then(function (response) {
        var data = response.data;
        var videoUrl = data.videoUrl;
        var ratio = (data.width && data.height) ? (data.height / data.width * 100) : 56.25;
        if (videoUrl && ratio) {
          vm.model.settings.backendData = {
            videoUrl: videoUrl,
            ratio: ratio
          };
        } else {
          // do not cache invalid data
          delete vm.model.settings.backendData;
        }
      }).catch(function () {
        // do not cache invalid data
        delete vm.model.settings.backendData;
        return $q.resolve();
      }).finally(function () {
        $timeout(function () {
          vm.model._loading = false;
        });
      });
    }

    (function _init() {
      $scope.saveCallbacks.onBeforeSave = onBeforeSave;
      checkUrl();
    })();
  }

})(angular);
