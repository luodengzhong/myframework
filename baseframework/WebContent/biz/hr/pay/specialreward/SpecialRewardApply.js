var gridManager = null, refreshFlag = false;
var specialRewardStatus={};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	specialRewardStatus=$('#specialRewardStatus').combox('getJSONData');
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveApecialRewardByStages:{id:'saveApecialRewardByStages',text:'处理',img:'page_favourites.gif',click:function(){
			showSpecialRewardByStagesPage();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "奖罚原因", name: "title", width:300, minWidth: 60, type: "string", align: "left" },
			{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },			   
			{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" }, 
			{ display: "奖罚类别", name: "rewardApplyKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "总金额", name: "allAmount", width: 100, minWidth: 60, type: "money", align: "left" },
			{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return specialRewardStatus[item.status];
				} 
			}
		],
		dataAction : 'server',
		url: web_app.name+'/hRSpecialRewardAction!slicedQuerySpecialRewardApply.ajax',
		parms:{firstAuditId:1,disposeStatus:1},//只查询第一次申请的单据
		manageType:'hrSpecialRewardManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			showSpecialRewardByStagesPage(data.auditId);
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

function showSpecialRewardByStagesPage(auditId){
	if(!auditId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.auditId;
	}
	parent.addTabItem({ 
		tabid: 'HRSpecialRewardByStages'+auditId,
		text: '专项奖罚分期确认',
		url: web_app.name + '/hRSpecialRewardAction!showSpecialRewardByStages.do?bizId=' + auditId
	});
}