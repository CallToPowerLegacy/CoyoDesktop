(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.wiki')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "APP.WIKI.ARTICLE_OPTIONS": "Options",
          "APP.WIKI.ARTICLE_PLURAL": "Articles",
          "APP.WIKI.ARTICLE_SINGULAR": "Article",
          "APP.WIKI.ARTICLE_NONE": "Articles",
          "APP.WIKI.ARTICLE.EDITING_OPTIONS.LOCKED.INFO": "This article is currently being edited by {lockHolder}. Started {formattedLockDate}.",
          "APP.WIKI.ARTICLE.EDITING_OPTIONS.SET_AS_HOME_ARTICLE": "Set as Home Article",
          "APP.WIKI.ARTICLE.EDITING_OPTIONS.UNLOCK": "Unlock",
          "APP.WIKI.ARTICLE.EDITING_OPTIONS.REVERT": "Revert to this version",
          "APP.WIKI.ARTICLE.HOME_ARTICLE.MODAL.TITLE": "Set as Home Article",
          "APP.WIKI.ARTICLE.HOME_ARTICLE.MODAL.TEXT.HOME_SET": "Do you really want to set this article as home article for the wiki '{wikiName}'? This will replace the currently set home article.",
          "APP.WIKI.ARTICLE.HOME_ARTICLE.MODAL.TEXT.HOME_NOT_SET": "Do you really want to set this article as home article for the wiki '{wikiName}'?",
          "APP.WIKI.ARTICLE.HOME_ARTICLE.NOTIFICATION.SUCCESS": "Successfully set as home article.",
          "APP.WIKI.ARTICLE.LATEST.BEFORE_LINK": "You are viewing an older version of this article. Click ",
          "APP.WIKI.ARTICLE.LATEST.LINK": "here",
          "APP.WIKI.ARTICLE.LATEST.AFTER_LINK": " for the latest version.",
          "APP.WIKI.ARTICLE.NEW": "New",
          "APP.WIKI.ARTICLE.OVERVIEW": "Overview",
          "APP.WIKI.ARTICLE.TITLE": "Title",
          "APP.WIKI.ARTICLE.UPDATED": "Updated",
          "APP.WIKI.ARTICLE.DELETE.MULTIPLE.TEXT": "Deleting this article also deletes {noOfArticles} {noOfArticles, plural, =0 {sub-articles} =1 {sub-article} other {sub-articles}} and {noOfArticles, plural, =0 {their} =1 {its} other {their}} sub-articles.",
          "APP.WIKI.ARTICLE.DELETE.HOME.TEXT": "This article is set as the home article of this app. If you delete it the app will return to showing the list of articles on start.",
          "APP.WIKI.ARTICLE.DELETE.WARNING.TITLE": "Attention:",
          "APP.WIKI.HEADER.SUBARTICLES": "{noOfArticles, plural, =0 {sub-articles} =1 {sub-article} other {sub-articles}}",
          "APP.WIKI.COMMENTS.TITLE": "Comments",
          "APP.WIKI.COMMENTS.DESCRIPTION": "Users can comment on wiki articles",
          "APP.WIKI.CREATE": "Create Article",
          "APP.WIKI.DESCRIPTION": "The wiki app allows you to create a custom wiki space including articles and content editing.",
          "APP.WIKI.EDITORS": "Editors",
          "APP.WIKI.EDITORTYPE.ADMIN.DESCRIPTION": "Only admins can edit wiki articles",
          "APP.WIKI.EDITORTYPE.ADMIN.NAME": "Admins",
          "APP.WIKI.EDITORTYPE.VIEWER.DESCRIPTION": "Everyone can edit wiki articles",
          "APP.WIKI.EDITORTYPE.VIEWER.NAME": "Everyone",
          "APP.WIKI.EMPTY": "This wiki does not have any articles, yet.",
          "APP.WIKI.EMPTY_LINK": "Create the first article now.",
          "APP.WIKI.HIDE_AUTHORS.TITLE": "Hide author",
          "APP.WIKI.HIDE_AUTHORS.DESCRIPTION": "Users are not able to see the author of a wiki article",
          "APP.WIKI.HIDE_AUTHORS.HELP": "Admins will still be able to see the author by viewing the article's history.",
          "APP.WIKI.MODAL.DELETE.TEXT": "Do you really want to delete the article '{title}'? The deletion cannot be undone.",
          "APP.WIKI.MODAL.DELETE.TITLE": "Delete Article",
          "APP.WIKI.MODAL.LOCK.REMOVED.TEXT": "Your lock on the article has been removed. It's possible that you cannot save this article any longer without data loss.",
          "APP.WIKI.MODAL.LOCK.REMOVED.TITLE": "Lock removed",
          "APP.WIKI.MODAL.UNLOCK.TEXT": "Do you really want to unlock this article for editing? This could potentially lead to data loss and confusion when {lockHolder} is done editing the article and tries to save it.",
          "APP.WIKI.MODAL.UNLOCK.TITLE": "Unlock Article",
          "APP.WIKI.NAME": "Wiki",
          "APP.WIKI.SELECT.PARENT.LABEL": "Create in",
          "APP.WIKI.SELECT.PARENT.NO_ARTICLES_FOUND": "No article",
          "APP.WIKI.HISTORY": "History",
          "APP.WIKI.HISTORY.TITLE": "Wiki Article History",
          "APP.WIKI.HOME.TITLE": "Home Article",
          "APP.WIKI.HOME.HELP": "Define an article that users should see first when they open this app.",
          "ENTITY_TYPE.WIKI_ARTICLE": "Wiki Article",
          "NOTIFICATIONS.WIKI.ARTICLE.PUBLISHED": "*{s1}* has published the article '*{s2}*' in *{s3}*.",
          "NOTIFICATIONS.WIKI.ARTICLE.PUBLISHED_NO_AUTHOR": "Article '*{s2}*' was published in  *{s3}*."
        });
        /* eslint-enable quotes */
      });
})(angular);
