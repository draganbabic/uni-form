//
// Uni-Form jQuery Plugin without Validation
// =============================================================================
//
// Provides form actions for use with the [Uni-Form markup][sprawsm] style
//
// Author: Ilija Studen for the purposes of Uni-Form
//
// Modified by Aris Karageorgos to use the parents function
//
// Modified by Toni Karlheinz to support input fields' text
// coloring and removal of their initial values on focus
//
// Modified by Jason Brumwell for optimization, addition
// of valid and invalid states and default data attribues
//
// Modified by [Craig Davis][there4] with refactoring and unit tests
//
// @license MIT http://www.opensource.org/licenses/mit-license.php
//
// [sprawsm]: http://sprawsm.com/uni-form/
// [there4]: http://there4development.com
//
/* global jQuery:false */
(function ($) {

  $.fn.uniform = function (settings) {

    settings = $.extend({
      valid_class:         'valid',
      invalid_class:       'invalid',
      error_class:         'error',
      focused_class:       'focused',
      holder_class:        'ctrl-holder',
      field_selector:      'input, textarea, select',
      default_value_color: '#afafaf'
    }, settings);

    return this.each(function () {
      var form = $(this), validate;

      validate = function ($input, valid, text) {
        var $p;
        $p = $input
          .closest('div.' + settings.holder_class)
          .andSelf()
          .toggleClass(settings.invalid_class, !valid)
          .toggleClass(settings.error_class, !valid)
          .toggleClass(settings.valid_class, valid)
          .find('p.form-hint');

        if (!valid && !$p.data('info-text')) {
          $p.data('info-text', $p.html());
        } else if (valid) {
          text = $p.data('info-text');
        }

        if (text) {
          $p.html(text);
        }
      };

      form.submit(function () {
        form.find(settings.field_selector).each(function () {
          if ($(this).val() === $(this).data('default-value')) {
            $(this).val("");
          }
        });
      });

      // Select form fields and attach the higlighter functionality
      form.find(settings.field_selector).each(function () {
        var $input = $(this),
            value = $input.val();

        $input.data('default-color', $input.css('color'));

        if (value === $input.data('default-value') || ! value) {
          $input.not('select').css("color", settings.default_value_color);
          $input.val($input.data('default-value'));
        }
      });

      form.delegate(settings.field_selector, 'focus', function () {
        form
          .find('.' + settings.focused_class)
          .removeClass(settings.focused_class);

        var $input = $(this);

        $input
          .parents()
          .filter('.' + settings.holder_class + ':first')
          .addClass(settings.focused_class);

        if ($input.val() === $input.data('default-value')) {
          $input.val("");
        }

        $input.not('select').css('color', $input.data('default-color'));
      });

      form.delegate(settings.field_selector, 'blur', function () {
        var $input = $(this);
        form
          .find('.' + settings.focused_class)
          .removeClass(settings.focused_class);
        if ($input.val() === "" ||
          $input.val() === $input.data('default-value')
        ) {
          $input.not('select').css("color", settings.default_value_color);
          $input.val($input.data('default-value'));
        } else {
          $input.css('color', $input.data('default-color'));
        }
      });

      form.delegate(settings.field_selector, 'error', function (e, text) {
        validate($(this), false, text);
      });

      form.delegate(settings.field_selector, 'success', function () {
        validate($(this), true);
      });
    });
  };

}(jQuery));
