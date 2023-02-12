(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoRte', rte)
      .controller('CoyoRteController', CoyoRteController);

  function rte() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/rte/rte.html',
      scope: {},
      bindToController: {
        ngModel: '=',
        height: '<'
      },
      require: 'ngModel',
      controller: 'CoyoRteController',
      controllerAs: '$ctrl'
    };
  }

  function CoyoRteController($element, $timeout, $translate, $window, $document, $httpParamSerializerJQLike, $q,
                             specifyLinkModalService, specifyVideoModalService, fileLibraryModalService, authService,
                             backendUrlService, DocumentModel, SenderModel, oembedVideoService, appService) {
    var vm = this;

    // manually initialize the dropdown menus due to a bug in SummerNote:
    // https://github.com/summernote/summernote/issues/1400
    function _initDropDowns() {
      $timeout(function () {
        angular.element('.dropdown-toggle').dropdown();
      });
    }

    function _getBaseUrl(senderId, fileId) {
      return backendUrlService.getUrl() + DocumentModel.$url({
        senderId: senderId,
        id: fileId
      });
    }

    function _getImageUrl(selectedImage) {
      var image = {
        fileId: selectedImage.id,
        senderId: selectedImage.senderId,
        modified: selectedImage.modified
      };
      var baseUrl = _getBaseUrl(image.senderId, image.fileId);
      var queryParams = {modified: image.modified};
      return baseUrl + '?' + $httpParamSerializerJQLike(queryParams);
    }

    /* eslint-disable angular/document-service */
    function _getLinkNode(model) {
      var node = document.createElement('a');
      node.appendChild(document.createTextNode(model.text));
      node.setAttribute('title', model.text);
      node.setAttribute('href', model.url);
      if (model.newWindow) {
        node.setAttribute('target', '_blank');
      }
      return node;
    }
    /* eslint-enable angular/document-service */

    function _updateLinkNode(model, currentNode) {
      var node = currentNode.context;
      node.innerHTML = model.text;
      node.setAttribute('title', model.text);
      node.setAttribute('href', model.url);
      if (model.newWindow) {
        node.setAttribute('target', '_blank');
      } else {
        node.removeAttribute('target');
      }
      return node;
    }

    /* eslint-disable angular/document-service */
    function _getFileLinkNode(file, selection) {
      var node = document.createElement('span');
      node.appendChild(document.createTextNode(selection ? selection : file.name));
      node.setAttribute('class', 'note-file-link');
      node.setAttribute('coyo-download', _getBaseUrl(file.senderId, file.id));
      return node;
    }
    /* eslint-enable angular/document-service */

    /* eslint-disable angular/document-service */
    function _getImageNode(selection, style) {
      var imageUrl = _getImageUrl(selection);
      var node = document.createElement('img');
      node.setAttribute('src', imageUrl);
      node.setAttribute('class', 'note-image');
      node.setAttribute('style', style);
      node.setAttribute('alt', selection.name);
      return node;
    }
    /* eslint-enable angular/document-service */

    /* eslint-disable angular/angularelement */
    function _floatImageContainerNode(context, classList) {
      var $target = $(context.invoke('editor.restoreTarget'));
      $target.context.classList.remove('pull-right');
      $target.context.classList.remove('pull-left');
      $target.context.classList.add(classList);
    }
    /* eslint-enable angular/angularelement */

    /* eslint-disable angular/angularelement */
    function _resizeImageContainerFix(context, value) {
      var $target = $(context.invoke('editor.restoreTarget'));
      $target.css({
        width: value * 100 + '%',
        height: ''
      });
    }
    /* eslint-enable angular/angularelement */

    function validVideoUrl(url) {
      return oembedVideoService.isVideoUrl(url);
    }

    /* eslint-disable angular/angularelement */
    /* eslint-disable angular/document-service */
    function _getVideoNode(model) {
      var container = !_.isUndefined(vm._slot[0]) ? vm._slot[0] : vm._slot;
      if (model.fromBackend) {
        var $video = oembedVideoService.createEmbedCode(model, container);
      } else {
        // If backend can't communicate with the internet, try to embed the videos via frontend and regEx validation.
        $video = oembedVideoService.createByUrl(model.url, container);

        if (!$video) {
          // No valid video
          $('<span></span>');
        }
      }
      $video.addClass('note-video-clip');

      return $video[0];
    }
    /* eslint-enable angular/document-service */
    /* eslint-enable angular/angularelement */

    ////////////////////////////////////////////////////////////////////////

    (function _init() {
      $timeout(function () {
        _initDropDowns();
        vm._slot = angular.element($element).children().first();

        var toolbar = [
          ['style', ['bold', 'italic', 'underline', 'strikethrough']],
          ['fontclr', ['color']],
          ['font', ['clear']],
          ['headline', ['style']],
          ['alignment', ['paragraph']],
          ['insert', ['insertLink', 'insertFileLink', 'insertImage', 'insertVideo']],
          ['list', ['ul', 'ol']],
          ['table', ['table']],
          ['rule', ['hr', 'removeTab', 'insertTab']],
          ['history', ['undo', 'redo']],
          ['view', ['codeview', 'fullscreen']]
        ];

        var toolbarPopoverLink = [
          ['link', ['editLink', 'unlink']]
        ];

        var toolbarPopoverImage = [
          ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25', 'resizeImage15']],
          ['float', ['floatLeftImage', 'floatRightImage', 'floatNoneImage']],
          ['remove', ['removeMedia']],
          ['custom', ['imageTitle']]
        ];

        var toolbarPopoverTable = [
          ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
          ['delete', ['deleteRow', 'deleteCol']]
        ];

        $translate([
          'RTE.EDITOR.COLOR.RECENT', 'RTE.EDITOR.COLOR.MORE', 'RTE.EDITOR.COLOR.BACKGROUND',
          'RTE.EDITOR.COLOR.FOREGROUND', 'RTE.EDITOR.COLOR.TRANSPARENT',
          'RTE.EDITOR.COLOR.SETTRANSPARENT', 'RTE.EDITOR.COLOR.RESET',
          'RTE.EDITOR.COLOR.RESETTODEFAULT', 'RTE.EDITOR.FONT.BOLD', 'RTE.EDITOR.FONT.ITALIC',
          'RTE.EDITOR.FONT.UNDERLINE', 'RTE.EDITOR.FONT.CLEAR', 'RTE.EDITOR.FONT.LINEHEIGHT',
          'RTE.EDITOR.FONT.STRIKETHROUGH', 'RTE.EDITOR.FONT.SIZE', 'RTE.EDITOR.FONT.FAMILY',
          'RTE.EDITOR.HISTORY.UNDO', 'RTE.EDITOR.HISTORY.REDO', 'RTE.EDITOR.HR.INSERT',
          'RTE.EDITOR.IMAGE.IMAGE', 'RTE.EDITOR.IMAGE.RESIZEFULL', 'RTE.EDITOR.IMAGE.RESIZEHALF',
          'RTE.EDITOR.IMAGE.RESIZEQUARTER', 'RTE.EDITOR.IMAGE.FLOATLEFT',
          'RTE.EDITOR.IMAGE.FLOATRIGHT', 'RTE.EDITOR.IMAGE.FLOATNONE', 'RTE.EDITOR.IMAGE.REMOVE',
          'RTE.EDITOR.LINK.LINK', 'RTE.EDITOR.LINK.UNLINK', 'RTE.EDITOR.LISTS.UNORDERED',
          'RTE.EDITOR.LISTS.ORDERED', 'RTE.EDITOR.OPTIONS.CODEVIEW',
          'RTE.EDITOR.PARAGRAPH.PARAGRAPH', 'RTE.EDITOR.PARAGRAPH.OUTDENT',
          'RTE.EDITOR.PARAGRAPH.INDENT', 'RTE.EDITOR.PARAGRAPH.ALIGNLEFT',
          'RTE.EDITOR.PARAGRAPH.ALIGNCENTER', 'RTE.EDITOR.PARAGRAPH.ALIGNRIGHT',
          'RTE.EDITOR.PARAGRAPH.JUSTIFYFULL', 'RTE.EDITOR.STYLE.STYLE', 'RTE.EDITOR.STYLE.P',
          'RTE.EDITOR.STYLE.NORMAL', 'RTE.EDITOR.STYLE.QUOTE', 'RTE.EDITOR.STYLE.CODE',
          'RTE.EDITOR.STYLE.HEADER1', 'RTE.EDITOR.STYLE.HEADER2', 'RTE.EDITOR.STYLE.HEADER3',
          'RTE.EDITOR.STYLE.HEADER4', 'RTE.EDITOR.STYLE.HEADER5', 'RTE.EDITOR.STYLE.HEADER6',
          'RTE.EDITOR.TABLE.TABLE', 'RTE.EDITOR.TABLE.ADDROWABOVE', 'RTE.EDITOR.TABLE.ADDROWBELOW',
          'RTE.EDITOR.TABLE.ADDCOLLEFT', 'RTE.EDITOR.TABLE.ADDCOLRIGHT', 'RTE.EDITOR.TABLE.DELROW',
          'RTE.EDITOR.TABLE.DELCOL', 'RTE.EDITOR.TABLE.DELTABLE',
          'RTE.MODAL.INSERT_LINK.TOOLTIP', 'RTE.MODAL.INSERT_IMAGE.TOOLTIP',
          'RTE.MODAL.EDIT_LINK.TOOLTIP', 'RTE.MODAL.INSERT_FILE.TOOLTIP',
          'RTE.MODAL.INSERT_VIDEO.TOOLTIP', 'RTE.EDITOR.TAB.TOOLTIP', 'RTE.EDITOR.UNTAB.TOOLTIP'])
            .then(function (translations) {
              // Customize existing modules
              $.summernote.options.modules.handle = HandleResize;

              // More languages available at https://github.com/summernote/summernote/tree/develop/lang
              // This is a customized "en-US" keyset
              $.extend($.summernote.lang, {
                'en': {
                  color: {
                    recent: translations['RTE.EDITOR.COLOR.RECENT'],
                    more: translations['RTE.EDITOR.COLOR.MORE'],
                    background: translations['RTE.EDITOR.COLOR.BACKGROUND'],
                    foreground: translations['RTE.EDITOR.COLOR.FOREGROUND'],
                    transparent: translations['RTE.EDITOR.COLOR.TRANSPARENT'],
                    setTransparent: translations['RTE.EDITOR.COLOR.SETTRANSPARENT'],
                    reset: translations['RTE.EDITOR.COLOR.RESET'],
                    resetToDefault: translations['RTE.EDITOR.COLOR.RESETTODEFAULT']
                  },
                  font: {
                    bold: translations['RTE.EDITOR.FONT.BOLD'],
                    italic: translations['RTE.EDITOR.FONT.ITALIC'],
                    underline: translations['RTE.EDITOR.FONT.UNDERLINE'],
                    clear: translations['RTE.EDITOR.FONT.CLEAR'],
                    height: translations['RTE.EDITOR.FONT.LINEHEIGHT'],
                    strikethrough: translations['RTE.EDITOR.FONT.STRIKETHROUGH'],
                    size: translations['RTE.EDITOR.FONT.SIZE'],
                    name: translations['RTE.EDITOR.FONT.FAMILY']
                  },
                  history: {
                    undo: translations['RTE.EDITOR.HISTORY.UNDO'],
                    redo: translations['RTE.EDITOR.HISTORY.REDO']
                  },
                  hr: {
                    insert: translations['RTE.EDITOR.HR.INSERT']
                  },
                  image: {
                    image: translations['RTE.EDITOR.IMAGE.IMAGE'],
                    resizeFull: translations['RTE.EDITOR.IMAGE.RESIZEFULL'],
                    resizeHalf: translations['RTE.EDITOR.IMAGE.RESIZEHALF'],
                    resizeQuarter: translations['RTE.EDITOR.IMAGE.RESIZEQUARTER'],
                    floatLeft: translations['RTE.EDITOR.IMAGE.FLOATLEFT'],
                    floatRight: translations['RTE.EDITOR.IMAGE.FLOATRIGHT'],
                    floatNone: translations['RTE.EDITOR.IMAGE.FLOATNONE'],
                    remove: translations['RTE.EDITOR.IMAGE.REMOVE']
                  },
                  link: {
                    link: translations['RTE.EDITOR.LINK.LINK'],
                    unlink: translations['RTE.EDITOR.LINK.UNLINK']
                  },
                  lists: {
                    unordered: translations['RTE.EDITOR.LISTS.UNORDERED'],
                    ordered: translations['RTE.EDITOR.LISTS.ORDERED']
                  },
                  options: {
                    codeview: translations['RTE.EDITOR.OPTIONS.CODEVIEW']
                  },
                  paragraph: {
                    paragraph: translations['RTE.EDITOR.PARAGRAPH.PARAGRAPH'],
                    outdent: translations['RTE.EDITOR.PARAGRAPH.OUTDENT'],
                    indent: translations['RTE.EDITOR.PARAGRAPH.INDENT'],
                    left: translations['RTE.EDITOR.PARAGRAPH.ALIGNLEFT'],
                    center: translations['RTE.EDITOR.PARAGRAPH.ALIGNCENTER'],
                    right: translations['RTE.EDITOR.PARAGRAPH.ALIGNRIGHT'],
                    justify: translations['RTE.EDITOR.PARAGRAPH.JUSTIFYFULL']
                  },
                  style: {
                    style: translations['RTE.EDITOR.STYLE.STYLE'],
                    p: translations['RTE.EDITOR.STYLE.P'],
                    normal: translations['RTE.EDITOR.STYLE.NORMAL'],
                    blockquote: translations['RTE.EDITOR.STYLE.QUOTE'],
                    pre: translations['RTE.EDITOR.STYLE.CODE'],
                    h1: translations['RTE.EDITOR.STYLE.HEADER1'],
                    h2: translations['RTE.EDITOR.STYLE.HEADER2'],
                    h3: translations['RTE.EDITOR.STYLE.HEADER3'],
                    h4: translations['RTE.EDITOR.STYLE.HEADER4'],
                    h5: translations['RTE.EDITOR.STYLE.HEADER5'],
                    h6: translations['RTE.EDITOR.STYLE.HEADER6']
                  },
                  table: {
                    table: translations['RTE.EDITOR.TABLE.TABLE'],
                    addRowAbove: translations['RTE.EDITOR.TABLE.ADDROWABOVE'],
                    addRowBelow: translations['RTE.EDITOR.TABLE.ADDROWBELOW'],
                    addColLeft: translations['RTE.EDITOR.TABLE.ADDCOLLEFT'],
                    addColRight: translations['RTE.EDITOR.TABLE.ADDCOLRIGHT'],
                    delRow: translations['RTE.EDITOR.TABLE.DELROW'],
                    delCol: translations['RTE.EDITOR.TABLE.DELCOL'],
                    delTable: translations['RTE.EDITOR.TABLE.DELTABLE']
                  }
                },
                'de': {
                  color: {
                    recent: translations['RTE.EDITOR.COLOR.RECENT'],
                    more: translations['RTE.EDITOR.COLOR.MORE'],
                    background: translations['RTE.EDITOR.COLOR.BACKGROUND'],
                    foreground: translations['RTE.EDITOR.COLOR.FOREGROUND'],
                    transparent: translations['RTE.EDITOR.COLOR.TRANSPARENT'],
                    setTransparent: translations['RTE.EDITOR.COLOR.SETTRANSPARENT'],
                    reset: translations['RTE.EDITOR.COLOR.RESET'],
                    resetToDefault: translations['RTE.EDITOR.COLOR.RESETTODEFAULT']
                  },
                  font: {
                    bold: translations['RTE.EDITOR.FONT.BOLD'],
                    italic: translations['RTE.EDITOR.FONT.ITALIC'],
                    underline: translations['RTE.EDITOR.FONT.UNDERLINE'],
                    clear: translations['RTE.EDITOR.FONT.CLEAR'],
                    height: translations['RTE.EDITOR.FONT.LINEHEIGHT'],
                    strikethrough: translations['RTE.EDITOR.FONT.STRIKETHROUGH'],
                    size: translations['RTE.EDITOR.FONT.SIZE'],
                    name: translations['RTE.EDITOR.FONT.FAMILY']
                  },
                  history: {
                    undo: translations['RTE.EDITOR.HISTORY.UNDO'],
                    redo: translations['RTE.EDITOR.HISTORY.REDO']
                  },
                  hr: {
                    insert: translations['RTE.EDITOR.HR.INSERT']
                  },
                  image: {
                    image: translations['RTE.EDITOR.IMAGE.IMAGE'],
                    resizeFull: translations['RTE.EDITOR.IMAGE.RESIZEFULL'],
                    resizeHalf: translations['RTE.EDITOR.IMAGE.RESIZEHALF'],
                    resizeQuarter: translations['RTE.EDITOR.IMAGE.RESIZEQUARTER'],
                    floatLeft: translations['RTE.EDITOR.IMAGE.FLOATLEFT'],
                    floatRight: translations['RTE.EDITOR.IMAGE.FLOATRIGHT'],
                    floatNone: translations['RTE.EDITOR.IMAGE.FLOATNONE'],
                    remove: translations['RTE.EDITOR.IMAGE.REMOVE']
                  },
                  link: {
                    link: translations['RTE.EDITOR.LINK.LINK'],
                    unlink: translations['RTE.EDITOR.LINK.UNLINK']
                  },
                  lists: {
                    unordered: translations['RTE.EDITOR.LISTS.UNORDERED'],
                    ordered: translations['RTE.EDITOR.LISTS.ORDERED']
                  },
                  options: {
                    codeview: translations['RTE.EDITOR.OPTIONS.CODEVIEW']
                  },
                  paragraph: {
                    paragraph: translations['RTE.EDITOR.PARAGRAPH.PARAGRAPH'],
                    outdent: translations['RTE.EDITOR.PARAGRAPH.OUTDENT'],
                    indent: translations['RTE.EDITOR.PARAGRAPH.INDENT'],
                    left: translations['RTE.EDITOR.PARAGRAPH.ALIGNLEFT'],
                    center: translations['RTE.EDITOR.PARAGRAPH.ALIGNCENTER'],
                    right: translations['RTE.EDITOR.PARAGRAPH.ALIGNRIGHT'],
                    justify: translations['RTE.EDITOR.PARAGRAPH.JUSTIFYFULL']
                  },
                  style: {
                    style: translations['RTE.EDITOR.STYLE.STYLE'],
                    p: translations['RTE.EDITOR.STYLE.P'],
                    normal: translations['RTE.EDITOR.STYLE.NORMAL'],
                    blockquote: translations['RTE.EDITOR.STYLE.QUOTE'],
                    pre: translations['RTE.EDITOR.STYLE.CODE'],
                    h1: translations['RTE.EDITOR.STYLE.HEADER1'],
                    h2: translations['RTE.EDITOR.STYLE.HEADER2'],
                    h3: translations['RTE.EDITOR.STYLE.HEADER3'],
                    h4: translations['RTE.EDITOR.STYLE.HEADER4'],
                    h5: translations['RTE.EDITOR.STYLE.HEADER5'],
                    h6: translations['RTE.EDITOR.STYLE.HEADER6']
                  },
                  table: {
                    table: translations['RTE.EDITOR.TABLE.TABLE'],
                    addRowAbove: translations['RTE.EDITOR.TABLE.ADDROWABOVE'],
                    addRowBelow: translations['RTE.EDITOR.TABLE.ADDROWBELOW'],
                    addColLeft: translations['RTE.EDITOR.TABLE.ADDCOLLEFT'],
                    addColRight: translations['RTE.EDITOR.TABLE.ADDCOLRIGHT'],
                    delRow: translations['RTE.EDITOR.TABLE.DELROW'],
                    delCol: translations['RTE.EDITOR.TABLE.DELCOL'],
                    delTable: translations['RTE.EDITOR.TABLE.DELTABLE']
                  }
                }
              });

              ////////////////////////////////////////////////////////////////////////

              /* global $:true */

              /* eslint-disable angular/angularelement */
              /* eslint-disable indent */
              var InsertLinkButton = function (context) {
                var ui = angular.element.summernote.ui;

                var button = ui.button({
                  contents: '<i class="zmdi zmdi-link custom-btn"></i>',
                  tooltip: translations['RTE.MODAL.INSERT_LINK.TOOLTIP'],
                  click: function () {
                    $('.note-popover').hide(); // This is needed because Summernote does not close popovers automatically.

                    var selection = '';
                    if ($window.getSelection) {
                      selection = $window.getSelection().toString();
                    } else if ($document.selection && $document.selection.type !== 'Control') {
                      selection = $document.selection.createRange().text;
                    }

                    context.invoke('editor.saveRange');
                    return specifyLinkModalService.specify({
                      title: 'RTE.MODAL.INSERT_LINK.TITLE',
                      description: 'RTE.MODAL.INSERT_LINK.TEXT',
                      url: 'RTE.MODAL.INSERT_LINK.URL',
                      newWindow: 'RTE.MODAL.INSERT_LINK.NEWWINDOW',
                      selection: selection
                    }).then(function (model) {
                      context.invoke('editor.restoreRange');
                      context.invoke('editor.focus');
                      context.invoke('editor.insertNode', _getLinkNode(model));
                      // With the following space the anchor span lost focus
                      context.invoke('editor.pasteHTML', '&nbsp;');
                    })
                    .catch(function () {
                      // Restore range when modal dismiss
                      context.invoke('editor.restoreRange');
                      context.invoke('editor.focus');
                    });
                  }
                });

                return button.render();
              };
              /* eslint-enable indent */
              /* eslint-enable angular/angularelement */

              /* eslint-disable angular/angularelement */
              /* eslint-disable angular/document-service */
              var EditLinkButton = function (context) {
                var ui = angular.element.summernote.ui;

                var button = ui.button({
                  contents: '<i class="zmdi zmdi-edit custom-btn"></i>',
                  tooltip: translations['RTE.MODAL.EDIT_LINK.TOOLTIP'],
                  click: function () {
                    $('.note-popover').hide(); // This is needed because Summernote does not close popovers automatically.

                    var $node = $(context.invoke('restoreTarget'));
                    if ($node.length <= 0) {
                      $node = $(document.getSelection().focusNode.parentElement, '.note-editable');
                    }
                    var linkInfo = $node.context;
                    var newWindow = (linkInfo.target === '_blank');

                    context.invoke('editor.saveRange');
                    return specifyLinkModalService.specify({
                      title: 'RTE.MODAL.INSERT_LINK.TITLE',
                      description: 'RTE.MODAL.INSERT_LINK.TEXT',
                      url: 'RTE.MODAL.INSERT_LINK.URL',
                      newWindow: 'RTE.MODAL.INSERT_LINK.NEWWINDOW'
                    }, {
                      text: linkInfo.text,
                      url: linkInfo.href,
                      newWindow: newWindow
                    }).then(function (model) {
                      context.invoke('editor.restoreRange');
                      context.invoke('editor.focus');
                      context.invoke('editor.insertNode', _updateLinkNode(model, $node));
                      // With the following space the anchor span lost focus
                      context.invoke('editor.pasteHTML', '&nbsp;');
                    }).catch(function () {
                      // Restore range when modal dismiss
                      context.invoke('editor.restoreRange');
                      context.invoke('editor.focus');
                    });
                  }
                });
                return button.render();
              };
              /* eslint-enable angular/document-service */
              /* eslint-enable angular/angularelement */

              var FloatLeftImage = function (context) {
                var ui = angular.element.summernote.ui;

                var button = ui.button({
                  contents: '<i class="note-icon-align-left"></i>',
                  tooltip: translations['RTE.EDITOR.IMAGE.FLOATLEFT'],
                  click: function () {
                    context.invoke('editor.beforeCommand');
                    context.createInvokeHandler(_floatImageContainerNode(context, 'pull-left'));
                    context.invoke('editor.afterCommand');
                  }
                });
                return button.render();
              };

              var FloatRightImage = function (context) {
                var ui = angular.element.summernote.ui;

                var button = ui.button({
                  contents: '<i class="note-icon-align-right"></i>',
                  tooltip: translations['RTE.EDITOR.IMAGE.FLOATRIGHT'],
                  click: function () {
                    context.invoke('editor.beforeCommand');
                    context.createInvokeHandler(_floatImageContainerNode(context, 'pull-right'));
                    context.invoke('editor.afterCommand');
                  }
                });
                return button.render();
              };

              var FloatNoneImage = function (context) {
                var ui = angular.element.summernote.ui;

                var button = ui.button({
                  contents: '<i class="note-icon-align-justify"></i>',
                  tooltip: translations['RTE.EDITOR.IMAGE.FLOATNONE'],
                  click: function () {
                    context.invoke('editor.beforeCommand');
                    context.createInvokeHandler(_floatImageContainerNode(context, ''));
                    context.invoke('editor.afterCommand');
                  }
                });
                return button.render();
              };

              var EditImageSize15 = function (context) {
                var ui = angular.element.summernote.ui;

                var button = ui.button({
                  contents: '<span class="note-fontsize-10">15%</span>',
                  tooltip: translations['RTE.EDITOR.IMAGE.RESIZEFULL'],
                  click: function () {
                    context.invoke('editor.beforeCommand');
                    context.createInvokeHandler(_resizeImageContainerFix(context, '0.15'));
                    context.invoke('editor.afterCommand');
                  }
                });
                return button.render();
              };

              /* eslint-disable angular/angularelement */
              /* eslint-disable indent */
              var InsertFileLinkButton = function (context) {
                var ui = angular.element.summernote.ui;

                var button = ui.button({
                  contents: '<i class="zmdi zmdi-file custom-btn"></i>',
                  tooltip: translations['RTE.MODAL.INSERT_FILE.TOOLTIP'],
                  click: function () {
                    $('.note-popover').hide(); // This is needed because Summernote does not close popovers automatically.

                    var selection = '';
                    if ($window.getSelection) {
                      selection = $window.getSelection().toString();
                    } else if ($document.selection && $document.selection.type !== 'Control') {
                      selection = $document.selection.createRange().text;
                    }

                    context.invoke('editor.saveRange');

                    var senderIdOrSlug = SenderModel.getCurrentIdOrSlug();
                    var defineSender = $q.defer();

                    if (angular.isUndefined(senderIdOrSlug)) {
                      authService.getUser().then(function (currentUser) {
                        defineSender.resolve(currentUser);
                      });
                    } else {
                      SenderModel.getWithPermissions(senderIdOrSlug, {}, ['createFile']).then(function (sender) {
                        var appIdOrSlug = appService.getCurrentAppIdOrSlug();
                        if (angular.isUndefined(appIdOrSlug)) {
                          defineSender.resolve({sender: sender});
                        } else {
                          sender.getApp(appIdOrSlug).then(function (app) {
                            defineSender.resolve({sender: sender, initialFolder: {id: app.rootFolderId}});
                          });
                        }
                      });
                    }

                    defineSender.promise.then(function (result) {
                      fileLibraryModalService
                          .open(result.sender, {selectMode: 'single', initialFolder: result.initialFolder},
                              'RTE.MODAL.INSERT_FILE.SELECT')
                          .then(function (file) {
                            context.invoke('editor.restoreRange');
                            context.invoke('editor.focus');
                            context.invoke('editor.insertNode', _getFileLinkNode(file, selection));
                            // With the following space the anchor span lost focus
                            context.invoke('editor.pasteHTML', '&nbsp;');
                          })
                          .catch(function () {
                            // Restore range when modal dismiss
                            context.invoke('editor.restoreRange');
                            context.invoke('editor.focus');
                          });
                    });
                  }
                });

                return button.render();
              };
              /* eslint-enable indent */
              /* eslint-enable angular/angularelement */

              /* eslint-disable angular/angularelement */
              var InsertImageButton = function (context) {
                var ui = angular.element.summernote.ui;

                var button = ui.button({
                  contents: '<i class="zmdi zmdi-image custom-btn"></i>',
                  tooltip: translations['RTE.MODAL.INSERT_IMAGE.TOOLTIP'],
                  click: function () {
                    $('.note-popover').hide(); // This is needed because Summernote does not close popovers automatically.

                    context.invoke('editor.saveRange');

                    var senderIdOrSlug = SenderModel.getCurrentIdOrSlug();
                    var defineSender = $q.defer();

                    if (angular.isUndefined(senderIdOrSlug)) {
                      authService.getUser().then(function (currentUser) {
                        defineSender.resolve(currentUser);
                      });
                    } else {
                      SenderModel.getWithPermissions(senderIdOrSlug, {}, ['createFile']).then(function (sender) {
                        var appIdOrSlug = appService.getCurrentAppIdOrSlug();
                        if (angular.isUndefined(appIdOrSlug)) {
                          defineSender.resolve({sender: sender});
                        } else {
                          sender.getApp(appIdOrSlug).then(function (app) {
                            defineSender.resolve({sender: sender, initialFolder: {id: app.rootFolderId}});
                          });
                        }
                      });
                    }

                    defineSender.promise.then(function (result) {
                      fileLibraryModalService
                          .open(result.sender, {
                            selectMode: 'single', filterContentType: 'image',
                            initialFolder: result.initialFolder
                          },
                          {cropImage: true}, 'RTE.MODAL.INSERT_IMAGE.SELECT')
                          .then(function (selection) {
                            context.invoke('editor.restoreRange');
                            context.invoke('editor.focus');
                            context.invoke('editor.insertNode', _getImageNode(selection, 'width: 90%;'));
                          })
                          .catch(function () {
                            // Restore range when modal dismiss
                            context.invoke('editor.restoreRange');
                            context.invoke('editor.focus');
                          });
                    });
                  }
                });

                return button.render();
              };
              /* eslint-enable angular/angularelement */

              /* eslint-disable angular/angularelement */
              var InsertVideoButton = function (context) {
                var ui = angular.element.summernote.ui;

                var button = ui.button({
                  contents: '<i class="note-icon-video custom-btn"></i>',
                  tooltip: translations['RTE.MODAL.INSERT_VIDEO.TOOLTIP'],
                  click: function () {
                    $('.note-popover').hide(); // This is needed because Summernote does not close popovers automatically.

                    context.invoke('editor.saveRange');
                    return specifyVideoModalService.specify({
                      title: 'RTE.MODAL.INSERT_VIDEO.TITLE',
                      url: 'RTE.MODAL.INSERT_VIDEO.URL',
                      text: 'RTE.MODAL.INSERT_VIDEO.TEXT',
                      validFunction: validVideoUrl
                    }).then(function (model) {
                      context.invoke('editor.restoreRange');
                      context.invoke('editor.focus');
                      context.invoke('editor.insertNode', _getVideoNode(model));
                    }).catch(function () {
                      // Restore range when modal dismiss
                      context.invoke('editor.restoreRange');
                      context.invoke('editor.focus');
                    });
                  }
                });

                return button.render();
              };
              /* eslint-enable angular/angularelement */

              /* eslint-disable angular/angularelement */
              var InsertTabButton = function (context) {
                var ui = angular.element.summernote.ui;

                var button = ui.button({
                  contents: '<i class="note-icon-align-indent custom-btn"></i>',
                  tooltip: translations['RTE.EDITOR.TAB.TOOLTIP'],
                  click: context.createInvokeHandler('editor.indent')
                });

                return button.render();
              };
              /* eslint-enable angular/angularelement */

              /* eslint-disable angular/angularelement */
              var RemoveTabButton = function (context) {
                var ui = angular.element.summernote.ui;

                var button = ui.button({
                  contents: '<i class="note-icon-align-outdent custom-btn"></i>',
                  tooltip: translations['RTE.EDITOR.UNTAB.TOOLTIP'],
                  click: context.createInvokeHandler('editor.outdent')
                });

                return button.render();
              };
              /* eslint-enable angular/angularelement */

              /* eslint-disable angular/angularelement */
              /* eslint-disable angular/controller-as-vm */
              function HandleResize(context) {
                var self = this;

                var $document = $(document);
                var $editingArea = context.layoutInfo.editingArea;
                var options = context.options;
                this.events = {
                  'summernote.mousedown': function (we, e) {
                    if (self.update(e.target)) {
                      e.preventDefault();
                    }
                  },
                  'summernote.keyup summernote.scroll summernote.change summernote.dialog.shown': function () {
                    self.update();
                  }
                };

                this.initialize = function () {
                  this.$handle = $([
                    '<div class="note-handle">',
                    '<div class="note-control-selection">',
                    '<div class="note-control-selection-bg"></div>',
                    '<div class="note-control-holder note-control-nw"></div>',
                    '<div class="note-control-holder note-control-ne"></div>',
                    '<div class="note-control-holder note-control-sw"></div>',
                    '<div class="',
                    (options.disableResizeImage ? 'note-control-holder' : 'note-control-sizing'),
                    ' note-control-se"></div>',
                    (options.disableResizeImage ? '' : '<div class="note-control-selection-info"></div>'),
                    '</div>',
                    '</div>'
                  ].join('')).prependTo($editingArea);

                  this.$handle.on('mousedown', function (event) {
                    var target = event.target;
                    if (target && $(target).hasClass('note-control-sizing')) {
                      event.preventDefault();
                      event.stopPropagation();

                      var $target = self.$handle.find('.note-control-selection').data('target'),
                          posStart = $target.offset(),
                          scrollTop = $document.scrollTop();

                      $document.on('mousemove', function (event) {
                        var pos = {
                          x: event.clientX - posStart.left,
                          y: event.clientY - (posStart.top - scrollTop)
                        };

                        var imageSize;
                        if (!event.shiftKey) {
                          var newRatio = pos.y / pos.x;

                          var ratio = $target.data('ratio');
                          var width = ratio > newRatio ? pos.x : pos.y / ratio;
                          imageSize = {
                            width: width / $editingArea.innerWidth() * 100 + '%',
                            height: 'auto'
                          };
                        } else {
                          imageSize = {
                            width: pos.x,
                            height: pos.y
                          };
                        }

                        $target.css(imageSize);
                        self.update($target[0]);

                      }).one('mouseup', function (e) {
                        e.preventDefault();
                        $document.off('mousemove');
                        context.invoke('editor.afterCommand');
                      });

                      if (!$target.data('ratio')) { // original ratio.
                        $target.data('ratio', $target.height() / $target.width());
                      }
                    }
                  });
                };

                this.destroy = function () {
                  this.$handle.remove();
                };

                this.update = function (target) {
                  var isImage = target && target.nodeName.toUpperCase() === 'IMG';
                  var $selection = this.$handle.find('.note-control-selection');

                  context.invoke('imagePopover.update', target);

                  if (isImage) {
                    var $image = $(target);
                    var pos = $image.position();

                    // exclude margin
                    var imageSize = {
                      w: $image.innerWidth(),
                      h: $image.innerHeight()
                    };

                    var imageMargin = {
                      top: parseInt($image.css('margin-top')),
                      left: parseInt($image.css('margin-left'))
                    };

                    $selection.css({
                      display: 'block',
                      left: pos.left + imageMargin.left,
                      top: pos.top + imageMargin.top,
                      width: imageSize.w,
                      height: imageSize.h
                    }).data('target', $image); // save current image element.

                    var sizingText = imageSize.w + 'x' + imageSize.h;
                    $selection.find('.note-control-selection-info').text(sizingText);
                    context.invoke('editor.saveTarget', target);
                  } else {
                    this.hide();
                  }

                  return isImage;
                };

                /**
                 * hide
                 *
                 * @param {jQuery} $handle
                 */
                this.hide = function () {
                  context.invoke('editor.clearTarget');
                  this.$handle.children().hide();
                };
              }
              /* eslint-enable angular/angularelement */
              /* eslint-enable angular/controller-as-vm */

              ////////////////////////////////////////////////////////////////////////

              vm.options = {
                dialogsInBody: true,
                height: vm.height || 350,
                focus: false,
                airMode: false,
                toolbar: toolbar,
                shortcuts: true,
                lang: $translate.use(),
                popover: {
                  link: toolbarPopoverLink,
                  image: toolbarPopoverImage,
                  table: toolbarPopoverTable
                },
                buttons: {
                  insertLink: InsertLinkButton,
                  insertImage: InsertImageButton,
                  editLink: EditLinkButton,
                  insertVideo: InsertVideoButton,
                  insertFileLink: InsertFileLinkButton,
                  insertTab: InsertTabButton,
                  removeTab: RemoveTabButton,
                  resizeImage15: EditImageSize15,
                  floatLeftImage: FloatLeftImage,
                  floatRightImage: FloatRightImage,
                  floatNoneImage: FloatNoneImage
                }
              };
            });
      });
    })();
  }
})(angular);
