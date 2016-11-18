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
		manageType:'hrBaseAttManage',
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
		html.push('打卡记录');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>打卡记录');
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
			{ display: "公司", name: "orgName", width: 120, minWidth: 60, type: "string", align: "left" },
			{ display: "中心", name: "centerName", width: 120, minWidth: 60, type: "string", align: "left" },
			{ display: "部门", name: "deptName", width: 120, minWidth: 60, type: "string", align: "left" },
			{ display: "姓名", name: "personName", width: 80, minWidth: 60, type: "string", align: "left" },		   
			{ display: "打卡时间", name: "checkTime", width: 140, minWidth: 120, type: "datetime", align: "center" }	,
			{ display: "打卡机器", name: "macName", width: 140, minWidth: 100, type: "string", align: "center" }	,
			{ display: "打卡地点", name: "macAddress", width: 180, minWidth: 80, type: "string", align: "center" }	
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryCheckList.ajax',
		manageType:'hrBaseAttManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		delayLoad:true,
		sortName:'checkTime',
		sortOrder:'desc',		
		heightDiff : -10,
		toolbar: toolbarOptions,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	if(!param) return false;
	var startDate=$('#startDate').val();
	var endDate=$('#endDate').val();
	var dateDiff=Public.dateDiff('d',endDate,startDate);
	if(dateDiff<0){
		Public.errorTip('开始日期不能大于结束日期!');
		return false;
	}
	if(dateDiff>61){
		Public.errorTip('时间跨度不能大于2个月');
		return false;
	}
	UICtrl.gridSearch(gridManager, param);
}


//重置表单
function resetForm(obj) {
	$(obj).formClean();
}


//刷新表格
function reloadGrid() {
	gridManager.loadData();
}
