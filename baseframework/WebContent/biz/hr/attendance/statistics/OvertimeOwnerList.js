var attendanceStatus=null;
var gridManager = null, refreshFlag = false,overtimeListData=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	overtimeListData=$('#overtimeKindId').combox('getJSONData');
	delete overtimeListData['Normal'];
	overtimeListData['']='';
	$('#overtimeKindId').combox('setData',overtimeListData);
	$('#overtimeKindId').combox('setValue','');
	attendanceStatus=$('#attendanceStatus').combox('getJSONData');
}

//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			  		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "center" },		   
					{ display: "单据号码", name: "billCode", width: 140, minWidth: 140, type: "string", align: "center" },
					{ display: "加班人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "center" },
					{ display: "加班类别", name: "overtimeKindId", width: 100, minWidth: 60, type: "string", align: "center",
						render: function (item) { 
							return overtimeListData[item.overtimeKindId];
						}
					},
				    { display: "开始时间", name: "startDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "结束时间", name: "endDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "核销开始时间", name: "verificationStartDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "核销结束时间", name: "verificationEndDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "状态", name: "status", width: 80, minWidth: 60, type: "string", align: "center",
				   	   render: function (item) { 
							return attendanceStatus[item.status];
						}
				    }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryOwnerOvertimeList.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'asc',
		enabledEdit: true,
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

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}