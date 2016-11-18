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
		html.push('人才选拨需求列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>人才选拨需求列表');
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
		viewHandler:function(){
			updateHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   
		{ display: "申请日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "拟选拨机构", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "拟选拨中心", name: "chosenCenterName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "拟选拨部门", name: "chosenDeptName", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "拟选拨岗位", name: "chosenPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "拟选拨人数", name: "chosenNum", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "已拟选拨人数", name: "chosenedNum", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" }		   
		],
		dataAction : 'server',
		url: web_app.name+'/talentschosendemandAction!slicedQueryTalentsChosenDemand.ajax',
		manageType:'hrBaseTalentsChosenData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		fixedCellHeight : true,
		toolbar: toolbarOptions,

		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.talentsChosenDemandId);
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
function updateHandler(talentsChosenDemandId){
	if(!talentsChosenDemandId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		talentsChosenDemandId=row.talentsChosenDemandId;
	}
	
	parent.addTabItem({
		tabid: 'HRtalentsDemand'+talentsChosenDemandId,
		text: '人才选拨需求详情',
		url: web_app.name + '/talentschosendemandAction!showUpdate.job?bizId=' 
			+ talentsChosenDemandId+'&isReadOnly=true'
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
/*
//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "employApplyAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'employApplyAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'employApplyAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
