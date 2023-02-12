(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "APP.LIST.FIELDS.ERROR.REQUIRED": "Dieses Feld ist ein Pflichtfeld.",
          "APP.LIST.FIELDS.DATE.TITLE": "Datum",
          "APP.LIST.FIELDS.DATE.DESCRIPTION": "Mit diesem Feld kann ein Datum in die Liste übernommen werden.",
          "APP.LIST.FIELDS.TEXT.TITLE": "Text",
          "APP.LIST.FIELDS.TEXT.DESCRIPTION": "Ein ein- oder mehrzeiliges Standard-Textfeld, bei dem die Minimal- und Maximallänge eingeschränkt werden kann.",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MULTILINE": "Mehrzeilig",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MULTILINE.LABEL": "Dieses Feld ist mehrzeilig",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MULTILINE.HELP": "Bestimmt ob das Textfeld mehrzeilige Eingaben unterstützt.",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MINLENGTH": "Mindestlänge",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MINLENGTH.HELP": "Die Mindestlänge der Eingabe durch den Benutzer.",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MAXLENGTH": "Maximallänge",
          "APP.LIST.FIELDS.TEXT.SETTINGS.MAXLENGTH.HELP": "Die Maximallänge der Eingabe durch den Benutzer.",
          "APP.LIST.FIELDS.TEXT.ERROR.MINLENGTH": "Dieses Feld muss mindestens {minlength} Zeichen enthalten!",
          "APP.LIST.FIELDS.TEXT.ERROR.MAXLENGTH": "Es dürfen höchstens {maxlength} Zeichen eingegeben werden!",
          "APP.LIST.FIELDS.CHECKBOX.TITLE": "Checkbox",
          "APP.LIST.FIELDS.CHECKBOX.DESCRIPTION": "Eine Checkbox kann an- oder abgewählt werden und erlaubt somit genau zwei Zustände.",
          "APP.LIST.FIELDS.CHECKBOX.SETTINGS.PRESELECT": "Standardwert",
          "APP.LIST.FIELDS.CHECKBOX.SETTINGS.PRESELECT.LABEL": "Diese Checkbox ist vorausgewählt.",
          "APP.LIST.FIELDS.CHECKBOX.SETTINGS.PRESELECT.HELP": "Wähle aus ob bei neuen Listeneinträgen dieses Feld vorausgewählt sein soll.",
          "APP.LIST.FIELDS.FILE.TITLE": "Datei",
          "APP.LIST.FIELDS.FILE.DELETED": "gelöscht",
          "APP.LIST.FIELDS.FILE.DESCRIPTION": "Lade eine oder mehrere Dateien hoch und verbinde sie mit einem Eintrag.",
          "APP.LIST.FIELDS.FILE.SETTINGS.MULTI": "Mehrfach-Upload",
          "APP.LIST.FIELDS.FILE.SETTINGS.MULTI.LABEL": "Es können mehrere Dateien hochgeladen werden",
          "APP.LIST.FIELDS.FILE.SETTINGS.MULTI.HELP": "Lege fest, ob man diesem Feld mehrere Dateien hinzufügen kann.",
          "APP.LIST.FIELDS.USER.TITLE": "Benutzer",
          "APP.LIST.FIELDS.USER.DESCRIPTION": "Bei der Benutzerauswahl kann eingestellt werden, ob nur ein Benutzer auswählbar sein soll oder mehrere.",
          "APP.LIST.FIELDS.USER.SETTINGS.MULTI": "Mehrfachauswahl",
          "APP.LIST.FIELDS.USER.SETTINGS.MULTI.LABEL": "Es können mehrere Benutzer ausgewählt werden",
          "APP.LIST.FIELDS.USER.SETTINGS.MULTI.HELP": "Lege fest, ob mehrere Benutzer ausgewählt werden können.",
          "APP.LIST.FIELDS.USER.ERROR.SINGLE": "Es darf nur ein Benutzer ausgewählt sein.",
          "APP.LIST.FIELDS.OPTIONS.TITLE": "Optionen",
          "APP.LIST.FIELDS.OPTIONS.DESCRIPTION": "Für Options-Felder kann eingestellt werden, ob jeweils nur eine Option oder mehrere Optionen auswählbar sein sollen.",
          "APP.LIST.FIELDS.OPTIONS.SETTINGS.MULTI": "Mehrfachauswahl",
          "APP.LIST.FIELDS.OPTIONS.SETTINGS.MULTI.LABEL": "Es können mehrere Optionen ausgewählt werden",
          "APP.LIST.FIELDS.OPTIONS.SETTINGS.MULTI.HELP": "Lege fest, ob mehrere Optionen ausgewählt werden können.",
          "APP.LIST.FIELDS.OPTIONS.SETTINGS.OPTIONS": "Optionen",
          "APP.LIST.FIELDS.OPTIONS.SETTINGS.OPTIONS.HELP": "Hier kannst du neue Optionen hinzufügen, löschen und die Reihenfolge verändern.",
          "APP.LIST.FIELDS.OPTIONS.PLACEHOLDER": "Bitte auswählen",
          "APP.LIST.FIELDS.LINK.TITLE": "Link",
          "APP.LIST.FIELDS.LINK.DESCRIPTION": "Mit diesem Feld kann ein klickbarer Link in die Liste übernommen werden.",
          "APP.LIST.FIELDS.LINK.SETTINGS.SAMEWINDOW": "Zielfenster",
          "APP.LIST.FIELDS.LINK.SETTINGS.SAMEWINDOW.LABEL": "Der Link wird im aktuellen Fenster geöffnet",
          "APP.LIST.FIELDS.LINK.SETTINGS.SAMEWINDOW.HELP": "Bestimme ob der Link in einem neuen Fenster oder im aktuellen Fenster geöffnet werden soll.",
          "APP.LIST.FIELDS.LINK.ERRORS.PATTERN": "Der eingegebene Wert ist kein gültiger Link.",
          "APP.LIST.FIELDS.NUMBER.TITLE": "Nummer",
          "APP.LIST.FIELDS.NUMBER.DESCRIPTION": "Ein einfaches Nummernfeld. Du kannst ein Maximum und Minimum definieren.",
          "APP.LIST.FIELDS.NUMBER.SETTINGS.MIN": "Minimum",
          "APP.LIST.FIELDS.NUMBER.SETTINGS.MIN.HELP": "Der minimale Wert, der eingegeben werden darf. Diese Angabe kann leer bleiben.",
          "APP.LIST.FIELDS.NUMBER.SETTINGS.MAX": "Maximum",
          "APP.LIST.FIELDS.NUMBER.SETTINGS.MAX.HELP": "Der maximale Wert, der eingegeben werden darf. Diese Angabe kann leer bleiben.",
          "APP.LIST.FIELDS.NUMBER.ERROR.MIN": "Der eingegebene Wert darf nicht niedriger als {min} sein.",
          "APP.LIST.FIELDS.NUMBER.ERROR.MAX": "Der eingegebene Wert darf nicht höher als {max} sein."
        });
        /* eslint-enable quotes */
      });
})(angular);
