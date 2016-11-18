var gridManager = null, refreshFlag = false,speechTypeTemp=null;
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
		manageType:'hrBaseTalentsChosenData',
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
		html.push('竞聘候选人演讲分数列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>竞聘候选人演讲分数列表');
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
	var  speechType=$('#speechType').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){
			updateHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		  { display: "填表时间", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		
		  { display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "date", align: "left" },		   
	      { display: "机构", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		   
          { display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  { display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  { display: "申请人", name: "personMemberName", width: 80, minWidth: 60, type: "string", align: "left" },
		  { display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" }	,
		  { display: "描述", name: "desption", width: 100, minWidth: 60, type: "string", align: "left" }	   	
		],
		dataAction : 'server',
		url: web_app.name+'/speechscoreresultAction!slicedQuerySpeechScoreResultAduit.ajax',
		parms:{speechType:speechType},
		manageType:'hrBaseTalentsChosenData',
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
			updateHandler(data.resultAduitId);
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
function updateHandler(resultAduitId){
	if(!resultAduitId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		resultAduitId=row.resultAduitId;
	
	}
	parent.addTabItem({
		tabid: 'HRSpeechScoreResultAduit'+resultAduitId,
		text: '竞聘结果审批详情',
		url: web_app.name + '/speechscoreresultAction!showUpdate.job?bizId=' 
			+ resultAduitId+'&isReadOnly=true'
	});
}


//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
