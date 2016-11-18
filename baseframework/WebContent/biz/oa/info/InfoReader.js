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
			{ display: "人员名称", name: "personName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "人员类别", name: "kindIdTextView", width: 80, minWidth: 60, type: "string", align: "left",hide:true },		
			{ display: "人员路径", name: "fullName", width: 400, minWidth: 60, type: "string", align: "left" },	
			{ display: "最后阅读时间", name: "lastReadTime", width: 130, minWidth: 60, type: "datetime", align: "left" },		   
			{ display: "阅读次数", name: "readCount", width: 80, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/oaInfoAction!slicedQueryInforReader.ajax',
		parms:{infoPromulgateId:$('#infoPromulgateId').val(),readerKind:1},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fullSequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
	var readerKind=$("#readerKind1").getValue();
	gridManager.toggleCol('kindIdTextView', readerKind!=1);
}

//重置表单
function resetForm(obj) {
	$(obj).formClean();
	$("#readerKind1").setValue(1);
}
