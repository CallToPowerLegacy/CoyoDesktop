(function (angular) {
  'use strict';

  angular
      .module('coyo.timeline')
      .controller('TimelineFormController', TimelineFormController)
      .controller('SelectStickyModalController', SelectStickyModalController)
      .controller('RestrictionSelectionModalController', RestrictionSelectionModalController)
      .controller('SelectAttachmentModalController', SelectAttachmentModalController);

  function TimelineFormController($scope, $rootScope, $log, $translate, $sce, $element, TimelineItemModel, authService,
                                  tempUploadService, webPreviewService, oembedVideoService, utilService, modalService) {
    var vm = this;
    var inModal = angular.isDefined($scope.vm);
    var POST_AS_TRANSLATION = $translate.instant('MODULE.TIMELINE.FORM.POST_AS');

    vm.screenSize = $rootScope.screenSize;
    vm.staticSenderOptions = [];
    vm.uuid = utilService.uuid();

    vm.stickyExpiryOptions = [
      {expiry: 1000 * 60 * 60 * 24, label: 'MODULE.TIMELINE.STICKY.EXPIRY.ONE_DAY'},
      {expiry: 1000 * 60 * 60 * 24 * 7, label: 'MODULE.TIMELINE.STICKY.EXPIRY.ONE_WEEK'},
      {expiry: 1000 * 60 * 60 * 24 * 30, label: 'MODULE.TIMELINE.STICKY.EXPIRY.ONE_MONTH'},
      {expiry: 1000 * 60 * 60 * 24 * 365, label: 'MODULE.TIMELINE.STICKY.EXPIRY.ONE_YEAR'}
    ];

    vm.restrictionOptions = [
      {restricted: true, label: 'YES', icon: 'zmdi-lock'},
      {restricted: false, label: 'NO', icon: 'zmdi-lock-open'}
    ];

    vm.$onInit = init;
    vm.save = save;
    vm.openModalSelectSticky = openModalSelectSticky;
    vm.openRestrictionSelectionModal = openRestrictionSelectionModal;
    vm.onBlur = onBlur;
    vm.onKeyDown = onKeyDown;
    vm.fetchWebPreviews = fetchWebPreviews;
    vm.findNewUrls = findNewUrls;
    vm.addAttachments = addAttachments;
    vm.selectSenderOptionGroups = selectSenderOptionGroups;
    vm.openModalSelectAttachments = openModalSelectAttachments;
    vm.addFileLibraryAttachments = addFileLibraryAttachments;

    // --------------------------------------------------------------------------------------------------------

    function init() {
      if (!vm.contextId) {
        throw new Error('[TimelineFormController] Context ID required but not found.');
      }

      if (!vm.timelineType) {
        throw new Error('[TimelineFormController] Timeline type required but not found.');
      }


      // load current user
      authService.getUser().then(function (user) {
        vm.currentUser = user;
        _reset();
      });

      authService.onGlobalPermissions('ACT_AS_SENDER', function (canActAsSender) {
        vm.canActAsSender = canActAsSender;
      });
    }

    function _reset() {
      vm.newItemAttachments = [];
      vm.newItemLinkPreviews = [];
      vm.newItemVideoPreviews = [];
      vm.failedWebPreviews = [];
      vm.author = vm.currentUser;
      vm.currentUser.typeLabelTranslated = $translate.instant('MODULE.TIMELINE.FORM.POST_AS_CURRENT_USER_SUBLINE');
      vm.staticSenderOptions = [vm.currentUser];
      vm.newItemModel = new TimelineItemModel({
        authorId: vm.currentUser.id,
        type: 'post',
        restricted: false,
        data: {
          message: ''
        }
      });
      vm.stickyExpiry = null;

      if (vm.form) {
        vm.form.$setPristine();
        vm.form.$setUntouched();
      }
    }

    // --------------------------------------------------------------------------------------------------------

    function save() {
      if (vm.form.$valid && _.filter(vm.newItemAttachments, {uploading: true}).length === 0) {
        vm.saving = true;

        vm.newItemModel.authorId = vm.author ? vm.author.id : vm.currentUser.id;
        vm.newItemModel.recipientIds = [vm.timelineType === 'personal' ? vm.author.id : vm.contextId];
        vm.newItemModel.stickyExpiry = vm.stickyExpiry ? new Date().getTime() + vm.stickyExpiry : null;
        vm.newItemModel.attachments = _.map(vm.newItemAttachments, function (attachment) {
          return {
            name: attachment.name,
            uid: attachment.uid,
            contentType: attachment.contentType
          };
        });

        vm.newItemModel.linkPreviews = vm.newItemLinkPreviews;
        vm.newItemModel.videoPreviews = vm.newItemVideoPreviews;
        webPreviewService.cancelGenerateRequest('user submitted form');

        return vm.newItemModel.create().then(_reset).finally(function () {
          vm.saving = false;

          if (inModal) {
            $scope.$dismiss('cancel'); //eslint-disable-line
          }
        });
      } else {
        return null;
      }
    }

    function addFileLibraryAttachments(files) {
      vm.newItemModel.fileLibraryAttachments = _.unionBy(vm.newItemModel.fileLibraryAttachments,
          files, 'fileId');

      vm.focusMessageFormField = true;
    }

    /**
     * Opens the modal for restriction selection
     */
    function openRestrictionSelectionModal() {
      modalService.open({
        templateUrl: 'app/modules/timeline/components/timeline-form/timeline-form-modal-select-restriction.html',
        controller: 'RestrictionSelectionModalController',
        controllerAs: '$ctrl',
        resolve: {
          restrictionOptions: function () {
            return vm.restrictionOptions;
          },
          restricted: function () {
            return vm.restricted;
          }
        }
      }).result.then(function (selection) {
        vm.restricted = selection;
      });
    }

    /**
     * Opens the modal for marking the post as sticky
     */
    function openModalSelectSticky() {
      modalService.open({
        templateUrl: 'app/modules/timeline/components/timeline-form/timeline-form-modal-select-sticky.html',
        controller: 'SelectStickyModalController',
        controllerAs: '$ctrl',
        resolve: {
          stickyExpiryOptions: function () {
            return vm.stickyExpiryOptions;
          },
          stickyExpiry: function () {
            return vm.stickyExpiry;
          }
        }
      }).result.then(function (selection) {
        vm.stickyExpiry = selection;
      });
    }

    /**
     * Opens the modal for adding attachments
     */
    function openModalSelectAttachments() {
      modalService.open({
        templateUrl: 'app/modules/timeline/components/timeline-form/timeline-form-modal-select-attachment.html',
        controller: 'SelectAttachmentModalController',
        controllerAs: '$ctrl',
        resolve: {
          context: function () {
            return vm.timelineType === 'personal' ? vm.author : {id: vm.contextId};
          }
        }
      }).result.then(function (result) {
        if (result.attachments) {
          addAttachments(result.attachments);
        }
        if (result.fileLibraryAttachments) {
          vm.newItemModel.fileLibraryAttachments = _.unionBy(vm.newItemModel.fileLibraryAttachments,
              result.fileLibraryAttachments, 'fileId');
        }
      });
    }

    function onBlur() {
      vm.focusMessageFormField = false;
      if (!_.isUndefined(vm.newItemModel.data.message)) {
        vm.fetchWebPreviews(vm.newItemModel.data.message);
      }
    }

    function onKeyDown($event) {
      if ($event.ctrlKey && $event.keyCode === 13) {
        $event.preventDefault();
        vm.save();
      } else if ($event.keyCode === 32 || $event.keyCode === 13 || $event.tab) {
        if (!_.isUndefined(vm.newItemModel.data.message)) {
          vm.fetchWebPreviews(vm.newItemModel.data.message);
        }
      }
    }

    function fetchWebPreviews(message) {
      if (!_.isEmpty(message)) {
        var newUrls = findNewUrls(message);

        if (!_.isEmpty(newUrls)) {
          webPreviewService.generateWebPreviews(newUrls).then(function (webPreviews) {
            addWebPreviews(newUrls, webPreviews);
          }).catch(function (error) {
            $log.error('An error occurred while retrieving the link preview image ', error);
          });
        }
      }
    }

    function findNewUrls(message) {
      var newUrls = new Array();

      _.forEach(webPreviewService.extractUrls(message), function (url) {
        if (!_.find(vm.newItemLinkPreviews, ['url', url]) && !_.includes(vm.failedWebPreviews, url)) {
          newUrls.push(url);
        }
      });

      return newUrls;
    }

    function addWebPreviews(urls, webPreviews) {
      angular.forEach(updatePositions(webPreviews), function (webPreview) {
        if (_.isEqual(webPreview.type, 'LINK')) {
          vm.newItemLinkPreviews.push(webPreview);
        } else if (_.isEqual(webPreview.type, 'VIDEO')) {
          var videoElement = getEmbedCode(webPreview);
          if (!_.isUndefined(videoElement)) {
            webPreview.embedCode = videoElement;
          }
          vm.newItemVideoPreviews.push(webPreview);
        }
      });

      /* failed previews are apparently those for which there is no matching url */
      angular.forEach(urls, function (url) {
        if (!_.find(vm.newItemLinkPreviews, ['url', url])) {
          vm.failedWebPreviews.push(url);
        }
      });

      vm.focusMessageFormField = true;
    }

    function updatePositions(linkPreviews) {
      var lpWithHighestPosition = _.maxBy(vm.newItemLinkPreviews, 'position');
      var nextHighestPosition = _.isUndefined(lpWithHighestPosition) ? 0 : lpWithHighestPosition.position + 1;

      angular.forEach(linkPreviews, function (linkPreview) {
        if (nextHighestPosition !== 0 && nextHighestPosition >= linkPreview.position) {
          linkPreview.position = linkPreview.position + nextHighestPosition;
        }
      });

      return linkPreviews;
    }

    function getEmbedCode(webPreview) {
      var videoElement = oembedVideoService.createEmbedCode(webPreview, $element[0]);
      if (videoElement) {
        return {
          url: webPreview.videoUrl,
          html: $sce.trustAsHtml(videoElement.prop('outerHTML')),
          heightPercentage: oembedVideoService.getHeightPercentage(videoElement)
        };
      }
      return undefined;
    }

    function addAttachments(files) {
      vm.newItemAttachments.push.apply(vm.newItemAttachments, files);

      angular.forEach(files, function (file) {
        tempUploadService.upload(file, 300).then(function (blob) {
          angular.extend(file, blob);
        }).catch(function () {
          vm.attachments = _.reject(vm.attachments, file);
        });
      });

      vm.focusMessageFormField = true;
    }

    function selectSenderOptionGroups(option) {
      return vm.staticSenderOptions.indexOf(option) > -1 ? POST_AS_TRANSLATION : undefined;
    }
  }

  function SelectStickyModalController($uibModalInstance, stickyExpiryOptions, stickyExpiry) {
    var vm = this;

    vm.stickyExpiryOptions = stickyExpiryOptions;
    vm.stickyExpiry = stickyExpiry;

    vm.setExpiryDate = setExpiryDate;

    /**
     * Returns the value for the expiry date and closes the modal.
     *
     * @param {number} stickyExpiry The sticky expiry date
     */
    function setExpiryDate(stickyExpiry) {
      vm.stickyExpiry = stickyExpiry;
      $uibModalInstance.close(vm.stickyExpiry);
    }
  }

  function RestrictionSelectionModalController($uibModalInstance, restrictionOptions, restricted) {
    var vm = this;

    vm.restrictionOptions = restrictionOptions;
    vm.restricted = restricted;

    vm.setRestriction = setRestriction;

    /**
     * Returns the value for the restriction and closes the modal.
     *
     * @param {number} restricted post restriction state
     */
    function setRestriction(restricted) {
      vm.restricted = restricted;
      $uibModalInstance.close(vm.restricted);
    }
  }

  function SelectAttachmentModalController(fileLibraryModalService, $uibModalInstance, context) {
    var vm = this;
    vm.context = context;

    vm.openFileLibrary = openFileLibrary;
    vm.addAttachments = addAttachments;

    function openFileLibrary() {
      fileLibraryModalService.open(vm.context,
          {selectMode: 'multiple'})
          .then(function (selectedFiles) {
            $uibModalInstance.close({
              fileLibraryAttachments: _.map(selectedFiles, function (elem) {
                return {
                  fileId: elem.id,
                  senderId: elem.senderId,
                  displayName: elem.displayName
                };
              })
            });
          });
    }

    function addAttachments(files) {
      $uibModalInstance.close({attachments: files});
    }

  }

})(angular);
