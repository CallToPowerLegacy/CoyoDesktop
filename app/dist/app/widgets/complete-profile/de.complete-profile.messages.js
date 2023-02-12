(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.completeprofile')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.COMPLETEPROFILE.DESCRIPTION": "Zeigt eine ToDo-Liste zum Vervollständigen des Benutzerprofils an",
          "WIDGET.COMPLETEPROFILE.NAME": "Profil vervollständigen",
          "WIDGET.COMPLETEPROFILE.TITLE": "Vervollständige dein Profil",
          "WIDGET.COMPLETEPROFILE.AVATAR": "Lade ein Profilbild hoch",
          "WIDGET.COMPLETEPROFILE.COVER": "Lade ein Titelbild hoch",
          "WIDGET.COMPLETEPROFILE.PROFILEFIELDS": "Gib weitere Informationen zu Dir an",
          "WIDGET.COMPLETEPROFILE.CREATEDPOST": "Schreibe etwas auf die Timeline",
          "WIDGET.COMPLETEPROFILE.FOLLOWINGUSER": "Folge einem Kollegen",
          "WIDGET.COMPLETEPROFILE.PAGEMEMBER": "Folge einer Seite"
        });
        /* eslint-enable quotes */
      });
})(angular);
