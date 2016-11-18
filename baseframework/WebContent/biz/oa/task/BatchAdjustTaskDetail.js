var adjustTaskKindList=null,relationGridManager=null;
$(document).ready(function() {
	initializeUI();
	queryTaskPerson(getGridQueryId());//调用taskPersonChooseUtil.js中方法
	initUIByIsAborted();
	initializeAddGrid();
	initializeAddUI();
	initFileUpInput();
	initRelationPlan();
	initUIdateIsChange();
});
function getId() {
	return $("#adjustAskId").val() || 0;
}
function setId(value){
	$("#adjustAskId").val(value);
	$('#taskDetailFileList').fileList({readOnly:false});
}

function initializeUI(){
	var unusualPlanTask = $("#unusualPlanTask").val();
	if(1 == unusualPlanTask){
		$("#taskBar").show()
    $("#updateInstitutionTree").click(function () {
    	saveTaskReport();
    });
	}
	$('#taskDetailFileList').fileList({readOnly:getId()?false:true});
	/************类别选择******************/	
	//注册责任人及责任部门选择
	initOwnerAndDeptChoose();//调用taskPersonChooseUtil.js中方法
	if(!UICtrl.isApplyProcUnit()){
		hideChooseLink();
	}else{
		$('#isAborted0').parent().on('click',function(e){
			var $clicked = $(e.target || e.srcElement);
	    	if($clicked.is('input')){
	    		setTimeout(initUIByIsAborted,0);
	    	} 
		});
	}
}
function initUIByIsAborted(){
	var isAborted=$('#isAborted0').getValue();
	var div=$('#adjustTaskShowDiv')[isAborted==1?'hide':'show']();
	if(isAborted==1){
		div.find('input,select').attr('notCheck','true');
	}else{
		div.find('input,select').removeAttr('notCheck');
	}	
}

function initUIdateIsChange(){
	var isPlanningSpecialist=$('#isPlanningSpecialist').getValue();
	var iscreate=$('#iscreate').getValue();
	 
	if (isPlanningSpecialist==1) {
		//允许编辑
		setTimeout(function(){UICtrl.enable($('#dutyDeptName'));},0)		
		setTimeout(function(){UICtrl.enable($('#ownerName'));},0)		
		setTimeout(function(){UICtrl.enable($('#startDate'));},0)	
		setTimeout(function(){UICtrl.enable($('#finishDate'));},0)		
		setTimeout(function(){UICtrl.enable($('#relationGrid'));},0)	
		setTimeout(function(){UICtrl.enable($('#addmaingrid'));},0)	
//		div.find('a,GridStyle').attr('notCheck','true');
	}
	if (iscreate==1) {	
		setTimeout(function(){UICtrl.enable($('#relationGrid'));},0)	
		setTimeout(function(){UICtrl.disable($('#addmaingrid'));},0)	
	}
	if (iscreate==1 &&isPlanningSpecialist==1) {	
		setTimeout(function(){UICtrl.enable($('#relationGrid'));},0)	
		setTimeout(function(){UICtrl.enable($('#addmaingrid'));},0)	
	}

//	if (isApproveProcUnit()) {
//		permissionAuthority['maingrid.showDetailTaskDetailHandler']={authority:'readwrite',type:'2'};
//		permissionAuthority['maingrid.personName']={authority:'readwrite',type:'1'};
//	}
//	if(!Public.isReadOnly){
//	 	setTimeout(function(){$('#workContactIdAttachment').fileList('enable');},0);
//	}
}
function getGridQueryId(){
	var adjustAskId=$('#adjustAskId').val();
	if(adjustAskId!=''){
		return adjustAskId;
	}
	return $('#planTaskId').val();
}

function getExtendedData(){
	var startDate=getStartDate();
	var finishDate=getFinishDate();
	if(!startDate||!finishDate) return false;
	if(!Public.compareDate(finishDate,startDate)){
		Public.errorTip("计划完成时间不能小于计划开始时间!");
		return false;
	}
	var param={finishDate:finishDate+' 23:59:59'};
	param['taskExecutors']=getExecutorArray();//调用taskPersonChooseUtil.js中方法
	param['taskManager']=getManagerArray(1);//调用taskPersonChooseUtil.js中方法
	param['taskRelation']=saveUpdateRelation();
	return param;
}

function saveTaskReport(){
	  //新增状态默认取父节点值
	var _selfDialog=this;
	var param = $("#submitForm").formToJSON();
	if(!param) return false;
	UICtrl.confirm('您确定提交当前数据吗?', function() {
		var url=web_app.name + "/planAuditProjectAction!submitUnusualTaskReport.ajax";
		Public.ajax(url,param,function(id){
			fn();
		});
	});

}

function businessJudgmentUnit(){
	return true;
}


//function enableAdjustTaskBill(){
//	if (isApproveProcUnit()) {
//		setTimeout(function(){UICtrl.enable($('#adjustTaskKind'));},0)
//		setTimeout(function(){UICtrl.enable($('#dutyDeptName'));},0)
//		setTimeout(function(){UICtrl.enable($('#ownerName'));},0)
//	}
//	/*else{
//		setTimeout(function(){UICtrl.disable($('#adjustTaskKind'));},0)
//	}*/
//}

