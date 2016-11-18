$(document).ready(function() {
	UICtrl.setReadOnly($('body'));
	changeInputView();
	setTimeout(function(){
		$('#screenOverLoading').hide();
	},0);
});
function changeInputView(){
	$('body').find('input[type="text"]').each(function(){
		if($(this).is(':hidden')) return;
		var value=$(this).val();
		$('<span></span>').text(value).insertAfter($(this));
		$(this).hide();
	});
	$('body').find('textarea').each(function(){
		if($(this).is(':hidden')) return;
		var value=$(this).val();
		value=value.replace(/\n/g, "<br />");
		$('<span></span>').html(value).insertAfter($(this));
		$(this).hide();
	});
	$('body').find('select').each(function(){
		if($(this).is(':hidden')) return;
		var value=$(this).find("option:selected").text();
		$('<span></span>').text(value).insertAfter($(this));
		UICtrl.disable($(this));
		$(this).hide();
	});
	//替换单选
	$('body').find('input:radio').each(function(){
		$('<span class="radio'+($(this).is(':checked')?'checked':'')+'"></span>').insertAfter($(this));
		$(this).hide();
	});
	//替换复选
	$('body').find('input:checkbox').each(function(){
		$('<span class="checkbox'+($(this).is(':checked')?'checked':'')+'"></span>').insertAfter($(this));
		$(this).hide();
	});
}
