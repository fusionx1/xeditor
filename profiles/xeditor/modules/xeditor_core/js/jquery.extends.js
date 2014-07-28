jQuery.extend(jQuery.fn, {
  within: function(parent) {
    return this.filter(function() {
      return !!jQuery(this).closest(parent).length;
    });
  },

  hasAncestor: function(ancestor) {
    return this.within(ancestor).length > 0;
  }
});
