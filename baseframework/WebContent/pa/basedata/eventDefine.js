var treeManager, gridManager, folderTreeMenu, refreshFlag = false, nodeKindId, eventDefineId = 0, lastSelectedId = 0, parentId = -1, operateCfg = {};

$(function() {
	initializeOperateCfg();
	bindEvents();
	loadTree();
	initializeUI();
	initializeGrid();

	function initializeOperateCfg() {
		var actionPath = web_app.name + "/eventDefineAction!";
		operateCfg.queryAction = actionPath + 'slicedQueryEventDefine.ajax';
		operateCfg.showInsertAction = actionPath
				+ "showInsertEventDefinePage.load";
		operateCfg.showUpdateAction = actionPath
				+ 'showUpdateEventDefinePage.load';
		operateCfg.showMoveAction = actionPath + "showMoveEventDefinePage.do";

		operateCfg.insertAction = actionPath + 'insertEventDefine.ajax';
		operateCfg.updateAction = actionPath + 'updateEventDefine.ajax';
		operateCfg.deleteAction = actionPath + 'deleteEventDefine.ajax';
		operateCfg.queryAll = actionPath + "queryAllEventDefine.ajax";
		operateCfg.updateSequenceAction = actionPath
				+ "updateEventDefineSequence.ajax";
		operateCfg.moveAction = actionPath + "moveEventDefine.ajax";

		operateCfg.showInsertTitle = "添加事件定义";
		operateCfg.showUpdateTitle = "修改事件定义";
		operateCfg.showMoveTitle = "移动事件对话框";
	}

	function initializeUI() {
		UICtrl.initDefaulLayout();
	}

	function bindEvents() {
		$("#btnQuery").click(function() {
					var params = $(this.form).formToJSON();
					UICtrl.gridSearch(gridManager, params);
				});
	}

	function initializeGrid() {
		UICtrl.autoSetWrapperDivHeight();
		var toolbarparam = {
			addHandler : showInsertDialog,
			updateHandler : showUpdateDialog,
			deleteHandler : deleteEventDefine,
			saveSortIDHandler : updateEventDefineSequence,
			moveHandler : moveEventDefine
		};
		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

		gridManager = UICtrl.grid("#maingrid", {
					columns : [{
								display : '编码',
								name : 'code',
								width : 150,
								minWidth : 60,
								type : "string",
								align : "left"
							}, {
								display : '名称',
								name : 'name',
								width : 150,
								minWidth : 60,
								type : "string",
								align : "left"
							}, {
								display : '描述',
								name : 'description',
								width : 150,
								minWidth : 60,
								type : "string",
								align : "left"
							}, {
								display : "排序号",
								name : "sequence",
								width : 60,
								minWidth : 60,
								type : "int",
								align : "left",
								render : function(item) {
									return "<input type='text' id='txtSequence_"
											+ item.eventDefineId
											+ "' class='textbox' value='"
											+ item.sequence + "' />";
								}
							}],
					dataAction : 'server',
					url : operateCfg.queryAction,
					parms : {
						parentId : -1,
						nodeKindId : ENodeKind.Data
					},
					rownumbers : true,
					usePager : true,
					sortName : "sequence",
					SortOrder : "asc",
					toolbar : toolbarOptions,
					width : '100%',
					height : '100%',
					heightDiff : -10,
					headerRowHeight : 25,
					rowHeight : 25,
					checkbox : true,
					fixedCellHeight : true,
					selectRowButtonOnly : true,
					onDblClickRow : function(data, rowindex, rowobj) {
						doShowUpdateDialog(data.eventDefineId);
					}
				});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function getId() {
	return parseInt($("#eventDefineId").val() || 0);
}

function showInsertDialog() {
	if (parentId <= 0) {
		Public.tip("请选择分类！");
		return;
	}
	UICtrl.showAjaxDialog({
				url : operateCfg.showInsertAction,
				title : operateCfg.showInsertTitle,
				param : {
					parentId : parentId,
					nodeKindId : ENodeKind.Data
				},
				width : 400,
				ok : doSaveEventDefine,
				close : reloadGrid
			});
}

function doShowUpdateDialog(eventDefineId) {
	UICtrl.showAjaxDialog({
				url : operateCfg.showUpdateAction,
				param : {
					id : eventDefineId
				},
				title : operateCfg.showUpdateTitle,
				width : 400,
				ok : doSaveEventDefine,
				close : reloadGrid
			});
}

function showUpdateDialog() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}
	doShowUpdateDialog(row.eventDefineId);
}

function doSaveEventDefine() {
	var _self = this;
	var id = getId();
	$('#submitForm').ajaxSubmit({
				url : (id ? operateCfg.updateAction : operateCfg.insertAction),
				success : function() {
					refreshFlag = true;
					_self.close();
				}
			});
}

function deleteEventDefine() {
	var action = operateCfg.deleteAction;
	DataUtil.del({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : "eventDefineId"
			});
}

function updateEventDefineSequence() {
	var action = operateCfg.updateSequenceAction;
	DataUtil.updateSequence({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : 'eventDefineId',
				seqFieldName : 'sequence'
			});
}

function moveEventDefine() {
	var rows = gridManager.getSelecteds();
	if (!rows || rows.length < 1) {
		Public.tip('请选择要移动的数据!');
		return;
	}

	UICtrl.showFrameDialog({
				url : operateCfg.showMoveAction,
				param : {
					item : EBaseDataItem.EventDefine
				},
				title : operateCfg.showMoveTitle,
				width : 350,
				height : 400,
				ok : doMoveEventDefine,
				close : onDialogCloseHandler
			});
}

function doMoveEventDefine() {
	var fn = this.iframe.contentWindow.getSelectedTreeNodeData;
	var data = fn();
	if (!data) {
		return;
	}
	var ids = DataUtil.getSelectedIds({
				gridManager : gridManager,
				idFieldName : "eventDefineId"
			});

	if (!ids)
		return;

	var _self = this;
	var params = {};
	params.parentId = data.eventDefineId;
	params.ids = $.toJSON(ids);
	Public.ajax(operateCfg.moveAction, params, function() {
				refreshFlag = true;
				_self.close();
			});
	reloadGrid();
}

function onDialogCloseHandler() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}

function reloadGrid() {
	reloadGrid2();
}

function reloadGrid2() {
	var params = $("#queryMainForm").formToJSON();
	UICtrl.gridSearch(gridManager, params);
}

function loadTree() {
	PACommonTree.createTree({
				loadAction : operateCfg.queryAll,
				showAddAction : operateCfg.showInsertAction,
				showUpdateAction : operateCfg.showUpdateAction,
				deleteAction : operateCfg.deleteAction,
				updateAction : operateCfg.updateAction,
				insertAction : operateCfg.insertAction,
				updateSequenceAction : operateCfg.updateSequenceAction,
				treeId : "#maintree",
				parentId : parentId,
				idFieldName : 'eventDefineId',
				title : '事件定义分类',
				onClick : function(node) {
					if (!node || !node.data)
						return;
					parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
					gridManager.options.parms.fullId = node.data.fullId;

					if (node.data.nodeId == 0) {
						$('.l-layout-center .l-layout-header').html("事务定义列表");
					} else {
						$('.l-layout-center .l-layout-header')
								.html("<font style=\"color:Tomato;font-size:13px;\">["
										+ node.data.name + "]</font>事务定义列表");
					}
					reloadGrid2();
				},
				onFormInit : function() {
					$('#url').parent().parent().hide();
					$('#kindId1').parent().parent().hide();
				}
			});
}