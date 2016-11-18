$(document).ready(function() {
	UICtrl.autoGroupAreaToggle();
	initializeUI();
});

function isApplyProcUnit(){
	return !Public.isReadOnly;
}

function initializeUI(){
	var toolBar=$('#toolBar');
	if(toolBar.length>0){
		toolBar.toolBar('removeItem');
		toolBar.toolBar('addItem',[
			 {id:'save',name:'保存',icon:'save',event:function(){saveDataCollection();}},
		     {line:true},
		     {id:'edit',name:'保存并新增',icon:'edit',event:function(){
		     	saveDataCollection(function(){
		     		var dataCollectionKindId=$('#dataCollectionKindId').val();
					var url=web_app.name + '/dataCollectionAction!showInsertDataCollection.job?useRightHandlerPage=0&dataCollectionKindId='+dataCollectionKindId;
		     		window.location.href=url;
		     	});
		     }},
		     {line:true},
		     {id:'stop',name:'关闭',icon:'stop',event: closeWindow},
	   	     {line:true}
		 ]);
	}
	$('#dataCollectionAttachment').fileList();
}

function saveDataCollection(fn){
	$('#dataCollectionSubmitForm').ajaxSubmit({
		url: web_app.name + '/dataCollectionAction!saveDataCollection.ajax',
		success: function (id) {
			$('#dataCollectionId').val(id);
			$('#dataCollectionAttachment').fileList({bizId:id});
			if($.isFunction(fn)){
				fn.call(window,id);
			}
		}     
    });
}

function closeWindow(){
	UICtrl.closeCurrentTab();
}