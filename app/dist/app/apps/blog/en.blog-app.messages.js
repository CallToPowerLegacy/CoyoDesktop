(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.blog')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "APP.BLOG.ARTICLE.OVERVIEW": "Overview",
          "APP.BLOG.ARTICLE.PUBLISH_AS_AUTHOR": "Publish in the author's name",
          "APP.BLOG.ARTICLE.PUBLISH_AS_SENDER": "Publish in the name of this page or workspace",
          "APP.BLOG.ARTICLE.PUBLISH_AS_AUTHOR_HELP": "You can choose between publishing the article in your name or in the name of the page or workspace containing this app.",
          "APP.BLOG.ARTICLE.STATUS.DRAFT.HELP": "Only admins, publishers and you are able to see and edit the draft.",
          "APP.BLOG.ARTICLE.STATUS.DRAFT.LABEL": "Draft",
          "APP.BLOG.ARTICLE.STATUS.PUBLISHED.DATEPICKER.HELP": "Defaults to the current date.",
          "APP.BLOG.ARTICLE.STATUS.PUBLISHED.HELP": "Publish this article immediately.",
          "APP.BLOG.ARTICLE.STATUS.PUBLISHED.LABEL": "Published",
          "APP.BLOG.ARTICLE.STATUS.PUBLISHED.RAISE_NOTIFICATION": "Raise Notification to All Subscribers",
          "APP.BLOG.ARTICLE.STATUS.PUBLISHED_AT.HELP": "Publish this article at the specified date.",
          "APP.BLOG.ARTICLE.STATUS.PUBLISHED_AT.LABEL": "Published At",
          "APP.BLOG.ARTICLE.STATUS.STATUS": "Status",
          "APP.BLOG.ARTICLE.TEASER.SHOW_TEASER_WITH_TEXT": "Display the teaser before the blog article.",
          "APP.BLOG.ARTICLE.TEASER.TEASER": "Teaser Text",
          "APP.BLOG.ARTICLE.TEASER.REQUIRED": "The blog's teaser text is missing.",
          "APP.BLOG.ARTICLE.TEASER.TEASER_HELP": "A brief summary of max. 500 characters of the article.",
          "APP.BLOG.ARTICLE.TEASER.TEASER_IMAGE": "Main Teaser Image",
          "APP.BLOG.ARTICLE.TEASER.TEASER_IMAGE_HELP": "Select a teaser image to be displayed along with the teaser text.",
          "APP.BLOG.ARTICLE.TEASER.TEASER_IMAGE_UPLOAD": "Upload",
          "APP.BLOG.ARTICLE.TEASER.TEASER_IMAGE_WIDE": "Widget Teaser Image",
          "APP.BLOG.ARTICLE.TEASER.TEASER_IMAGE_WIDE_HELP": "Select a teaser image to be displayed in the \"single blogarticle\" widget.",
          "APP.BLOG.ARTICLE.TEXT": "Text",
          "APP.BLOG.ARTICLE.TITLE": "Title",
          "APP.BLOG.ARTICLE.TITLE.REQUIRED": "The blog's title is missing.",
          "APP.BLOG.ARTICLE_NONE": "Articles",
          "APP.BLOG.ARTICLE_PLURAL": "Articles",
          "APP.BLOG.ARTICLE_SINGULAR": "Article",
          "APP.BLOG.AUTHOR": "Author",
          "APP.BLOG.AUTHORS": "Authors",
          "APP.BLOG.AUTHORTYPE.ADMIN.DESCRIPTION": "Only admins can write blog articles.",
          "APP.BLOG.AUTHORTYPE.ADMIN.NAME": "Admins",
          "APP.BLOG.AUTHORTYPE.BLOGAPP_LIST_OF_USERS.DESCRIPTION": "Selected users can write blog articles.",
          "APP.BLOG.AUTHORTYPE.BLOGAPP_LIST_OF_USERS.NAME": "Custom",
          "APP.BLOG.AUTHORTYPE.VIEWER.DESCRIPTION": "Everyone can write blog articles.",
          "APP.BLOG.AUTHORTYPE.VIEWER.NAME": "Everyone",
          "APP.BLOG.COMMENTS.TITLE": "Comments",
          "APP.BLOG.COMMENTS.DESCRIPTION": "Users can comment on blog articles",
          "APP.BLOG.CREATE": "Create Article",
          "APP.BLOG.DESCRIPTION": "A blog is a great way to share your insights and news. Write articles and share them with your colleagues.",
          "APP.BLOG.DRAFT": "Draft",
          "APP.BLOG.EMPTY": "This blog does not have any articles, yet.",
          "APP.BLOG.EMPTY_LINK": "Create the first article now.",
          "APP.BLOG.FILTER.DATE.TITLE": "Date",
          "APP.BLOG.FILTER.STATUS.DRAFT": "Draft",
          "APP.BLOG.FILTER.STATUS.PUBLISHED": "Published",
          "APP.BLOG.FILTER.STATUS.SCHEDULED": "Scheduled",
          "APP.BLOG.FILTER.STATUS.TITLE": "Status",
          "APP.BLOG.MODAL.DELETE.TEXT": "Do you really want to delete the article \"{title}\"? The deletion can't be undone.",
          "APP.BLOG.MODAL.DELETE.TITLE": "Delete Article",
          "APP.BLOG.NAME": "Blog",
          "APP.BLOG.PUBLISHERS": "Publishers",
          "APP.BLOG.PUBLISHERS.ALREADY_SHARED": "This article has already been shared, when unpublishing the shares are still visible but the article can't be read anymore.",
          "APP.BLOG.PUBLISHERTYPE.ADMIN.DESCRIPTION": "Only admins can edit and publish blog articles.",
          "APP.BLOG.PUBLISHERTYPE.ADMIN.NAME": "Admins",
          "APP.BLOG.PUBLISHERTYPE.BLOGAPP_LIST_OF_USERS.DESCRIPTION": "Selected users can edit and publish blog articles.",
          "APP.BLOG.PUBLISHERTYPE.BLOGAPP_LIST_OF_USERS.NAME": "Custom",
          "APP.BLOG.PUBLISHERTYPE.VIEWER.DESCRIPTION": "Everyone can edit and publish blog articles.",
          "APP.BLOG.PUBLISHERTYPE.VIEWER.NAME": "Everyone",
          "APP.BLOG.READ_MORE": "Read More",
          "APP.BLOG.SCHEDULED_FOR": "This article is scheduled for publication.",
          "APP.BLOG.SHARE.TITLE": "Share",
          "APP.BLOG.SHARE.DESCRIPTION": "All articles get shared on timeline automatically",
          "APP.BLOG.TAB.ARTICLE": "Article",
          "APP.BLOG.TAB.PUBLICATION": "Publish",
          "APP.BLOG.TAB.TEASER": "Teaser",
          "ENTITY_TYPE.BLOG_ARTICLE": "Blog Article",
          "NOTIFICATIONS.BLOG.ARTICLE.PUBLISHED": "*{s1}* has published the article '*{s2}*' in *{s3}*."
        });
        /* eslint-enable quotes */
      });
})(angular);
