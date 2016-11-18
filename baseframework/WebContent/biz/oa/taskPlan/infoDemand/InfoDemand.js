
var gridManager = null, refreshFlag = false ;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight(); 
	initListChoose();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var selfDeptId = $("#selfDeptId").val();
	var toolbarOptions = null;
	if(!selfDeptId){
	toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){
			viewHandler();
		},
		updateHandler: updateHandler, 
		deleteHandler: deleteHandler,
		createtaskHandler:{id:'createtask',text:'任务分配', click:createtaskHandler, img:'page_edit.gif'} ,
		showTaskDetailHandler:{id:'showTaskDetail',text:'查看任务', click:showTaskDetailHandler, img:'page_edit.gif'}
	}); 
	}
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: [		          
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "发起公司", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "发起部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "发起人", name: "personName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "需求标题", name: "title", width: 100, minWidth: 60, type: "string", align: "left" },	   
		{ display: "预期完成时间", name: "expectDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "预估工作量", name: "expectLoadTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "是否计划内", name: "isPlanTextView", width: 100, minWidth: 60, type: "string", align: "left"},	
		{ display: "优先级", name: "urgentDegreeTextView", width: 100, minWidth: 60, type: "string", align: "left"},		
		{ display: "最后处理时间", name: "lastDealDate", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "statusTextView", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "任务号", name: "taskPlanId", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/infoDemandAction!slicedQueryInfoDemand.ajax',
		parms: {selfDeptId: selfDeptId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'infoDemandId',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: false,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.infoDemandId);
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
	UICtrl.showAjaxDialog({url: web_app.name + '/infoDemandAction!showInsertInfoDemand.load',init:initFunchoose, ok: insert, close: dialogClose});
}
function updateHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var infoDemandId=row.infoDemandId;
	UICtrl.showAjaxDialog({url: web_app.name + '/infoDemandAction!showUpdateInfoDemand.load',title:'信息化需求单', param:{infoDemandId:infoDemandId},init:initFunchoose,  ok: update, close: dialogClose});
}
function viewHandler(infoDemandId){
	if(!infoDemandId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		infoDemandId=row.infoDemandId;
	}
	/*var selfDeptId = $("#selfDeptId").val();
	if(!selfDeptId){
	//所需参数需要自己提取 {id:row.id}alert(1)
	UICtrl.showAjaxDialog({url: web_app.name + '/infoDemandAction!showUpdateInfoDemand.load', param:{infoDemandId:infoDemandId},init:initFunchoose,  ok: update, close: dialogClose});
	}else{
	UICtrl.showAjaxDialog({url: web_app.name + '/infoDemandAction!showUpdateInfoDemand.load', param:{infoDemandId:infoDemandId},init:initFunchoose, ok: dialogClose, close: dialogClose});
	}*/
	var url=web_app.name + '/infoDemandAction!showInfoDemand.job?bizId='+infoDemandId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'infoDemand'+infoDemandId, text: '查看信息化需求', url:url});
}

function initListChoose(){
	var selfDeptId = $("#selfDeptId").val();
	if(selfDeptId){
		$('#deptName').parents('dl').hide();
	}
	
	$("#deptName").orgTree({filter:'dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"}, 
		back:{
			text:'#deptName',
			value:'#deptId',
			id:'#deptId',
			name:'#deptName'
		}
	});
	
	$("#personName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},back:{personMemberName:"#personName"}
	});

}

function initFunchoose(){
	/*var div=$('#InfoDemandDetailDiv');
	var height=$(document).height()*0.8-50;
	div.css({height:height,overflowX :'hidden',overflowY:'auto'});*/
	var selfDeptId = $("#selfDeptId").val();
	if(selfDeptId){
		$('#deptName').parents('dl').hide();		
		UICtrl.setReadOnly($('#submitForm'));
	}

	$("#functionName").treebox({
		name: 'funSelect',
		treeLeafOnly: true,
		getParam : function(data) {
			return {};
		},
		
		back:{text:'#functionName',value:'#functionId'},		
		onChange: function(node){
				
		}
	});
/*	$("#functionName").searchbox({type : "pt", name : "sysfunc", 
		getParam : function() {
			return {};
		},back:{id:"#functionId",description:"#functionName"}
	});*/

	$('#infoDemandIdAttachment').fileList({bizId:$("#infoDemandId").val()});

}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
//	alert(row);
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/infoDemandAction!deleteInfoDemand.ajax?infoDemandId=' + row.infoDemandId, {}, function(){
			reloadGrid();
		});
	});
}

//新增保存
function insert() {
	$('#submitForm').ajaxSubmit({url: web_app.name + '/infoDemandAction!insertInfoDemand.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/infoDemandAction!updateInfoDemand.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

//编辑保存
function saveTask(){
	var _self = this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/infoDemandAction!updateTakplan.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			refreshFlag = true;
			_self.close();
		}
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
} 

//自定义字段数据
function createtaskHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	infoDemandId=row.infoDemandId;
	//状态非3，代表流程没有处理完成
	if (3!=row.status) {Public.tip('请先审批流程！'); return; }
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/infoDemandAction!showCreateTaskInfo.load', param:{infoDemandId:infoDemandId},width:600,init:initSerchBox,  ok: saveTask, close: dialogClose});
}

function showTaskDetailHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var  taskId=row.taskPlanId;
	//根据选择数据的状态，判断当前是否审批完成，如果非审批完成，则不允许分配任务
	//状态非3，代表流程没有处理完成
	if (!taskId) {Public.tip('请先分配任务！'); return; }
	
	 var url=web_app.name + '/planTaskManagerAction!showTaskDetail.do?taskId='+taskId;
	 parent.addTabItem({ tabid: 'viewTask'+taskId, text: '任务详情', url:url});
//	 UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showCreateTaskInfo.load', param:{workContactDetailId:workContactDetailId}, init:initSerchBox, ok: saveTask, close: dialogClose});
}
