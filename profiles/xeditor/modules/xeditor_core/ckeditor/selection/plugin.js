/**
 * @file plugin.js
 * Manage selection in Ckeditor.
 */
( function() {
  CKEDITOR.plugins.add( 'selection', {
    icons: 'selection',
    init: function( editor ) {
      editor.addCommand( 'selection', {
        exec : function( editor ) {   
          // Get Text.
          var selected_text = editor.getSelection().getSelectedText();
          // Make a new paragraph.
          var newElement = new CKEDITOR.dom.element("p");
          // Set Attributes
          newElement.setAttributes({class: 'selected'})
          // Set text to element.
          newElement.setText(selected_text);
          // Add the new element containing selected text.
          editor.insertElement(newElement);
        }
      });
      editor.ui.addButton( 'selection', {
        label: 'Content selection',
        command: 'selection',
        icon: this.path + 'icons/selection.png'
      });
      editor.config.contentsCss = this.path + 'css/selection.css';
    }
  });
})();
