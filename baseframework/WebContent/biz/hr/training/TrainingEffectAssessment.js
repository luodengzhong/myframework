var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		deleteHandler: deleteHandler
		//enableHandler: enableHandler,
		//disableHandler: disableHandler,
		//saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{display: "学员姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left"},
			{display: "讲师姓名", name: "teacherName", width: 100, minWidth: 60, type: "string", align: "left"},
			{display: "培训内容", name: "content", width: 100, minWidth: 60, type: "string", align: "left"},
			{display: "培训日期", name: "trainingDate", width: 100, minWidth: 60, type: "string", align: "left"},
			{display: "总体评分", name: "score", width: 100, minWidth: 60, type: "string", align: "left"},
			{display: "建议", name: "suggestion", width: 100, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/trainingEffectAssessmentAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'trainingEffectAssessmentId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
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
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingEffectAssessmentAction!showInsert.load',width:800,ok: insert, close: dialogClose});
}
//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingEffectAssessmentAction!showUpdate.load', param:{}, ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/trainingEffectAssessmentAction!delete.ajax', {trainingEffectAssessmentId:row.trainingEffectAssessmentId}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'trainingEffectAssessmentAction!delete.ajax',
		gridManager:gridManager,idFieldName:'id',
		onCheck:function(data){
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});*/
}

//新增保存
function insert() {
	/*
	var id=$('#detailId').val();
	if(id!='') return update();
	*/
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingEffectAssessmentAction!insert.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			//$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingEffectAssessmentAction!update.ajax',
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
/*
//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "trainingEffectAssessmentAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'trainingEffectAssessmentAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'trainingEffectAssessmentAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
