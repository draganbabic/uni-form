/**
 * Uni-Form jQuery Plugin without Validation
 *
 * Provides form actions for use with the Uni-Form markup style
 *
 * Author: Ilija Studen for the purposes of Uni-Form
 * 
 * Modified by Aris Karageorgos to use the parents function
 * 
 * Modified by Toni Karlheinz to support input fields' text
 * coloring and removal of their initial values on focus
 * 
 * Modified by Jason Brumwell for optimization, addition
 * of valid and invalid states and default data attribues
 * 
 *
 * @see http://sprawsm.com/uni-form/
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 */
jQuery.fn.uniform = function(settings) {
    settings = jQuery.extend({
        valid_class    : 'valid',
        invalid_class  : 'invalid',
        error_class    : 'error',
        focused_class  : 'focused',
        holder_class   : 'ctrlHolder',
        field_selector : 'input, textarea, select',
        default_value_color: "#AFAFAF"
    }, settings);
  
    return this.each(function() {
        var form = jQuery(this),
            validate = function($input,valid,text) {
                var $p = $input.closest('div.'+settings.holder_class)
                               .andSelf()
                               .toggleClass(settings.invalid_class,!valid)
                               .toggleClass(settings.error_class,!valid)
                               .toggleClass(settings.valid_class,valid)
                               .find('p.formHint');

                if (! valid && ! $p.data('info-text')) {
                    $p.data('info-text',$p.html());
                } else if (valid) {
                    text = $p.data('info-text');
                }

                if (text) {
                    $p.html(text);
                }
            };

        form.submit(function(){
            form.find(settings.field_selector).each(function(){
                if($(this).val() == $(this).data('default-value')) $(this).val("");
            });
        })

        // Select form fields and attach them higlighter functionality
        form.find(settings.field_selector).each(function(){
            var $input = $(this),
                value = $input.val();

            $input.data('default-color',$input.css('color'));
            $input.data('true-type', $input[0].type);

            if (value == $input.data('default-value') || ! value) {
                $input.not('select').css("color",settings.default_value_color);
                $input.val($input.data('default-value'));

		if($input[0].type == 'password') {
		    $input[0].type = 'text';
		}
            }
        })

        form.delegate(settings.field_selector,'focus',function() {
            form.find('.' + settings.focused_class).removeClass(settings.focused_class);

            var $input = $(this);

            $input.parents().filter('.'+settings.holder_class+':first').addClass(settings.focused_class);
            
            if($input.val() == $input.data('default-value')){
                $input.val("");
                
                if($input.data('true-type') == 'password') {
                    $input[0].type = $input.data('true-type');
                }
            }

            $input.not('select').css('color',$input.data('default-color'));
        });

        form.delegate(settings.field_selector,'blur',function() {
            var $input = $(this);
            form.find('.' + settings.focused_class).removeClass(settings.focused_class);
            if($input.val() == "" || $input.val() == $input.data('default-value')){
                $input.not('select').css("color",settings.default_value_color);
                $input.val($input.data('default-value'));
                
                if($input.data('true-type') == 'password') {
		    $input[0].type = 'text';
		}
            } else {
                $input.css('color',$input.data('default-color'));
            }
        });

        form.delegate(settings.field_selector,'error',function(e,text) {
            validate($(this),false,text);
        });

        form.delegate(settings.field_selector,'success',function(e,text) {
            validate($(this),true);
        });
    });
};
