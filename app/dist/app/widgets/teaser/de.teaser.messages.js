(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.teaser')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGETS.TEASER.DESCRIPTION": "Zeigt einen Bild-Slider inklusive Text",
          "WIDGETS.TEASER.NAME": "Teaser",
          "WIDGETS.TEASER.SETTINGS.CONFIG.CONTEXT.TITLE": "Optionen",
          "WIDGETS.TEASER.SETTINGS.CONFIG.CONTEXT.DOWN": "Nach unten verschieben",
          "WIDGETS.TEASER.SETTINGS.CONFIG.CONTEXT.UP": "Nach oben verschieben",
          "WIDGETS.TEASER.SETTINGS.CONFIG.IMAGE.LABEL": "Bild",
          "WIDGETS.TEASER.SETTINGS.CONFIG.IMAGE.HELP": "Hintergrundbild für die Folie",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.LABEL": "Überschrift",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.HELP": "Überschrift für die Folie",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.SLIDE.NEW": "Folie erstellen",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.SLIDE.EDIT": "Folie bearbeiten",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.SLIDES": "Folien",
          "WIDGETS.TEASER.SETTINGS.CONFIG.HEADLINE.SIZE": "Größe",
          "WIDGETS.TEASER.SETTINGS.CONFIG.SUBHEADLINE.LABEL": "Untertitel",
          "WIDGETS.TEASER.SETTINGS.CONFIG.SUBHEADLINE.HELP": "Untertitel für die Folie",
          "WIDGETS.TEASER.SETTINGS.CONFIG.BUTTON.CREATE": "Anlegen",
          "WIDGETS.TEASER.SETTINGS.CONFIG.BUTTON.EDIT": "Änderungen übernehmen",
          "WIDGETS.TEASER.SETTINGS.CONFIG.BUTTON.NEW": "Neue Folie",
          "WIDGETS.TEASER.SETTINGS.CONFIG.TAB.HELP": "Link wird in einem neuen Tab geöffnet",
          "WIDGETS.TEASER.SETTINGS.CONFIG.TAB.LABEL": "Neuer Tab",
          "WIDGETS.TEASER.SETTINGS.CONFIG.URL.HELP": "Link, der bei einem Klick auf die Folie geöffnet wird",
          "WIDGETS.TEASER.SETTINGS.CONFIG.URL.LABEL": "Link",
          "WIDGETS.TEASER.SETTINGS.CONFIG.URL.PLACEHOLDER": "http://",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL": "Folie",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.ONE.HEADLINE": "Grünes Unternehmen",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.ONE.SUBHEADLINE": "Wir sind eines der umweltfreundlichsten Unternehmen weltweit",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.TWO.HEADLINE": "Feier",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.TWO.SUBHEADLINE": "Cloud-Speicher ab sofort für unsere Kunden verfügbar",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.THREE.HEADLINE": "Neuer Kunde",
          "WIDGETS.TEASER.SETTINGS.SLIDES.LABEL.DEFAULT.THREE.SUBHEADLINE": "Seit Montag nutzt ein neuer Kunde unsere Dienste"
        });
        /* eslint-enable quotes */
      });
})(angular);
