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
		html.push('员工转正意见征求表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>员工转正意见征求表');
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
		}
	});
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{display: "申请时间", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left"},
		{ display: "申请人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "转正员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "员工入职时间", name: "employedDate", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "是否同意转正", name: "opinionTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "员工所属部门", name: "dept", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工所属中心", name: "center", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工岗位", name: "pos", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "审批时间", name: "approvdDate", width: 100, minWidth: 60, type: "date", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/beFormalAskopAction!slicedQuery.ajax',
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		fixedCellHeight : true,
		toolbar: toolbarOptions,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.id);
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
function viewHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	
	parent.addTabItem({ 
		tabid: 'HRBeFormalAskOp'+id,
		text: '新员工转正意见',
		url: web_app.name + '/beFormalAskopAction!showUpdate.job?bizId=' 
			+ id+'&isReadOnly=true'
		}); 
}




