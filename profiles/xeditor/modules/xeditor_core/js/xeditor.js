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
    }
  };

  function SelectText(element) {
    var text = document.getElementById(element);
    if ($.browser.msie) {
      var range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
    }
    else if ($.browser.mozilla || $.browser.opera) {
      var selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    else if ($.browser.safari) {
      var selection = window.getSelection();
      selection.setBaseAndExtent(text, 0, text, 1);
    }
  }
})(jQuery);
