var gridManager = null, refreshFlag = false;
var dataSource={
		yesOrNo:{1:'是',0:'否'}
};
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
		manageType:'hrBaseTrainManageData',
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
		html.push('外送培训申请列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>外送培训申请列表');
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
		viewHandler:function(){
			viewHandler();
		},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		updateHandler:{id:'upload',text:'上传培训协议',img:'page_java.gif',click:function(){
			editHandler();
		}},
		cancelHandler:{id:'Cancel',text:'作废培训申请',img:'page_deny.gif',click:function(){
			cancelHandler();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工姓名", name: "personName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "外送培训类别", name: "outboundApplyTypeTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "培训机构名称", name: "trainingOrgName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "培训开始时间", name: "startTime", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "培训结束时间", name: "endTime", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "预计费用", name: "predictFee", width: 100, minWidth: 60, type: "string", align: "left" },		 
		{ display: "申请状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "签订培训协议", name: "isSignProtocols", width: 140, minWidth: 60, type: "string", align: "left",
		  render:function(item){
		  	if(item.isSignProtocols==1){
		  		return "是"+' ('+ '<a href="javascript:showAttachInfoByDetailId('+item.detailId+')">'+'点击查看培训协议  )'+'</a>';
		  	}else{
		  	 return "否";
		  	}
		      }},	
		{ display: "备注", name: "applicationContent", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "培训课程", name: "course", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "培训地点", name: "place", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "培训讲师姓名", name: "teacherName", width: 100, minWidth: 60, type: "string", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/trainingOutboundApplyAction!slicedQuery.ajax',
		manageType:'hrBaseTrainManageData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.trainingOutboundApplyId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

function showAttachInfoByDetailId(detailId){
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingOutboundApplyAction!showUpdateIsSignProtocol.load', 
	param:{detailId:detailId,isSignProtocols:1}, 
	title:'查看培训协议',
	init:initDialog,
	ok: false, 
	width:400,
	close: dialogClose});
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
function viewHandler(trainingOutboundApplyId){
	if(!trainingOutboundApplyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		trainingOutboundApplyId=row.trainingOutboundApplyId;
	}
	parent.addTabItem({
		tabid: 'HRTrainOutApplyList'+trainingOutboundApplyId,
		text: '外送专项培训申请明细',
		url: web_app.name + '/trainingOutboundApplyAction!showUpdate.job?bizId=' + trainingOutboundApplyId+'&isReadOnly=true'
	});
}

function editHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var detailId=row.detailId;
	var isSignProtocols=row.isSignProtocols;
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingOutboundApplyAction!showUpdateIsSignProtocol.load', 
	param:{detailId:detailId,isSignProtocols:isSignProtocols}, 
	title:'修改信息',
	init:initDialog,
	ok: update, 
	width:400,
	close: dialogClose});
}

function cancelHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var trainingOutboundApplyId=row.trainingOutboundApplyId;
	var applicationContent=row.applicationContent;

 UICtrl.showAjaxDialog({url: web_app.name + '/trainingOutboundApplyAction!showUpateCancelReasonDetail.load', 
			title:"提示：请填写作废原因",
			param:{trainingOutboundApplyId:trainingOutboundApplyId,applicationContent:applicationContent,status:5},
			ok: function (){
			     updateStatus();
			}, 
			width:400,
			height:100,
			close: this.close()}); 
}
function updateStatus(){
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingOutboundApplyAction!updateStatus.ajax',
	  success : function() {
	  	_self.close();
		reloadGrid();
			}});
}
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingOutboundApplyAction!updateDeta.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}
function initDialog(){
	$('#isSignProtocolsFileList').fileList();
}


