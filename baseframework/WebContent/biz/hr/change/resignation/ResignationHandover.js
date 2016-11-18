
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
		   
		{ display: "员工ID", name: "archivesId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "交接日期", name: "handoverDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "制表人机构ID", name: "organId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "制表人机构名称", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "制表人部门ID", name: "deptId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "制表人部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "制表人岗位ID", name: "positionId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "制表人岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "制表人ID", name: "personMemberId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "制表人姓名", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "FULL_ID", name: "fullId", width: 100, minWidth: 60, type: "string", align: "left" },
		   {}
		],
		dataAction : 'server',
		url: web_app.name+'/resignationHandoverAction!slicedQueryResignationHandover.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'handoverDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
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


//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/resignationHandoverAction!deleteResignationHandover.ajax', {}, function(){
			reloadGrid();
		});
	});
}



//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

