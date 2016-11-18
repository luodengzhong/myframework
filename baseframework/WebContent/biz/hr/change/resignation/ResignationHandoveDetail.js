var gridManager = null, refreshFlag = false;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
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
			editor: { type:'text', required: true}
		},		   
		{ display: "完成时间", name: "finishDate", width: 150, minWidth: 150, type: "date", align: "left",
			editor: { type:'date', required: true}
		},		   
		{ display: "完成状况", name: "finishStatus", width: 150, minWidth: 150, type: "string", align: "left" ,
			editor: { type:'text'}
		},		   
		{ display: "完成进度", name: "finishProgress", width: 150, minWidth: 150, type: "string", align: "left",
			editor: { type:'text'}
		},		   
		{ display: "质量要求", name: "qualityRequirement", width: 150, minWidth: 150, type: "string", align: "left",
			editor: { type:'text'}
		},
		
		{ display: "交接人", name: "handoverPersonMemberName", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type: 'select',   required: true, data: { type:"sys", name: "orgSelect", 
				getParam: function(){
				 return { a: 1, b: 1, searchQueryCondition: " org_kind_id ='psm' and instr(full_id, '.prj') = 0" };
				}, back:{fullId: "handoverFullId", fullName:"handoverFullName",
					     personMemberId: "handoverPersonMemberId", personMemberName: "handoverPersonMemberName" }
		}}}		   
		],
		dataAction : 'server',
		url: web_app.name+'/resignationHandoverAction!slicedQueryResignationHandoveDetail.ajax',
		parms:{resignationHandoverId:$('#resignationHandoverId').val()},
		pageSize : 20,
		width : '99%',
		height : 300,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'finishDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{handoverFullId:'',handoverPersonMemberId:'',handoverPersonMemberName:'',archivesId:'',resignationHandoverId:''},
		onLoadData :function(){
			return !($('#resignationHandoverId').val()=='');
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

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/resignationHandoverAction!showUpdateResignationHandoveDetail.load', param:{}, ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({action:'resignationHandoverAction!deleteResignationHandoveDetail.ajax',
		gridManager: gridManager,idFieldName:'detailId',
		onSuccess:function(){
			gridManager.loadData();
		}
	});	
}

//新增保存
function insert() {
	$('#submitForm').ajaxSubmit({url: web_app.name + '/resignationHandoverAction!insertResignationHandoveDetail.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			//$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/resignationHandoverAction!updateResignationHandoveDetail.ajax',
		success : function() {
			refreshFlag = true;
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



function save(){
	saveHandler();
}

function getId() {
	return $("#resignationHandoverId").val() || 0;
}

function setId(value){
	$("#resignationHandoverId").val(value);
	gridManager.options.parms['resignationHandoverId'] =value;
}
function afterSave(){
	reloadGrid();
}
//添加按钮 
function saveHandler() {
	var detailData =getExtendedData();
	if(detailData===false){
		return;
	}
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/resignationHandoverAction!saveOrUpdateResignationHandoverDetails.ajax',
		param : $.extend({}, detailData),
		success : function(data) {
			if (!getId())
				setId(data);
			afterSave();
		}
	});
	
}
function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}

