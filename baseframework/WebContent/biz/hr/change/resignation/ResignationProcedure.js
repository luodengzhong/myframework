var gridManager = null, refreshFlag = false;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	$('#reshuffleProcedureFileList').fileList();
	$('#resignationProcedureFileList').fileList();
	$('#deleteProcessInstance,#deleteProcessInstance_line').hide();
	$('#staffName').searchbox({ type:"hr", name: "resignationChoosePerson",
			back:{
				ognId:"#orgnizationId",ognName:"#orgnizationName",centreId:"#centerId",employedDate:"#employedDate",
				centreName:"#centerName",dptId:"#departmentId",dptName:"#departmentName",
				posId:"#posId",posName:"#posName",staffName:"#staffName",archivesId:"#archivesId"}
	 });
	 var $al=$('#handoverPsmName');
	 $al.orgTree({
	 filter: 'psm',
	 	back:{
			text:$al,
			value:'#handoverPsmId',
			id:'#handoverPsmId',
			name:$al
	 	}
	 });

});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			UICtrl.addGridRow(gridManager);
		}, 
		deleteHandler: deleteHandler	
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "工作内容", name: "workContent", width: 250, minWidth: 250, type: "string", align: "left",
			editor: { type:'text',maxLength:200, required: true}
		},		   
		{ display: "完成时间", name: "finishDate", width: 150, minWidth: 150, type: "date", align: "left",
			editor: { type:'date', required: true}
		},		   
		{ display: "完成状况", name: "finishStatus", width: 150, minWidth: 150, type: "string", align: "left" ,
			editor: { type:'text',maxLength:"50"}
		},		   
		{ display: "完成进度", name: "finishProgress", width: 150, minWidth: 150, type: "string", align: "left",
			editor: { type:'text',maxLength:"50"}
		},		   
		{ display: "质量要求", name: "qualityRequirement", width: 150,minWidth: 150, type: "string", align: "left",
			editor: { type:'text', maxLength:"50"}
		},
		
		{ display: "交接人", name: "handoverPersonMemberName", width: 150, minWidth: 150, type: "string", align: "left",
			editor: { type: 'select',   required: true, data: { type:"sys", name: "orgSelect",
				getParam: function(){
				 return { a: 1, b: 1, searchQueryCondition: " org_kind_id ='psm' and instr(full_id, '.prj') = 0 " };
				}, back:{fullId: "handoverFullId", fullName:"handoverFullName",
					     personMemberId: "handoverPersonMemberId", personMemberName: "handoverPersonMemberName" }
		}}}		   
		],
		dataAction : 'server',
		url: web_app.name+'/resignationProcedureAction!slicedQueryResignationProcedureDetail.ajax',
		parms:{resignationProcedureId:$('#resignationProcedureId').val()},
		pageSize : 20,
		width : '99%',
		height : 300,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{detailId:'',handoverfullid:'',handoverPersonMemberId:'',handoverPersonMemberName:'',archivesId:''},
		onLoadData :function(){
			return !($('#resignationProcedureId').val()=='');
		}
	});
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/resignationHandoverAction!showInsertResignationHandoveDetail.load', ok: save, close: dialogClose});
}

function deleteHandler(){
	DataUtil.delSelectedRows({action:'resignationHandoverAction!deleteResignationHandoveDetail.ajax',
		gridManager: gridManager,idFieldName:'detailId',
		onSuccess:function(){
			gridManager.loadData();
		}
	});	
}



//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}


//查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}



//function save(){
//	saveHandler();
//}

function getId() {
	return $("#resignationProcedureId").val() || 0;
}

function setId(value){
	$("#resignationProcedureId").val(value);
	gridManager.options.parms['resignationProcedureId'] =value;
	 //$('#reshuffleProcedureFileList').fileList({bizId:value});
	    $('#reshuffleProcedureFileList').fileList({bizId:value});
	     $('#resignationProcedureFileList').fileList({bizId:value});


}
function afterSave(){
	reloadGrid();
}
//添加按钮 

function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}


function getOrganId(){
	return $("#organId").val();
}

function print(){
	var  staffName=$('#staffName').val();
	window.open(web_app.name + '/resignationProcedureAction!createPdf.load?auditId='+getId()+'&staffName='+encodeURI(encodeURI(staffName)));	
}

