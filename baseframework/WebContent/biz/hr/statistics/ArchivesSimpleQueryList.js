var gridManager = null, refreshFlag = false;
var queryType=null;
var yesOrNo = {0:'否', 1:'是'};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	queryType=Public.getQueryStringByName("type");
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
		html.push('人员列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>人员列表');
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
		viewHandler: viewHandler,
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		saveHandler:saveHandler
	});
	var param={};
	param[queryType]=1;
	var manageType="hrArchivesManage";
	if (queryType=='needDropAccount'){
		manageType="hrITCheck"
	}
	var columns=[
	      { display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left"},	
	      { display: "用户名", name: "f07", width: 90, minWidth: 60, type: "string", align: "left"},	
	      { display: "证件号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left"},
	      { display: "性别", name: "sexTextView", width: 70, minWidth: 60, type: "string", align: "left"},
	      { display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
	      { display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
	      { display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
	      { display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" }
	];
	if(queryType=='isBirthdate'||queryType=='isNextBirthdate'||queryType=="isNextRetire"){
		columns.push({ display: "生日", name: "birthdate", width: 100, minWidth: 60, type: "date", align: "left" });
	}else if(queryType=='isOneChild'){
		columns.push({ display: "独生子女生日", name: "childBirthday", width: 100, minWidth: 60, type: "date", align: "left" });
	}else if(queryType=='needDropAccount'){
		columns.push({ display: "账号注销时间", name: "accountDeadlineDate", width: 100, minWidth: 60, type: "date", align: "left" });
		columns.push({ display: "OA账号是否已注销", name: "yesorno", width: 150, minWidth: 60, type: "date", align: "left",
		editor: { type:'combobox',data:yesOrNo,required: false},
		render: function (item) { 
					return yesOrNo[item.yesorno];
		} });
		columns.push({ display: "ERP账号是否已注销", name: "erpYesorno", width: 150, minWidth: 60, type: "date", align: "left",
		editor: { type:'combobox',data:yesOrNo,required: false},
		render: function (item) { 
					return yesOrNo[item.erpYesorno];
		} });
	}else if(queryType=='takeJobsAssessment'){
		columns.push({ display: "异动生效时间", name: "effectiveDate", width: 100, minWidth: 60, type: "date", align: "left" });
	}
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/hrArchivesAction!slicedSimpleQuery.ajax',
		parms:param,
		manageType:manageType,
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.archivesId);
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
	onFolderTreeNodeClick();
}

function saveHandler(){
	var extendedData=getExtendedData();
    if (!extendedData) return;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/resignationAction!updateStatus.ajax',
		param : {extendedData:$.toJSON(extendedData)},
		success : function(data) {
			parent.Public.successTip("保存成功！");
			refreshFlag = true;
		}
	});
}

function getExtendedData() {
	var extendedData = DataUtil.getGridData({gridManager: gridManager});
	if(!extendedData){
		return false;
	}
	return extendedData;
}

function viewHandler(archivesId){
	if(!archivesId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		archivesId=row.archivesId;
	}
	var url=web_app.name + '/hrArchivesAction!showUpdate.do?functionCode=HRArchivesMaintain&archivesId='+archivesId+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HRArchivesView'+archivesId, text: '查看人员 ', url:url});
}