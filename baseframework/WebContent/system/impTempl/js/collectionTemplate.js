var imp_log_query_manage_type = 'collectionTemplate';// 日志查询管理权限类型

$(document).ready(function() {
	pmCollectionTemplateSelect();
	pmUnPaidCollectionBillSelect(function(el,values){
		$("#templateName").val('');
		$("#templateId").val('');
	});
	$("#templetNameSubject").hide();
	
	$('#importdata').find('span').uploadButton({
	   param:function(){
      		var templateId= $('#templateId').val();
      		if(templateId==''){
      			Public.tip('请选择托收模板!');
      			return false;
      		}
      		return {
				templateId:templateId,
				collectionBillId:$("#collectionBillId").val(),
				templId:$("#templId").val()
			};
      	},
    	url:web_app.name+'/collectionOperationAction!impCollectionTemaplate.ajax',
    	afterUpload:function(){
    		query($('#queryMainForm'));
    	}
      })
});

// 导出模板
function exportExcel() {
	exportHandler();
}

function exportHandler(obj) {
	var templateName = $("#templateName").val();
	var params = $("#queryMainForm").formToJSON();
	if (!params) {
		return;
	}
	// 下载模板
	var url = web_app.name + '/collectionOperationAction!exportCollectionTemaplate.ajax';
	var fileName = templateName;
	UICtrl.downFileByAjax(url, params, fileName);
}

function pmCollectionTemplateSelect(callBackFunc){
	$("#templateName").searchbox({
		type : 'pm',
		name : 'pmCollectionTemplateSelect',
		getParam: function(){
			var param = {};
			param['collectionBillId'] = $('#collectionBillId').val()||-1;
			return param;
		},
		back : {
			value : '#templateId',
			text : '#templateName'
		},	
		onChange : callBackFunc
	});
}

function pmUnPaidCollectionBillSelect(callBackFunc){
	$("#collectionBillName").searchbox({
		type : 'pm',
		name : 'pmUnPaidCollectionBillSelect',
		getParam: function(){
			var param = {};			
			param['projectId'] = $('#projectId').val();
			return param;
		},
		back : {
			value : '#collectionBillId',
			text : '#collectionBillName'
		},	
		onChange:callBackFunc
	});
}
