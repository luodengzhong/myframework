
var gridManager = null, refreshFlag = false,yesOrNo = {0:'否', 1:'是'},messageKindData={},
meetingMessageConfigGrid = null,meetingKindTaskConfigGrid = null,
meetingKindParticipantGrid = null,meetingKindLeaveOrgConfigGrid = null,
meetingLevelData = {},
orgKindData = {"ogn":"机构","dpt":"部门","pos":"岗位","psm":"个人"};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	messageKindData = $("#messageKindId").combox("getJSONData");
	meetingLevelData = $("#meetingLevel").combox("getJSONData");
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	UICtrl.initDefaulLayout();
	$('#maintree').commonTree({
		kindId : CommonTreeKind.MeetingKind,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.MeetingKind){
		parentId="";
		$('#treeParentId').val("");
		html.push('会议类型列表');
	}else{
		$('#treeParentId').val(folderId);
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>会议类型列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{parentId:parentId});
	}
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "名称", name: "name", width: 220, minWidth: 60, type: "string", align: "left" },		      
		{ display: "会议等级", name: "meetingLevel", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return meetingLevelData[item.meetingLevel];
			}},		   
		{ display: "是否启用", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) {
				return yesOrNo[item.status];
			}},		
		{ display: "纪要自由流", name: "freeFlow", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) {
				return yesOrNo[item.freeFlow];
			}},	
		{ display: "专委会会议", name: "isSpecializedCommittee", width: 80, minWidth: 60, type: "string", align: "left",
			render: function (item) {
				return yesOrNo[item.isSpecializedCommittee];
			}},	
		{ display: "预定提前天数", name: "aheadDays", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "通知模式", name: "messageKindId", width: 100, minWidth: 60, type: "string", align: "left",
			render: function(item){
				return messageKindData[item.messageKindId];
			}},
		{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",		   
			render: function(item){
				return "<input type='text' id='txtSequence_" + item.meetingKindId + "' class='textbox' value='" + item.sequence + "' />";
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingKindAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.meetingKindId);
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
}

//添加按钮 
var meetingKindTmpId = '';
function addHandler() {
	meetingKindTmpId = '';
	var parentId=$('#treeParentId').val();
	if(parentId==''){
		Public.tip('请选择类别树！'); 
		return;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/meetingKindAction!showInsert.load', 
		param:{parentId:parentId},ok: insert, close: dialogClose,
		init:initDialog,title:'新增会议类型',width:650,height : 390});
}

//编辑按钮
function updateHandler(meetingKindId){
	if(!meetingKindId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		meetingKindId=row.meetingKindId;
	}
	meetingKindTmpId = meetingKindId;
	UICtrl.showAjaxDialog({url: web_app.name + '/meetingKindAction!showUpdate.load', 
		param:{meetingKindId:meetingKindId}, ok: update, close: dialogClose,
		init:initDialog,title:'修改会议类型',width:650,height : 390});
}

//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({ action:web_app.name + '/meetingKindAction!delete.ajax', 
		gridManager: gridManager, idFieldName: 'meetingKindId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}

function initDialog(){
	var param={meetingKindId:meetingKindTmpId,bizId:meetingKindTmpId};
	var toolbarMessageConfigOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			if (!checkMettingKind()) return;
            UICtrl.addGridRow(meetingMessageConfigGrid,
                { sequence: meetingMessageConfigGrid.getData().length + 1});
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'meetingKindAction!deleteMessageConfig.ajax',
				gridManager:meetingMessageConfigGrid,idFieldName:'meetingMessageConfigId',
				onSuccess:function(){
					meetingMessageConfigGrid.loadData();
				}
			});
		}
	});
	meetingMessageConfigGrid = UICtrl.grid('#meetingMessageConfigGrid', {
		columns: [   
			{ display: "通知模式", name: "messageKindId", width: 180, minWidth: 100, type: "string", align: "left",
					editor: { type: 'combobox',data: messageKindData,required:true},
					render: function(item){
						return messageKindData[item.messageKindId];
					}
			},	   	   
			{ display: "提前时间", name: "aheadTime", width: 120, minWidth: 80, type: "string", align: "left",
				editor: { type: 'text',mask:"nn:nn",required:true}},		   
			{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left"	,
				editor: { type: 'spinner',mask:"nnn",required:true}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingKindAction!slicedQueryMessageConfig.ajax',
		parms:param,
		width : "99.5%",
		height : 200,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarMessageConfigOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		enabledEdit: true,
		usePager: false,
		onLoadData :function(){
   			return (getMeetingKindId()!='');
   		}
	});
	//清空grid对象
	meetingKindTaskConfigGrid = null;
	meetingKindParticipantGrid = null;
	meetingKindLeaveOrgConfigGrid = null;
	$('#meetingKindTab').tab().on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('li')){
			var id=$clicked.attr('id');
			if(id=='messageConfig'){
				meetingMessageConfigGrid._onResize.ligerDefer(meetingMessageConfigGrid, 10);
			}else if(id=='participant'){
				if(meetingKindParticipantGrid==null){
					initMeetingKindParticipantGrid();
				}
				else{
					meetingKindParticipantGrid._onResize.ligerDefer(meetingKindParticipantGrid, 10);
				}
			}
			else if(id=='leaveOrgConfig'){
				if(meetingKindLeaveOrgConfigGrid==null){
					initMeetingKindLeaveOrgConfigGrid();
				}
				else{
					meetingKindLeaveOrgConfigGrid._onResize.ligerDefer(meetingKindLeaveOrgConfigGrid, 10);
				}
			}
			else{
				if(meetingKindTaskConfigGrid==null){
					initMeetingKindTaskConfigGrid();
				}
				else{
					meetingKindTaskConfigGrid._onResize.ligerDefer(meetingKindTaskConfigGrid, 10);
				}
			}
		}
	});
}

