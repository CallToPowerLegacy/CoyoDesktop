(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.teaser')
      .controller('TeaserWidgetSettingsController', TeaserWidgetSettingsController);

  function TeaserWidgetSettingsController($scope, $translate, SenderModel, backendUrlService, coyoEndpoints) {
    var vm = this;
    vm.model = $scope.model;
    vm.model.settings._size = vm.model.settings._size || 'sm';
    vm.treeOptions = {};
    vm.openConfig = openConfig;
    vm.saveConfig = saveConfig;
    vm.closeConfig = closeConfig;
    vm.deleteSlide = deleteSlide;
    vm.swapListItem = swapListItem;
    vm.setTeaserSize = setTeaserSize;

    // Set default Slides
    var defaultSlides = [
      {
        // https://images.unsplash.com/photo-1482212637574-9bd8a0700a76?dpr=2&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=
        '_image': 'assets/images/widgets/teaser/dummy-content/dreaming_of_clouds.jpg',
        '_url': '/pages/company-news/apps/timeline/timeline',
        'headline': $translate.instant('WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.ONE.HEADLINE'),
        'subheadline': $translate.instant('WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.ONE.SUBHEADLINE'),
        '_newTab': false
      },
      {
        // https://images.unsplash.com/photo-1466150036782-869a824aeb25?dpr=2&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=
        '_image': 'assets/images/widgets/teaser/dummy-content/favorit_act.jpg',
        '_url': '/pages/company-news/apps/timeline/timeline',
        'headline': $translate.instant('WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.TWO.HEADLINE'),
        'subheadline': $translate.instant('WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.TWO.SUBHEADLINE'),
        '_newTab': false
      },
      {
        // https://images.unsplash.com/photo-1450101499163-c8848c66ca85?dpr=2&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop=
        '_image': 'assets/images/widgets/teaser/dummy-content/new_client.jpg',
        '_url': '/pages/company-news/apps/timeline/timeline',
        'headline': $translate.instant('WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.THREE.HEADLINE'),
        'subheadline': $translate.instant('WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.THREE.SUBHEADLINE'),
        '_newTab': false
      }
    ];

    function openConfig(index) {
      if (angular.isUndefined(index)) {
        vm.model.editing = false;
      } else {
        vm.model.editingIndex = index;
        vm.model.editing = true;
        vm.model.config = vm.model.settings.slides[index];
      }
      vm.configSlide = true;
    }

    function saveConfig() {
      if (angular.isDefined(vm.file)) {
        var file = vm.file;
        if (!vm.model.config) {
          vm.model.config = {};
        }
        vm.model.config._image = _createPreviewUrl(file.senderId, file.id, 'ORIGINAL', file.modified);
      }

      if (!vm.model.editing) {
        // New slide
        if (vm.model.config) {
          vm.model.settings.slides.push(vm.model.config);
        }
      } else {
        // Edit existing slide
        vm.model.settings.slides[vm.model.editingIndex] = vm.model.config;
      }

      _clearConfig();
      vm.configSlide = false;
    }

    function closeConfig() {
      _clearConfig();
      vm.configSlide = false;
    }

    function deleteSlide(index) {
      vm.model.settings.slides.splice(index, 1);
    }

    function swapListItem(oldIndex, newIndex) {
      var temp = vm.model.settings.slides[newIndex];
      vm.model.settings.slides[newIndex] = vm.model.settings.slides[oldIndex];
      vm.model.settings.slides[oldIndex] = temp;
    }

    function setTeaserSize(size) {
      vm.model.settings._size = size;
    }

    function _clearConfig() {
      vm.file = undefined;
      vm.model.config = undefined;
    }

    function _setDefaultSlides() {
      if (!vm.model.settings.slides || vm.model.settings.slides.length < 1) {
        vm.model.settings.slides = defaultSlides;
      }
    }

    function _createPreviewUrl(senderId, documentId, size, modified) {
      var baseUrl = backendUrlService.getUrl() + coyoEndpoints.sender.preview.replace('{{groupId}}', senderId).replace('{{id}}', documentId);
      var _modified = modified ? ('&modified=' + modified) : '';
      return baseUrl + (baseUrl.indexOf('?') < 0 ? '?' : '&') + 'imageSize=' + size + _modified;
    }

    (function _init() {
      vm.loading = true;
      _setDefaultSlides();

      var senderIdOrSlug = SenderModel.getCurrentIdOrSlug();
      if (angular.isDefined(senderIdOrSlug)) {
        SenderModel.getWithPermissions(senderIdOrSlug, {}, ['manage', 'createFile']).then(function (sender) {
          vm.model.sender = sender;
        });
      }

      vm.loading = false;
    })();
  }
})(angular);
