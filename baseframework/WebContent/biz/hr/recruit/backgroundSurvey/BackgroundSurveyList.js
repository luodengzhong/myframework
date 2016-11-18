var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseRecruitData',
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
		onClick : onFolderTreeNodeClick});
}

function onFolderTreeNodeClick(data) {

	var html=[],fullId='',fullName='';
	if(!data){
		html.push('录用申请列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>录用申请列表');
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
		viewHandler: function(){
			updateHandler();
		}
		
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
        { display: "被调查人姓名", name: "surveyName", width: 100, minWidth: 60, type: "string", align: "left" },		   
        { display: "试岗部门", name: "employDept", width: 100, minWidth: 60, type: "string", align: "left" },		   
        { display: "岗位", name: "employPos", width: 100, minWidth: 60, type: "string", align: "left" },	   
		{ display: "调查人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "调查日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "调查方式", name: "surveyWay", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "被调查人毕业学校", name: "university", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "被调查人专业", name: "specialty", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "学信网查询结果", name: "queryResultTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" }		   
		],
		dataAction : 'server',
		url: web_app.name+'/backgroundSurveyAction!slicedQuery.ajax',
		parms:{status:'1,3'},
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.surveyId);
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


//编辑按钮
function updateHandler(surveyId){
	if(!surveyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		surveyId=row.surveyId;
	}
	
	parent.addTabItem({
		tabid: 'HRBackgroundSurvey'+surveyId,
		text: '人事背景调查',
		url: web_app.name + '/backgroundSurveyAction!showUpdate.job?bizId=' 
			+ surveyId+'&isReadOnly=true'
	}
	);
}



//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
