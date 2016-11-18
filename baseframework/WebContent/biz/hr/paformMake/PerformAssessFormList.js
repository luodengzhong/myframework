var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler:function(){
			viewHandler();
		}
		
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		 { display: "考核表名称", name: "formName", width: 200, minWidth: 60, type: "string", align: "left" },	
		{ display: "被考核对象", name: "assessName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "所在部门", name: "assessDeptName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "所在岗位", name: "assessPostionName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "考核模板", name: "templetName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },	
		{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/paformMakeAction!slicedQueryPerformAssessForm.ajax',
		manageType: 'hrPerFormAssessManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.formId);
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


//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/paformMakeAction!showUpdatePerformAssessForm.load', param:{}, ok: update, close: dialogClose});
}

//编辑按钮
function viewHandler(formId){
	if(!formId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		formId=row.formId;
	}
	parent.addTabItem({
		tabid: 'HRPaformMake'+formId,
		text: '员工绩效表查看',
		url: web_app.name + '/paformMakeAction!showUpdate.job?bizId=' 
			+ formId+'&isReadOnly=true'
	});

}


//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

