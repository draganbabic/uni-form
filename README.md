[![Build Status](https://travis-ci.org/there4/uni-form.png?branch=make-sense)](https://travis-ci.org/there4/uni-form)

# [Uni-Form Markup][uni-form]: Making forms as simple as 1,2,3

- - -

Copyright (c) 2013, Dragan Babic

All JS written and maintained by Craig Davis of [There4 Development][t4]

> Permission is hereby granted, free of charge, to any person
> obtaining a copy of this software and associated documentation
> files (the "Software"), to deal in the Software without
> restriction, including without limitation the rights to use,
> copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the
> Software is furnished to do so, subject to the following
> conditions:
>
> The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
> OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
> HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
> WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
> FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
> OTHER DEALINGS IN THE SOFTWARE.

## About Uni–Form

Uni-Form is a “framework” that standardizes form markup and styles it with CSS
giving you two most widely used layout options to choose from. Anyone can get nice looking, well structured, highly customizable, accessible and usable forms. To put it simply: it makes a developer's life a lot easier.

* [Uni-Form Homepage][uni-form]
* [Support at GitHub Issues][issues]
* [GitHub repository][gh]

## How to Use?

First thing you need to do is to link up the necessary files:

1. Link to the main CSS file

        <link href="path/to/file/uni-form.css" rel="stylesheet"/>

2. Link to the Uni–Form style CSS file

        <link href="path/to/file/style.uni-form.css" rel="stylesheet"/>

3. Optionally you'll want to link up jQuery and Uni–Form jQuery files if you'd like Uni–Form to highlight the form rows on focus (it's a usability aid):

        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript" src="path/to/file/uni-form.jquery.js"></script>

4. You may also want to try out the version of the Uni–Form jQuery plugin that supports client side validation, in case replace the regular plugin with this:

        <script type="text/javascript" src="path/to/file/uni-form-validation.jquery.js"></script>

5. Please note that this plugin no longer automatically initializes itself. You must do this manually, by adding this snippet after you have included both jQuery and the plugin you have chosen:

        <script type="text/javascript">
          $(document).ready( function () {
            // Initialize Uni-Form
            $(function(){
              $('form.uniForm').uniform();
            });
          });
        </script>

- - -

Now that you're all set up, all you need to do is add form fields that are formatted with Uni–Form markup so the CSS and JavaScript will get the “hooks” they need. These chunks of code are called “units” and all available units can be found within the file called fauxform.html that is included in this package.

Feel free to extend Uni–Form with units of your own and share.

### Uni–Form unit basics

* All units should be contained within a `.ctrl-holder`
* All fields should be marked up with a class: `.input-text` (for single line inputs), `.input-textarea` ( for multiline-inputs), `.input-select` (for select boxes), `.input-file` (for file uploads).
*

## Styles

As of v1.4 Uni–Form supports styles. These are separate CSS files that contain the presentation aspect of your form (considering that uni-form.css) contains the layout and all other necessities. Style CSS files should be used to control how your form looks, spacing, etc.

Consider included style a starting point for making your own.

## Options and Layout Control

Uni–Form by default has two form layouts: default and inline. This is controlled by adding (or removing) a CSS class `.inline-labels` to (preferably) the fieldset element.

There is another option in regards to the form field layout and it concerns what is referred to as "multifields" (grouped controls). These are fields that contain multiple inputs per unit and are usually used for checkboxes and radio buttons. Each layout supports an alternate multifield layout. This is achieved by adding (or removing) a CSS class `.uni-form-multi` to the `ul` element within `.ctrl-holder`.

## Events

Triggering an error event on the form fields will apply the error class to the controller and overwrite the supplied description of that controller with the error text, an example would be:

    $(selector).trigger('error',['an error occured']);

Subsequent calls to success on the form field will remove the error and replace the error text with the originally supplied description, an example:

    $(selector).trigger('success');

## Form Validation

Uni–Form can be used with the included uni-form-validation.js file for client side validation. This is accomplished by using class names on the form elements to trigger validation rules on blur(). It must be noted that these validation rules should be used to supplement a server side solution.

Required element, cannot be empty:

    <input type="text" class="textInput required" />

Integer with value greater than or equal to 8:

    <input type="text" class="textInput validateInteger validateMin val-8" />

### Available validators:

* required
* validateMinLength
* validateMin
* validateMaxLength
* validateMax
* validateSameAs
* validateEmail
* validateUrl
* validateNumber
* validateInteger
* validateAlpha
* validateAlphaNum
* validatePhrase
* validatePhone
* validateDate
* validateCallback

Validators what require a parameter, such as validateMinLength, take that parameter as a class name following the validator in the format of _val-{value}_.

## We've got robust frameworks like Twitter Bootstrap, and Zurb's Foundation. Why do we need Uni-Form?

Because not all people want to get married to a full fledged framework for all their websites. Also many of those frameworks — and by the way I'm not denying their utility, they are great tools! — are not designed to be friendly to their environment, meaning it isn't really simple to tear out the form part of Bootstrap and implement it into your existing project.

This is why Uni–Form is kept small, and why it's so plainly styled by default. We don't want to impose an aesthetic and we play nice with your existing code!

- - -

Give respect and get it back.

[uni-form]: http://sprawsm.com/uni-form/
[issues]: https://github.com/draganbabic/uni-form/issues
[gh]: https://github.com/draganbabic/uni-form/
[t4]: http://there4development.com/

