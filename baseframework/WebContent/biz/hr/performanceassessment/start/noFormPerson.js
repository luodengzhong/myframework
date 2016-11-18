var gridManager = null;
$(document).ready(function() {
	initializeGrid();
});
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [  
			{ display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "岗位", name: "posName", width: 180, minWidth: 60, type: "string", align: "left" },
			{ display: "路径", name: "fullName", width: 260, minWidth: 60, type: "string", align: "left" },
			{ display: "人员类别", name: "staffKindTextView", width: 100, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/performassessAction!slicedQueryNoFormPerson.ajax',
		parms:{noFormPeriodCode:$('#mainPeriodCode').val(),noFormfullId:$('#mainFullId').val()},
		pageSize : 20,
		width :860,
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		sortName:'sequence',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true
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
	onFolderTreeNodeClick();
}