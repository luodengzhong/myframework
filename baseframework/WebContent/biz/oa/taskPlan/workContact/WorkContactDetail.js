
var gridManager = null, refreshFlag = false,showAjaxDialog = null, selfDeptId = null,selfPersonId = null;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initDataBox();
});

//初始化表格
function initializeGrid() {

	selfDeptId = $("#selfDeptId").val();
	selfPersonId = $("#selfPersonId").val();
	var toolbarOptions =null;
	if(!selfDeptId){
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		showTaskDetailHandler:{id:'showTaskDetail',text:'查看任务', click:showTaskDetailHandler, img:'page_edit.gif'},
		showDetailTaskDetailHandler:{id:'showDetailTaskDetail',text:'查看子流程任务', click:showDetailTaskDetailHandler, img:'page_edit.gif'}
	});
	}else{
		var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
			createtaskHandler:{id:'createtask',text:'任务分配', click:createtaskHandler, img:'page_edit.gif'},
			showTaskDetailHandler:{id:'showTaskDetail',text:'查看任务', click:showTaskDetailHandler, img:'page_edit.gif'},
			showDetailTaskDetailHandler:{id:'showDetailTaskDetail',text:'查看子流程任务', click:showDetailTaskDetailHandler, img:'page_edit.gif'}
		});
	}
	gridManager = UICtrl.grid('#maingrid', {
		columns: [		   
		{ display: "联系单ID", name: "workContactId", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "联系事项描述", name: "description", width: 100, minWidth: 60, type: "string", align: "left" },	   
		{ display: "联系部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		 
		{ display: "全路径", name: "fullName", width: 100, minWidth: 60, type: "string", align: "left" },		 
		{ display: "处理职能类型名称", name: "funTypeName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "预估工作量", name: "expectLoadTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "创建时间", name: "createDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "预期完成时间", name: "expectDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "执行人", name: "personName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "优先级", name: "urgentDegreeTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "任务号", name: "taskPlanId", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/workContactAction!slicedQueryWorkContactDetail.ajax',
		parms: {selfDeptId: selfDeptId,selfPersonId: selfPersonId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'workContactId,sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

//编辑保存
function saveTask(){
	var _self = this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/workContactAction!updateTakplan.ajax',
		success : function(data) {
			refreshFlag = true;
			_self.close();
		}
	});
}

//自定义字段数据
function createtaskHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var workContactDetailId=row.workContactDetailId;
	//根据选择数据的状态，判断当前是否审批完成，如果非审批完成，则不允许分配任务
	//状态非3，代表流程没有处理完成
	if (3!=row.status) {Public.tip('请先审批流程！'); return; }
	//所需参数需要自己提取 {id:row.id}
	showAjaxDialog = UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showCreateTaskInfo.load', param:{workContactDetailId:workContactDetailId}, init:initSerchBox, ok: saveTask, close: dialogClose});
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

//职能类别下拉
function initDataBox(){
	if(selfDeptId){
		$('#deptName').parents('dl').hide();
		$("#deptId").val(selfDeptId);
//		$('#deptName').parent().parent().parent().hide();
	}
	var fullName = $('#fullName').val();
	if(  $('#fullName').val()||typeof(fullName) == "undefined"){
		$('#fullName').val($('#deptName').val())
	}
	$("#funTypeName").searchbox({type : "bpm", name : "bizSegmentationByDept", 
		getParam : function() {
		    return { orgId: $("#deptId").val(), searchQueryCondition: "kind_id in (2) " };//kind_id in (1,2,3) 
		},back:{ name: "#funTypeName" }
		});
	
	$("#deptName").orgTree({filter:'dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"}, 
		back:{
			text:'#deptName',
			value:'#deptId',
			id:'#deptId',
			name:'#deptName'
		}, 
        beforeChange: function(nodeData, editParm){
			var fullName = nodeData.fullName;
        	$('#fullName').val(data.fullName);			
		}
	}); 

	$('#workContactIdAttachment').fileList({bizId:$("#workContactId").val()});
	
}

function initDialogDataBox(){
	initDataBox();
	$("#personName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
            return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};//kind_id in (1,2,3) 
            },back:{ id: "#personId", personMemberName: "#personName" }
		}); 
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
	UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showInsertWorkContactDetail.load', ok: insert, close: dialogClose});
}

//编辑按钮
function updateHandler(workContactDetailId){
	if(!workContactDetailId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		workContactDetailId=row.workContactDetailId;
	}
	var selfDeptId = $("#selfDeptId").val();
	if(!selfDeptId){
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showUpdateWorkContactDetail.load', param:{workContactDetailId:workContactDetailId}, init :initDialogDataBox,ok: update, close: dialogClose});
	}else{
		UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showUpdateWorkContactDetail.load', param:{workContactDetailId:workContactDetailId}, init :initDialogDataBox,ok: dialogClose, close: dialogClose});
			}
	}

//查看子流程任务按钮 
function showDetailTaskDetailHandler(){ 
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var  bizId=row.workContactDetailId;
	//根据选择数据的状态，判断当前是否审批完成，如果非审批完成，则不允许分配任务
	//状态非3，代表流程没有处理完成
	//	if (!taskId) {Public.tip('请先分配任务！'); return; }
	if (0==row.status) {Public.tip('请先完成发起方的审批流程！'); return; }
	
	 var url=web_app.name + '/workContactAction!showWorkContactDetail.job?bizId='+bizId+'&isReadOnly=true';
	 parent.addTabItem({ tabid: 'workContactDetail'+bizId, text: '审批事项', url:url});
//	 UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showCreateTaskInfo.load', param:{workContactDetailId:workContactDetailId}, init:initSerchBox, ok: saveTask, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/workContactAction!deleteWorkContactDetail.ajax?workContactDetailId=' + row.workContactDetailId, {}, function(){
			reloadGrid();
		});
	});
}

//新增保存
function insert() {
	$('#submitForm').ajaxSubmit({url: web_app.name + '/workContactAction!insertWorkContactDetail.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/workContactAction!updateWorkContactDetail.ajax',
		success : function() {
			refreshFlag = true;
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


