(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "RTE.DESCRIPTION": "Zeigt Rich-Text mit einem optionalen Titel.",
          "RTE.EDITOR.COLOR.RECENT": "Aktuelle Farbe",
          "RTE.EDITOR.COLOR.MORE": "Mehr Farben",
          "RTE.EDITOR.COLOR.BACKGROUND": "Hintergrundfarbe",
          "RTE.EDITOR.COLOR.FOREGROUND": "Vordergrundfarbe",
          "RTE.EDITOR.COLOR.TRANSPARENT": "Transparent",
          "RTE.EDITOR.COLOR.SETTRANSPARENT": "Transparent setzen",
          "RTE.EDITOR.COLOR.RESET": "Zurücksetzen",
          "RTE.EDITOR.COLOR.RESETTODEFAULT": "Einstellung zurücksetzen",
          "RTE.EDITOR.FONT.BOLD": "Fett",
          "RTE.EDITOR.FONT.ITALIC": "Kursiv",
          "RTE.EDITOR.FONT.UNDERLINE": "Unterstrichen",
          "RTE.EDITOR.FONT.CLEAR": "Stil entfernen",
          "RTE.EDITOR.FONT.LINEHEIGHT": "Linienstärke",
          "RTE.EDITOR.FONT.STRIKETHROUGH": "Durchgestrichen",
          "RTE.EDITOR.FONT.SIZE": "Schriftgröße",
          "RTE.EDITOR.FONT.FAMILY": "Schriftart",
          "RTE.EDITOR.HISTORY.UNDO": "Rückgängig",
          "RTE.EDITOR.HISTORY.REDO": "Wiederherstellen",
          "RTE.EDITOR.HR.INSERT": "Horizontale Linie",
          "RTE.EDITOR.IMAGE.IMAGE": "Bild",
          "RTE.EDITOR.IMAGE.RESIZEFULL": "Größe ändern",
          "RTE.EDITOR.IMAGE.RESIZEHALF": "Größe auf die Hälfte reduzieren",
          "RTE.EDITOR.IMAGE.RESIZEQUARTER": "Größe auf ein Viertel reduzieren",
          "RTE.EDITOR.IMAGE.FLOATLEFT": "Linksbündig",
          "RTE.EDITOR.IMAGE.FLOATRIGHT": "Rechtsbündig",
          "RTE.EDITOR.IMAGE.FLOATNONE": "Nicht ausrichten",
          "RTE.EDITOR.IMAGE.REMOVE": "Bild entfernen",
          "RTE.EDITOR.LINK.LINK": "Verlinken",
          "RTE.EDITOR.LINK.UNLINK": "Verlinkung entfernen",
          "RTE.EDITOR.LISTS.UNORDERED": "Liste",
          "RTE.EDITOR.LISTS.ORDERED": "Aufzählung",
          "RTE.EDITOR.OPTIONS.CODEVIEW": "Quellcode anzeigen",
          "RTE.EDITOR.PARAGRAPH.PARAGRAPH": "Absatz",
          "RTE.EDITOR.PARAGRAPH.OUTDENT": "Einzug veringern",
          "RTE.EDITOR.PARAGRAPH.INDENT": "Einzug vergrößern",
          "RTE.EDITOR.PARAGRAPH.ALIGNLEFT": "Linksbündig",
          "RTE.EDITOR.PARAGRAPH.ALIGNCENTER": "Mittig",
          "RTE.EDITOR.PARAGRAPH.ALIGNRIGHT": "Rechtsbündig",
          "RTE.EDITOR.PARAGRAPH.JUSTIFYFULL": "Strecken",
          "RTE.EDITOR.STYLE.STYLE": "Style",
          "RTE.EDITOR.STYLE.P": "Absatz",
          "RTE.EDITOR.STYLE.NORMAL": "Normal",
          "RTE.EDITOR.STYLE.QUOTE": "Zitat",
          "RTE.EDITOR.STYLE.CODE": "Code",
          "RTE.EDITOR.STYLE.HEADER1": "Überschrift 1",
          "RTE.EDITOR.STYLE.HEADER2": "Überschrift 2",
          "RTE.EDITOR.STYLE.HEADER3": "Überschrift 3",
          "RTE.EDITOR.STYLE.HEADER4": "Überschrift 4",
          "RTE.EDITOR.STYLE.HEADER5": "Überschrift 5",
          "RTE.EDITOR.STYLE.HEADER6": "Überschrift 6",
          "RTE.EDITOR.TAB.TOOLTIP": "Tab einfügen",
          "RTE.EDITOR.UNTAB.TOOLTIP": "Tab entfernen",
          "RTE.EDITOR.TABLE.TABLE": "Tabelle",
          "RTE.EDITOR.TABLE.ADDROWABOVE": "Zeile darüber einfügen",
          "RTE.EDITOR.TABLE.ADDROWBELOW": "Zeile darunter einfügen",
          "RTE.EDITOR.TABLE.ADDCOLLEFT": "Spalte links einfügen",
          "RTE.EDITOR.TABLE.ADDCOLRIGHT": "Spalte rechts einfügen",
          "RTE.EDITOR.TABLE.DELROW": "Zeile löschen",
          "RTE.EDITOR.TABLE.DELCOL": "Spalte löschen",
          "RTE.EDITOR.TABLE.DELTABLE": "Tabelle löschen",
          "RTE.MODAL.INSERT_VIDEO.URL": "https://",
          "RTE.MODAL.EDIT_LINK.NEWWINDOW": "In neuem Fenster öffnen",
          "RTE.MODAL.EDIT_LINK.TEXT": "Link-Beschreibung (optional)",
          "RTE.MODAL.EDIT_LINK.TITLE": "Link bearbeiten",
          "RTE.MODAL.EDIT_LINK.TOOLTIP": "Bearbeiten",
          "RTE.MODAL.EDIT_LINK.URL": "Die URL",
          "RTE.MODAL.INSERT_FILE.SELECT": "Wähle eine Datei",
          "RTE.MODAL.INSERT_FILE.TOOLTIP": "Dateilink einfügen",
          "RTE.MODAL.INSERT_IMAGE.SELECT": "Wähle ein Bild",
          "RTE.MODAL.INSERT_IMAGE.TOOLTIP": "Bild einfügen",
          "RTE.MODAL.INSERT_LINK.NEWWINDOW": "In neuem Fenster öffnen",
          "RTE.MODAL.INSERT_LINK.TEXT": "Link-Beschreibung (optional)",
          "RTE.MODAL.INSERT_LINK.TOOLTIP": "Link einfügen",
          "RTE.MODAL.INSERT_LINK.TITLE": "Link einfügen",
          "RTE.MODAL.INSERT_LINK.URL": "https://",
          "RTE.MODAL.INSERT_VIDEO.SERVICES": "YouTube, Vimeo, Vine, Instagram, DailyMotion, Youku oder Video-CDN",
          "RTE.MODAL.INSERT_VIDEO.TEXT": "Video-URL",
          "RTE.MODAL.INSERT_VIDEO.TITLE": "Video einfügen",
          "RTE.MODAL.INSERT_VIDEO.TOOLTIP": "Video einfügen",
          "RTE.MODAL.VALIDATION.INVALID_VIDEO_URL": "Es wurde kein Video unter dieser URL gefunden. Bitte überprüfe deine Eingaben.",
          "RTE.MODAL.VALIDATION.NOT_EMBEDDABLE": "Das Video kann nicht eingebettet werden.",
          "RTE.NAME": "Rich-Text-Editor",
          "WIDGET.RTE.NAME": "Rich-Text-Editor",
          "RTE.SETTINGS.AIR_MODE": "Minimale Werkzeugleiste",
          "RTE.SETTINGS.AIR_MODE.HELP": "Zeigt eine minimale Werkzeugleiste an, die nur eingeblendet wird, wenn der Benutzer das Textfeld auswählt."
        });
        /* eslint-enable quotes */
      });
})(angular);
