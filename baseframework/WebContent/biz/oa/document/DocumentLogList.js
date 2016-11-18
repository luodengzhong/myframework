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
			{ display: "操作人", name: "createByName", width: '100', minWidth: 60, type: "string", align: "left"},
			{ display: "创建时间", name: "createDate", width: '130', minWidth: 40, type: "dateTime", align: "left"},
			{ display: "操作类型", name: "operationTypeTextView", width: '100', minWidth: 60, type: "string", align: "left"},
			{ display: "位置", name: "fullPathName", width: '400', minWidth: 60, type: "string", align: "left"},
			{ display: "内容", name: "operationRemark", width: '400', minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/oaDocumentAction!slicedQueryDocumentLog.ajax',
		parms :{documentLibraryId:$('#documentLibraryId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'createDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}
