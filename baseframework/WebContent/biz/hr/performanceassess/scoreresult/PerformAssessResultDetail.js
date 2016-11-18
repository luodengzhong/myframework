
$(document).ready(function() {
$.getFormButton([{name:'分数归档',event:function(){
	archiveHandler();
	}},{name:'抄送',event:copyAndSend},
	{name:'打印',event:printf}]);
});

function  reloadGrid(){
	
}

function printf(){
		var  formId=$('#formId').val();
	var  staffName=$('#assessName').val();
	var  status=$('#scoreStatus').val();
	if(status!=4){
		Public.tip("测评结果未归档,不能打印");
		return ;
	}
	window.open(web_app.name + '/performAssessResultAction!createPdf.load?formId='+formId+'&staffName='+encodeURI(encodeURI(staffName)));	
}

function copyAndSend(){
	var formId=$('#formId').val();
	var assessName=$('#assessName').val();
	var  status=$('#scoreStatus').val();
	if(status!=4){
		Public.tip("测评结果未归档,不能抄送");
		return ;
	}
	 var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
	 UICtrl.showFrameDialog({
			title : "选择人员",
			url : web_app.name + "/orgAction!showSelectOrgDialog.do",
			param : selectOrgParams,
			width : 700,
			height : 400,
			ok : function() {
				copyAndSendTask(this,formId,assessName);
			},
			close : this.close()
		});
}

function copyAndSendTask(_self,formId,staffName){
		var data = _self.iframe.contentWindow.selectedData;

	Public.ajax(web_app.name + "/performAssessResultAction!copyAndSendTask.ajax",
			{formId:formId,staffName:staffName,data:$.toJSON(data)}, function() {
				_self.close();
			});
	
	
}
function archiveHandler(){
	var status=$('#scoreStatus').val();
	var formId=$('#formId').val();
	if(status==4){
		Public.tip("测评结果已归档,无需重复归档");
		return ;
	}
	if(status==1){
		Public.tip("评分未完成,不能归档");
		return ;
	}

	UICtrl.confirm('确定归档分数吗?',function(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performAssessResultAction!archive.ajax',
		param:{formId:formId},
		success : function() {
			reloadGrid();
		}
	});
	});

}