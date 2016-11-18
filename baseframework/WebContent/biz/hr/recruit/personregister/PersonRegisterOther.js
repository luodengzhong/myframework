var learnGridManager = null, refreshFlag = false;
var familyGridManager =null,trainGridManager=null,workGridManager=null,workDetailGridM=null;
var gridManager=null;
var hunterType=4,commType=3;
$(document).ready(function() {
//	UICtrl.autoSetWrapperDivHeight();
	var personRegisterReadOnly=Public.getQueryStringByName("personRegisterReadOnly")==='true';
	if(personRegisterReadOnly){
		Public.isReadOnly=true;
	}
	var writeId=$('#writeId').val();
	var queryWay=$('#queryWay').val();
	var taskId=$('#taskId').val();
	var staffName=$('#staffName').val();
	$('#writeFileList').fileList({isCheck:false});
	initializeLearnGrid(writeId);
	initializeTrainGrid(writeId);
	initializeFamilyGrid(writeId);
	initializeWorkGrid(writeId);
	initializeWorkDetailGrid(writeId);
	if(queryWay!=0){
	$.getFormButton([{name:'上一步',event:function(){
		beforePage();
		}},{name:'完  成',event:function(){
			saveInfo(writeId);}},
		{id:"upLoadButton",name:'上 传 附 件'}]);
	   $('#writeFileList').fileList({button:'#upLoadButton'});
	}
	else if(taskId!=''){
		$.getFormButton([{name:'同意面试',event:function(){
			agree(writeId,taskId,staffName);
			}},{name:'不同意面试',event:function(){
				disAgree(writeId,taskId,staffName);}}]);
	}/*else {
		$.getFormButton([{name:'直接面试',event:function(){
			agree(writeId,taskId);
			}},{name:'发送简历',event:function(){
				disAgree(writeId,taskId);}}]);
	}*/
	UICtrl.autoGroupAreaToggle();
});


function beforePage(){
	history.back();
}

function initializeLearnGrid(writeId){

	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandlerLearn, 
		updateHandler:function(){
			updateHandlerLearn();
		},
		deleteHandler: deleteHandlerLearn
	});
	learnGridManager = UICtrl.grid('#learnDetailId', {
		columns: [
		{ display: "入学时间", name: "enrollingDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "毕业时间", name: "graduationDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "毕业学校", name: "university", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所学专业", name: "specialty", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "学历", name: "educationTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "学位", name: "degreeTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "备注", name: "remark", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/personregisterAction!slicedQueryLearnExp.ajax',
		parms:{writeId:writeId,pagesize:100},
		usePager: false,
		width : '100%',
		height : 180,
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'enrollingDate',
		sortOrder:'asc',
		usePager: false,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		 onLoadData :function(){
				return !($('#writeId').val()=='');
			},
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandlerLearn(data.learnId);
		}
	});
	UICtrl.setSearchAreaToggle(learnGridManager);
}

function addHandlerLearn(){
	var writeId=$('#writeId').val();
	
	UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showInsertLearnExp.load',
		title:"添加学习经历",
		param:{writeId:writeId},
		ok: insertLearn, 
		width:750,
		close:function(){ dialogClose(learnGridManager);}});
}


function updateHandlerLearn(learnId){
	if(!learnId){
		var row = learnGridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		learnId=row.learnId;
		
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showUpdateLearnExp.load', 
	    param:{learnId:learnId},
	    title:"修改学习经历",
	    ok: updateLearn, 
	    width:750,
	    close: 
	    	function(){ dialogClose(learnGridManager);}});
	
}

function insertLearn(){
	var learnId=$('#learnId').val();
	if(learnId!='') return updateLearn();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!insertLearnExp.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#learnId').val(data);
			refreshFlag = true;
		}
	});
}

function updateLearn(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!updateLearnExp.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}


function deleteHandlerLearn(){
	var row = learnGridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/personregisterAction!deleteLearnExp.ajax', {learnId:row.learnId}, function(){
			reloadGrid(learnGridManager);
		});
	});
}
function initializeTrainGrid(writeId) {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandlerTrain, 
		updateHandler:function(){
			updateHandlerTrain();
			},
		deleteHandler: deleteHandlerTrain
	});
	trainGridManager = UICtrl.grid('#trainDetailId', {
		columns: [
		{ display: "起始时间", name: "writeTime", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "终止时间", name: "endTime", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "培训举办单位", name: "forCompany", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "培训内容", name: "trainContent", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "获得证书", name: "getCertificate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "备注", name: "remark", width: 100, minWidth: 60, type: "string", align: "left" }		   
		],
		dataAction : 'server',
		url: web_app.name+'/personregisterAction!slicedQueryTrainExp.ajax',
		parms:{writeId:writeId,pagesize:100},
		usePager: false,
		width : '100%',
		height : 180,
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'writeTime',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		 onLoadData :function(){
				return !($('#writeId').val()=='');
			},
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandlerTrain(data.trainId);
		}
	});
	UICtrl.setSearchAreaToggle(trainGridManager);
}

