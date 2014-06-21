/**
 * @file
 * xEditor_core Barley. Provides Barley-like functionality.
 */ 
(function ($, Backbone, Drupal, drupalSettings, JSON, storage) {

  Drupal.behaviors.xeditor = {
    attach: function (context, settings) {
      // Do something
    }
  };

  Drupal.xeditor = {
    // A Drupal.edit.AppView instance.
    app: null,

    collections: {
      // All in-place editable entities (Drupal.edit.EntityModel) on the page.
      entities: null,
      // All in-place editable fields (Drupal.edit.FieldModel) on the page.
      fields: null
    },

    // In-place editors will register themselves in this object.
    editors: {},

    // Per-field metadata that indicates whether in-place editing is allowed,
    // which in-place editor should be used, etc.
    metadata: {
      has: function (fieldID) {
        return storage.getItem(this._prefixFieldID(fieldID)) !== null;
      },
      add: function (fieldID, metadata) {
        storage.setItem(this._prefixFieldID(fieldID), JSON.stringify(metadata));
      },
      get: function (fieldID, key) {
        var metadata = JSON.parse(storage.getItem(this._prefixFieldID(fieldID)));
        return (key === undefined) ? metadata : metadata[key];
      },
      _prefixFieldID: function (fieldID) {
        return 'Drupal.edit.metadata.' + fieldID;
      },
      _unprefixFieldID: function (fieldID) {
        // Strip "Drupal.edit.metadata.", which is 21 characters long.
        return fieldID.substring(21);
      },
      intersection: function (fieldIDs) {
        var prefixedFieldIDs = _.map(fieldIDs, this._prefixFieldID);
        var intersection = _.intersection(prefixedFieldIDs, _.keys(sessionStorage));
        return _.map(intersection, this._unprefixFieldID);
      }
    }
  };
  
})(jQuery, Backbone, Drupal, Drupal.settings, window.JSON, window.sessionStorage);
