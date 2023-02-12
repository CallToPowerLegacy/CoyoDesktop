(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.forum')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "APP.FORUM.ATTACH_FILES": "Dateien anhängen",
          "APP.FORUM.ANSWER.TITLE": "Antwort hinzufügen",
          "APP.FORUM.CREATE": "Thema erstellen",
          "APP.FORUM.CREATE.TITLE": "Erstelle ein Thema",
          "APP.FORUM.DESCRIPTION": "Stelle Fragen, gib Antworten oder diskutiere mit deinen Kollegen über diverse Themen.",
          "APP.FORUM.EMPTY": "Dieses Forum beinhaltet aktuell keine Themen.",
          "APP.FORUM.EMPTY.FILTER": "Es wurden keine Themen gefunden, die den Filterkriterien entsprechen.",
          "APP.FORUM.EMPTY_LINK": "Erstelle jetzt das erste Thema",
          "APP.FORUM.FILTER.STATUS.CLOSED": "Geschlossen",
          "APP.FORUM.FILTER.STATUS.OPEN": "Offen",
          "APP.FORUM.FILTER.STATUS.TITLE": "Status",
          "APP.FORUM.NAME": "Forum",
          "APP.FORUM.SEARCH.LIST": "Nach Titel suchen",
          "APP.FORUM.THREAD_NONE": "Themen",
          "APP.FORUM.THREAD_OPTIONS": "Optionen",
          "APP.FORUM.THREAD_PLURAL": "Themen",
          "APP.FORUM.THREAD_SINGULAR": "Thema",
          "APP.FORUM.THREAD.ANSWER.DELETE": "Antwort löschen",
          "APP.FORUM.THREAD.ANSWER.DELETED": "Diese Antwort wurde gelöscht.",
          "APP.FORUM.THREAD.ANSWER.DELETED.LABEL": "Gelöscht",
          "APP.FORUM.THREAD.CLOSE": "Schließen",
          "APP.FORUM.THREAD.CLOSED": "Geschlossen",
          "APP.FORUM.THREAD.CLOSED.MESSAGE": "Dieses Thema ist geschlossen.",
          "APP.FORUM.THREAD.CREATOR": "Ersteller",
          "APP.FORUM.THREAD.DELETE": "Löschen",
          "APP.FORUM.THREAD.LIST.TITLE": "Titel",
          "APP.FORUM.THREAD.LIST.ANSWERS": "Antworten",
          "APP.FORUM.THREAD.LIST.CREATED": "Erstellt",
          "APP.FORUM.THREAD.LIST.LATESTACTIVITY": "Letzte Aktivität",
          "APP.FORUM.THREAD.MODAL.CLOSE.TITLE": "Thema schließen?",
          "APP.FORUM.THREAD.MODAL.CLOSE.TEXT": "Möchtest du das Thema \"{title}\" wirklich schließen?",
          "APP.FORUM.THREAD.MODAL.ANSWER.DELETE.TEXT": "Möchtest du diese Antwort wirklich löschen?",
          "APP.FORUM.THREAD.MODAL.ANSWER.DELETE.TITLE": "Antwort löschen?",
          "APP.FORUM.THREAD.MODAL.DELETE.TEXT": "Möchtest du das Thema \"{title}\" wirklich löschen?",
          "APP.FORUM.THREAD.MODAL.DELETE.TITLE": "Thema löschen?",
          "APP.FORUM.THREAD.OPEN": "Offen",
          "APP.FORUM.THREAD.OVERVIEW": "Zurück zur Themenübersicht",
          "APP.FORUM.THREAD.PIN": "Anheften",
          "APP.FORUM.THREAD.PINNED": "Angeheftet",
          "APP.FORUM.THREAD.PINNED.SUCCESS": "Thema angeheftet",
          "APP.FORUM.THREAD.REOPEN": "Neu öffnen",
          "APP.FORUM.THREAD.TITLE": "Titel",
          "APP.FORUM.THREAD.UNPIN": "Thema lösen",
          "APP.FORUM.THREAD.UNPINNED.SUCCESS": "Thema gelöst",
          "ENTITY_TYPE.FORUM_THREAD": "Forums-Thema",
          "NOTIFICATIONS.FORUM.THREAD.ANSWER.PUBLISHED": "*{s1}* hat auf das Thema '*{s3}*' in *{s4}* geantwortet.",
          "NOTIFICATIONS.FORUM.THREAD.PUBLISHED": "*{s1}* hat das Thema '*{s2}*' in *{s3}* veröffentlicht."
        });
        /* eslint-enable quotes */
      });
})(angular);
