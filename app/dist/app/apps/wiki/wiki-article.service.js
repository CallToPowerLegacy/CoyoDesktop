(function () {
  'use strict';

  angular.module('coyo.apps.wiki')
      .factory('wikiArticleService', wikiArticleService);

  /**
   * @ngdoc service
   * @name coyo.apps.wiki.wikiArticleService
   *
   * @description
   * This service provides a common way manage articles.
   *
   * @requires $log
   * @requires commons.ui.alertConfirmModalService
   */
  function wikiArticleService($log, $q, $interval, alertConfirmModalService) {
    var lockInterval = {};
    var lockIntervalMilliseconds = 5 * 60 * 1000;

    return {
      deleteArticle: deleteArticle,
      lock: lock,
      unlock: unlock,
      releaseLock: releaseLock,
      isLocked: isLocked,
      hasLock: hasLock
    };

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleService#deleteArticle
     * @methodOf coyo.apps.wiki.wikiArticleService
     *
     * @description
     * Opens a modal to delete an article. It checks whether the article has subarticles or is currently the home
     * article of the app. If this is the case warnings are displayed.
     *
     * @param {object} app
     * The app the article belongs to
     *
     * @param {object} article
     * The article to delete
     *
     * @returns {object} a promise which is resolved after the article is deleted.
     */
    function deleteArticle(app, article) {
      var alerts = [];
      var translationContext = {
        title: article.title
      };

      if (article.wikiArticles > 0) {
        alerts.push({
          alertClass: 'alert-danger',
          alertTitle: 'APP.WIKI.ARTICLE.DELETE.WARNING.TITLE',
          alertText: 'APP.WIKI.ARTICLE.DELETE.MULTIPLE.TEXT'
        });
        translationContext.noOfArticles = article.wikiArticles;
      }

      if (app.settings.home === article.id) {
        alerts.push({
          alertClass: 'alert-danger',
          alertTitle: 'APP.WIKI.ARTICLE.DELETE.WARNING.TITLE',
          alertText: 'APP.WIKI.ARTICLE.DELETE.HOME.TEXT'
        });
      }

      return alertConfirmModalService.confirm({
        title: 'APP.WIKI.MODAL.DELETE.TITLE',
        text: 'APP.WIKI.MODAL.DELETE.TEXT',
        alerts: alerts,
        translationContext: translationContext
      }).then(function () {
        return article.delete().then(function () {
          if (app.settings.home === article.id) {
            $log.debug('Deleted home article. Removing article as home from wiki app.');
            app.settings.home = '';
            return app.save();
          }
          return undefined; // return undefined to have a consistent return value
        });
      });
    }

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleService#lock
     * @methodOf coyo.apps.wiki.wikiArticleService
     *
     * @description
     * Locks the given article for the current user and renews the lock every five minutes. Locking fails if the user
     * does not have the permission to lock the article or if the article is already locked. If successfully locked an
     * `/topic/item.&lt;article-id&gt;.lock.set` event is broadcast via websockets.
     *
     * @param {object} article
     * The article to lock.
     *
     * @param {object} currentUser
     * The current user who locks the article.
     *
     * @returns {object} A promise which is resolved on success and rejected if the lock could not be acquired.
     */
    function lock(article, currentUser) {
      var deferred = $q.defer();
      article.lock().then(function (lock) {
        if (hasLock(lock, currentUser)) {
          _startLockRefreshInterval(lock);
          deferred.resolve(lock);
        } else {
          deferred.reject();
        }
      });
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleService#unlock
     * @methodOf coyo.apps.wiki.wikiArticleService
     *
     * @description
     * (Forcefully) unlocks the given article independently of who owns the lock right now and stops the renewing of
     * the lock. Unlocking fails if the user does not have the permission to unlock the article. If successfully
     * unlocked a `/topic/item.&lt;article-id&gt;.lock.removed` event is broadcast via websockets.
     *
     * @param {object} article The article to unlock.
     * @returns {object} A promise which is resolved if unlocking was successful and rejected if it failed.
     */
    function unlock(article) {
      return article.unlock().then(function () {
        _cancelLockRefreshInterval(article);
      });
    }

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleService#releaseLock
     * @methodOf coyo.apps.wiki.wikiArticleService
     *
     * @description
     * Releases the lock from the given article if it is owned by the current user. If successfully released
     * a `/topic/item.&lt;article-id&gt;.lock.released` event is broadcast via websockets. The renewing of the lock is
     * stopped if the current user owns the lock - regardless if the actual unlocking was successful or not.
     *
     * @param {object} article
     * The article to unlock
     *
     * @param {object} currentUser
     * The current user who releases the article. This user needs to own the lock to the article. If not, nochting
     * happens.
     *
     * @param {boolean=false} changed
     * If the article was changed, this parameter should be set `true`. This way event recipients can see that they need
     * to refresh the article.
     *
     * @returns {object} A promise which is resolved if releasing the lock was successful and rejected in any other
     * case.
     */
    function releaseLock(article, currentUser, changed) {
      var deferred = $q.defer();
      if (isLocked(article) && hasLock(article, currentUser)) {
        return article.unlock(changed).finally(function () {
          _cancelLockRefreshInterval(article);
        });
      }
      deferred.reject();
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleService#isLocked
     * @methodOf coyo.apps.wiki.wikiArticleService
     *
     * @description
     * Returns whether the given article is locked.
     *
     * @param {object} lockable
     * The lockable entity to check.
     *
     * @returns {boolean} `true` if the given article is locked, `false` otherwise.
     */
    function isLocked(lockable) {
      return lockable.locked;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.wiki.wikiArticleService#hasLock
     * @methodOf coyo.apps.wiki.wikiArticleService
     *
     * @description
     * Returns whether the given lock is owned by the given user.
     *
     * @param {object} lockable
     * The lockable entity to check
     *
     * @param {object} user
     * The user to check
     *
     * @returns {boolean} `true` if the given article is locked by the given user, `false` otherwise.
     */
    function hasLock(lockable, user) {
      return (!!lockable.lockHolder && (lockable.lockHolder.id === user.id));
    }

    /******************* PRIVATE METHODS *******************/

    function _startLockRefreshInterval(lockable) {
      lockInterval[lockable.id] = $interval(function () {
        _refreshLock(lockable);
      }, lockIntervalMilliseconds);
    }

    function _cancelLockRefreshInterval(lockable) {
      $interval.cancel(lockInterval[lockable.id]);
      delete lockInterval[lockable.id];
    }

    function _refreshLock(article) {
      article.lock().then(function (lock) {
        $log.debug('[WikiArticleService] Refreshed lock', lock);
      }).catch(function () {
        _cancelLockRefreshInterval(article);
      });
    }

  }

})();
