var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "组织路径", name: "fullName", width: 400, minWidth: 60, type: "string", align: "left" },		
		{ display: "组织名称", name: "orgUtilName", width: 130, minWidth: 60, type: "string", align: "left" },		   
		{ display: "类型", name: "evaluateOrgKindTextView", width:100, minWidth: 60, type: "string", align: "left" },	
		{ display: "参与评价", name: "isEvaluateTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "备注", name: "remark", width: 200, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/evaluateSetUpAction!slicedQueryEvaluateOrg.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fullSequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.evaluateOrgId);
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
		url: web_app.name + '/evaluateSetUpAction!showInsertEvaluateOrg.load',
		title:'评价组织维护',width:300,
		init:initDetail,
		ok: saveEvaluateOrg
	});
}

//编辑按钮
function updateHandler(evaluateOrgId){
	if(!evaluateOrgId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		evaluateOrgId=row.evaluateOrgId;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/evaluateSetUpAction!showUpdateEvaluateOrg.load',
		title:'评价组织维护', width:300,
		param:{evaluateOrgId:evaluateOrgId}, 
		init:initDetail,
		ok: saveEvaluateOrg
	});
}
function initDetail(doc){
	$('#detailOrgUtilName').orgTree({
		filter:'ogn,dpt',
		param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		beforeChange:function(node){
			var kind=node.orgKindId;
			$('#detailEvaluateOrgKind').combox('setValue',kind=='dpt'?'HQ':'cityCorp');
			$('#detailIsEvaluate').combox('setValue',1);
		},
		back:{
			text:'#detailOrgUtilName',
			value:'#detailOrgUtilId',
			id:'#detailOrgUtilId',
			name:'#detailOrgUtilName'
		}
	});
	var detailEvaluateOrgId=$('#detailEvaluateOrgId').val();
	if(detailEvaluateOrgId!=''){
		UICtrl.disable($('#detailOrgUtilName'));
	}
}
//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/evaluateSetUpAction!deleteEvaluateOrg.ajax', {evaluateOrgId:row.evaluateOrgId}, function(){
			reloadGrid();
		});
	});
}

//新增保存
function saveEvaluateOrg() {
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/evaluateSetUpAction!saveEvaluateOrg.ajax',
		success : function(data) {
			_self.close();
			reloadGrid();
		}
	});
}