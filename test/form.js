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

  module("Form behaviours", {
    setup: function() { // This will run before each test in this module.
      this.elems = $('#qunit-fixture').children();
    }
  });

  test("Ask on Leave", function() {
    var prompted = false,
        $form = $('#qunit-form'),
        $name = $('#name');

    $form.uniform({
      ask_on_leave: true,
      on_leave_callback: function() {
        prompted = true;
      }
    });

    // The autofocus on the #name is causing a change on load
    // We want this test to pass, and don't really care to test
    // the combination of autofocus and the ask_on_leave
    $name.val($name.attr('data-default-value'));

    jQuery(window).trigger('beforeunload');
    equal(
      prompted,
      false,
      "Form passes without data changing."
    );

    jQuery('#email', $form).val('spam@example.com');
    jQuery(window).trigger('beforeunload');

    equal(
      prompted,
      true,
      "Form has calls on_leave_callback after data change."
    );

  });

  test("Prevent submit", function() {
    var $form = jQuery('#qunit-form');

    $form.uniform({prevent_submit : true});

    jQuery('#email', $form)
      .trigger('focus')
      .val('invalid.email')
      .trigger('blur');
    $form.trigger('submit');

    equal(
      $form.hasClass('failedSubmit'),
      true,
      "Form has failedSubmit class after submit with invalid data"
    );
  });

  test("Submit callback is executed", function() {
    var was_called = false,
        $form = jQuery('#qunit-form');

    $form.uniform({
      submit_callback: function () {
        was_called = true;
        return false;
      }
    });

    $form.trigger('submit');

    equal(
      was_called,
      true,
      "Submit callback was not called"
    );
  });


}(jQuery));
