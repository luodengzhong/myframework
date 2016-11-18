$(document).ready(function() {
	var imgDiv=$('div.show_question_img');
	if(imgDiv.length>0){
		imgDiv.find('img').each(function(i,o){
			UICtrl.autoResizeImage($(this),256);
			$(this).show();
		});
		setTimeout(function(){imgDiv.show();},100);
	}
});
function showQuestionImg(id){
	var url=web_app.name+'/attachmentAction!downFile.ajax?id='+id;
	$.thickbox({imgURL:url});
}