/**
 * @file plugin.js
 * Manage selection in Ckeditor.
 */
(function($) {
  CKEDITOR.plugins.add('selection', {
    icons: 'selection',
    init: function(editor) {
      editor.addCommand('selection', {
        exec : function(editor) {   
          //
        }
      });
      editor.ui.addButton('selection', {
        label: 'Content selection',
        command: 'selection',
        icon: this.path + 'icons/selection.png'
      });
      editor.config.contentsCss = this.path + 'css/selection.css';
      console.log(this.path);
    },

    afterInit: function (editor) {
      console.log(Drupal.xeditor.getSelection());
      var selection = new CKEDITOR.dom.selection(CKEDITOR.document);
    }

  });
})(jQuery);
