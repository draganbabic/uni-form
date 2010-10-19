// Author: Ilija Studen for the purposes of Uni–Form
// Modified by Aris Karageorgos to use the parents function

jQuery.fn.uniform = function(settings) {
  settings = jQuery.extend({
    valid_class    : 'valid',
    invalid_class  : 'invalid',
    focused_class  : 'focused',
    holder_class   : 'ctrlHolder',
    field_selector : 'input, select, textarea'
  }, settings);
  
  return this.each(function() {
    var form = jQuery(this);
    // Select form fields and attach them higlighter functionality
    form.find(settings.field_selector).focus(function() {
      form.find('.' + settings.focused_class).removeClass(settings.focused_class);
      $(this).parents().filter('.'+settings.holder_class+':first').addClass(settings.focused_class);
    }).blur(function() {
      form.find('.' + settings.focused_class).removeClass(settings.focused_class);
    });
  });
};
// Auto set on page load...
$(document).ready(function() {
  jQuery('form.uniForm').uniform();
});