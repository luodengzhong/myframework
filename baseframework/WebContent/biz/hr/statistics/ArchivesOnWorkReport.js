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
	var html=[],fullId='/',fullName='';
	if(!data){
		html.push('统计报表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>统计报表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#fullId').val(fullId);
	if (gridManager&&fullId!='') {
		query();
		//UICtrl.gridSearch(gridManager,{fullId:fullId});
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
	      { display: "单位名称", name: "ognName", width: 150, minWidth: 60, type: "string", align: "center"},
	      { display: "所属一级中心", name: "centreName", width: 150, minWidth: 60, type: "string", align: "center"},		   
	      { display: "部门名称", name: "dptName", width: 150, minWidth: 60, type: "string", align: "center" },	
	      { display: "职位", name: "posName", width: 150, minWidth: 60, type: "string", align: "center" },
	      { display: "编制", name: "ognNum", width: 50, minWidth: 50, type: "string", align: "left" },	  
	      { display: "在职人数", name: "onWorkNum", width: 50, minWidth: 50, type: "string", align: "center" }		   
	];
	
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/hrSystemStatisticsAction!slicedArchivesOnWorkQuery.ajax',
		manageType:'hrArchivesManage',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		delayLoad:true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledSort : false
		
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(obj) {
	var endDate =  $("#endDate").val();
	if(!endDate){
		Public.tip('请选择结束期间')	;	
		return;
	}
	var fullId =  $("#fullId").val();
	if(!fullId){
		Public.tip('请选择机构')	;	
		return;
	}
	var param = {fullId: fullId, endDate: endDate};
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

