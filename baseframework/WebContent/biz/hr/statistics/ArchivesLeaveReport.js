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
		manageType:'hrArchivesManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos"};
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
		html.push('统计报表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>统计报表');
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
		exportExcelHandler:function(){
			UICtrl.gridExport(gridManager);
		}
	});
	var columns=[
	      { display: "单位名称", name: "ognName", width: 100, minWidth: 60, type: "string", align: "center"},
	      { display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "center" },		   
	      { display: "部门名称", name: "dptName", width: 100, minWidth: 60, type: "string", align: "center" },	
	      { display: "职位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
	      { display: "姓名", name: "staffName", width: 80, minWidth: 60, type: "string", align: "left" },	
	      { display: "主动/被动", name: "typeName", width: 100, minWidth: 60, type: "string", align: "center" },
	      { display: "工龄", name: "CWorkTime", width: 60, minWidth: 60, type: "string", align: "center" },	
	      { display: "年龄", name: "age", width: 60, minWidth: 60, type: "string", align: "center" },	
	      { display: "职级", name: "staffingPostsRank", width: 60, minWidth: 60, type: "string", align: "center" },	 	   
	      { display: "学历", name: "educationTextView", width: 100, minWidth: 60, type: "string", align: "center" }	,	
	      { display: "性别", name: "sexTextView", width: 60, minWidth: 60, type: "string", align: "center"}   
	];
	
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/hrSystemStatisticsAction!slicedArchivesLeaveQuery.ajax',
		manageType:'hrArchivesManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		delayLoad:true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
		
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(obj) {
	var startDate =  $("#startDate").val();
	if(!startDate){
		Public.tip('请选择开始期间')	;	
		return;
	}
	var endDate =  $("#endDate").val();
	if(!endDate){
		Public.tip('请选择结束期间')	;	
		return;
	}
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
	onFolderTreeNodeClick();
}

