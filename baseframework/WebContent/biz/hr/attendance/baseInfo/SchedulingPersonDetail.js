var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	var columns=[
	    { display: "姓名", name: "name", width: 120, minWidth: 80, type: "string", align: "center" },
	    { display: "日期", name: "workDate", width: 100, minWidth: 60, type: "string", align: "center" },
	    { display: "班次名称", name: "workShiftName", width: 140, minWidth: 80, type: "string", align: "center" },
	    { display: "排班机构全路径", name: "fullName", width: 260, minWidth: 80, type: "string", align: "center" }
	];
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns, 
		dataAction : 'server',
		url: web_app.name+'/attBaseInfoAction!slicedQuerySchedulingPersonDetail.ajax',
		parms:{ownerPersonId:$('#ownerPersonId').val(),startDate:$('#startDate').val(),endDate:$('#endDate').val()},
		pageSize : 10,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: false,
		sortName:'workDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}
