
var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var createPersonId = $("#curUserId").val();
	toolbarOptions = UICtrl.getDefaultToolbarOptions({
		canlendarDetailHandler: {id: 'canlendarDetail',text:'日历视图明细',img: 'page_edit.gif',click:function(){viewCalendarPlanHandler();}
		},
		listDetailHandler: {id: 'listDetail',text:'列表视图明细',img: 'page_edit.gif',click:viewListPlanHandler
		}
        });

	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   
		{ display: "计划标题", name: "title", width: 150, minWidth: 60, type: "string", align: "left"
		},		 
		{ display: "计划描述", name: "planDesc", width: 150, minWidth: 100, type: "string", align: "left"
		},	
		{ display: "责任人", name: "ownerName", width: 150, minWidth: 60, type: "string", align: "left" 
		},		   
		{ display: "责任人部门", name: "dutyDeptName", width: 150, minWidth: 60, type: "string", align: "left" 
		},
		{ display: "被管理组织", name: "beManageredName", width: 150, minWidth: 60, type: "string", align: "left"
		},
		{ display: "创建时间", name: "fillinDate", width: 150, minWidth: 60, type: "date", align: "left"
		},
		{ display: "状态", name: "statusName", width: 100, minWidth: 60, type: "string", align: "left"
		}
		],		   
		
		dataAction : 'server',
		url: web_app.name+'/specialPlanAction!slicedQuerySpecialPlan.ajax',
		parms : {
			createPersonId : createPersonId
			},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit: true,
        rownumbers: true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewCalendarPlanHandler(data.specialPlanId);
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

//查看视图明细
function viewCalendarPlanHandler(id) {
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.specialPlanId;
	}
	var url=web_app.name + '/specialPlanAction!showUpdate.do?specialPlanId='+id;
	parent.addTabItem({ tabid: 'SpecialPlanAdd'+id, text: '专项计划查看 ', url:url});
}

//查看列表明
function viewListPlanHandler() {
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var id=row.specialPlanId;
	
	UICtrl.showAjaxDialog({url: web_app.name + '/specialPlanAction!showListDetail.load', param:{specialPlanId:id},
		init:initDetailList,ok: dialogClose, close: dialogClose});
}

function initDetailList(){
	var specialPlanId = gridManager.getSelectedRow().specialPlanId;
	var detailGridManager = UICtrl.grid('#maingrid_detail', {
		columns: [
		{ display: "功能名称", name: "functionName", width: 100, minWidth: 60, type: "string", align: "left"},		 
		{ display: "基础管理权限", name: "authorityName", width: 150, minWidth: 60, type: "string", align: "left"},		   
		{ display: "组织", name: "orgName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "组织类型", name: "orgType", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "开始时间", name: "startTime", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "结束时间", name: "endTime", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "被管理组织", name: "beManageredName", width: 100, minWidth: 60, type: "date", align: "left" },	
		{ display: "授权", name: "authNames", width: 250, minWidth: 60, type: "date", align: "left" },	
		],		   
		dataAction : 'server',
		url: web_app.name+'/specialPlanAction!loadListDetail.ajax',
		parms : {
			specialPlanId : specialPlanId
			},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit: true,
        rownumbers: true
	});
	UICtrl.setSearchAreaToggle(detailGridManager);
}


//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
