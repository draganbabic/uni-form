/*! Uni-Form - v1.5.0 - 2013-03-31
* http://sprawsm.com/uni-form/
* Copyright (c) 2013 Dragan Babic; Licensed MIT */
//
// Uni-Form jQuery Plugin with Validation
// =============================================================================
//
// Provide form actions for use with the [Uni-Form markup][sprawsm] style
// This version adds additional support for client side validation.
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
// Modified by [Craig Davis][there4] to add support for client
// side validation routines. The validation routines based on an
// open source library of unknown authorship.
//
// @license MIT http://www.opensource.org/licenses/mit-license.php
//
// [sprawsm]: http://sprawsm.com/uni-form
// [there4]: http://there4development.com
//
/* global jQuery:false */
(function ($) {

  // Static Method to hold config and options
  $.uniform = function () {};

  // Hold a collection of the various form validators
  $.uniform.validators = {};

  // Get the value for a validator that takes parameters.
  // These are in the format of `val-{value}`
  $.uniform.get_val = function (name, classes, defaultValue) {
    var i, value = defaultValue;
    classes = classes.split(' ');
    for (i = 0; i < classes.length; i += 1) {
      if (classes[i] === name) {
        if ((classes[i + 1] !== 'undefined') && ('val-' === classes[i + 1].substr(0, 4))) {
          value = parseInt(classes[i + 1].substr(4), 10);
          return value;
        }
      }
    }
    return value;
  };

  // Get the text of the label that belongs to the field
  $.uniform.get_label_text = function ($field, options) {
    var text = $field.closest('label').text();
    if (text === '') {
      text = $field.closest('div.' + options.holder_class).find('label').text();
    }
    return text.replace('*', '').replace(':', ''); // Pretty formatting
  };

  // Set the results of form validation on the form element
  $.uniform.validate = function ($input, isValid, errorMessage, errors, options) {
    var $p, name;
    options = options || $.uniform.defaultOptions;
    $p = $input
      .closest('div.' + options.holder_class)
      .andSelf()
      .toggleClass(options.invalid_class, !isValid)
      .toggleClass(options.error_class, !isValid)
      .toggleClass(options.valid_class, isValid)
      .find('p.form-hint');

    name = $input.attr('name');

    // Store this into the errors array, can be used by the custom callback
    if (!isValid) {
      errors[name] = errorMessage;
    }
    else if (name in errors) {
      delete errors[name];
    }

    // If the validation failed we'll stash the p help text into the info-data
    // and then put the error message in it's place.
    if (!isValid && ! $p.data('info-text')) {
      $p.data('info-text', $p.html());
    }
    else if (isValid) {
      errorMessage = $p.data('info-text');
    }

    if (errorMessage) { $p.html(errorMessage); }
  };

  $.fn.uniform = function (options) {

    options = $.extend($.uniform.defaultOptions, options);

    return this.each(function () {
      var form, errors, get_label_text, get_val, validate, initial_values;

      form = $(this);
      errors = [];
      get_label_text = $.proxy($.uniform.get_label_text, this);
      get_val = $.proxy($.uniform.get_val, this);
      validate = $.proxy($.uniform.validate, this);

      // Select form fields and attach the highlighter functionality
      form.find(options.field_selector).each(function () {
        var $input = $(this),
            value = $input.val();

        $input.data('default-color', $input.css('color'));

        if (value === $input.data('default-value') || !value) {
          $input.not('select').css("color", options.default_value_color);
          // Issue 15, we use .attr() here because we want the string value
          // and the .data() can type cast
          $input.val($input.attr('data-default-value'));
        }
      });

      // Register the `ask_on_leave` handler
      //
      // We need to serialize the form data, wait for a beforeunload,
      // then serialize and compare for changes. If they changed things, and
      // haven't submitted, we'll let them know about it
      //
      // Note that you can turn on `askOnLeave` with either uniform.settings
      // or with a form class.
      if (options.ask_on_leave || form.hasClass('askOnLeave')) {
        initial_values = form.serialize();
        $(window).bind("beforeunload", function () {
          if ((initial_values !== form.serialize()) &&
              (options.ask_on_leave || form.hasClass('askOnLeave'))
          ) {
            return ($.isFunction(options.on_leave_callback)) ?
              options.on_leave_callback(form):
              window.confirm($.uniform.i18n('on_leave'));
          }
        });
      }


       // Attach the submit handler to the form
       //
       // Tasks
       //  * Remove any default values from the form
       //  * If prevent_submit is set true, return false if
       //    there are outstanding errors in the form
       //
       // TODO: Use prevent_submit to disable the submit in the blur handler
      form.submit(function () {
        var return_val, callback_result = true;

        // In the case of a previously failed submit, we'll remove our marker
        form.removeClass('failedSubmit');

        // Prevent the ask_on_leave from firing
        options.ask_on_leave = false;
        form.removeClass('askOnLeave');

        // Remove the default values from the val() where they were being displayed
        form.find(options.field_selector).each(function () {
          if ($(this).val() === $(this).data('default-value')) {
            $(this).val('');
          }
        });

        // Traverse and revalidate making sure that we haven't missed any fields
        // perhaps if a field was filled in before uniform was initialized
        // or if blur failed to fire correctly
        // You can turn on prevent_submit with either a class or with the uniform.settings
        if (options.prevent_submit || form.hasClass('preventSubmit')) {
          // use blur to run the validators on each field
          form.find(options.field_selector).each(function () {
            $(this).blur();
          });

          // if we have a submit callback, we'll give it a chance to inspect the data now
          if ($.isFunction(options.submit_callback)) {
            callback_result = options.submit_callback(form);
          }

          // if there are any error messages
          if (form.find('.' + options.invalid_class).add('.' + options.error_class).length ||
            (!callback_result)
          ) {
            return_val = ($.isFunction(options.prevent_submit_callback)) ?
                options.prevent_submit_callback(form, $.uniform.i18n('submit_msg'), [$.uniform.i18n('submit_help')]):
                $.fn.uniform.showFormError(form, $.uniform.i18n('submit_msg'), [$.uniform.i18n('submit_help')]);
          } // end form error counting

        } // end preventSubmit
        else {
          // We aren't preventing the submission when there are errors, so this function must
          // return true and allow the form to submit.
          return_val = true;
        }

        // QUnit needs to run this submit function, and still prevent the submit.
        // This isn't ideal, but it prevents us from having to trap events
        if (form.parents('#qunit-fixture').length) {
          return_val = false;
        }

        if (return_val === false) { form.addClass('failedSubmit'); }

        return return_val;
      });

      // Set the form focus class and remove any classes other than the focus
      // class and then hide the default label text
      form.delegate(options.field_selector, 'focus', function () {
        form.find('.' + options.focused_class).removeClass(options.focused_class);
        var $input = $(this);

        $input
          .parents()
          .filter('.' + options.holder_class + ':first')
          .addClass(options.focused_class);

        if ($input.val() === $input.data('default-value')) {
          $input.val('');
        }

        $input.not('select').css('color', $input.data('default-color'));
      });

      // Validate a form field on the blur event
      //
      // Search the classnames on the element for the names of
      // validators, and run them as we find them
      //
      // If the validators fail, we trigger either 'success' or 'error' events
      form.delegate(options.field_selector, 'blur', function () {
        var $input = $(this),
            has_validation = false,
            validator,
            validation_result,
            label = get_label_text($input, options);

        // Remove focus from form element
        form.find('.' + options.focused_class).removeClass(options.focused_class);

        // (if empty or equal to default value) AND not required
        if (($input.val() === "" || $input.val() === $input.data('default-value')) &&
          !$input.hasClass('required')
        ) {
          $input.not('select').css("color", options.default_value_color);
          $input.val($input.data('default-value'));
          return;
        }

        // run the validation and if they all pass, we mark the color and move on
        for (validator in $.uniform.validators) {
          if ($input.hasClass(validator)) {
            validation_result = $.uniform.validators[validator]($input, label, options);
            has_validation = true;
            if (typeof(validation_result) === 'string') {
              $input.trigger('error', validation_result);
              return;
            }
          }
        }

        // If it had validation and we didn't return above,
        // then all validation passed
        if (has_validation) {
          $input.trigger('success');
        }

        // Return the color to the default
        $input.css('color', $input.data('default-color'));
        return;
      });

      // Handle a validation error in the form element
      // This will set the field to have the error marker and update the
      // warning text
      form.delegate(options.field_selector, 'error', function (e, text) {
        validate($(this), false, text, errors, options);
      });

      // Handle a succesful validation in the form element
      // Remove any error messages and set the validation marker to be success
      form.delegate(options.field_selector, 'success', function () {
        validate($(this), true, '', errors, options);
      });

      // Issue 9: HTML5 autofocus elements
      // When the browser focuses, it happens before Uni-Form, and so we need
      // the manually run the focus event here to deal with style changes
      // and any handling of the default data
      $('input[autofocus]:first').focus();

    }); // end for each form
  };

  // Display a Uni-Form form validation error
  $.fn.uniform.showFormError = function ($form, errorTitle, errorMessages) {
    var m, $message;

    if ($('#errorMsg').length) {
      $('#errorMsg').remove();
    }

    $message = $('<div />')
      .attr('id', 'errorMsg')
      .html("<h3>" + errorTitle + "</h3>");

    if (errorMessages.length) {
      $message.append($('<ol />'));
      for (m in errorMessages) {
        if (errorMessages.hasOwnProperty(m)) {
          $('ol', $message).append($('<li />').text(errorMessages[m]));
        }
      }
    }

    $form.prepend($message);
    $('html, body').animate({ scrollTop: $form.offset().top }, 500);
    $('#errorMsg').slideDown();
    return false;
  };

  // Show the Uni-Form form success message
  $.fn.uniform.showFormSuccess = function ($form, successMessage) {
    $('#okMsg').remove(); // Remove the old message
    $form.prepend( // The success message
      $('<div />').attr('id', 'okMsg').html("<h3>" + successMessage + "</h3>")
    );
    // relocate to the top of the form so we can see the message
    $('html, body').animate({scrollTop: $form.offset().top}, 500);
    // Display the message by sliding it down
    $('#okMsg').slideDown();
    return false;
  };


  // Value of field is not empty, whitespace will be counted as empty
  $.uniform.validators.required = function ($field, caption) {
    var name;
    if ($field.is(':radio')) {
      name = $field.attr('name');
      if ($("input[name=" + name + "]:checked").length) {
        return true;
      }
      return $.uniform.i18n('req_radio', caption);
    }
    if ($field.is(':checkbox')) {
      name = $field.attr('name');
      if ($field.is(":checked")) { return true; }
      return $.uniform.i18n('req_checkbox', caption);
    }
    if ($.trim($field.val()) === '') {
      return $.uniform.i18n('required', caption);
    }
    return true;
  };

  // Value is shorter than allowed
  $.uniform.validators.validateMinLength = function ($field, caption) {
    var min_length = $.uniform.get_val('validateMinLength', $field.attr('class'), 0);
    if ((min_length > 0) && ($field.val().length < min_length)) {
      return $.uniform.i18n('minlength', caption, min_length);
    }
    return true;
  };

  // Value is less than min
  $.uniform.validators.validateMin = function ($field, caption) {
    var min_val = $.uniform.get_val('validateMin', $field.attr('class'), 0);
    if ((parseInt($field.val(), 10) < min_val)) {
      return $.uniform.i18n('min', caption, min_val);
    }
    return true;
  };

  // Value is longer than allowed
  $.uniform.validators.validateMaxLength = function ($field, caption) {
    var max_length = $.uniform.get_val('validateMaxLength', $field.attr('class'), 0);
    if ((max_length > 0) && ($field.val().length > max_length)) {
      return $.uniform.i18n('maxlength', caption, max_length);
    }
    return true;
  };

  // Value is greater than max
  $.uniform.validators.validateMax = function ($field, caption) {
    var max_val = $.uniform.get_val('validateMax', $field.attr('class'), 0);
    if ((parseInt($field.val(), 10) > max_val)) {
      return $.uniform.i18n('max', caption, max_val);
    }
    return true;
  };


  // Element has same value as that of the target Element
  //
  // This does not use the val-{name} format, and instead
  // is only the name of the element
  //
  // class="validateSameAs field_id"
  $.uniform.validators.validateSameAs = function ($field, caption, options) {
    var classes = $field.attr('class').split(' '),
        target_field = '',
        target_field_name = '',
        target_field_caption = '',
        i, $form;

    for (i = 0; i < classes.length; i += 1) {
      if (classes[i] === 'validateSameAs') {
        if (classes[i + 1] !== 'undefined') {
          target_field_name = classes[i + 1];
          break;
        }
      }
    }

    if (target_field_name) {
      $form = $field.parents('form:first');
      target_field = $('input[name="' + target_field_name + '"]', $form);
      if (target_field.length > 0) {
        if (target_field.val() !== $field.val()) {
          target_field_caption = $.uniform.get_label_text(target_field, options);
          return $.uniform.i18n('same_as', caption, target_field_caption);
        }
      }
    }

    return true;
  };

  // Valid email address
  $.uniform.validators.validateEmail = function ($field, caption) {
    if ($field.val().match(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
      return true;
    }
    return $.uniform.i18n('email', caption);
  };

  // Valid URL (http://,https://,ftp://)
  $.uniform.validators.validateUrl = function ($field, caption) {
    if ($field.val().match(/^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_\-]*)(\.[A-Z0-9][A-Z0-9_\-]*)+)(:(\d+))?\/?/i)) {
      return true;
    }
    return $.uniform.i18n('url', caption);
  };

  // Number is only valid value (integers and floats)
  $.uniform.validators.validateNumber = function ($field, caption) {
    if ($field.val().match(/(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/) || $field.val() === '') {
      return true;
    }
    return $.uniform.i18n('number', caption);
  };

  // Whole numbers are allowed
  $.uniform.validators.validateInteger = function ($field, caption) {
    if ($field.val().match(/(^-?\d\d*$)/) || $field.val() === '') {
      return true;
    }
    return $.uniform.i18n('integer', caption);
  };

  // Letters only
  $.uniform.validators.validateAlpha = function ($field, caption) {
    if ($field.val().match(/^[a-zA-Z]+$/)) {
      return true;
    }
    return $.uniform.i18n('alpha', caption);
  };

  // Letters and numbers
  $.uniform.validators.validateAlphaNum = function ($field, caption) {
    if ($field.val().match(/\W/)) {
      return $.uniform.i18n('alphanum', caption);
    }
    return true;
  };

  // Simple phrases of words, numbers and punctuation
  $.uniform.validators.validatePhrase = function ($field, caption) {
    if (($field.val() === '') || $field.val().match(/^[\w\d\.\-_\(\)\*'# :,]+$/i)) {
      return true;
    }
    return $.uniform.i18n('phrase', caption);
  };

  // Phone number
  $.uniform.validators.validatePhone = function ($field, caption) {
    var phoneNumber = /^\(?(\d{3})\)?[\- ]?(\d{3})[\- ]?(\d{4})$/;
    if (phoneNumber.test($field.val())) {
      return true;
    }
    return $.uniform.i18n('phone', caption);
  };

  // Date in MM/DD/YYYY format
  $.uniform.validators.validateDate = function ($field, caption) {
    if ($field.val().match('([0]?[1-9]|[1][0-2])/([0]?[1-9]|[1|2][0-9]|[3][0|1])/([0-9]{4}|[0-9]{2})$')) {
      return true;
    }
    return $.uniform.i18n('date', caption);
  };

  // Callback validator
  //
  // Lets you define your own validators. Usage:
  //
  // `<input name="myinput" class="validateCallback my_callback">`
  //
  // This will result in UniForm searching for `window.my_callback` function and
  // executing it with field and caption arguments. Sample implementation:
  //
  //     window.my_callback = function (field, caption) {
  //       if (field.val() === '34') {
  //         return true;
  //       } else {
  //         return caption + ' value should be "34"';
  //       }
  //     }
  //
  $.uniform.validators.validateCallback = function ($field, caption) {
    var classes = $field.attr('class').split(' '),
        callback_function = '',
        i;

    for (i = 0; i < classes.length; i += 1) {
      if (classes[i] === 'validateCallback') {
        if (classes[i + 1] !== 'undefined') {
          callback_function = classes[i + 1];
          break;
        }
      }
    }

    if (window[callback_function] !== 'undefined' &&
      (typeof window[callback_function] === 'function')
    ) {
      return window[callback_function]($field, caption);
    }

    return $.uniform.i18n('callback', caption, callback_function);
  };

   // Simple replacement for i18n + sprintf
   // $.uniform.i18n("string_key", sprintf style arguments)
  $.uniform.i18n = function (lang_key) {
    var lang_string = $.uniform.language[lang_key],
        bits = lang_string.split('%'),
        out = bits[0],
        re = /^([ds])(.*)$/,
        p, i;

    for (i = 1; i < bits.length; i += 1) {
      p = re.exec(bits[i]);
      if (!p || arguments[i] === null) {
        continue;
      }
      if (p[1] === 'd') {
        out += parseInt(arguments[i], 10);
      } else if (p[1] === 's') {
        out += arguments[i];
      }
      out += p[2];
    }
    return out;
  };

  // Internationalized language strings for validation messages
  $.uniform.language = {
    required:       '%s is required',
    req_radio:      'Please make a selection',
    req_checkbox:   'You must select this checkbox to continue',
    minlength:      '%s should be at least %d characters long',
    min:            '%s should be greater than or equal to %d',
    maxlength:      '%s should not be longer than %d characters',
    max:            '%s should be less than or equal to %d',
    same_as:        '%s is expected to be same as %s',
    email:          '%s is not a valid email address',
    url:            '%s is not a valid URL',
    number:         '%s needs to be a number',
    integer:        '%s needs to be a whole number',
    alpha:          '%s should contain only letters (without special characters or numbers)',
    alphanum:       '%s should contain only numbers and letters (without special characters)',
    phrase:         '%s should contain only alphabetic characters, numbers, spaces, and the following: . , - _ () * # :',
    phone:          '%s should be a phone number',
    date:           '%s should be a date (mm/dd/yyyy)',
    callback:       'Failed to validate %s field. Validator function (%s) is not defined!',
    on_leave:       'Are you sure you want to leave this page without saving this form?',
    submit_msg:     'Sorry, this form needs corrections.',
    submit_help:    'Please see the items marked below.',
    submit_success: 'Thank you, this form has been sent.'
  };

  // Classnames and callback options
  $.uniform.defaultOptions = {
    submit_callback:         false,
    prevent_submit:          false,
    prevent_submit_callback: false,
    ask_on_leave:            false,
    on_leave_callback:       false,
    valid_class:             'valid',
    invalid_class:           'invalid',
    error_class:             'error',
    focused_class:           'focused',
    holder_class:            'ctrl-holder',
    hint_class:              'form-hint',
    field_selector:          'input, textarea, select',
    default_value_color:     '#afafaf'
  };

}(jQuery));
