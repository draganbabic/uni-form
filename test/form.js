module("Form behaviours");

test("Ask on Leave", function() {
  var prompted = false;
  
  $form = jQuery('#qunit-form');
  $form.uniform({
    ask_on_leave      : true,
    on_leave_callback : function() {
      prompted = true;
    }
  });
  
  // The autofocus on the #name is causing a change on load
  // We want this test to pass, and don't really care to test
  // the combination of autofocus and the ask_on_leave
  $name = $('#name')
  $name.val($name.attr('data-default-value'));
  
  jQuery(window).trigger('beforeunload')
  equals(
    prompted,
    false,
    "Form passes without data changing."
  );

  jQuery('#email', $form).val('spam@example.com');
    
  jQuery(window).trigger('beforeunload')
  equals(
    prompted,
    true,
    "Form has calls on_leave_callback after data change."
  );

});

test("Prevent submit", function() {
  $form = jQuery('#qunit-form');
  $form.uniform({prevent_submit : true});
  jQuery('#email', $form)
    .trigger('focus')
    .val('invalid.email')
    .trigger('blur');
  $form.trigger('submit');
  
  equals(
    $form.hasClass('failedSubmit'),
    true,
    "Form has failedSubmit class after submit with invalid data"
  );
});

