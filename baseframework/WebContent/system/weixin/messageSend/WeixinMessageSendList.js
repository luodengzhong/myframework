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
		html.push('信息发送列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>信息发送列表');
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
		addHandler:function(){
			addHandler();
		},
		updateHandler:function(){
			updateHandler();
		},
		deleteHandler:function(){
			deleteHandler();
		},
		saveCopyNew:{id:'saveCopyNew',text:'复制新增',img:'page_user.gif',click:function(){
			var row = gridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			var weixinMessageSendId=row.weixinMessageSendId;
			saveCopyNew(weixinMessageSendId,function(){
				reloadGrid();
			});
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "单据号码", name: "billCode", width: 130, minWidth: 60, type: "string", align: "left" },
		{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "发送类别", name: "msgTypeTextView", width: 80, minWidth: 60, type: "string", align: "left" },	
		{ display: "标题", name: "title", width: 200, minWidth: 60, type: "string", align: "left" },
		{ display: "已发送", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "发送时间", name: "sendDate", width: 150, minWidth: 60, type: "datetime", align: "left" }	   
		],
		dataAction : 'server',
		url: web_app.name+'/weixinMessageSendAction!slicedQueryWeixinMessageSend.ajax',
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
			updateHandler(data.weixinMessageSendId);
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

function addHandler(){
		UICtrl.showAjaxDialog({
		url: web_app.name + '/weixinMessageSendAction!showInsertWeixinMessageSend.load',
		width:750,
		title:'发送消息',
		init:function(){
			initializeMessageSendUI();
		},
		ok: function(){
			saveMessageSend(function(){refreshFlag=true;});
		},
		close: dialogClose,
		button:[{
			id:'sendWeixinMessage',
			name : '发送消息',
			callback:function(){
				var _self=this;
				sendMessage(function(){
					_self.close();
					reloadGrid();
				});
				return false;
			}
		}]
	});
}

//编辑按钮
function updateHandler(weixinMessageSendId){
	if(!weixinMessageSendId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		weixinMessageSendId=row.weixinMessageSendId;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/weixinMessageSendAction!showUpdateWeixinMessageSend.load', 
		param:{weixinMessageSendId:weixinMessageSendId},
		width:750,
		title:'发送消息',
		init:function(){
			initializeMessageSendUI();
		},
		ok: function(){
			saveMessageSend(function(){refreshFlag=true;});
		},
		close: dialogClose,
		button:[{
			id:'sendWeixinMessage',
			name : '发送消息',
			callback:function(){
				var _self=this;
				sendMessage(function(){
					_self.close();
					reloadGrid();
				});
				return false;
			}
		}]
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var weixinMessageSendId=row.weixinMessageSendId;
	var status=row.status;
	if(status!=0){
		Public.tip('已发送的数据不能删除！'); return;
	}
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/weixinMessageSendAction!deleteWeixinMessageSend.ajax', {weixinMessageSendId:weixinMessageSendId}, function(){
			reloadGrid();
		});
	});
}
