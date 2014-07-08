/**
 * @file
 * xEditor_core Barley. Provides Barley-like functionality.
 */
(function ($) {

  Drupal.behaviors.xeditorCore = {
    attach: function (context, settings) {
      // Load editable fields when tapping content.
      // See - http://api.jquery.com/trigger/.
      $(".front .node .field-name-body, .node .field-name-body, .node h2 a, .page-node h1.title").click(function() {
        $(".quick-edit a").trigger("click");
        setTimeout(function() {
          if ($(".page-node h1.title > div").hasClass("edit-editable")) {
            $(".page-node h1.title > div").trigger("click").focus();
          }
        }, 50);
      });

      // Load ckeditor.
      var element = $(".node .field-name-body .field-item");
      $(element).mouseup(function(){
        var selection = Drupal.xeditor.getSelection();
        if (selection.length != 0) {
          setTimeout(function() {
            if ($(".node .field-name-body, .node .field-name-body .field-item").hasClass("edit-editable")) {
              $(".node .field-name-body.edit-editable").trigger("click");
              $(".node .field-name-body .edit-editable").trigger("click");
            }
          }, 90);
        }
      });

      //jQuery(".node .field-name-body").attr("contenteditable", "true");
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
