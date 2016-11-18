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
		{ display: "名称", name: "name", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "类别", name: "kindName", width: 60, minWidth: 60, type: "string", align: "left" },		   
		{ display: "数据来源", name: "dataSourceName", width: 80, minWidth: 60, type: "string", align: "left" }	,	
		{ display: "数据来源配置", name: "dataSourceConfig", width: 460, minWidth: 60, type: "string", align: "left" }	,	
		{ display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left" ,		   
			render: function(item){
				return "<input type='text' id='txtSequence_" + item.id + "' class='textbox' value='" + item.sequence + "' />";
			}
		}  
		],
		dataAction : 'server',
		url: web_app.name+'/approvalRuleAction!slicedQueryApprovalElement.ajax',
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
		title : "添加审批要素",
		width : 300,
		url : web_app.name + '/approvalRuleAction!showInsertApprovalElement.load',
		ok : insert,
		close : dialogClose
	});
}

function showUpdateHandler(id){
	UICtrl.showAjaxDialog({
		title : "修改审批要素",
		url: web_app.name + '/approvalRuleAction!showUpdateApprovalElement.load', 
		width : 300, param:{ id: id }, ok: update, close: dialogClose});
}

function updateHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	showUpdateHandler(row.id);
}

function deleteHandler(){
	var action = '/approvalRuleAction!deleteApprovalElement.ajax';
	DataUtil.del({ action: action, gridManager: gridManager, onSuccess: reloadGrid });
}

//新增保存
function insert() {
	_self = this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/approvalRuleAction!insertApprovalElement.ajax',
		success : function() {
			refreshFlag = true;
			_self.close();
		}
	});
}

//编辑保存
function update(){
	_self = this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/approvalRuleAction!updateApprovalElement.ajax',
		success : function() {
			refreshFlag = true;
			_self.close();
		}
	});
}

function updateSequence(){
	var action = "approvalRuleAction!updateApprovalElementSequence.ajax";
	DataUtil.updateSequence({ action: action, gridManager: gridManager,  onSuccess: reloadGrid });
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