function initMeetingKindParticipantGrid(){
	//调整为使用sys_common_handler表
	var toolbarKindParticipantOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			if (!checkMettingKind()) return;
			showChooseOrgDialog(function(data){
				var addRows=[];
				$.each(data,function(i,o){
					var row=$.extend({},o,{orgUnitId:o['id'],orgUnitName:o['name'],kindId:'meeting',bizId:meetingKindTmpId});
					addRows.push(row);
				});
				meetingKindParticipantGrid.addRows(addRows);
			});
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'meetingKindAction!deleteKindParticipant.ajax',
				gridManager:meetingKindParticipantGrid,idFieldName:'commonHandlerId',
				onSuccess:function(){
					meetingKindParticipantGrid.loadData();
				}
			});
		}
	});
	meetingKindParticipantGrid = UICtrl.grid('#meetingKindParticipantGrid', {
		columns: [   
			{ display: "对象名称", name: "orgUnitName", width: 260, minWidth: 120, type: "string", align: "left"},	   	   
			{ display: "种类", name: "orgKindId", width: 120, minWidth: 80, type: "string", align: "left",
				render: function (item) {
	                   return OpmUtil.getOrgKindDisplay(item.orgKindId);
	             }}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingKindAction!slicedQueryKindParticipant.ajax',
		parms:{bizId:getMeetingKindId(),kindId:'meeting'},
		width : "99.5%",
		height : 200,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'orgKindId',
		sortOrder:'asc',
		toolbar: toolbarKindParticipantOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		enabledEdit: true,
		usePager: false,
		onLoadData :function(){
   			return (getMeetingKindId()!='');
   		}
	});
}

function initMeetingKindTaskConfigGrid(){
	var toolbarTaskConfigOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			if (!checkMettingKind()) return;
            UICtrl.addGridRow(meetingKindTaskConfigGrid,
                { sequence: meetingKindTaskConfigGrid.getData().length + 1});
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'meetingKindAction!deleteTaskConfig.ajax',
				gridManager:meetingKindTaskConfigGrid,idFieldName:'meetingKindTaskConfigId',
				onSuccess:function(){
					meetingKindTaskConfigGrid.loadData();
				}
			});
		}
	});
	meetingKindTaskConfigGrid = UICtrl.grid('#meetingKindTaskConfigGrid', {
		columns: [     	   	
			{ display: "名称", name: "name", width: 460, minWidth: 180, type: "string", align: "left",
				editor: { type: 'text',required:true}},		
			{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left"	,
				editor: { type: 'spinner',mask:"nnn",required:true}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingKindAction!slicedQueryKindTaskConfig.ajax',
		parms:{meetingKindId:getMeetingKindId()},
		width : "99.5%",
		height : 200,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarTaskConfigOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		enabledEdit: true,
		usePager: false,
		onLoadData :function(){
   			return (getMeetingKindId()!='');
   		}
	});
}

function initMeetingKindLeaveOrgConfigGrid(){
	var toolbarKindLeaveOrgOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			if (!checkMettingKind()) return;
			showChooseOrgDialog(function(data){
				var addRows=[];
				$.each(data,function(i,o){
					var row=$.extend({},o,{orgUnitId:o['id'],orgUnitName:o['name'],kindId:'meetingLeave',bizId:meetingKindTmpId});
					addRows.push(row);
				});
				meetingKindLeaveOrgConfigGrid.addRows(addRows);
			});
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'meetingKindAction!deleteKindLeaveOrg.ajax',
				gridManager:meetingKindLeaveOrgConfigGrid,idFieldName:'commonHandlerId',
				onSuccess:function(){
					meetingKindLeaveOrgConfigGrid.loadData();
				}
			});
		}
	});
	meetingKindLeaveOrgConfigGrid = UICtrl.grid('#meetingKindLeaveOrgConfigGrid', {
		columns: [   
			{ display: "对象名称", name: "orgUnitName", width: 260, minWidth: 120, type: "string", align: "left"},	   	   
			{ display: "种类", name: "orgKindId", width: 120, minWidth: 80, type: "string", align: "left",
				render: function (item) {
	                   return OpmUtil.getOrgKindDisplay(item.orgKindId);
	             }}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingKindAction!slicedQueryKindLeaveOrg.ajax',
		parms:{bizId:getMeetingKindId(),kindId:'meetingLeave'},
		width : "99.5%",
		height : 200,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'orgKindId',
		sortOrder:'asc',
		toolbar: toolbarKindLeaveOrgOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		enabledEdit: true,
		usePager: false,
		onLoadData :function(){
   			return (getMeetingKindId()!='');
   		}
	});
}

