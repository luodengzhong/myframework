var gridManager = null, refreshFlag = false,yesOrNo = {0:'否', 1:'是'},
selectFunctionDialog=null;
var chooseManager = null;
var isInitializingData = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	//initializeChooseGrid();
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos,psm"};
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
	var html=[],id='',name='',orgKindId='',fullId='',fullName='';
	if(!data){
		html.push('会议秘书信息');
	}else{
		id=data.id,name=data.name,orgKindId=data.orgKindId,fullId=data.fullId,fullName=data.fullName;
		$('#fullId').val(fullId);
		$('#manageOrganId').val(id);
		$('#orgName').val(name);
		$('#mfullName').val(fullName);
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>会议秘书信息');
		refreshGrid();
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
}

//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "组织机构", name: "manageOrgName", width: 100, minWidth: 60, type: "string", align: "left" }, 
		{ display: "秘书机构名称", name: "orgName", width: 100, minWidth: 60, type: "string", align: "left" }, 
		{ display: "秘书名", name: "personName", width: 70, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingSecretaryAction!slicedQuery.ajax',
		parms: {manageOrganId:getManageOrgId(),pagesize:1000},
		pageSize : 1000,
		usePager:false,
		delayLoad:false,
		enabledEdit: false,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			addData(data);
		}
	});
}

function initializeChooseGrid(){
	chooseManager = UICtrl.grid('#choosedgrid', {
		columns: [
		{ display: "秘书机构名称", name: "handleKindName", width: 100, minWidth: 60, type: "string", align: "left" }, 
		{ display: "秘书名", name: "orgUnitName", width: 70, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		//url: web_app.name + '/meetingAction!queryMeetingHandler.ajax',
		//parms: {meetingId:'0',kindId:'noticeHandler',pagesize:10000},
		pageSize : 10000,
		usePager:false,
		delayLoad:false,
		enabledEdit: false,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			delData(data);
		}
	});
}

function getManageOrgId(){
	return $("#manageOrganId").val();
}

function getMeetingId(){
	return $("meetingId").val();
}

function addSecret(){
	var rows = gridManager.getSelectedRows();
	if (!rows || rows.length < 1) {
		Public.tip('请选择左侧秘书!');
		return;
	}
	var selectedData = chooseManager.rows || [];
	for (var i = 0; i < rows.length; i++) {
		addData(rows[i]);
	}
}

function deleteSecret(){
	var rows = chooseManager.getSelectedRows();
	if (!rows || rows.length < 1) {
		Public.tip('请选择右侧秘书!');
		return;
	}
	var selectedData = chooseManager.rows || [];
	for (var i = 0; i < rows.length; i++) {
		for (var j = 0; j < selectedData.length; j++) {
			if (selectedData[j].personId == rows[i].personId) {
				chooseManager.deleteRow(rows[i]);
				break;
			}
		}
	}
}

function delData(data){
	chooseManager.deleteRow(data);
}

// 查询
function query(obj) {
	var manageOrgId = getManageOrgId();
	if(!manageOrgId){
		Public.tip("请选择左侧的组织机构");
		return;
	}
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//查询
function refreshGrid(){
	var obj = $("#queryMainForm");
	query(obj);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

function reloadChooseManager(){
	chooseManager.loadData();
}

function addData(data){
	var selectedData = chooseManager.rows || [];
	var notAdded = true;
	for (var j = 0; j < selectedData.length; j++) {
		if (selectedData[j].personId == data.personId) {
			notAdded = false;
			break;
		}
	}
	if (notAdded) {
		UICtrl.addGridRow(chooseManager,data);
	}
    
}

function getChooseGridData(){
	return chooseManager.rows;
}