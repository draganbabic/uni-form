module("Github cases");

/**
 * Case 1
 * 
 * Prevent submit fails if the blur handler hasn't been called on data
 * 
 * @link https://github.com/LearningStation/uni-form/issues/issue/1
 */
test("Prevent submit fails for existing data", function() {

  $form = jQuery('#qunit-form');
  jQuery('#email', $form).val('invalid@example');
  $form.uniform({
      prevent_submit : true
  });

  $form.trigger('submit');
  
  equals(
    $form.hasClass('failedSubmit'),
    true,
    "Form has failedSubmit class after submit without blur on invalid data"
  );

});



/**
 * Case 3
 * 
 * data-default-value gets submitted
 * 
 * @link https://github.com/LearningStation/uni-form/issues/issue/3
 */
test("data-default-value gets submitted", function() {

  $form = jQuery('#qunit-form');
  $form.uniform();

  equals(
    $('input[name="email"]', $form).val(),
    "Your email address",
    "Value of email field is same as prompt"
  );
  
  $form.trigger('submit');

  equals(
    $('input[name="email"]', $form).val(),
    "",
    "Value of email field is empty after submit"
  );

});