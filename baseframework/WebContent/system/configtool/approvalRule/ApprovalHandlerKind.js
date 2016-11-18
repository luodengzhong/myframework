var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ addHandler: addHandler, 
		updateHandler: updateHandler, deleteHandler: deleteHandler,
		saveSortIDHandler : updateSequence });
	gridManager = UICtrl.grid('#maingrid', {
		columns: [		   
		{ display: "编码", name: "code", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "名称", name: "name", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "数据来源", name: "dataSourceName", width: 80, minWidth: 60, type: "string", align: "left" }	,	
		{ display: "数据来源配置", name: "dataSourceConfig", width: 560, minWidth: 60, type: "string", align: "left" }	,	
		{ display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left" ,		   
			render: UICtrl.sequenceRender
		}  
		],
		dataAction : 'server',
		url: web_app.name+'/approvalRuleAction!slicedQueryApprovalHandlerKind.ajax',
		pageSize : 20,
		width : '99.8%',
		height : '100%',
		sortName: 'sequence',
		sortOrder: 'asc',
		heightDiff : -7,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox: true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			showUpdateHandler(data.id);
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

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({
		title : "添加审批处理人类别",
		width : 300,
		url : web_app.name + '/approvalRuleAction!showInsertApprovalHandlerKind.load',
		ok : insert,
		close : dialogClose
	});
}

function updateHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	showUpdateHandler(row.id);
}

function showUpdateHandler(id){
	UICtrl.showAjaxDialog({
		title : "修改审批处理人类别",
		url: web_app.name + '/approvalRuleAction!showUpdateApprovalHandlerKind.load', 
		width : 300, param:{ id: id }, ok: update, close: dialogClose});
}

function deleteHandler(){
	var action = '/approvalRuleAction!deleteApprovalHandlerKind.ajax';
	DataUtil.del({ action: action, gridManager: gridManager, onSuccess: reloadGrid });
}

//新增保存
function insert() {
	_self = this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/approvalRuleAction!insertApprovalHandlerKind.ajax',
		success : function() {
			refreshFlag = true;
			_self.close();
		}
	});
}

//编辑保存
function update(){
	_self = this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/approvalRuleAction!updateApprovalHandlerKind.ajax',
		success : function() {
			refreshFlag = true;
			_self.close();
		}
	});
}

function updateSequence(){
	var action = "approvalRuleAction!updateApprovalHandlerKindSequence.ajax";
	DataUtil.updateSequence({ action: action, gridManager: gridManager,  onSuccess: reloadGrid });
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
