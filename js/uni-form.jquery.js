// Author: Ilija Studen for the purposes of Uni–Form

// Modified by Aris Karageorgos to use the parents function

// Modified by Toni Karlheinz to support input fields' text
// coloring and removal of their initial values on focus

jQuery.fn.uniform = function(settings) {
  settings = jQuery.extend({
    valid_class    : 'valid',
    invalid_class  : 'invalid',
    focused_class  : 'focused',
    holder_class   : 'element',
    field_selector : ':text, textarea',
    default_value_color: "#AFAFAF"
  }, settings);
  
  return this.each(function() {
    var form = jQuery(this);
    form.submit(function(){
      form.find(settings.field_selector).each(function(){
        if($(this).val() == $(this).attr("default_value")) $(this).val("");
      });
    });
    // Select form fields and attach them higlighter functionality
    form.find(settings.field_selector).each(function(){
      var default_value = $(this).val();
      var default_color = $(this).css("color");
      if($(this).val() == default_value){$(this).css("color",settings.default_value_color);};
      $(this).attr("default_value", default_value);
      $(this).focus(function() {
       form.find('.' + settings.focused_class).removeClass(settings.focused_class);
        $(this).parents().filter('.'+settings.holder_class+':first').addClass(settings.focused_class);
        if($(this).val() == default_value){ $(this).val("");$(this).css("color",default_color); };
      }).blur(function() {
        form.find('.' + settings.focused_class).removeClass(settings.focused_class);
        if($(this).val() == ""){$(this).css("color",settings.default_value_color);$(this).val(default_value);};
      });
    })
  });
};
// Auto set on page load...
$(document).ready(function() {
  jQuery('form').uniform();
});

