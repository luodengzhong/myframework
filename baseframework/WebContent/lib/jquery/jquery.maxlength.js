/*********************************************************
title:     textarea 控制maxlenth属性
Author:      xiexin
使用:   $('textarea').maxLength();
**********************************************************/
(function ($) {

$.fn.maxLength = function (settings) {

    if (typeof settings == 'string') {
        settings = { feedback : settings };
    }
    settings = $.extend({}, $.fn.maxLength.defaults, settings);
    return this.each(function () {
        var field = this,
        	$field = $(field),
        	limit = settings.maxlength ? settings.maxlength : $field.attr('maxlength'),
            limit=parseInt(limit,10),
        	$charsLeft =null;
		if(isNaN(limit))
			return;
		if(settings.feedback!=false){
			$charsLeft=$(settings.feedback);
		}
    	function limitCheck(event) {
        	var len = field.value.length,
            keycode = event.keyCode;
			if(keycode!=13&&keycode!=8&&keycode!=46&&keycode!=37&&keycode!=38&&keycode!=39&&keycode!=40){
				if(len>limit-1){
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
			}
        }
        var updateCount = function () {
            var len = field.value.length,
            diff = limit - len;
			if($charsLeft)
				$charsLeft.html( diff || "0" );
            if (diff < 0) {
            	field.value = field.value.substr(0, limit);
                updateCount();
            }
        };

        $field.keyup(updateCount).change(updateCount);
        $field.keydown(limitCheck);
        updateCount();
    });
};

$.fn.maxLength.defaults = {
    maxlength : false,
    feedback : false
};

})(jQuery);