function getMeetingKindId(){
	return $('#meetingKindId').val();
}

function checkMettingKind() {
    var meetingKindId = $('#meetingKindId').val();
    if(meetingKindId==""){
		Public.tip("请先保存会议类型");
		return false;
	}
    return true;
}

//新增保存
function insert() {
	if(meetingKindTmpId == ''){
		$('#submitForm').ajaxSubmit({url: web_app.name + '/meetingKindAction!insert.ajax',
			success : function(id) {
				meetingKindTmpId = id;
				$('#meetingKindId').val(id);
				//设置grid参数，loadData
				meetingMessageConfigGrid.options.parms['meetingKindId'] =id;
				meetingMessageConfigGrid.loadData();
				if(meetingKindParticipantGrid!=null){
					meetingKindParticipantGrid.options.parms['bizId'] =id;
					meetingKindParticipantGrid.options.parms['meetingKindId'] =id;
					meetingKindParticipantGrid.loadData();
				}
				if(meetingKindTaskConfigGrid!=null){
					meetingKindTaskConfigGrid.options.parms['meetingKindId'] =id;
					meetingKindTaskConfigGrid.loadData();
				}
				if(meetingKindLeaveOrgConfigGrid!=null){
					meetingKindLeaveOrgConfigGrid.options.parms['meetingKindId'] =id;
					meetingKindLeaveOrgConfigGrid.loadData();
				}
				refreshFlag = true;
			}
		});
	}
	else{
		update();
	}
}

//编辑保存
function update(){
	var param = {};
	//细项保存
	var detailMessageData=DataUtil.getGridData({gridManager:meetingMessageConfigGrid});
	if(!detailMessageData){
		if(!detailMessageData) {
			$('#messageConfig').trigger('click');
			return false;
		}
	}
	param.detailMessageData = $.toJSON(detailMessageData);
	if(meetingKindParticipantGrid!=null){
		var detailParticipantData=DataUtil.getGridData({gridManager:meetingKindParticipantGrid});
		if(!detailParticipantData){
			if(!detailParticipantData) {
				$('#participant').trigger('click');
				return false;
			}
		}
		//校验id不能重复
		if(!checkUnique(meetingKindParticipantGrid.rows,'orgUnitId')){
			Public.tip("存在重复对象，请修改");
			return false;
		}
		param.detailParticipantData = $.toJSON(detailParticipantData);
	}
	if(meetingKindTaskConfigGrid!=null){
		var detailTaskData=DataUtil.getGridData({gridManager:meetingKindTaskConfigGrid});
		if(!detailTaskData){
			if(!detailTaskData) {
				$('#taskConfig').trigger('click');
				return false;
			}
		}
		param.detailTaskData = $.toJSON(detailTaskData);
	}
	if(meetingKindLeaveOrgConfigGrid!=null){
		var detailLeaveOrgData=DataUtil.getGridData({gridManager:meetingKindLeaveOrgConfigGrid});
		if(!detailLeaveOrgData){
			if(!detailLeaveOrgData) {
				$('#leaveOrgConfig').trigger('click');
				return false;
			}
		}
		//校验id不能重复
		if(!checkUnique(meetingKindLeaveOrgConfigGrid.rows,'orgUnitId')){
			Public.tip("存在重复对象，请修改");
			return false;
		}
		param.detailLeaveOrgData = $.toJSON(detailLeaveOrgData);
	}
	$('#submitForm').ajaxSubmit({url: web_app.name + '/meetingKindAction!update.ajax',
		param:param,
		success : function() {
			//刷新grid
			meetingMessageConfigGrid.loadData();
			if(meetingKindParticipantGrid!=null){
				meetingKindParticipantGrid.loadData();
			}
			if(meetingKindTaskConfigGrid!=null){
				meetingKindTaskConfigGrid.loadData();
			}
			if(meetingKindLeaveOrgConfigGrid!=null){
				meetingKindLeaveOrgConfigGrid.loadData();
			}
			refreshFlag = true;
		}
	});
}

function checkUnique(rows,obj){
	for(var i=0;i<rows.length;i++){
		var tmpObj = rows[i][obj];
		if(tmpObj!=""){
			for(var j=i+1;j<rows.length;j++){
				if(tmpObj==rows[j][obj]){
					return false;
				}
			}
		}
	}
	return true;
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "meetingKindAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'meetingKindId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'meetingKindAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'meetingKindId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'meetingKindAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'meetingKindId', param:{status:0},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

//打开机构选择对话框
function showChooseOrgDialog(fn){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='ogn,dpt,pos,psm,system';
	var options = { params: selectOrgParams,title : "选择组织",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			if($.isFunction(fn)){
				fn.call(window,data);
			}
			this.close();
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}