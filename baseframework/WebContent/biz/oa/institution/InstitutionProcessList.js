
var gridManager = null, refreshFlag = false,institutionReviseStatusData=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	institutionReviseStatusData=$('#institutionReviseStatusId').combox('getJSONData');
	initializeGrid();
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
					{ display: "机构", name: "organName", width: 140, minWidth: 100, type: "string", align: "center" },
					{ display: "部门", name: "deptName", width: 140, minWidth: 100, type: "string", align: "center" },
					{ display: "申请人", name: "personMemberName", width: 140, minWidth: 100, type: "string", align: "center" },
					{ display: "状态", name: "status", width: 80, minWidth: 60, type: "string", align: "center",
						render: function (item) { 
							return institutionReviseStatusData[item.status];
						}				    	
				    }
		],
		dataAction : 'server',
		url: web_app.name+'/oaInstitutionAction!slicedQueryInstitutionProcess.ajax',
		pageSize : 20,
		manageType:'institutionProcessManage',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		delayLoad:false,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: false,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.institutionProcessId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}
//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.institutionProcessId;
	}else{
		auditId=id;
	}

	parent.addTabItem({
		tabid: 'OAInstitutionProcessList'+auditId,
		text: '制度修订单据查询',
		url: web_app.name + '/oaInstitutionAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true&useDefaultHandler=0'
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

