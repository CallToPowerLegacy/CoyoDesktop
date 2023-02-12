(function (angular) {
  'use strict';

  angular
      .module('commons.config')
      .constant('coyoUrls', {
        customerCenter: 'https://my.coyoapp.com'
      })
      .constant('coyoEndpoints', {
        setup: '/web/setup',
        info: '/manage/info',
        log: '/web/log',
        login: '/web/auth/login',
        logout: '/web/auth/logout',
        ssoLogin: '/web/sso/login/{configIdOrSlug}',
        ssoLogout: '/web/sso/logout',
        socket: '/web/ws?_csrf={token}',
        reset: '/web/reset-password',
        csrf: '/web/csrf',
        languages: '/web/languages',
        timezones: '/web/timezones',
        settings: '/web/settings/{{public}}',
        terms: '/web/terms',
        termsLog: '/web/terms/log',
        capabilities: '/web/capabilities',
        search: {
          query: '/web/search?_page={page}&_pageSize={pageSize}'
        },
        user: {
          users: '/web/users',
          user: '/web/users/{id}',
          setUserName: '/web/users/{id}/name',
          setLanguage: '/web/users/{id}/language',
          setTimeZone: '/web/users/{id}/timezone',
          changePassword: '/web/users/{id}/password',
          pushDevices: '/web/users/{id}/pushdevices',
          pushDeviceDelete: '/web/users/{id}/pushdevices/{deviceid}',
          pushDeviceActivate: '/web/users/{id}/pushdevices/{deviceid}/activate',
          pushDeviceDeactivate: '/web/users/{id}/pushdevices/{deviceid}/deactivate',
          notificationSettings: '/web/users/{{userId}}/notification-settings',
          subscriptions: '/web/users/{{userId}}/subscriptions',
          hashtagSubscriptions: '/web/users/{id}/hashtag-subscriptions',
          getUserOnlineCount: '/web/users/online/count',
          presenceStatusList: '/web/users/presence-status',
          profile: {
            groups: '/web/users/profile/groups',
            fields: '/web/users/{id}/profile/fields'
          },
          email: {
            change: '/web/users/{id}/email',
            activate: '/web/users/{id}/email'
          },
          groups: '/web/groups',
          roles: '/web/roles'
        },
        userDirectory: {
          types: '/web/userdirectories/types',
          directories: '/web/userdirectories'
        },
        page: {
          pages: '/web/pages',
          checkName: '/web/pages/check-name?name={name}&pageId={pageId}',
          categories: '/web/page-categories'
        },
        timeline: {
          items: '/web/timeline-items',
          linkPreviews: '/web/timeline-items/link-previews',
          videoPreviews: '/web/timeline-items/video-previews',
          preview: '/web/timeline-items/{{groupId}}/attachments/{{id}}'
        },
        shares: '/web/shares/{{targetType}}',
        reports: '/web/reports',
        publicLink: {
          getLink: '/web/public-link/{{senderId}}/{{fileId}}',
          create: '/web/public-link/{{senderId}}/{{fileId}}',
          recreate: '/web/public-link/{{token}}/recreate',
          activate: '/web/public-link/{{token}}/activate',
          deactivate: '/web/public-link/{{token}}/deactivate'
        },
        sender: {
          senders: '/web/senders',
          apps: {
            list: '/web/senders/{{senderId}}/apps/{{id}}', // app ID can also be an app slug
            base: '/web/senders/{{senderId}}/apps/{{appId}}',
            checkSlug: '/web/senders/{senderId}/apps/action/check-slug?slug={slug}&appId={appId}'
          },
          files: '/web/senders/{{senderId}}/files/{{id}}',
          folders: '/web/senders/{{senderId}}/folders/{{id}}',
          documents: '/web/senders/{{senderId}}/documents/{{id}}',
          versions: '/web/senders/{{senderId}}/documents/{{id}}/versions',
          preview: '/web/senders/{{groupId}}/documents/{{id}}',
          checkSlug: '/web/senders/action/check-slug?slug={slug}&senderId={senderId}',
          avatar: '/web/senders/{id}/images/avatar',
          cover: '/web/senders/{id}/images/cover'
        },
        notification: {
          notifications: '/web/notifications?category={category}',
          status: '/web/notifications/status',
          update: '/web/notifications/{id}',
          markAllSeen: '/web/notifications/action/mark-seen?category={category}',
          markAllClicked: '/web/notifications/action/mark-clicked?category={category}'
        },
        maintenance: {
          base: '/web/maintenance/{{id}}'
        },
        apps: {
          configuration: '/web/apps/configurations/{{key}}',
          global: '/web/apps'
        },
        launchpad: {
          categories: '/web/launchpad/categories',
          links: '/web/launchpad/categories/{owner}/links',
          icons: '/web/launchpad/categories/{owner}/links/{id}/icon'
        },
        landingPage: {
          landingPages: '/web/landing-pages',
          checkName: '/web/landing-pages/action/check-name?name={name}&pageId={pageId}'
        },
        likes: {
          likes: '/web/like-targets/{{targetType}}/{{targetId}}/likes/{{senderId}}',
          info: '/web/like-targets/{{targetType}}/{{targetId}}',
          infoBulk: '/web/like-targets/{{targetType}}'
        },
        comments: {
          comments: '/web/comments',
          preview: '/web/comments/{{groupId}}/attachments/{{id}}',
          count: '/web/comments/count'
        },
        widgets: '/web/widgets/{{slot}}/{{id}}',
        widgetLayouts: '/web/widget-layouts/{{name}}',
        widgetConfigurations: '/web/widget-configurations/{{key}}',
        workspace: {
          workspaces: '/web/workspaces',
          categories: '/web/workspace-categories',
          checkName: '/web/workspaces/check-name?name={name}&workspaceId={workspaceId}'
        },
        messaging: {
          channels: '/web/message-channels/{{id}}',
          attachments: '/web/message-channels/{{channelId}}/attachments/{{id}}',
          members: '/web/message-channels/{{channelId}}/members/{{id}}',
          messages: '/web/message-channels/{{channelId}}/messages',
          preview: '/web/message-channels/{{groupId}}/attachments/{{id}}',
          unreadCount: '/web/users/{{userId}}/messages/unread-count'
        },
        upload: {
          temp: '/web/uploads/temp'
        },
        webPreviews: {
          generate: '/web/web-previews',
          image: '/web/web-previews/{{id}}/image',
          tempImage: '/web/web-previews/{{imageBlobUid}}/image/temp?contentType='
        },
        theme: {
          themes: '/web/themes',
          checkName: '/web/themes/action/check-name?name={name}&themeId={themeId}',
          upload: '/web/themes',
          download: '/web/themes/public',
          files: '/web/themes/public/files/{id}'
        },
        authenticationProvider: {
          authenticationProviders: '/web/auth/providers'
        },
        job: {
          jobs: '/web/jobs/{{name}}'
        },
        apiClient: {
          apiClients: '/web/api-clients'
        },
        hashtags: {
          trending: '/web/widgets/hashtag/trending'
        },
        statistics: '/web/statistics/{{statisticName}}',
        event: {
          events: '/web/events'
        }
      });

})(angular);