function addHandlerTrain(){
	var writeId=$('#writeId').val();
	
	UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showInsertTrainExp.load', 
		title:"添加培训经历",
		param:{writeId:writeId},
		ok: insertTrain,
		width:750,
		close: function(){dialogClose(trainGridManager);}});
}

function insertTrain(){
	var trainId=$('#trainId').val();
	if(trainId!='') return updateTrain();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!insertTrainExp.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#trainId').val(data);
			refreshFlag = true;
		}
	});
}

function updateHandlerTrain(trainId){
	if(!trainId){
		var row = trainGridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		trainId=row.trainId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showUpdateTrainExp.load', 
		param:{trainId:trainId},
		title:"修改培训经历",
		width:750,
		ok: updateTrain, close: function(){dialogClose(trainGridManager);}});
}

function updateTrain(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!updateTrainExp.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

function deleteHandlerTrain(){
	
	var row = trainGridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/personregisterAction!deleteTrainExp.ajax', 
				{trainId:row.trainId}, function(){
			reloadGrid(trainGridManager);
		});
	});
}

function initializeFamilyGrid(writeId) {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandlerFamily, 
		updateHandler:function(){
			updateHandlerFamily();
		},
		deleteHandler: deleteHandlerFamily
	});
	familyGridManager = UICtrl.grid('#familyDetailId', {
		columns: [
		{ display: "家庭成员姓名", name: "familyName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "与本人关系", name: "familyRelationTextView", width: 100, minWidth: 60, type: "string", align: "left"},		   
		{ display: "联系方式", name: "familyPhone", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "工作单位", name: "familyFirm", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "担任职务", name: "occupation", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "地址", name: "address", width: 100, minWidth: 60, type: "string", align: "left" }	
		],
		dataAction : 'server',
		url: web_app.name+'/personregisterAction!slicedQueryFamilyMember.ajax',
		parms:{writeId:writeId,pagesize:100},
		usePager: false,
		width : '100%',
		height : 180,
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		 onLoadData :function(){
				return !($('#writeId').val()=='');
			},
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandlerFamily(data.familyMemberId);
		}
	});
	UICtrl.setSearchAreaToggle(familyGridManager);
}

function addHandlerFamily(){
	var writeId=$('#writeId').val();
	
	UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showInsertFamilyMember.load',
		title:"添加家庭成员",
		param:{writeId:writeId},
		ok: insertFamily,
		width:750,close: function(){dialogClose(familyGridManager);}});

}
function insertFamily(){
	var familyMemberId=$('#familyMemberId').val();
	if(familyMemberId!='') return updateFamily();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!insertFamilyMember.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#familyMemberId').val(data);
			refreshFlag = true;
		}
	});
}


function updateHandlerFamily(familyMemberId){
	if(!familyMemberId){
		var row = familyGridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		familyMemberId=row.familyMemberId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showUpdateFamilyMember.load', 
		param:{familyMemberId:familyMemberId},
		title:"修改家庭成员",
		ok: updateFamily, 
		width:750,close: function(){dialogClose(familyGridManager);}});
}

function updateFamily(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!updateFamilyMember.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

function deleteHandlerFamily(){
	var row = familyGridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/personregisterAction!deleteFamilyMember.ajax', 
				{familyMemberId:row.familyMemberId}, function(){
			reloadGrid(familyGridManager);
		});
	});
}

function initializeWorkGrid(writeId) {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandlerWork, 
		updateHandler:function(){
			updateHandlerWork();
		},
		deleteHandler: deleteHandlerWork
	});
	workGridManager = UICtrl.grid('#mainWorkId', {
		columns: [
		{ display: "工作起始时间", name: "resumeBeginDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "工作结束时间", name: "resumeEndDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "工作单位", name: "resumeCompany", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "担任职务", name: "resumePos", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "证明人", name: "linkmainPerson", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "证明人联系电话", name: "linkmainPhone", width: 100, minWidth: 60, type: "string", align: "left" }		   
		],
		dataAction : 'server',
		url: web_app.name+'/personregisterAction!slicedQueryWorkExp.ajax',
		parms:{writeId:writeId,pagesize:100},
		usePager: false,
		width : '100%',
		height : 180,
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'resumeBeginDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandlerWork(data.workId);
		}
	});
	UICtrl.setSearchAreaToggle(workGridManager);
}

function addHandlerWork(){
	var writeId=$('#writeId').val();
	
	UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showInsertWorkExp.load', 
		title:"添加工作经历",
		param:{writeId:writeId},

		ok: insertWork, 
		width:750,close: function(){dialogClose(workGridManager);}});

}

function insertWork(){
	var workId=$('#workId').val();
	if(workId!='') return updateWork();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!insertWorkExp.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#workId').val(data);
			refreshFlag = true;
		}
	});
}

