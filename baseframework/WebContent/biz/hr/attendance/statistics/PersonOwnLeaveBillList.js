
var gridManager = null, refreshFlag = false,attendanceStatusData;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	leaveKindData=$('#leaveKindId').combox('getJSONData');
	attendanceStatusData=$('#attendanceStatusId').combox('getJSONData');
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){
			updateHandler();
		},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
					{ display: "单据号码", name: "billCode", width: 140, minWidth: 140, type: "string", align: "center" },
					{ display: "请假类别", name: "leaveKindId", width: 120, minWidth: 120, type: "string", align: "center",
						render: function (item) { 
							return leaveKindData[item.leaveKindId];
						} 
					},	
		  		    { display: "开始时间", name: "startDate", width: 140, minWidth: 140, type: "datetime", align: "center" },		   
				    { display: "结束时间", name: "endDate", width: 140, minWidth: 140, type: "datetime", align: "center" },	
		  		    { display: "核销开始时间", name: "verificationStartDate", width: 140, minWidth: 140, type: "datetime", align: "center" },		   
				    { display: "核销结束时间", name: "verificationEndDate", width: 140, minWidth: 140, type: "datetime", align: "center" },
				    { display: "状态", name: "status", width: 80, minWidth: 60, type: "string", align: "center",
						render: function (item) { 
							return attendanceStatusData[item.status];
						}	
				    }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryPersonalLeave.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'verificationStartDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: false,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.leaveId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}
//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.leaveId;
	}else{
		auditId=id;
	}

	parent.addTabItem({
		tabid: 'HRLeaveBillList'+auditId,
		text: '员工请假单据查询',
		url: web_app.name + '/attLeaveAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true'
	}
	);
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

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}


