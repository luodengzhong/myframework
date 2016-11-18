var gridManager = null, refreshFlag = false, gridTitle='人员离职率报表', totalgridManager = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});//  
	UICtrl.layout("#divLayOut", {topHeight: 150});
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
	var html=[],fullId='/',fullName='', ognKindId='', ognId='';
	if(!data){
		html.push('统计报表');
	}else{
		fullId=data.fullId,fullName=data.fullName, ognKindId=data.orgKindId, ognId=data.id;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>统计报表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#ognKindId').val(ognKindId);
	$('#fullId').val(fullId);
	$('#ognId').val(ognId);
	if (gridManager&&fullId!=''&&fullId!='/') {
		query();
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
    var columns= [
	      	{ display: "单位名称", name: "ognName", width: 150, minWidth: 60, type: "string", align: "center"},
	      	{ display: "所属一级中心", name: "centreName", width: 150, minWidth: 60, type: "string", align: "center"},		   
	      	{ display: "部门名称", name: "dptName", width: 150, minWidth: 60, type: "string", align: "center" },	
	      	{ display: "职位", name: "posName", width: 150, minWidth: 60, type: "string", align: "center" },
	     	 { display: "编制", name: "bzNum", width: 50, minWidth: 50, type: "string", align: "center" },	  
	     	 { display: "总在职人数", name: "onWorkNum", width: 80, minWidth: 80, type: "string", align: "center"},	  
	     	 { display: "总离职人数", name: "leaveNum", width: 80, minWidth: 80, type: "string", align: "center"},	  
	     	 { display: "主动职人数", name: "zdLeaveNum", width: 80, minWidth: 80, type: "string", align: "center" },	  
	     	 { display: "被动职人数", name: "bdLeaveNum", width: 80, minWidth: 80, type: "string", align: "center" },	  
	     	 { display: "离职率", name: "leaveRate", width: 80, minWidth: 80, type: "string", align: "center",
	     	 	render: function (item) {
	     	 		return (item.leaveNum/item.onWorkNum).toFixed(2) * 100 + '%';
	     	 	}
	     	 }
	     	 ];	  
	
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/hrSystemStatisticsAction!slicedArchivesLeaveRateQuery.ajax',
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
	
    var totalOnWorkNum = 0, totalLeaveNum = 0;
    var totalColumns= [
	      { display: "组织机构", name: "ognName", width: 200, minWidth: 60, type: "string", align: "center",
	      	render: function (item) {
	      		var ognName = item.ognName;
	      		if(item.centreName)
	      			ognName += "-" + item.centreName;
	      		if(item.dptName)
	      			ognName += "-" + item.dptName;
	      		if(item.posName)
	      			ognName += "-" + item.posName;
	      		return ognName;
	      	},
	     	 	totalSummary: {align: "left",type: "sum",
	     	 		render: function (item) {
	     	 			return "总计：";
	     	 		} }},
	     	 { display: "编制", name: "bzNum", width: 100, minWidth: 50, type: "string", align: "center"},	  
	     	 { display: "总在职人数", name: "onWorkNum", width: 80, minWidth: 80, type: "string", align: "center",
	     	 	totalSummary: {align: "left",type: "sum",
	     	 		render: function (item) {
	     	 			totalOnWorkNum = item.sum;
	     	 			return item.sum;
	     	 		} }},	  
	     	 { display: "总离职人数", name: "leaveNum", width: 80, minWidth: 80, type: "string", align: "center",
	     	 	totalSummary: {align: "left",type: "sum",
	     	 		render: function (item) {
	     	 			totalLeaveNum = item.sum;
	     	 			return item.sum;
	     	 		} }},	  
	     	 { display: "主动职人数", name: "zdLeaveNum", width: 80, minWidth: 80, type: "string", align: "center",
	     	 	totalSummary: {align: "left",type: "sum",
	     	 		render: function (item) {
	     	 			return item.sum;
	     	 		} } },	  
	     	 { display: "被动职人数", name: "bdLeaveNum", width: 80, minWidth: 80, type: "string", align: "center",
	     	 	totalSummary: {align: "left",type: "sum",
	     	 		render: function (item) {
	     	 			return item.sum;
	     	 		} } },	  
	     	 { display: "离职率", name: "leaveRate", width: 80, minWidth: 80, type: "string", align: "center",
	     	 	render: function (item) {
	     	 		return (item.leaveNum/item.onWorkNum).toFixed(2) * 100 + '%';
	     	 	},
	     	 	totalSummary: {align: "left",type: "sum",
	     	 		render: function (item) {
	     	 			return (totalLeaveNum/totalOnWorkNum).toFixed(2) * 100 + '%';
	     	 		} }
	     	 }
	     	 ];	
	
	totalgridManager = UICtrl.grid('#maingridTotal', {
		columns:totalColumns,
		dataAction : 'server',
		url: web_app.name+'/hrSystemStatisticsAction!slicedArchivesTotalLeaveRateQuery.ajax',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		delayLoad:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledSort : false,
		usePager: false,
		title: "总计"
		
	});
	UICtrl.setSearchAreaToggle(totalgridManager,false);
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
	var fullId =  $("#fullId").val();
	if(!fullId){
		Public.tip('请选择机构')	;	
		return;
	}
	var ognKindId =  $("#ognKindId").val();
	if(!ognKindId){
		Public.tip('请选择机构')	;	
		return;
	}
	var posName =  $("#posName").val() || "*";
	
	var param = {fullId: fullId, ognKindId: ognKindId, startDate: startDate, endDate: endDate, posName: posName};
	var totalParam = {fullId: fullId, ognKindId: ognKindId, startDate: startDate, endDate: endDate};
	UICtrl.gridSearch(gridManager, param);
	UICtrl.gridSearch(totalgridManager, totalParam);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
	totalgridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
	onFolderTreeNodeClick();
}

