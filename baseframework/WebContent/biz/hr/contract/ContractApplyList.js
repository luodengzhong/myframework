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
	    manageType:'hrBaseContractRenewManage',
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
}

function onFolderTreeNodeClick(data) {
     var html=[],fullId='',fullName='';
     if(!data){
	    html.push('劳动合同续签申请单列表');
     }else{
	    fullId=data.fullId,fullName=data.fullName;
	    html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>劳动合同续签申请单列表');
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
			showApplyDetail();
		}
	});
	
	gridManager = UICtrl.grid('#contractApplyMaingrid', {
		columns: [
		{ display: "续签员工", name: "archivesName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "合同到期时间", name: "contracEndDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "续签部门", name: "deptRenewName", width: 100, minWidth: 60, type: "string", align: "left"},
		{ display: "申请人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "申请时间", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "审批时间", name: "endTime", width: 100, minWidth: 60, type: "date", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/hRContractAction!slicedQueryContractApply.ajax',
		manageType:'hrBaseContractRenewManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		fixedCellHeight : true,
		toolbar: toolbarOptions,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			showApplyDetail(data.contractApplyId);
		}
		
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//查看申请意见详情
function showApplyDetail(contractApplyId){
	
	if(!contractApplyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		contractApplyId=row.contractApplyId;
	}
	parent.addTabItem({
		tabid: 'HRContractRenewApply'+contractApplyId,
		text: '合同续签查看',
		url: web_app.name + '/hRContractAction!showUpdate.job?bizId=' 
			+ contractApplyId+'&isReadOnly=true'
	}
	);
}


//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}





