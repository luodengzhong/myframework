var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "名称", name: "name", width: 140, minWidth: 60, type: "string", align: "left" },		   	
		{ display: "描述", name: "description", width: 200, minWidth: 60, type: "string", align: "left" },		
		{ display: "考试时长", name: "timeout", width: 80, minWidth: 60, type: "string", align: "left" },		 
		{ display: "合格分数", name: "passingScore", width: 80, minWidth: 60, type: "string", align: "left" },		 
		{ display: "重考次数", name: "retakeNum", width: 80, minWidth: 60, type: "string", align: "left" },		 
		{ display: "序号", name: "sequence", width: 80, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.sequenceRender(item,'examinationTypeId');
			}
		},		   
		{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/examSetUpAction!slicedQueryExaminationType.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.examinationTypeId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
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
	UICtrl.showAjaxDialog({url: web_app.name + '/examSetUpAction!showInsertExaminationType.load',title:'考试类别维护',width:300, ok: saveExaminationType});
}

//编辑按钮
function updateHandler(examinationTypeId){
	if(!examinationTypeId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		examinationTypeId=row.examinationTypeId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/examSetUpAction!showUpdateExaminationType.load',title:'考试类别维护', width:300,param:{examinationTypeId:examinationTypeId}, ok: saveExaminationType});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/examSetUpAction!deleteExaminationType.ajax', {examinationTypeId:row.examinationTypeId}, function(){
			reloadGrid();
		});
	});
}

//新增保存
function saveExaminationType() {
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/examSetUpAction!saveExaminationType.ajax',
		success : function(data) {
			_self.close();
			reloadGrid();
		}
	});
}


//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "examSetUpAction!updateExaminationTypeSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'examinationTypeId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'examSetUpAction!updateExaminationTypeStatus.ajax',
		gridManager: gridManager,idFieldName:'examinationTypeId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'examSetUpAction!updateExaminationTypeStatus.ajax',
		gridManager: gridManager,idFieldName:'examinationTypeId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

