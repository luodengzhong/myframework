$(document).ready(function() {
	$('#instReviseBody').filePreview({appendTo:
		$('#editDetail'),isReadOnly:true,canEdit:false});//预览模式
	$('#instReviseBody').hide();
});
			
/*点击文件打开*/
function openAttachment(id){
	var url="/attachmentPreview.do?isReadOnly=true&id="+id;
	window.open(web_app.name + url);
}