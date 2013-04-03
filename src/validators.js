/* global jQuery:false */

(function ($) {

  var escapeStr;

  $.uniform = $.uniform || {};

  // Hold a collection of the various form validators
  $.uniform.validators = {};

  escapeStr = function (str) {
   return (str) ? str.replace(/([ #;&,.+*~\':"!\^$\[\]()=>|\/@])/g,'\\$1'): str;
  };

  // Value of field is not empty, whitespace will be counted as empty
  $.uniform.validators.required = function ($field, caption) {
    var name;
    if ($field.is(':radio')) {
      name = escapeStr($field.attr('name'));
      if ($("input[name=" + name + "]:checked").length) {
        return true;
      }
      return $.uniform.i18n('req_radio', caption);
    }
    if ($field.is(':checkbox')) {
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
  // is only the __name__ of the element
  //
  // `class="validateSameAs field_id"`
  $.uniform.validators.validateSameAs = function ($field, caption, options) {
    var classes = $field.attr('class').split(' '),
        target_field_name = '',
        target_field_caption = '',
        $form = $field.closest('form'),
        $target_field, i;

    options = options || $.uniform.defaultOptions;
    for (i = 0; i < classes.length; i += 1) {
      if (classes[i] === 'validateSameAs') {
        if (classes[i + 1] !== 'undefined') {
          target_field_name = classes[i + 1];
          break;
        }
      }
    }

    if (target_field_name) {
      $target_field = $form.find('input[name="' + target_field_name + '"]');
      if ($target_field.val() !== $field.val()) {
        target_field_caption = $.uniform.get_label_text($target_field, options);
        return $.uniform.i18n('same_as', caption, target_field_caption);
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

}(jQuery));
