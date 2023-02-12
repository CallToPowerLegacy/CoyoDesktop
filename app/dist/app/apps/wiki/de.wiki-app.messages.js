(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.wiki')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "APP.WIKI.ARTICLE_OPTIONS": "Optionen",
          "APP.WIKI.ARTICLE_PLURAL": "Artikel",
          "APP.WIKI.ARTICLE_SINGULAR": "Artikel",
          "APP.WIKI.ARTICLE_NONE": "Artikel",
          "APP.WIKI.ARTICLE.EDITING_OPTIONS.LOCKED.INFO": "Dieser Artikel wird aktuell von {lockHolder} bearbeitet. Begonnen {formattedLockDate}.",
          "APP.WIKI.ARTICLE.EDITING_OPTIONS.SET_AS_HOME_ARTICLE": "Als Startartikel setzen",
          "APP.WIKI.ARTICLE.EDITING_OPTIONS.UNLOCK": "Freischalten",
          "APP.WIKI.ARTICLE.EDITING_OPTIONS.REVERT": "Auf diese Version zurücksetzen",
          "APP.WIKI.ARTICLE.HOME_ARTICLE.MODAL.TITLE": "Als Startartikel setzen",
          "APP.WIKI.ARTICLE.HOME_ARTICLE.MODAL.TEXT.HOME_SET": "Möchtest du diesen Artikel wirklich als Startartikel für das Wiki '{wikiName}' nutzen? Dieser würde den aktuellen Startartikel ersetzen.",
          "APP.WIKI.ARTICLE.HOME_ARTICLE.MODAL.TEXT.HOME_NOT_SET": "Möchtest du diesen Artikel wirklich als Startartikel für das Wiki '{wikiName}' verwenden?",
          "APP.WIKI.ARTICLE.HOME_ARTICLE.NOTIFICATION.SUCCESS": "Erfolgreich als Startartikel ausgewählt.",
          "APP.WIKI.ARTICLE.LATEST.BEFORE_LINK": "Dir wird eine ältere Version des Artikels angezeigt. Klick ",
          "APP.WIKI.ARTICLE.LATEST.LINK": "hier",
          "APP.WIKI.ARTICLE.LATEST.AFTER_LINK": " für die neueste Version.",
          "APP.WIKI.ARTICLE.NEW": "Neu",
          "APP.WIKI.ARTICLE.OVERVIEW": "Überblick",
          "APP.WIKI.ARTICLE.TITLE": "Titel",
          "APP.WIKI.ARTICLE.UPDATED": "Aktualisiert",
          "APP.WIKI.ARTICLE.DELETE.MULTIPLE.TEXT": "Das Löschen dieses Artikels löscht ebenfalls {noOfArticles} Unterartikel und {noOfArticles, plural, =0 {dessen} =1 {dessen} other {deren}} Unterartikel.",
          "APP.WIKI.ARTICLE.DELETE.HOME.TEXT": "Dieser Artikel ist als Startartikel dieser App definiert. Wenn du ihn löschst, wird statt eines Startartikels wieder die Liste aller Artikel angezeigt.",
          "APP.WIKI.ARTICLE.DELETE.WARNING.TITLE": "Achtung:",
          "APP.WIKI.HEADER.SUBARTICLES": "Unterartikel",
          "APP.WIKI.COMMENTS.TITLE": "Kommentare",
          "APP.WIKI.COMMENTS.DESCRIPTION": "Benutzer können Wiki-Artikel kommentieren",
          "APP.WIKI.CREATE": "Artikel schreiben",
          "APP.WIKI.DESCRIPTION": "Die Wiki-App erstellt ein neues Wiki mit Artikeln, Historie, Textinhalten, Bildern und Links in Form von Widgets. Das Layout jedes einzelnen Artikels kann selbst gestaltet werden.",
          "APP.WIKI.EDITORS": "Redakteure",
          "APP.WIKI.EDITORTYPE.ADMIN.DESCRIPTION": "Nur Admins können Wiki-Artikel bearbeiten",
          "APP.WIKI.EDITORTYPE.ADMIN.NAME": "Admins",
          "APP.WIKI.EDITORTYPE.VIEWER.DESCRIPTION": "Jeder Benutzer kann Wiki-Artikel bearbeiten",
          "APP.WIKI.EDITORTYPE.VIEWER.NAME": "Jeder",
          "APP.WIKI.EMPTY": "Dieses Wiki beinhaltet aktuell keine Beiträge.",
          "APP.WIKI.EMPTY_LINK": "Schreibe jetzt den ersten Artikel.",
          "APP.WIKI.HIDE_AUTHORS.TITLE": "Autor verstecken",
          "APP.WIKI.HIDE_AUTHORS.DESCRIPTION": "Autor des Wiki-Artikels wird nicht angezeigt",
          "APP.WIKI.HIDE_AUTHORS.HELP": "Für Admins ist der Autor in der Historie des Artikels weiterhin einsehbar.",
          "APP.WIKI.MODAL.DELETE.TEXT": "Möchtest du den Artikel '{title}' wirklich löschen? Das Löschen kann nicht rückgängig gemacht werden.",
          "APP.WIKI.MODAL.DELETE.TITLE": "Lösche Artikel",
          "APP.WIKI.MODAL.LOCK.REMOVED.TEXT": "Ein Admin hat deinen Artikel entsperrt. Es ist möglich, dass du diesen Artikel nicht ohne Datenverlust speichern kannst.",
          "APP.WIKI.MODAL.LOCK.REMOVED.TITLE": "Sperre entfernt",
          "APP.WIKI.MODAL.UNLOCK.TEXT": "Möchtest du diesen Artikel wirklich entsperren und zur Bearbeitung freigeben? Dies könnte zu Datenverlust und Unklarheit führen, wenn {lockHolder} diesen versucht zu speichern.",
          "APP.WIKI.MODAL.UNLOCK.TITLE": "Artikel entsperren",
          "APP.WIKI.NAME": "Wiki",
          "APP.WIKI.SELECT.PARENT.LABEL": "Erstellen in",
          "APP.WIKI.SELECT.PARENT.NO_ARTICLES_FOUND": "Keinen Artikel gefunden",
          "APP.WIKI.HISTORY": "Historie",
          "APP.WIKI.HISTORY.TITLE": "Artikel-Historie",
          "APP.WIKI.HOME.TITLE": "Startartikel",
          "APP.WIKI.HOME.HELP": "Definiere einen Startartikel, den Benutzer als erstes sehen sollen, wenn sie die App öffnen.",
          "ENTITY_TYPE.WIKI_ARTICLE": "Wiki-Artikel",
          "NOTIFICATIONS.WIKI.ARTICLE.PUBLISHED": "*{s1}* hat den Artikel '*{s2}*' in *{s3}* veröffentlicht.",
          "NOTIFICATIONS.WIKI.ARTICLE.PUBLISHED_NO_AUTHOR": "Der Artikel '*{s2}*' wurde in *{s3}* veröffentlicht."
        });
        /* eslint-enable quotes */
      });
})(angular);
