
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
		manageType:'hrBasePersonquatoData',
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
		html.push('专项招聘任务下达申请单列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>专项招聘任务下达申请单列表');
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
			viewHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
	   { display: "单位名称", name: "organName", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请人", name: "personMemberName", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请时间", name: "fillinDate", width: 120, minWidth: 60, type: "date", align: "left" },		   
		{ display: "备注", name: "remark", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" }		  
		],
		dataAction : 'server',
		url: web_app.name+'/specialRecruitApplyAction!slicedQuerySpecialRecruitApply.ajax',
		pageSize : 20,
		manageType:'hrBasePersonquatoData',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.applyId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
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

function viewHandler(applyId){
	if(!applyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		applyId=row.applyId;
	}
	parent.addTabItem({
		tabid: 'HRspecialRecruitApply'+applyId,
		text: '专项招聘申请查询',
		url: web_app.name + '/specialRecruitApplyAction!showUpdateSpecialRecruitApply.job?bizId=' 
			+ applyId+'&isReadOnly=true'
	}
	);
}

