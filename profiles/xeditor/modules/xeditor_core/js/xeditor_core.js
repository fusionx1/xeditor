/**
 * @file
 * xEditor_core Barley. Provides Barley-like functionality.
 */
(function ($) {

  Drupal.behaviors.xeditorCore = {

    // This behavior function is called when new element is being added.
    attach: function (context, settings) {
      if (context == document) {
        this.applyCKEditor(context);
        this.handleTriggerEvents();
        Drupal.xeditor.init();
      }
    },

    // This behavior function is called when elements are removed.
    detach: function (context, settings) {
      // Do your js stuffs you want to do after your AJAX call.
    },

    editTriggers: [
      '.node h2 .edit-field',
      'h1.title'
    ],

    // Makes sure that the triggers that triggers
    // CKEditor doesn't do anything else but that.
    handleTriggerEvents: function() {
      $(this.editTriggers.join(', ')).on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
    },

    // Adds an attribute to a set of elements.
    applyCKEditor: function(context) {
      console.log('Adding contenteditable..');
      var trigs = this.editTriggers.join(', ');

      $(trigs, context).attr('contenteditable', true);
    }

  };

})(jQuery);
