var gridManager = null, refreshFlag = false;
var userGroupDetailGridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.initDefaulLayout();
	$('#maintree').commonTree({
		kindId : CommonTreeKind.UserGroupKind,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.UserGroupKind){
		parentId="";
		html.push('分组列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>分组列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{folderId:parentId});
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
		saveSortIDHandler: saveSortIDHandler,
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "分组编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   	   	   
		{ display: "分组名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "备注", name: "remark", width: 250, minWidth: 60, type: "string", align: "left" },	
		{ display: "执行函数", name: "funName", width: 250, minWidth: 60, type: "string", align: "left" },	   
		{ display: "序号", name: "sequence", width: 80, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.sequenceRender(item,'groupId');
			}
		},		   
		{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/oaSetupAction!slicedQueryUserGroup.ajax',
		parms:{groupKind:'system'},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.groupId);
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
function addHandler() {
	var parentId=$('#treeParentId').val();
	if(parentId==''){
		Public.tip('请选择类别树！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		title:'新增分组',
		url: web_app.name + '/oaSetupAction!showInsertUserGroup.load',
		width:650,
		init:initDetailPage,
		ok: save,
		close: dialogClose
	});
}

//编辑按钮
function updateHandler(groupId){
	if(!groupId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		groupId=row.groupId;
	}
	UICtrl.showAjaxDialog({
		title:'编辑分组',
		url: web_app.name + '/oaSetupAction!showUpdateUserGroup.load', 
		param:{groupId:groupId},
		width:650,
		init:initDetailPage,
		ok: save,
		close: dialogClose
	});
}

function initDetailPage(){
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addUserGroupDetail, 
		deleteHandler: deleteUserGroupDetail
	});
	userGroupDetailGridManager = UICtrl.grid('#userGroupDetailGrid', {
		columns: [
		{ display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },		   	   	   
		{ display: "路径", name: "fullName", width: 300, minWidth: 60, type: "string", align: "left" },			   
		{ display: "类别", name: "orgKindId", width: 60, minWidth: 60, type: "string", align: "left",
			 render: function (item) {
                   return OpmUtil.getOrgKindDisplay(item.orgKindId);
             }
		},
		{ display: "状态", name: "statusTextView", width: 60, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/oaSetupAction!slicedQueryUserGroupDetail.ajax',
		parms:{groupId:$('#detailGroupId').val()},
		pageSize : 20,
		width : '99%',
		height : '100%',
		heightDiff : -60,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fullSequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true,
		onLoadData :function(){
			return !($('#detailGroupId').val()=='');
		}
	});
}

//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({action:'oaSetupAction!deleteUserGroup.ajax',
		gridManager:gridManager,idFieldName:'groupId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//保存
function save() {
	var param={};
	if($('#detailGroupId').val()==''){
		param['folderId']=$('#treeParentId').val();
	}
	var detailData = DataUtil.getGridData({gridManager: userGroupDetailGridManager});
	if(!detailData){
		return false;
	}
	param['detailData']=encodeURI($.toJSON(detailData))
	$('#submitForm').ajaxSubmit({url: web_app.name + '/oaSetupAction!saveUserGroup.ajax',
		param:param,
		success : function(data) {
			if($('#detailGroupId').val()==''){
				$('#detailGroupId').val(data);
				UICtrl.gridSearch(userGroupDetailGridManager, {groupId:$('#detailGroupId').val()});
			}else{
				userGroupDetailGridManager.loadData();
			}
			refreshFlag = true;
		}
	});
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
	var action = "oaSetupAction!updateUserGroupSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'groupId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'oaSetupAction!updateUserGroupStatus.ajax',
		gridManager: gridManager,idFieldName:'groupId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'oaSetupAction!updateUserGroupStatus.ajax',
		gridManager: gridManager,idFieldName:'groupId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动类别',kindId:CommonTreeKind.UserGroupKind,
		save:function(parentId){
			DataUtil.updateById({action:'oaSetupAction!updateUserGroupFolderId.ajax',
				gridManager:gridManager,idFieldName:'groupId',param:{folderId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}

function addUserGroupDetail(){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='dpt,pos,psm';
	var options = { params: selectOrgParams,title : "选择组织",
		parent:window['ajaxDialog'],
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			var addRows=[];
			$.each(data,function(i,o){
				var row=$.extend({},o,{orgId:o['id']});
				addRows.push(row);
			});
			userGroupDetailGridManager.addRows(addRows);
			this.close();
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

function deleteUserGroupDetail(){
	DataUtil.delSelectedRows({action:'oaSetupAction!deleteUserGroupDetail.ajax',
		gridManager:userGroupDetailGridManager,idFieldName:'groupDetailId',
		onSuccess:function(){
			userGroupDetailGridManager.loadData();
		}
	});
}