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
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
					{ display: "员工姓名", name: "staffName", width: 140, minWidth: 140, type: "string", align: "center",
					totalSummary:{
				    render: function (suminf, column, data){
					   return '学分合计';
				    },
				    align: 'center'
			         }},
					{ display: "培训名称", name: "trainingTypeName", width: 220, minWidth: 120, type: "string", align: "center"},	
		  		    { display: "培训角色", name: "trainingRole", width: 120, minWidth: 120, type: "string", align: "center"},	
		  		    { display: "开始时间", name: "startTime", width: 140, minWidth: 140, type: "datetime", align: "center" },		   
				    { display: "结束时间", name: "endTime", width: 140, minWidth: 140, type: "datetime", align: "center" },	
		  		    { display: "所获学分", name: "gainCredit", width: 140, minWidth: 140, type: "number", align: "center",totalSummary:UICtrl.getTotalSummary() }		   
		],
		dataAction : 'server',
		url: web_app.name+'/trainingSpecialClassAction!slicedQueryPersonalCredit.ajax',
		parms:{totalFields:'gainCredit',personId:$("#personId").val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'startTime',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: false,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			//updateHandler(data.id);
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