function updateHandlerWork(workId){
	if(!workId){
		var row = workGridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		workId=row.workId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showUpdateWorkExp.load', 
		param:{workId:workId}, 
		title:"修改工作经历",
		ok: updateWork, 
		width:750,close: function(){dialogClose(workGridManager);}});
}
function updateWork(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!updateWorkExp.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

function deleteHandlerWork(){
	var row = workGridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/personregisterAction!deleteWorkExp.ajax',
			{workId:row.workId}, function(){
			reloadGrid(workGridManager);
		});
	});
}
function initializeWorkDetailGrid(writeId) {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandlerWorkDetail, 
		updateHandler:function(){
			updateHandlerWorkDetail();
		},
		deleteHandler: deleteHandlerWorkDetail
	});
	workDetailGridM = UICtrl.grid('#workDetailId', {
		columns: [
		{ display: "所在企业全称", name: "resumeCompanyLast", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "本人下属员工数量", name: "fellowStaffNumLast", width: 60, minWidth: 60, type: "string", align: "left" },		   
		{ display: "最初岗位", name: "firstPos", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "最初岗位工资", name: "firstWage", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "最终岗位工资", name: "lastWage", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "最终岗位", name: "lastPos", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "离职原因", name: "leaveReasonLast", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "人力资源部办公电话", name: "telephoneLast", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "主要工作经历及业绩", name: "mainDetailLast", width: 150, minWidth: 60, type: "string", align: "left" }		
		
		],
		dataAction : 'server',
		url: web_app.name+'/personregisterAction!slicedQueryCompanyDetail.ajax',
		parms:{writeId:writeId,pagesize:100},
		usePager: false,
		width : '100%',
		height : 180,
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		 onLoadData :function(){
				return !($('#writeId').val()=='');
			},
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandlerWorkDetail(data.companyId);
		}
	});
	UICtrl.setSearchAreaToggle(workDetailGridM);
}

function addHandlerWorkDetail(){
	var writeId=$('#writeId').val();
	
	UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showInsertCompanyDetail.load', 
		title:"添加工作详细情况",
		param:{writeId:writeId},
		ok: insertWorkDetail, 
		width:750,close: function(){dialogClose(workDetailGridM);}});

}
function insertWorkDetail(){
	var companyId=$('#companyId').val();
	if(companyId!='') return updateWorkDetail();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!insertCompanyDetail.ajax',
		success : function(data) {
			$('#companyId').val(data);
			refreshFlag = true;
		}
	});
}

function updateHandlerWorkDetail(companyId){
	if(!companyId){
		var row = workDetailGridM.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		companyId=row.companyId;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showUpdateCompanyDetail.load', 
		param:{companyId:companyId},
		title:"修改工作详细情况",
		ok: updateWorkDetail, 
		width:750,close: function(){dialogClose(workDetailGridM);}});
}

function updateWorkDetail(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!updateCompanyDetail.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

function deleteHandlerWorkDetail(){
	var row = workDetailGridM.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/personregisterAction!deleteCompanyDetail.ajax', 
				{companyId:row.companyId}, function(){
			reloadGrid(workDetailGridM);
		});
	});
}

// 完成
function saveInfo(writeId) {
	var sourceType=$('#sourceType').val();
    if(sourceType==commType){
	  UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showInsertVaCode.load', 
			title:"提示：请牢记下面验证码方便你下次查询修改信息",
			param:{writeId:writeId},
			ok: false, 
			width:80,
			height:80,
			close: function(){
				UICtrl.closeAndReloadTabs(null, null);	

			}});  
	
    }else{
    	Public.tip("简历成功入库");
		UICtrl.closeAndReloadTabs(null, null);	

    }
}



function insertVaCode(){
	var writeId=$('#writeId').val();
	var vaCode=$('#vaCode').val();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!updatePersonRegister.ajax',
		param:{writeId:writeId,vaCode:vaCode}
		});
}

//刷新表格
function reloadGrid(e) {
	e.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}
//同意面试
function agree(writeId,taskId,staffName){
	Public.ajax(web_app.name + '/interviewApplyAction!agreeAndDisAgree.ajax', 
			{writeId:writeId,status:1,taskId:taskId,staffName:staffName}, function(){
				UICtrl.closeAndReloadTabs("TaskCenter", null);
	});
	
}
//不同意面试
function disAgree(writeId,taskId,staffName){
	//不同意面试  添加不同意原因
	 UICtrl.showAjaxDialog({url: web_app.name + '/interviewApplyAction!showUpateDisAgreeReason.load', 
			title:"提示：请填写不同意原因",
			param:{writeId:writeId,taskId:taskId,staffName:staffName},
			ok: function (){
			     doDisAgree();
			}, 
			width:400,
			height:100,
			close: this.close()});  
	
}

function  doDisAgree(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/interviewApplyAction!agreeAndDisAgree.ajax',
	  success : function() {
			UICtrl.closeAndReloadTabs("TaskCenter", null);	
			}});
			
	/*Public.ajax(web_app.name + '/interviewApplyAction!agreeAndDisAgree.ajax', 
			{writeId:writeId,status:2,taskId:taskId,staffName:staffName}, function(){
				UICtrl.closeAndReloadTabs("TaskCenter", null);
	});*/
}

//关闭对话框
function dialogClose(e){
	if(refreshFlag){
		reloadGrid(e);
		refreshFlag=false;
	}
}