//function isApproveProcUnit(){
//	return procUnitId == "Approve";
//}

function initRelationPlan(){

	adjustTaskKindList = $("#adjustTaskKind").combox("getJSONData");
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: selectTaskToGrid,
		deleteHandler: deleteRelationTask
	});
	
	var gridUrl = web_app.name+'/planTaskManagerAction!searchRelationTask.ajax';
	
	relationGridManager = UICtrl.grid('#relationGrid', {
		columns: [
		{ display: "计划名称", name: "taskName", width: 240, minWidth: 60, type: "string", align: "left", editor: {type: 'text'} },	
		{ display: "级别", name: "taskLevel", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { 
				type: 'combobox', 
				data: {'hza':'核重A','hz':'核重','5a':'5A',
				       '4a':'4A','3a':'3A','c':'C'
				}, 
				valueField: 'taskLevel' 
			},
			render:function(item){
				var _nm = "";
				var _val = item.taskLevel;
				if(_val=='hza')
					_nm = '核重A';
				else if(_val=='hz')
					_nm = '核重';
				else if(_val=='5a')
					_nm = '5A';
				else if(_val=='4a')
					_nm = '4A';
				else if(_val=='3a')
					_nm = '3A';
				else if(_val=='c')
					_nm = 'C';
				
				return _nm;
			}
		},		   
		{ display: "原开始时间", name: "oldStartDate", width: 100, minWidth: 60, type: "string", align: "left", format: 'yyyy-MM-dd'},
		{ display: "原结束时间", name: "oldFinishDate", width: 100, minWidth: 60, type: "string", align: "left", format: 'yyyy-MM-dd'},
		{ display: "新开始时间", name: "startDate", width: 100, minWidth: 60, type: "string", align: "left", format: 'yyyy-MM-dd', editor: { type: 'date'}},
		{ display: "新结束时间", name: "finishDate", width: 100, minWidth: 60, type: "string", align: "left", format: 'yyyy-MM-dd', editor: { type: 'date'}},
		{ display: "原责任人", name: "oldOwnerName", width: 100, minWidth: 60, type: "string", align: "left"},
		{ display: "新责任人", name: "ownerName", width: 150, minWidth: 60, type: "string", align: "left", 
			editor: {
				type: "dynamic", getEditor: function (row) {
					var dataSourceConfig = "{ type: 'tree',data:{name: 'org',filter:'psm'},textField:'ownerName',valueField:'ownerId'}";
					return (new Function("return " + dataSourceConfig))();
				}
        	}
		},
		{ display: "责任部门", name: "dutyDeptName", width: 150, minWidth: 60, type: "string", align: "left", 
			editor: {
				type: "dynamic", getEditor: function (row) {
					var dataSourceConfig = "{ type: 'tree',data:{name: 'org',filter:'dpt'},textField:'dutyDeptName',valueField:'dutyDeptId'}";
					return (new Function("return " + dataSourceConfig))();
				}
        	}
		},
		{ display: "调整类型", name: "adjustTaskKind", width: 100, minWidth: 60, type: "string", align: "left", 
	    	editor: { type: 'combobox',data: adjustTaskKindList,required:true},
			render: function (item) { 
				return adjustTaskKindList[item.adjustTaskKind];
			}  
		},
		/*{ display: "计划周期", name: "planningCycle", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { 
				type: 'combobox', 
				data: {'week':'周计划','month':'月计划','quarter':'季度计划','year':'年度计划'}, 
				valueField: 'planningCycle' 
			},
			render:function(item){
				var _nm = "";
				var _val = item.planningCycle;
				if(_val=='week')
					_nm = '周计划';
				else if(_val=='month')
					_nm = '月计划';
				else if(_val=='quarter')
					_nm = '季度计划';
				else if(_val=='year')
					_nm = '年度计划';
				
				return _nm;
			}
		},*/
		/*
		{ display: "下游评价人", name: "managers", width: 150, minWidth: 60, type: "string", align: "left", 
			editor: {
				type: "dynamic", getEditor: function (row) {
					var dataSourceConfig = "{ type: 'tree',data:{name: 'org',filter:'psm'},textField:'managers',valueField:'managerids'}";
					return (new Function("return " + dataSourceConfig))();
				}
        	}
		},
		{ display: "执行人", name: "excuters", width: 150, minWidth: 60, type: "string", align: "left", 
			editor: {
				type: "dynamic", getEditor: function (row) {
					var dataSourceConfig = "{ type: 'tree',data:{name: 'org',filter:'psm'},textField:'excuters',valueField:'excuterids'}";
					return (new Function("return " + dataSourceConfig))();
				}
        	}
		},
		*/
		{ display: "计划说明", name: "remark", width: 240, minWidth: 60, type: "string", align: "left", editor: {type: 'text'}}
		],
		dataAction : 'server',
		url: gridUrl,
        parms: {adjustAskId:getId()},
		usePager : false,
		width : '100%',
		height : 160,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'id',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		enabledEdit: true,
		selectRowButtonOnly : true
	});
}


