(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.media')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.MEDIA.DESCRIPTION": "Zeige eine Medien-Gallery.",
          "WIDGET.MEDIA.NAME": "Medien",
          "WIDGET.MEDIA.SETTINGS.TITLE": "Medien-Gallery Widget Einstellungen",
          "WIDGET.MEDIA.SETTINGS.BUTTON.OPTIONS": "Medien-Optionen",
          "WIDGET.MEDIA.SETTINGS.MEDIA.EMPTY": "Keine Medien vorhanden",
          "WIDGET.MEDIA.SETTINGS.MEDIA.TITLE": "Medien",
          "WIDGET.MEDIA.SETTINGS.MEDIA.PREVIEW": "Vorschau",
          "WIDGET.MEDIA.SETTINGS.MEDIA.MEDIA": "Medien",
          "WIDGET.MEDIA.SETTINGS.MEDIA.DESCRIPTION": "Beschreibung",
          "WIDGET.MEDIA.SETTINGS.MEDIA.UPLOAD_BOX": "Hier klicken um Medien hinzuzufügen",
          "WIDGET.MEDIA.SETTINGS.MEDIA.UPLOAD_BOX_MOBILE": "Medien hochladen",
          "WIDGET.MEDIA.SETTINGS.MEDIA.UPLOAD_BOX_ERROR": "Diese Datei kann nicht verwendet werden.",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.TITLE": "Informationen",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.PLACEHOLDER": "Optional",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_TITLE.LABEL": "Albumtitel",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_TITLE.HELP": "Legt den Titel des Albums fest.",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_DESCRIPTION.LABEL": "Beschreibung",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_DESCRIPTION.HELP": "Eine Beschreibung für das Album.",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_LOCATION.LABEL": "Ort",
          "WIDGET.MEDIA.SETTINGS.INFORMATION.ALBUM_LOCATION.HELP": "Hier kann der Ort angegeben werden, an dem die aufgenommenen Medien entstanden sind.",
          "WIDGET.MEDIA.OPTIONS.MODAL.TITLE": "Beschreibung editieren",
          "WIDGET.MEDIA.OPTIONS.BUTTON.PREVIEW": "Vorschau",
          "WIDGET.MEDIA.OPTIONS.BUTTON.PREVIEW.ACTIVATE": "aktivieren",
          "WIDGET.MEDIA.OPTIONS.BUTTON.PREVIEW.DEACTIVATE": "deaktivieren",
          "WIDGET.MEDIA.OPTIONS.BUTTON.DESCRIPTION": "Beschreibung editieren",
          "WIDGET.MEDIA.OPTIONS.BUTTON.DELETE": "Entfernen",
          "WIDGET.MEDIA.LIGHTBOX.OF": "von"
        });
        /* eslint-enable quotes */
      });
})(angular);
