(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.bookmarking')
      .directive('coyoBookmarkingWidget', bookmarkingWidget)
      .controller('BookmarkingWidgetController', BookmarkingWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.bookmarking.coyoBookmarkingWidget:coyoBookmarkingWidget
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to show bookmarks
   *
   * @param {object} widget
   * The widget configuration
   *
   * @param {boolean} editMode
   * The edit status of the current widget slot
   *
   */
  function bookmarkingWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/bookmarking/bookmarking-widget.html',
      scope: {},
      bindToController: {
        widget: '<',
        editMode: '<'
      },
      controller: 'BookmarkingWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function BookmarkingWidgetController(SettingsModel, $window, $scope) {
    var vm = this;

    vm.bookmarkTitle = '';
    vm.bookmarkUrl = '';
    vm.saveBookmark = false;
    vm.addBookmarkPanel = false;
    vm.validateBookmarkList = validateBookmarkList;
    vm.addBookmark = addBookmark;
    vm.removeBookmark = removeBookmark;
    vm.isRelativeUrl = isRelativeUrl;
    vm.onBookmarkLinkClicked = onBookmarkLinkClicked;

    // Initialisation
    if (!vm.widget.settings._bookmarks) {
      vm.widget.settings._bookmarks = [];
      vm.widget.settings._validBookmarkList = false;
    }

    function addBookmark() {
      if (!vm.saveBookmark) {
        vm.saveBookmark = true;
      } else {
        var title = vm.bookmarkTitle;
        var url = vm.bookmarkUrl;

        vm.widget.settings._bookmarks.splice(vm.widget.settings._bookmarks.length, 0, {title: title, url: url});

        vm.bookmarkTitle = '';
        vm.bookmarkUrl = '';
        vm.saveBookmark = false;
        vm.addBookmarkPanel = false;
        validateBookmarkList();
      }
    }

    function removeBookmark(index) {
      vm.widget.settings._bookmarks.splice(index, 1);
      validateBookmarkList();
    }

    function isRelativeUrl(url) {
      return _(url).startsWith('/');
    }

    function onBookmarkLinkClicked($event) {
      if (vm.editMode) {
        $event.preventDefault();
      }
    }

    SettingsModel.retrieveByKey('linkPattern').then(function (response) {
      vm.linkPattern = response;
    });

    /* Stops in-place editing of url and therefore shows bookmark title if editMode changes (closes) */
    $scope.$watch(function () { return vm.editMode; }, function () {
      vm.editUrlWithIndex = null;
    });

    /* Check for valid bookmarks. Especially needed for editing widget settings inplace */
    function validateBookmarkList() {
      vm.widget.settings._validBookmarkList = _.some(vm.widget.settings._bookmarks, function (bookmark) {
        return !!bookmark.url;
      });
    }
  }

})(angular);
