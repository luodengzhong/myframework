var gridManager = null, refreshFlag = false,manageType="hrExaminationManage";
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:manageType,
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	
	$('#examinationTypeName').searchbox({
		type: 'hr', name: 'examinationType',
		back: {
			examinationTypeId: '#examinationTypeId', 
			name:'#examinationTypeName'
		}
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('考试计划列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>考试计划列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		viewHandler:function(){
			viewHandler();
		},
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		saveTurnHandler:{id:'turn',text:'发起考试',img:'page_next.gif',click:function(){
			saveDoStartExam();
		}},
		saveCancelHandler:{id:'aborted',text:'作废',img:'page_cross.gif',click:function(){
			saveCancelExamStart();
		}},
		saveAbortedHandler:{id:'aborted',text:'结束考试',img:'page_url.gif',click:function(){
			saveCompletedExamStart();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "发起人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "考试主题", name: "subject", width: 250, minWidth: 60, type: "string", align: "left" },
		{ display: "考试类型", name: "examinationTypeName", width: 120, minWidth: 60, type: "string", align: "left" },
		{ display: "阅卷人", name: "managerName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/examStartAction!slicedQueryExamStart.ajax',
		manageType:manageType,
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			if(parseInt(data.status,10)!=3){
				updateHandler(data.examStartId);
			}else{
				viewHandler(data.examStartId);
			}
			
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
function saveDoStartExam(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=0){
		Public.tip('数据已提交不能重复发起!');
		return;
	}
	UICtrl.confirm('确定发起考试吗?',function(){
		Public.ajax(web_app.name + '/examStartAction!saveDoStartExam.ajax', {examStartId:row['examStartId']}, function(){
			reloadGrid();
		});
	});
}
function saveCancelExamStart(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)==3){
		Public.tip('已完成单据不能作废!');
		return;
	}
	UICtrl.confirm('确定作废考试吗?',function(){
		Public.ajax(web_app.name + '/examStartAction!saveCancelExamStart.ajax', {examStartId:row['examStartId']}, function(){
			reloadGrid();
		});
	});
}
function saveCompletedExamStart(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=1){
		Public.tip('只能结束已发起的考试!');
		return;
	}
	UICtrl.confirm('确定结束考试吗?',function(){
		Public.ajax(web_app.name + '/examStartAction!saveCompletedExamStart.ajax', {examStartId:row['examStartId']}, function(){
			reloadGrid();
		});
	});
}
function addHandler(){
	var url=web_app.name + '/examStartAction!showInsertExamStart.job';
	parent.addTabItem({ tabid: 'HRExamDoStart', text: '考试发起', url:url});
}
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=0){
		Public.tip('数据已提交不能删除!');
		return;
	}
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/examStartAction!deleteExamStart.ajax', {examStartId:row['examStartId']}, function(){
			reloadGrid();
		});
	});
}
function updateHandler(examStartId){
	if(!examStartId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		examStartId=row.examStartId;
	}
	var url=web_app.name + '/examStartAction!showUpdateExamStart.job?examStartId='+examStartId;
	parent.addTabItem({ tabid: 'HRExamStartModif'+examStartId, text: '编辑考试发起', url:url});
}
function viewHandler(examStartId){
	if(!examStartId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		examStartId=row.examStartId;
	}
	var url=web_app.name + '/examStartAction!showUpdateExamStart.job?examStartId='+examStartId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HRExamStartView'+examStartId, text: '查看考试发起', url:url});
}