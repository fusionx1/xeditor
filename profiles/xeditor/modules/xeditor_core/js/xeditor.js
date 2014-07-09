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

      // Create an instance of CKEDITOR.dom.selection.
      var selection = new CKEDITOR.dom.selection(CKEDITOR.document);

      // Save bookmarks with selection.createBookmarks():
      var bookmarks = selection.createBookmarks(1);
      console.log(selection);
      console.log(bookmarks);
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

  // Pre-Load Ckeditor script via AJAX.
  Drupal.xeditor.loadScript = function(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
  }

})(jQuery);
