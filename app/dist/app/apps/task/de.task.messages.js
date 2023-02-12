(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.task')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "APP.TASK.CREATE.BUTTON": "Erstellen",
          "APP.TASK.FORM.ASSIGNEE.LABEL": "Verantwortlicher",
          "APP.TASK.FORM.TITLE.LABEL": "Aufgabe",
          "APP.TASK.FORM.TITLE.PLACEHOLDER": "Aufgabe erstellen...",
          "APP.TASK.FORM.DESCRIPTION.LABEL": "Beschreibung",
          "APP.TASK.FORM.DUEDATE.LABEL": "Fällig am",
          "APP.TASK.FORM.TASKLIST.LABEL": "Aufgabenliste",
          "APP.TASK.DESCRIPTION": "Verwalte Aufgaben in Listen, weise sie deinen Kollegen zu und lege ein Fälligkeitsdatum fest.",
          "APP.TASK.DELETE": "Aufgabe löschen",
          "APP.TASK.DELETE.CONFIRM": "Möchtest du diese Aufgabe wirklich löschen?",
          "APP.TASK.DELETE.DONE": "Erledigte Aufgaben löschen",
          "APP.TASK.DELETE.DONE.CONFIRMATION.TITLE": "Erledigte Aufgaben löschen",
          "APP.TASK.DELETE.DONE.CONFIRMATION.TEXT": "Möchtest du wirklich alle erledigten Aufgaben löschen?",
          "APP.TASK.DELETE.SUCCESS": "Die Aufgabe wurde gelöscht.",
          "APP.TASK.LIST.ADD": "Liste hinzufügen",
          "APP.TASK.LIST.ADD.PLACEHOLDER": "Listen Name",
          "APP.TASK.LIST.DELETE.MODAL.TEXT": "Bist du dir sicher, dass du die Liste und alle dazugehörigen Aufgaben löschen möchtest?",
          "APP.TASK.LIST.DELETE.MODAL.TITLE": "Liste löschen",
          "APP.TASK.LIST.MODAL": "Aufgabenlisten",
          "APP.TASK.LIST.SETTINGS.MODAL": "Listen Einstellungen",
          "APP.TASK.LIST.SETTINGS.TITLE": "Name",
          "APP.TASK.LIST.SETTINGS.COLOR": "Farbe",
          "APP.TASK.LISTS.EMPTY": "Keine Listen vorhanden",
          "APP.TASK.MANAGE_LIST": "Aufgabenlisten verwalten",
          "APP.TASK.MANAGE_LIST.ADMIN.NAME": "Admins",
          "APP.TASK.MANAGE_LIST.ADMIN.DESCRIPTION": "Nur Admins können Aufgabenlisten erstellen und verwalten.",
          "APP.TASK.MANAGE_LIST.VIEWER.NAME": "Alle Benutzer",
          "APP.TASK.MANAGE_LIST.VIEWER.DESCRIPTION": "Alle Benutzer können Aufgabenlisten erstellen und verwalten.",
          "APP.TASK.MANAGE_TASKS": "Aufgaben verwalten",
          "APP.TASK.MANAGE_TASKS.ADMIN.NAME": "Admins",
          "APP.TASK.MANAGE_TASKS.ADMIN.DESCRIPTION": "Nur Admins können Aufgaben erstellen und verwalten.",
          "APP.TASK.MANAGE_TASKS.VIEWER.NAME": "Alle Benutzer",
          "APP.TASK.MANAGE_TASKS.VIEWER.DESCRIPTION": "Alle Benutzer können Aufgaben erstellen und verwalten.",
          "APP.TASK.NAME": "Aufgaben",
          "APP.TASK.TASKS.ASSIGNEE": "Zuständig",
          "APP.TASK.TASKS.CONTEXT_MENU.EDIT": "Bearbeiten",
          "APP.TASK.TASKS.CONTEXT_MENU.DELETE": "Löschen",
          "APP.TASK.TASKS.DUE_DATE": "Fällig am",
          "APP.TASK.TASKS.EMPTY_LIST": "Diese Aufgabenliste ist leer.",
          "APP.TASK.TASKS.STATUS": "Status",
          "APP.TASK.TASKS.TASK": "Aufgabe",
          "APP.TASK.TASKS.DONE": "Erledigt",
          "ENTITY_TYPE.TASK": "Aufgabe",
          "ENTITY_TYPE.TASKS": "Aufgaben",
          "NOTIFICATIONS.TASKS.USER.ASSIGNED": "*{s1}* hat dir in *{s3}* die Aufgabe *{s2}* zugewiesen.",
          "NOTIFICATIONS.TASKS.USER.UNASSIGNED": "Du wurdest von *{s1} aus der Aufgabe *{s2}* in *{s3}* entfernt.",
          "NOTIFICATIONS.TASKS.DUE": "Dein Task *{s1}* in *{s2}* ist heute fällig."
        });
        /* eslint-enable quotes */
      });
})(angular);
