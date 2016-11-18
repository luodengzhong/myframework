$(document).ready(function() {
	var interviewApplyId=$('#interviewApplyId').val();
	var writeId=$('#writeId').val();
	var staffName=$('#staffName').val();
	$('#interviewApplyFileList').fileList();
	if(interviewApplyId){
	   $('#interviewApplyFileList').fileList({bizId:interviewApplyId});
	}
	/*$.getFormButton([{name:'面试记录',event:function(){
		interviewRecord(writeId,staffName);
	}},{name:'保 存  ',event:function(){
		save(interviewApplyId);
		}},{id:"submit",name:'提 交',event:function(){
			submit(interviewApplyId);
		}}]);*/
	
});


function showViewPersonRegister(){
	var writeId=$('#writeId').val();
	 var name=$('#staffName').val();
	if(writeId.length>0){
		parent.addTabItem({
			tabid: 'showViewPersonRegister'+writeId,
			text: '【'+name+'】个人简历',
			url: web_app.name + '/personregisterAction!showViewPersonRegister.do?writeId=' 
				+ writeId+'&isReadOnly=true'
		});
	}else{
		Public.tip('请选择员工'); 
	}
}


//面试记录
function interviewRecord(){
   var writeId=$('#writeId').val();
   var name=$('#staffName').val();
	parent.addTabItem({
		tabid: 'HRInterViewApply'+writeId,
		text: '面试测评记录',
		url: web_app.name + '/interviewApplyAction!forwardListDetail.do?writeId='+writeId+'&status=4'
	});
}


function save(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/interviewApplyAction!update.ajax',
		success : function() {
			//如果不关闭对话框这里需要对主键赋值
			refreshFlag = true;
		}
	});
		

}


//提交
function advance() {
	$('#submitForm').ajaxSubmit({url: web_app.name + '/interviewApplyAction!submit.ajax',
		success : function(data) {
			UICtrl.closeAndReloadTabs("TaskCenter", null);
		
		}
	});

}



function getId() {
	return $("#interviewApplyId").val() || 0;
}

function setId(value){
	$("#interviewApplyId").val(value);
	 $('#interviewApplyFileList').fileList({bizId:value});


}
function afterSave(){
	reloadGrid();
}

function reloadGrid() {
} 


