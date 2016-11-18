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
		html.push('转正审批列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>转正审批列表');
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
		//deleteHandler: deleteHandler
		viewHandler:function(){
			viewHandler();
		},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "转正员工", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "身份证号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left" },
  		{ display: "入职时间", name: "employedDate", width: 100, minWidth: 60, type: "date", align: "left"},
  		{ display: "性别", name: "sexTextView", width: 100, minWidth: 60, type: "string", align: "left"},
  		{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
  		{ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
  		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
  		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },			   
		{ display: "审批时间", name: "approvdDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/beFormalAction!slicedQuery.ajax',
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'approvdDate',
		sortOrder:'desc',
		fixedCellHeight : true,
		toolbar: toolbarOptions,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.beFormalId);
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
function viewHandler(beFormalId){
	if(!beFormalId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		beFormalId=row.beFormalId;
	}
	parent.addTabItem({ 
		tabid: 'HRBeFormal'+beFormalId,
		text: '员工转正申请表',
		url: web_app.name + '/beFormalAction!showUpdate.job?bizId=' 
			+ beFormalId +'&isReadOnly=true'+'&taskKindId=makeACopyFor'
		}); 
	
}


