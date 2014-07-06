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
})(jQuery);
