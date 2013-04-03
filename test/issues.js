(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module("Github cases", {
    setup: function() { // This will run before each test in this module.
      this.elems = $('#qunit-fixture').children();
    }
  });

  /**
   * Case 1
   *
   * Prevent submit fails if the blur handler hasn't been called on data
   *
   * @link https://github.com/LearningStation/uni-form/issues/issue/1
   */
  test("Case 1: Prevent submit fails for existing data", function() {
    var $form = jQuery('#qunit-form');

    jQuery('#email', $form).val('invalid@example');

    $form.uniform({
        prevent_submit : true
    });

    $form.trigger('submit');

    equal(
      $form.hasClass('failedSubmit'),
      true,
      "Form has failedSubmit class after submit without blur on invalid data"
    );

  });

  /**
   * Case 2
   *
   * Feature request for required selection on radio button
   * when form inits with no selection
   *
   * @link https://github.com/LearningStation/uni-form/issues/issue/2
   */
  test("Case 2: Required validation for radio button", function() {
    var hasError = false,
        $form = jQuery('#qunit-form');

    $form
      .uniform({
        invalid_class           : 'invalid',
        error_class             : 'error',
        prevent_submit          : true,
        prevent_submit_callback : function($submit_form) {
          hasError =
              $('input[name="color"]:radio:first', $submit_form)
                  .parents('div.ctrl-holder')
                  .hasClass('error');
          return false;
        }
      })
      .trigger('submit');

    equal(hasError, true,
      "Radio group has invalid class after submit"
    );

    $('input[name="color"]:radio:first', $form).attr('checked', true);
    $form.trigger('submit');

    equal(
      hasError,
      false,
      "Radio group validated after selection and second submit"
    );

  });

  /**
   * Case 3
   *
   * data-default-value gets submitted
   *
   * @link https://github.com/LearningStation/uni-form/issues/issue/3
   */
  test("Case 3: data-default-value should not be submitted", function() {

    var $form = jQuery('#qunit-form');

    $form.uniform();

    equal(
      $('input[name="email"]', $form).val(),
      "Your email address",
      "Value of email field is same as prompt"
    );

    $form.trigger('submit');

    equal(
      $('input[name="email"]', $form).val(),
      "",
      "Value of email field is empty after submit"
    );

  });

  /**
   * Case 4
   *
   * Feature request for required selection on checkbox
   *
   * @link https://github.com/LearningStation/uni-form/issues/issue/4
   */
  test("Case 4: Required validation for checkbox", function() {
    var hasError = false,
        $form = jQuery('#qunit-form');

    $form
      .uniform({
        invalid_class           : 'invalid',
        error_class             : 'error',
        prevent_submit          : true,
        prevent_submit_callback : function($submit_form) {
          hasError =
              $('input[name="agreement"]:checkbox', $submit_form)
                  .parents('div.ctrl-holder')
                  .hasClass('error');
          return false;
        }
      })
      .trigger('submit');

    equal(hasError, true, "Checkbox has invalid class after submit");

    $('input[name="agreement"]:checkbox', $form).attr('checked', true);
    $form.trigger('submit');

    equal(hasError, false, "Validated after selection and second submit");

  });

  /**
   * Case 9
   *
   * Compatibility with HTML5 autofocus attribute
   *
   * @link https://github.com/LearningStation/uni-form/issues/issue/15
   */
  test("Case 9: Autofocus field works with highlight and default data", function() {

    var $input = $('#name'),
        $form = $('#qunit-form');

    function supports_input_autofocus() {
      var i = document.createElement('input');
      return 'autofocus' in i;
    }

    $input.attr('data-default-value', 'Sample data in case there is none');

    $form.uniform({
      focused_class : 'focused'
    });

    // Branching structures in tests are bad, but unsure how to proceed here.
    if (supports_input_autofocus()) {
      // the ctrlHolder should be focused.
      ok(
        $input.parents('div.ctrl-holder').hasClass('focused'),
        'The autofocus form element should be highlighted.'
      );

      // the default text should also be removed
      equal($input.val(), '', 'The default text should be removed on autofocused fields.');
    }
    else {
      ok(true, "This browser does not support autofocus");
    }



  });

  /**
   * Case 15
   *
   * Default values may be rounding or being altered
   *
   * @link https://github.com/LearningStation/uni-form/issues/issue/15
   */
  test("Case 15: Default value with a period should not be rounded", function() {
    var $input = $('#issue_15_a'),
        $form = $('#qunit-form');

    $input.attr('data-default-value', '100.000');

    $form.uniform();

    equal(
      $input.val(),
      $input.attr('data-default-value'),
      "A default value of 100.00 should display with decimal point intact."
    );
  });

  /**
   * Case 17
   *
   * Support for input element names with a period
   *
   * @link https://github.com/LearningStation/uni-form/issues/issue/15
   */
  test("Case 17: Support for input element names with a period", function() {
    var $inputs = $('input[name="color"]'),
        $form = $('#qunit-form');

    $inputs.attr({
      name: "demographicInfo.gender"
    });

    $form.uniform();
    $form.submit();

    ok($form.hasClass("failedSubmit"), "Required form failure");
  });


}(jQuery));
