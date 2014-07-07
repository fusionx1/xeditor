/**
 * @file
 * xEditor_core Barley. Provides Barley-like functionality.
 */
(function ($) {

  Drupal.behaviors.xeditorCore = {
    attach: function (context, settings) {
      // Load editable fields when tapping content.
      // See - http://api.jquery.com/trigger/.
      $(".node .field-name-body, .node h2 a").click(function() {
        $(".quick-edit a").trigger("click");
      });

      // Load ckeditor.
      var element = $(".node .field-name-body .field-item");
      $(element).mouseup(function(){
        var selection = Drupal.xeditor.getSelection();
        if (selection.length != 0) {
          setTimeout(function(){
            if ($(".node .field-name-body").hasClass("edit-editable")) {
              $(".node .field-name-body.edit-editable").trigger("click");
            }
          }, 1000);
        }
      });
    }
  };

  Drupal.xeditor = new Object;

  /**
   * Get text selection.
   */
  Drupal.xeditor.getSelection = function() {
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    }
    else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    return text;
  };

})(jQuery);
