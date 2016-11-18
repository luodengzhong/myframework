var gridManager = null, workContactDetailManager = null,refreshFlag = false, selfDeptId = null ;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initDataBox();
});

//初始化表格
function initializeGrid() {
	selfDeptId = $("#selfDeptId").val();
	var toolbarOptions = null;
	if(!selfDeptId){
	toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler
	});
	}if(selfDeptId){
		UICtrl.setReadOnly($('#deptName'));
		UICtrl.setReadOnly($('#personName'));	
	}
	gridManager = UICtrl.grid('#maingrid', {
		columns: [		   
		{ display: "发起部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "发起人名称", name: "personName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "预估工作量", name: "expectLoadTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "最后处理时间", name: "lastDealDate", width: 150, minWidth: 60, type: "string", align: "left" },	
		{ display: "单据号码", name: "billCode", width: 150, minWidth: 60, type: "string", align: "left" }, 
		{ display: "填表日期", name: "fillinDate", width: 150, minWidth: 60, type: "string", align: "left" } 
		],
		dataAction : 'server',
		url: web_app.name+'/workContactAction!slicedQueryWorkContact.ajax',
		parms: {selfDeptId: selfDeptId},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 'auto',
		sortName:'workContactId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
		},onAfterShowData: function () {
			onEditShowData(null);
		}		
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
function onEditShowData(hight) {
	if(hight){
		$(".l-grid-row-cell-inner").css("height", hight);
	}else{
	$(".l-grid-row-cell-inner").css("height", "auto");}
	var i = 0;
	$("tr", ".l-grid2", "#maingrid").each(function () {
		$($("tr", ".l-grid1", "#maingrid")[i]).css("height", $(this).height());
		i++;
	});/*}*/
}
//职能类别下拉
function initDataBox(){

	if(selfDeptId){
		$('#deptName').parents('dl').hide();
		$("#deptId").val(selfDeptId);
//		$('#deptName').parent().parent().parent().hide();
	}
	$("#deptName").orgTree({filter:'dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"}, 
		back:{
			text:'#deptName',
			value:'#deptId',
			id:'#deptId',
			name:'#deptName'
		}
	});

	$("#funTypeName").searchbox({type : "bpm", name : "bizSegmentationByDept", 
		getParam : function() {
		    return { orgId: $("#deptId").val(), searchQueryCondition: "kind_id in (1,2) " };//kind_id in (1,2,3) 
		},back:{ bizSegmentationId: "#funTypeId", name: "#funTypeName" }
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
	UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showInsertWorkContact.load', ok: insert, close: dialogClose});
}

//编辑按钮
function updateHandler(workContactId){
	if(!workContactId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		workContactId=row.workContactId;
	}
	if(!selfDeptId){
		var url=web_app.name + '/workContactAction!showUpdateWorkContact.job?workContactId='+workContactId+'&bizId='+workContactId;//?bizId='+bizId+'&isReadOnly=true';
		parent.addTabItem({ tabid: 'workContact'+workContactId, text: '工作联系单', url:url});
		//所需参数需要自己提取 {id:row.id}
		//UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showUpdateWorkContact.load', param:{workContactId:workContactId},init:initFunchoose ,ok: update, close: dialogClose});
	}else{
		var url=web_app.name + '/workContactAction!showUpdateWorkContact.job?workContactId='+workContactId+'&isReadOnly=true&selfDeptId='+selfDeptId+'&bizId='+workContactId;
		parent.addTabItem({ tabid: 'workContact'+workContactId, text: '工作联系单', url:url});
		//UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showUpdateWorkContact.load', param:{workContactId:workContactId},init:initFunchoose ,ok: dialogClose, close: dialogClose});
		}
	}


function initFunchoose(){
	if(selfDeptId){
		$('#deptName').parents('dl').hide();
		$('#organName').parents('dl').hide();		
		$("#deptId").val(selfDeptId);
//		$('#deptName').parent().parent().parent().hide();
	}
	initializeDetailGrid();
	$("#funTypeName").searchbox({type : "bpm", name : "bizSegmentationByDept", 
		getParam : function() {
		    return { orgId: $("#deptId").val(), searchQueryCondition: "kind_id in (1,2) " };//kind_id in (1,2,3) 
		},back:{ bizSegmentationId: "#funTypeId", name: "#funTypeName" }
	});
	$('#workContactIdAttachment').fileList({bizId:$("#workContactId").val()});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/workContactAction!deleteWorkContact.ajax?workContactId=' + row.workContactId, {}, function(){
			reloadGrid();
		});
	});
} 

//新增保存
function insert() {
	$('#submitForm').ajaxSubmit({url: web_app.name + '/workContactAction!insertWorkContact.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			//$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function saveTask(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/taskPlanAction!insertTaskPlan.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值 
			refreshFlag = true;
			UICtrl.setReadOnly($('#submitForm'));
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/workContactAction!updateWorkContact.ajax',
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

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "workContactAction!updateWorkContactSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'workContactId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//初始化表格
function initializeDetailGrid() {

	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		showDetailTaskDetailHandler:{id:'showDetailTaskDetail',text:'查看子流程任务', click:showDetailTaskDetailHandler, img:'page_edit.gif'}
	});
	workContactDetailManager = UICtrl.grid('#workContactDetailList', {
		columns: [
		   
		/*{ display: "联系单ID", name: "workContactId", width: 100, minWidth: 60, type: "string", align: "left" },	*/
		{ display: "联系部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		  
		{ display: "处理职能类型名称", name: "funTypeName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "预估工作量", name: "expectLoadTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		/*{ display: "创建时间", name: "createDate", width: 100, minWidth: 60, type: "string", align: "left" },	*/	   
		{ display: "预期完成时间", name: "expectDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "优先级", name: "urgentDegree", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "联系事项描述", name: "description", width: 100, minWidth: 450, type: "string", align: "left" }  /*,		   
		{ display: "任务号", name: "taskPlanId", width: 100, minWidth: 60, type: "string", align: "left" }*/
		],
		dataAction : 'server',
		url: web_app.name+'/workContactAction!slicedQueryWorkContactDetail.ajax',
		parms: {workContactId: $("#workContactId").val()},
		pageSize : 10,
		width : '98.8%',
		height : '300',
		heightDiff : -5,
		headerRowHeight : 25,
		toolbar: toolbarOptions,
		rowHeight : 'auto',
		sortName:'workContactId,sequence',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateDetailHandler(data.id);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

//编辑按钮
function updateDetailHandler(workContactDetailId){
	if(!workContactDetailId){
		var row = workContactDetailManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		workContactDetailId=row.workContactDetailId;
	}
	if(!selfDeptId){
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showUpdateWorkContactDetail.load', param:{workContactDetailId:workContactDetailId}, init:initDetailChoose,ok: update, close: dialogClose});
	}else{ 
	UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showUpdateWorkContactDetail.load', param:{workContactDetailId:workContactDetailId}, init:initDetailChoose,ok: dialogClose, close: dialogClose});
	}	
}
//查看子流程任务按钮 
function showDetailTaskDetailHandler(){ 
	var row = workContactDetailManager.getSelectedRow();
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
function initDetailChoose(){
	UICtrl.setReadOnly($('#submitForm')); 
	$('#workContactIdAttachment').fileList({bizId:$("#workContactId").val()});
}
