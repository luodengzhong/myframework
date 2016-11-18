var attendanceStatus=null;
var gridManager = null, refreshFlag = false;
var isAuthorization=0;//0 会议请假 1 专委会授权
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	isAuthorization=parseInt($('#isAuthorization').val(),10);
	isAuthorization=isNaN(isAuthorization)?0:isAuthorization;
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
	attendanceStatus=$('#attendanceStatus').combox('getJSONData');
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('会议请假单');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>会议请假单');
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
	var columns=[];
	columns.push({ display: "填单日期", name: "fillinDate", width: 100, minWidth: 100, type: "date", align: "center"});
	columns.push({ display: "单据编号", name: "billCode", width: 140, minWidth: 100, type: "string", align: "center"});
	columns.push({ display: "会议单据编号", name: "mbillCode", width: 140, minWidth: 100, type: "string", align: "center"});
	columns.push({ display: "会议类型", name: "meetingKindName", width: 120, minWidth: 100, type: "string", align: "left"});
	columns.push({ display: "会议名称", name: "meetingName", width: 280, minWidth: 100, type: "string", align: "left"});
	if(isAuthorization===0){
		columns.push({ display: "请假人单位", name: "organName", width: 180, minWidth: 180, type: "string", align: "center" });
		columns.push( { display: "请假人中心", name: "centerName", width: 120, minWidth: 120, type: "string", align: "center" });
		columns.push({ display: "请假人", name: "personMemberName", width: 100, minWidth: 100, type: "string", align: "center"});
		columns.push({ display: "请假原因", name: "reason", width: 220, minWidth: 120, type: "string", align: "left"});
	}else{
		columns.push({ display: "类别", name: "isSecretaryTextView", width: 100, minWidth: 100, type: "string", align: "center"});
		columns.push({ display: "委托人", name: "personMemberName", width: 100, minWidth: 100, type: "string", align: "center"});
		columns.push({ display: "受托人", name: "agentPersonMemberName", width: 100, minWidth: 100, type: "string", align: "center"});
	}
	columns.push( { display: "状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "center" });
	gridManager = UICtrl.grid('#maingrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/meetingLeaveAction!slicedQueryMeetingLeave.ajax',
		parms:{isAuthorization:isAuthorization},
		width : "99%",
		height : "100%",
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: false,
		enabledEdit: false,
		usePager: true,
		toolbar: toolbarOptions,
		onDblClickRow: function (data, rowIndex, rowObj) {
		    openUrl(data.meetingLeaveId,data.personMemberName);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

function openUrl(bizId,personMemberName){
	var subject=personMemberName+(isAuthorization===0?'会议请假单':'专委会会议授权');
	var url= web_app.name+'/meetingLeaveAction!showUpdate.job?bizId='+bizId+'&isReadOnly=true&useDefaultHandler=0';
	parent.addTabItem({
		tabid : bizId,
		text : subject,
		url : url
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}


