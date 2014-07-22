/**
 * @file
 * xEditor_core Barley. Provides Barley-like functionality.
 */
(function ($) {

  Drupal.behaviors.xeditorCore = {
    // This behavior function is called when new element is being added.
    attach: function (context, settings) {
      // Do your js stuffs you want to do after your AJAX call.
      // ******************************************************
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

      // This is to activate Ckeditor native inline-edit.
      // jQuery(".node .field-name-body").attr("contenteditable", "true");
    },

    // This behavior function is called when elements are removed.
    detach: function (context, settings) {
      // Do your js stuffs you want to do after your AJAX call.
    }
  };

  /**
   * Create a new object called 'xeditor'.
   */
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

  /**
   * Pre-Load Ckeditor script via AJAX.
   */
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
  };

  /**
   *  Pass user selection to Ckeditor instance.
   */
  CKEDITOR.on("instanceReady", function(event) {
    var editor = event.editor;
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

  });

  /**
   * Get Ckeditor instance.
   */
  Drupal.xeditor.getInstances = function() {
    CKEDITOR.on("instanceReady", function(event) {
      for(var instanceName in CKEDITOR.instances) {
        console.log(CKEDITOR.instances[instanceName]);
      }
    });
  };

})(jQuery);
