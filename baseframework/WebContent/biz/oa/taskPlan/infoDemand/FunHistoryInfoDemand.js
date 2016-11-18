var treeManager, gridManager, refreshFlag = false, selectFunctionDialog, lastSelectedId = 0;

$(function() {  
	loadFunctionTree();
	initializeUI();
	initializeGrid();

	function initializeUI() {
		UICtrl.initDefaulLayout();
	}
 
	function initializeGrid() {
		UICtrl.autoSetWrapperDivHeight();
		gridManager = UICtrl.grid('#maingrid', {
			columns: [	 
			{ display: "公司名称", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "发起部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "发起人名称", name: "personName", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "需求标题", name: "title", width: 100, minWidth: 60, type: "string", align: "left" },	   
			{ display: "预期完成时间", name: "expectDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "预估工作量", name: "expectLoadTextView", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "是否计划内", name: "isPlanTextView", width: 100, minWidth: 60, type: "string", align: "left"},	
			{ display: "优先级", name: "urgentDegreeTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "任务号", name: "taskPlanId", width: 100, minWidth: 60, type: "string", align: "left" }
			],
			dataAction : 'server',
			url: web_app.name+'/infoDemandAction!slicedQueryInfoDemand.ajax',
			parms : {
				functionId : 0
			},
			pageSize : 20,
			width : '100%',
			height : '100%',
			heightDiff : -5,
			headerRowHeight : 25,
			rowHeight : 25,
			sortName:'infoDemandId',
			sortOrder:'desc',
			fixedCellHeight : true,
			selectRowButtonOnly : true,
			checkbox: false,
			onDblClickRow : function(data, rowindex, rowobj) {
				updateHandler(data.infoDemandId); 
			} 
		});

		UICtrl.setSearchAreaToggle(gridManager);
	}

	function loadFunctionTree() {
		$('#maintree').commonTree({
			loadTreesAction : "/permissionAction!queryFunctions.ajax",
			isLeaf : function(data) {
				if (!data.parentId){
					data.nodeIcon = web_app.name + "/themes/default/images/icons/function.gif";
				}else {
					data.nodeIcon=DataUtil.changeFunctionIcon(data.icon);
				}
				return data.hasChildren == 0;
			},
			onClick : function(data) {
				if (data && lastSelectedId != data.id) {
					reloadGrid3(data.id, data.name);
				}
			},
			IsShowMenu : false
		});
	}
});


function reloadGrid() {
   $("#maintree").commonTree('refresh', lastSelectedId);
	var params = $("#queryMainForm").formToJSON();
	UICtrl.gridSearch(gridManager, params);
}

function reloadGrid2() {
	var params = $("#queryMainForm").formToJSON();
	UICtrl.gridSearch(gridManager, params);
}

function reloadGrid3(id, name) {
	$('.l-layout-center .l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + name+ "]</font>功能需求");
	lastSelectedId = id;
	var params = $("#queryMainForm").formToJSON();
	params.functionId = id;
	UICtrl.gridSearch(gridManager, params);
}

function initFunchoose(){  
	UICtrl.setReadOnly($('#submitForm')); 
	$("#functionName").searchbox({type : "pt", name : "sysfunc", 
		getParam : function() {
			return {};
		},back:{id:"#functionId",description:"#functionName"}
	});

}
//双击按钮
function updateHandler(infoDemandId){
	if(!infoDemandId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		infoDemandId=row.infoDemandId;
	}  
	UICtrl.showAjaxDialog({url: web_app.name + '/infoDemandAction!showUpdateInfoDemand.load', param:{infoDemandId:infoDemandId},init:initFunchoose, ok: dialogClose, close: dialogClose});
}

//查询
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
     