function selectTaskToGrid(){
	if(getId()==0){
		Public.tip('请先保存数据，再添加关联任务！'); 
		return; 
	}else{
	    var	owningObjectId =  $("#owningObjectId").val();
	    var managerType =  $("#managerType").val();
		UICtrl.showFrameDialog({
		     title: "选择关联任务",//?bizId='+row.taskReportId+'&isReadOnly=true';
		     url: web_app.name + "/planTaskManagerAction!forwardTaskList.do?owningObjectId="+owningObjectId+"&managerType="+managerType,
		     width: 800,
		     height: 400,
		     ok: function () {
		         var _self = this, data = _self.iframe.contentWindow.relationTaskGridManager.getSelectedRows();
		         if (!data)
		             return;
		         else
		        	 //selectTaskPlan(data);
		        	 saveRelationTask(data);
		        	 
		         _self.close();
		     }
		 });
	}
}

function saveRelationTask(_selectedData){
	var _planTaskId = $("#planTaskId").val();
	var _adjustId = getId();
	
	var len = _selectedData.length;
	var taskArr = [];
	var taskRelationArr = [];
	for(var i=0;i<len;i++){
		var arow = _selectedData[i];
		var task = {};
		task.planTaskId = arow.taskId;
		task.oldPlanningCycle = arow.planningCycle;
		task.oldTaskName = arow.taskName;
		task.oldTaskKindId = arow.taskKindId;
		task.oldTaskLevel = arow.taskLevel;
		task.oldStartDate = arow.startDate;
		task.oldFinishDate = arow.finishDate;
		task.oldDutyDeptId = arow.dutyDeptId;
		task.oldDutyDeptName = arow.dutyDeptName;
		task.oldOwnerId = arow.ownerId;
		task.oldOwnerName = arow.ownerName;
		
		task.owningObjectId = arow.owningObjectId;
		task.planningCycle = arow.planningCycle;
		task.taskName = arow.taskName;
		task.taskKindId = arow.taskKindId;
		task.taskLevel = arow.taskLevel;
		task.startDate = arow.startDate;
		task.finishDate = arow.finishDate;
		task.dutyDeptId = arow.dutyDeptId;
		task.dutyDeptName = arow.dutyDeptName;
		task.adjustTaskKind = arow.adjustTaskKind;
		task.ownerId = arow.ownerId;
		task.ownerName = arow.ownerName;
		task.remark = arow.remark;
		
		taskArr.push(task);
		
		//关联数据
		var taskRelation = {};
		taskRelation.tsakId = _planTaskId;  
		taskRelation.tsakAdjustId = _adjustId;
		taskRelation.relationTaskId = arow.taskId;
		taskRelation.relationTaskAdjustId = 0;
			
		taskRelationArr.push(taskRelation);
	}
	
	var params = {adjustInfo: $.toJSON(taskArr),relationAdjustInfo: $.toJSON(taskRelationArr)};
	$('#submitSubForm').ajaxSubmit({url: web_app.name + '/planTaskManagerAction!saveSelectInfo.ajax',
		param: params,
		success : function() {
			relationGridReload();
		}
	});
}

function relationGridReload(){
	var gridparms = {adjustAskId:getId()};
	UICtrl.gridSearch(relationGridManager,gridparms);
}

function selectTaskPlan(_selectedData){
	var len = _selectedData.length;
	for(var i=0;i<len;i++){
		var arow = _selectedData[i];
		arow.adjustAskId = "";
		UICtrl.addGridRow(relationGridManager,arow);
	}
}

function deleteRelationTask(){
	var row = relationGridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！'); 
		return; 
	}

	var _mainadjustAskId = getId();
	var _subadjustAskId = row.adjustAskId;
	
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/planTaskManagerAction!deleteRelation.ajax', 
				{
					relationAdjustAskId:_subadjustAskId,
					mainadjustAskId: _mainadjustAskId
				}, function(){
					relationGridReload();
		});
	});
}

function saveUpdateRelation(){
	if(!relationGridManager){
		return '';
	}
	var _data = relationGridManager.rows;
	var len = _data.length;
	var taskArr = [];
	if(len>0){
		for(var i=0;i<len;i++){
			var arow = _data[i];
			var task = {};

			task.planTaskId = arow.planTaskId;
			task.adjustAskId = arow.adjustAskId;
			task.owningObjectId = arow.owningObjectId;
			task.planningCycle = arow.planningCycle;
			task.taskName = arow.taskName;
			task.taskKindId = arow.taskKindId;
			task.taskLevel = arow.taskLevel;
			task.startDate = arow.startDate;
			task.finishDate = arow.finishDate;
			task.dutyDeptId = arow.dutyDeptId;
			task.dutyDeptName = arow.dutyDeptName;
			task.adjustTaskKind = arow.adjustTaskKind;
			task.ownerId = arow.ownerId;
			task.ownerName = arow.ownerName;
			task.remark = arow.remark;
			task.adjustNumber = arow.adjustNumber;
			
			taskArr.push(task);
		}
	}
	
	return $.toJSON(taskArr);
}
