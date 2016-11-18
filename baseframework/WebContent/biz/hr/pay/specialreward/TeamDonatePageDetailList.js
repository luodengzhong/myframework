var gridManager = null, refreshFlag = false;
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
		manageType:'hrSpecialRewardManage',
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
		html.push('团队捐赠明细');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>团队捐赠明细');
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
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "奖罚原因", name: "title", width: 200, minWidth: 60, type: "string", align: "left" },
			{ display: "奖罚类别", name: "rewardApplyKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "捐赠指定人", name: "createByName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "捐赠比例(%)", name: "proportion", width: 60, minWidth: 60, type: "string", align: "left" },	
			{ display: "计算金额", name: "tmpDonateAmount", width: 80, minWidth: 60, type: "money", align: "left" },
			{ display: "捐赠责任人", name: "personName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "捐赠金额", name: "donateAmount", width:80, minWidth: 60, type: "money", align: "left" },
		    { display: "完成日期", name: "closeDate", width: 100, minWidth: 60, type: "date", align: "left" },		 
			{ display: "是否完成", name: "yesornoTextView", width: 60, minWidth: 60, type: "string", align: "center"}
		],
		dataAction : 'server',
		url: web_app.name+'/hRSpecialRewardAction!slicedQueryTeamDonateDetailList.ajax',
		manageType:'hrSpecialRewardManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
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