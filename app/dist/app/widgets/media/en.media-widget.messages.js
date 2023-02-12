(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.media')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.MEDIA.DESCRIPTION": "Shows a media gallery.",
          "WIDGET.MEDIA.NAME": "Media",
          "WIDGET.MEDIA.SETTINGS.TITLE": "Media gallery widget settings",
          "WIDGET.MEDIA.SETTINGS.BUTTON.OPTIONS": "Media options",
          "WIDGET.MEDIA.SETTINGS.MEDIA.EMPTY": "No media present",
          "WIDGET.MEDIA.SETTINGS.MEDIA.TITLE": "Media",
          "WIDGET.MEDIA.SETTINGS.MEDIA.PREVIEW": "Preview",
          "WIDGET.MEDIA.SETTINGS.MEDIA.MEDIA": "Media",
          "WIDGET.MEDIA.SETTINGS.MEDIA.DESCRIPTION": "Description",
          "WIDGET.MEDIA.SETTINGS.MEDIA.UPLOAD_BOX": "Click here to add media",
          "WIDGET.MEDIA.SETTINGS.MEDIA.UPLOAD_BOX_MOBILE": "Upload media",
          "WIDGET.MEDIA.SETTINGS.MEDIA.UPLOAD_BOX_ERROR": "This file cannot be used.",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.TITLE": "Information",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.PLACEHOLDER": "Optional",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_TITLE.LABEL": "Album title",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_TITLE.HELP": "Defines the title for this album.",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_DESCRIPTION.LABEL": "Description",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_DESCRIPTION.HELP": "A description for the album.",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_LOCATION.LABEL": "Location",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_LOCATION.HELP": "A location can be set to state where the given media were recorded.",
          "WIDGET.MEDIA.OPTIONS.MODAL.TITLE": "Edit Description",
          "WIDGET.MEDIA.OPTIONS.BUTTON.PREVIEW": "Preview",
          "WIDGET.MEDIA.OPTIONS.BUTTON.PREVIEW.ACTIVATE": "activate",
          "WIDGET.MEDIA.OPTIONS.BUTTON.PREVIEW.DEACTIVATE": "deactivate",
          "WIDGET.MEDIA.OPTIONS.BUTTON.DESCRIPTION": "Edit description",
          "WIDGET.MEDIA.OPTIONS.BUTTON.DELETE": "Delete",
          "WIDGET.MEDIA.LIGHTBOX.OF": "of"
        });
        /* eslint-enable quotes */
      });
})(angular);
