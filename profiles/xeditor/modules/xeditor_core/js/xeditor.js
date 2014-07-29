/**
 * @file
 * xEditor Barley. Provides Barley-like functionality.
 */
(function ($) {

  var baseUrl = Drupal.settings.xeditor_core.base_path;
  var argZero = Drupal.settings.xeditor_core.arg_zero;

  Drupal.xeditor = {

    init: function() {
      this.applyCKEEvents();
    },

    // Unselects everything in the window
    unselectAll: function() {
      if (window.getSelection) {
        // Chrome.
        if (window.getSelection().empty) {
          window.getSelection().empty();
        }
        // Firefox.
        else if (window.getSelection().removeAllRanges) {
          window.getSelection().removeAllRanges();
        }
      }
      // IE?
      else if (document.selection) {
        document.selection.empty();
      }
    },

    // Focus the one of the first elements on site (#page)
    focusDefault: function() {
      $('#page').find('a, input, textarea, button').first().focus();
    },

    /**
     * getSelection()
     * - Returns the current selection from window
     * - Takes no arguments
     */
    getSelection: function() {
      var text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      }
      else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
      }

      return text;
    },

    /**
     * makeSelection(CKeditor, string)
     * - Applies selection to editor
     * TODO: finish this function, this is just a copy/paste
     */
    makeSelection: function(editor, selection) {
      // Grabs the current selection so that we can
      // reapply it to the editable content in CKE.
      var sel = editor.getSelection();

      // Change the selection to the current element.
      var element = sel.getStartElement();
      sel.selectElement(element);

      // Move the range to the we selected earlier.
      var findString = Drupal.xeditor.getSelection();
      var ranges = editor.getSelection().getRanges();
      var startIndex = element.getHtml().indexOf(findString);
      if (startIndex != -1 && (typeof ranges[0] != 'undefined')) {
        ranges[0].setStart(element.getFirst(), startIndex);
        ranges[0].setEnd(element.getFirst(), startIndex + findString.length);
        sel.selectRanges([ranges[0]]);
      }
    },

    loadScript: function(url, callback) {
      // Adding the script tag to the head as suggested before.
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;

      // Then bind the event to the callback function.
      // There are several events for cross browser compatibility.
      script.onreadystatechange = callback;
      script.onload = callback;

      // Fire the loading.
      head.appendChild(script);
    },

    setTitleSettings: function(editor) {
      console.warn('Setting title settings for CKE');

      // Remove unnecessary plugins to make the editor simpler.
      var unwantedPlugins = [
        'colorbutton',
        'find',
        'flash',
        'font',
        'forms',
        'iframe',
        'image',
        'newpage',
        'removeformat',
        'smiley',
        'specialchar',
        'stylescombo',
        'templates'
      ];

      editor.config.removePlugins = unwantedPlugins.join(',');

      // Rearrange the layout of the toolbar.
      editor.config.toolbarGroups = [
        { name: 'editing',    groups: [ 'basicstyles', 'links' ] },
        { name: 'undo' },
        { name: 'clipboard',  groups: [ 'selection', 'clipboard' ] },
        { name: 'about' }
      ];
    },

    shouldBeHandledAsTitle: function($el) {
      var titles = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      return ($el.is(titles) || $el.hasAncestor(titles));
    },

    stripNid: function(nid) {
      return parseInt(nid.match(/\d{1,}$/g));
    },

    deduceField: function($el) {
      if (this.shouldBeHandledAsTitle($el)) {
        return 'TITLE';
      }
      else if ($el.hasAncestor('field-name-body')) {
        return 'BODY';
      }
      else if ($el.hasAncestor('field-type-taxonomy-term-reference')) {
        return 'TAGS';
      }
      else {
        console.warn('Could not deduce what field should be updated.');
        return null;
      }
    },

    // TODO: Finish this function
    saveContent: function(nid, field, html) {
      var ajx = $.ajax({
        url: baseUrl + '/ajax-callback',
        type: 'POST',
        dataType: 'JSON',
        data: {
          nid: nid,
          arg: argZero,
          field: field,
          content: html
        }
      });

      ajx.fail(function(xhr, status, er) {
        console.info('Saving node resulted in this: ');
        console.error(er);
      });

      ajx.always(function(xhr, status, er) {
        console.info('Ajax done..');
        console.info(status);
        console.log(xhr);
      });
    },

    getNid: function($el) {
      var node = $el.closest('.node');
      var id = $el.closest('.node').attr('id');

      // Checks if there's an H1 on page.
      // Then there should be only one .node elem.
      if (node.length < 1 && $el.is('h1')) {
        var n = $('.node');

        // Checks if there are more nodes if so, abort!
        if (n.length > 1) {
          console.warn('Could not find correct node ID. Aborting save.');
          return false;
        }
        else {
          // Seems we found the right node (there was only one).
          return n.attr('id');
        }
      }
      else {
        // Seems we could find the correct node without trouble.
        return id;
      }
    },

    applyCKEEvents: function() {
      var that = this;

      CKEDITOR.plugins.registered['save'] = {
        init : function(editor) {
          var command = editor.addCommand('save', {
            modes : { wysiwyg:1, source:1 },
            exec : function(editor) {
              var html = editor.getData(),
               nidAttr = that.getNid($(editor.element.$)),
                 field = that.deduceField($(editor.element.$)),
                  nid  = that.stripNid(nidAttr);

              // Fires save event, then saves and unfocus/blur/unselects everything
              editor.fire('save');
              that.saveContent(nid, field, html);
              editor.fire('blur');
              that.unselectAll();
              that.focusDefault();
            }
          });

          editor.ui.addButton('Save', { label : 'Save changes', command : 'save', toolbar: 'basicstyles,1' });
        }
      };

      CKEDITOR.on('instanceCreated', function(e) {
        var editor  = e.editor,
            element = editor.element;

        if (Drupal.xeditor.shouldBeHandledAsTitle($(element.$))) {
          editor.on('configLoaded', function() {
            that.setTitleSettings(editor);
          });
        }

        editor.on('save', function(e) {
        });
      });

      CKEDITOR.on("instanceReady", function(e) {
        // Simple shout-out about what instances exists atm.
        for(var instanceName in CKEDITOR.instances) {
          // console.log(CKEDITOR.instances[instanceName]);
        }
      });
    }
  };

})(jQuery);
