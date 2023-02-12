(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.wiki')
      .controller('WikiArticleViewController', WikiArticleViewController);

  /**
   * Controller for viewing and inline-editing a wiki article.
   *
   * @requires $rootScope
   * @requires $scope
   * @requires $state
   * @requires $stateParams
   * @requires $log
   * @requires $timeout
   * @requires $q
   * @requires moment
   * @requires modalService
   * @requires coyoNotification
   * @requires coyo.apps.wiki.wikiArticleRevisionsModal
   * @requires commons.ui.alertConfirmModalService
   * @requires coyo.widgets.api.widgetLayoutService
   * @requires commons.sockets.socketService
   * @requires coyo.apps.wiki.WikiArticleModel
   * @requires coyo.apps.wiki.wikiArticleService
   * @requires app
   * @requires article
   * @requires editMode
   * @requires currentUser
   * @requires coyo.domain.SettingsModel
   * @requires sender
   * @requires coyo.apps.wiki.wikiArticleTranslationService
   */
  function WikiArticleViewController($rootScope, $scope, $state, $stateParams, $log, $timeout, $q, moment, modalService,
                                     coyoNotification, wikiArticleRevisionsModal, alertConfirmModalService,
                                     widgetLayoutService, socketService, WikiArticleModel, wikiArticleService, app,
                                     article, editMode, currentUser, SettingsModel, sender,
                                     wikiArticleTranslationService) {
    var vm = this;

    vm.$onInit = init;
    vm.app = app;
    vm.article = article;
    vm.editMode = editMode;
    vm.loading = true;
    vm.moment = moment;
    vm.simpleMode = true;

    vm.edit = edit;
    vm.setAsHomeArticle = setAsHomeArticle;
    vm.cancel = cancel;
    vm.save = save;
    vm.deleteArticle = deleteArticle;
    vm.removeLock = removeLock;
    vm.showRevisions = showRevisions;
    vm.openRevision = openRevision;

    function removeLock() {
      alertConfirmModalService.confirm({
        title: 'APP.WIKI.MODAL.UNLOCK.TITLE',
        text: 'APP.WIKI.MODAL.UNLOCK.TEXT',
        alertClass: 'alert-danger',
        translationContext: {
          lockHolder: vm.article.lockHolder.displayName
        }
      }).then(function () {
        wikiArticleService.unlock(vm.article).then(function () {
          _refreshLockInformation();
        });
      });
    }

    function deleteArticle(article) {
      wikiArticleService.deleteArticle(vm.app, article).then(function () {
        $state.go('^');
      });
    }

    function edit() {
      wikiArticleService.lock(vm.article, currentUser).then(function (lock) {
        vm.editMode = true;
        angular.extend(vm.article, lock);
        widgetLayoutService.edit($scope);
      }).catch(_refreshLockInformation);
    }

    function setAsHomeArticle() {
      var modaltext = vm.app.settings.home ? 'APP.WIKI.ARTICLE.HOME_ARTICLE.MODAL.TEXT.HOME_SET'
        : 'APP.WIKI.ARTICLE.HOME_ARTICLE.MODAL.TEXT.HOME_NOT_SET';
      modalService.confirm({
        title: 'APP.WIKI.ARTICLE.HOME_ARTICLE.MODAL.TITLE',
        text: modaltext,
        translationContext: {wikiName: vm.app.name},
        close: {title: 'YES'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        vm.app.settings.home = vm.article.id;
        vm.app.save().then(function (app) {
          $rootScope.$emit('app:updated', app);
          vm.app = app;
          coyoNotification.success('APP.WIKI.ARTICLE.HOME_ARTICLE.NOTIFICATION.SUCCESS');
        });
      });
    }

    function cancel() {
      vm.loading = true;
      wikiArticleService.releaseLock(vm.article, currentUser, false).finally(function () {
        widgetLayoutService.cancel($scope);
        _reloadInViewMode();
      });
    }

    function save() {
      wikiArticleTranslationService.prepareTranslations();

      var deferred = $q.defer();
      vm.loading = true;

      vm.article.update().then(function (savedArticle) {
        wikiArticleTranslationService.cleanup().then(function () {
          $timeout(function () { // wait to sync id to widget layout and slots
            widgetLayoutService.save($scope).then(function () {
              vm.editMode = false;
              wikiArticleService.releaseLock(savedArticle, currentUser, true).then(function () {
                deferred.resolve();
                _reloadInViewMode();
              });
            }).catch(function () {
              widgetLayoutService.edit($scope);
              deferred.reject();
            }).finally(function () {
              vm.loading = false;
            });
          });
        });
      }).catch(function () {
        deferred.reject();
        vm.loading = false;
      });

      return deferred.promise;
    }

    function showRevisions() {
      wikiArticleRevisionsModal.open(vm.article).then(openRevision);
    }

    function openRevision(revision) {
      $state.go($state.current, {revision: revision, editMode: false}, {reload: $state.current});
    }

    /******************* Helper methods *******************/

    function _refreshLockInformation() {
      var context = {
        senderId: vm.app.senderId,
        appId: vm.app.id,
        id: vm.article.id
      };
      return WikiArticleModel.getWithPermissions(context, {}, ['edit', 'delete']).then(function (article) {
        vm.article.locked = article.locked;
        vm.article.lockDate = article.lockDate;
        vm.article.lockHolder = article.lockHolder;
      });
    }

    function _reloadParentArticles() {
      vm.parentArticles = [];
      _loadParentArticles(article);
    }

    function _loadParentArticles(article) {
      if (!article.parentId || _.find(vm.parentArticles, {id: article.parentId})) {
        return;
      }
      var context = {
        senderId: app.senderId,
        appId: app.id,
        id: article.parentId
      };
      WikiArticleModel.getWithPermissions(context, {}, ['edit', 'delete']).then(function (article) {
        vm.parentArticles.unshift(article);
        _loadParentArticles(article);
      });
    }

    function _handleRemoved(event) {
      $log.debug('[WikiArticleService] Received event for wiki article lock removed', event);
      var previousHolder = event.content.previousHolder;

      // I had the lock (and I was in edit mode) -> show note that lock got removed
      if (vm.editMode && previousHolder === currentUser.id) {
        modalService.note({
          title: 'APP.WIKI.MODAL.LOCK.REMOVED.TITLE',
          text: 'APP.WIKI.MODAL.LOCK.REMOVED.TEXT'
        });
        _refreshLockInformation();
      }
    }

    function _handleReleased(event) {
      // someone else had the lock (and I wasn't in edit mode) -> update article
      $log.debug('[WikiArticleService] Received event for wiki article lock released', event);
      if (event.content.changed) {
        vm.article.latestRevision = false;
      }
      if (!vm.editMode) {
        _refreshLockInformation();
      }
    }

    function _handleLocked(event) {
      $log.debug('[WikiArticleService] Received event for wiki article lock set', event);
      if (!vm.editMode) {
        _refreshLockInformation();
      }
    }

    function _reloadInViewMode() {
      var stateParams = angular.extend(angular.copy($stateParams), {
        editMode: false
      });
      delete stateParams.revision;
      $state.transitionTo($state.current, stateParams, {
        reload: $state.current, inherit: false, notify: true
      });
    }

    /* ===== PRIVATE METHODS ===== */

    function init() {
      if (vm.article.wikiArticles > 0) {
        WikiArticleModel.getSubArticles(vm.app, vm.article.id).then(function (subArticles) {
          vm.subArticles = subArticles;
        });
      }

      widgetLayoutService.onload($scope).then(function () {
        if (vm.editMode && (!wikiArticleService.isLocked(vm.article)
                || wikiArticleService.hasLock(article, currentUser))) {
          edit();
        } else {
          vm.editMode = false;
        }
      }).finally(function () {
        vm.loading = false;
      });

      $scope.$watch(function () { return vm.article.parentId; }, function (newVal) {
        if (newVal === vm.article.id) {
          vm.article.parentId = null;
        }
      });

      _reloadParentArticles();

      var lock = '/topic/item.' + article.id + '.lock',
          unsubscribeSocketSubscriptionLocked = socketService.subscribe(lock, _handleLocked, 'set'),
          unsubscribeSocketSubscriptionUnlocked = socketService.subscribe(lock, _handleRemoved, 'removed'),
          unsubscribeSocketSubscriptionReleased = socketService.subscribe(lock, _handleReleased, 'released');

      $scope.$on('$destroy', function () {
        unsubscribeSocketSubscriptionLocked();
        unsubscribeSocketSubscriptionUnlocked();
        unsubscribeSocketSubscriptionReleased();
        if (vm.editMode) {
          wikiArticleService.releaseLock(vm.article, currentUser);
        }
      });

      _initTranslations();
    }

    function _initTranslations() {

      wikiArticleTranslationService.init($scope, vm, sender);

      var translations = [];
      _.forEach(vm.languages, function (value, key) {
        if (value.active && Object.keys(value.translations).length) {
          translations.push(key);
        }
      });

      currentUser.getBestSuitableLanguage(translations, SettingsModel.retrieve).then(function (language) {
        if (language !== 'NONE') {
          vm.currentLanguage = language;
          vm.languageInitialised[language] = true;
        }
      });
    }
  }
})(angular);
