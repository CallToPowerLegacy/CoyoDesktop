(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoMarkdownEditable', MarkdownEditable);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoMarkdownEditable:coyoMarkdownEditable
   * @restrict E
   * @scope
   *
   * @description
   * Directive mimics a contenteditable field with markdown support. In edit mode the markdown source is edited
   * and in display mode the formatted markdown is shown.
   *
   * @param {boolean} editable
   * If false the content cannot be edited.
   *
   * @param {object} ngModel
   * The model value to sync to.
   *
   * @param {string} placeholder
   * A text to be displayed if the content is empty.
   *
   * @requires $timeout
   */
  function MarkdownEditable($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/markdown/markdown-editable.html',
      require: ['ngModel', 'coyoMarkdownEditable'],
      scope: {},
      bindToController: {
        editable: '<',
        ngModel: '=',
        placeholder: '@'
      },
      controller: function () {},
      controllerAs: '$ctrl',
      link: function (scope, element, attributes, controllers) {
        var directiveController = controllers[1];
        directiveController.editing = false;

        $timeout(function () {

          function clickHandler() {
            directiveController.editing = true;
            scope.$apply();
            $timeout(function () {
              getTextarea().focus();
            });
          }

          function blurHandler() {
            $timeout(function () {
              directiveController.editing = false;
              scope.$apply();
            }, 200); // prevent jumping of content long enough so that a button click (e.g. save) is not ignored
          }

          function registerEventHandler() {
            element.on('click', clickHandler);
            getTextarea().on('blur', blurHandler);
          }

          function unregisterEventHandler() {
            element.off('click', clickHandler);
            getTextarea().off('blur', blurHandler);
          }

          function getTextarea() {
            return element.find('.markdown-editable-textarea');
          }

          scope.$watch(function () {
            return directiveController.editable;
          }, function (editable) {
            if (editable) {
              registerEventHandler();
            } else {
              unregisterEventHandler();
            }
          });
          scope.$on('$destroy', unregisterEventHandler);
        });
      }
    };
  }

})(angular);
