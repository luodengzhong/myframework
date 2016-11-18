var gridManager = null, workContactDetailManager = null,refreshFlag = false, selfDeptId = null ;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight(); 
	initFunchoose();
});
 


function initFunchoose(){
	selfDeptId = $("#selfDeptId").val();
	if(selfDeptId){
		$('#deptName').parents('dl').hide();
		$('#organName').parents('dl').hide();		
		$("#deptId").val(selfDeptId);
		//		$('#deptName').parent().parent().parent().hide();
	}
	//	if(!Public.isReadOnly){
	 setTimeout(function(){$('#workContactIdAttachment').fileList('enable');},0);
	 //	}
	initializeDetailGrid();
	$("#funTypeName").searchbox({type : "bpm", name : "bizSegmentationByDept", 
		getParam : function() {
		    return { orgId: $("#deptId").val(), searchQueryCondition: "kind_id in (1,2) " };//kind_id in (1,2,3) 
		},back:{ bizSegmentationId: "#funTypeId", name: "#funTypeName" }
	});
	$('#workContactIdAttachment').fileList({bizId:$("#workContactId").val()});
}

//编辑按钮
function updateHandler(workContactId){
	if(!workContactId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		workContactId=row.workContactId;
	}
	if(!selfDeptId){ 
		var url=web_app.name + '/workContactAction!showUpdateWorkContact.job?workContactId='+workContactId;
		parent.addTabItem({ tabid: 'workContactDetail'+bizId, text: '审批事项', url:url});
		//所需参数需要自己提取 {id:row.id}
		//UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showUpdateWorkContact.load', param:{workContactId:workContactId},init:initFunchoose ,ok: update, close: dialogClose});
	}else{ 
		var url=web_app.name + '/workContactAction!showUpdateWorkContact.job?workContactId='+workContactId+'&isReadOnly=true';
		parent.addTabItem({ tabid: 'workContact'+workContactId, text: '工作联系单', url:url});
		//UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showUpdateWorkContact.load', param:{workContactId:workContactId},init:initFunchoose ,ok: dialogClose, close: dialogClose});
		}
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
		/*showDetailTaskDetailHandler:{id:'showDetailTaskDetail',text:'查看子流程任务', click:showDetailTaskDetailHandler, img:'page_edit.gif'},*/
		showTaskDetailHandler:{id:'showTaskDetail',text:'查看任务', click:showTaskDetailHandler, img:'page_edit.gif'}
	});
	workContactDetailManager = UICtrl.grid('#workContactDetailList', {
		columns: [
		   
		/*{ display: "联系单ID", name: "workContactId", width: 100, minWidth: 60, type: "string", align: "left" },	*/
		{ display: "联系部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		  
		{ display: "全路径", name: "fullName", width: 100, minWidth: 60, type: "string", align: "left" },		  
		{ display: "处理职能类型名称", name: "funTypeName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		/*{ display: "预估工作量", name: "expectLoadTextView", width: 100, minWidth: 60, type: "string", align: "left" },		*/   
		/*{ display: "创建时间", name: "createDate", width: 100, minWidth: 60, type: "string", align: "left" },	*/	   
		/*{ display: "预期完成时间", name: "expectDate", width: 100, minWidth: 60, type: "string", align: "left" },	*/	   
		{ display: "执行人", name: "personName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		/*{ display: "优先级", name: "urgentDegree", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "任务号", name: "taskPlanId", width: 100, minWidth: 60, type: "string", align: "left" },	*/
		{ display: "联系事项描述", name: "description", width: 100, minWidth: 450, type: "string", align: "left" }
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
		detail: {height:'auto', onShowDetail: function(row, detailPanel,callback){
			var url=web_app.name+'/common/TaskExecutionList.jsp';
			Public.load(url,{procUnitId:'Approve',bizId:row.detailBizId},function(data){
				var div=$('<div></div>').css({'paddingLeft':'20px','paddingTop':'5px',overflow:'hidden'});
				div.html(data);
				$(detailPanel).append(div);
			});
        }},
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
	 parent.addTabItem({ tabid: 'workContactDetail'+bizId, text: '工联单事项', url:url});
//	 UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showCreateTaskInfo.load', param:{workContactDetailId:workContactDetailId}, init:initSerchBox, ok: saveTask, close: dialogClose});
}
function initDetailChoose(){
	UICtrl.setReadOnly($('#submitForm')); 
	$('#workContactIdAttachment').fileList({bizId:$("#workContactId").val()});
}
function showTaskDetailHandler(){
	var row = workContactDetailManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var  taskId=row.taskPlanId;
	//根据选择数据的状态，判断当前是否审批完成，如果非审批完成，则不允许分配任务
	//状态非3，代表流程没有处理完成
	if (!taskId) {Public.tip('请先分配任务！'); return; }
	
	 var url=web_app.name + '/planTaskManagerAction!showTaskDetail.do?taskId='+taskId;
	 parent.addTabItem({ tabid: 'viewTask'+taskId, text: '任务详情', url:url});
//	 UICtrl.showAjaxDialog({url: web_app.name + '/workContactAction!showCreateTaskInfo.load', param:{workContactDetailId:workContactDetailId}, init:initSerchBox, ok: saveTask, close: dialogClose});
}
