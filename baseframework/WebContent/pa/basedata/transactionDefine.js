var gridManager, refreshFlag = false, nodeKindId, transactionDefineId = 0, lastSelectedId = 0, parentId = -1, operateCfg = {};

$(function() {
	initializeOperateCfg();
	bindEvents();
	loadTree();
	initializeUI();
	initializeGrid();

	/**
	 * 寝始化参数配置
	 */
	function initializeOperateCfg() {
		var actionPath = web_app.name + "/transactionDefineAction!";
		operateCfg.queryAction = actionPath
				+ 'slicedQueryTransactionDefine.ajax';
		operateCfg.showInsertAction = actionPath
				+ "showInsertTransactionDefinePage.load";
		operateCfg.showUpdateAction = actionPath
				+ 'showUpdateTransactionDefinePage.load';
		operateCfg.showMoveAction = actionPath
				+ "showMoveTransactionDefinePage.do";

		operateCfg.insertAction = actionPath + 'insertTransactionDefine.ajax';
		operateCfg.updateAction = actionPath + 'updateTransactionDefine.ajax';
		operateCfg.deleteAction = actionPath + 'deleteTransactionDefine.ajax';
		operateCfg.queryAll = actionPath + "queryAllTransactionDefine.ajax";
		operateCfg.updateSequenceAction = actionPath
				+ "updateTransactionDefineSequence.ajax";
		operateCfg.moveAction = actionPath + "moveTransactionDefine.ajax";

		operateCfg.showInsertTitle = "添加事务定义";
		operateCfg.showUpdateTitle = "修改事务定义";
		operateCfg.showMoveTitle = "移动事务对话框";
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
			deleteHandler : deleteTransactionDefine,
			saveSortIDHandler : updateTransactionDefineSequence,
			moveHandler : moveTransactionDefine
		};
		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

		gridManager = UICtrl.grid("#maingrid", {
					columns : [{
								display : '名称',
								name : 'name',
								width : 320,
								minWidth : 60,
								type : "string",
								align : "left"
							}, {
								display : '时限(天)',
								name : 'timeLimit',
								width : 80,
								minWidth : 60,
								type : "string",
								align : "right"
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
											+ item.transactionDefineId
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
						doShowUpdateDialog(data.transactionDefineId);
					}
				});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function getId() {
	return parseInt($("#transactionDefineId").val() || 0);
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
					nodeKindId : ENodeKind.Data,
					timeLimit : 0
				},
				width : 400,
				ok : doSaveTransactionDefine,
				close : reloadGrid
			});
}

function doShowUpdateDialog(transactionDefineId) {
	UICtrl.showAjaxDialog({
				url : operateCfg.showUpdateAction,
				param : {
					id : transactionDefineId
				},
				title : operateCfg.showUpdateTitle,
				width : 400,
				ok : doSaveTransactionDefine,
				close : reloadGrid
			});
}

function showUpdateDialog() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}
	doShowUpdateDialog(row.transactionDefineId);
}

function doSaveTransactionDefine() {
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

function deleteTransactionDefine() {
	var action = operateCfg.deleteAction;
	DataUtil.del({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : "transactionDefineId"
			});
}

function updateTransactionDefineSequence() {
	var action = operateCfg.updateSequenceAction;
	DataUtil.updateSequence({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : 'transactionDefineId',
				seqFieldName : 'sequence'
			});
}

function moveTransactionDefine() {
	var rows = gridManager.getSelecteds();
	if (!rows || rows.length < 1) {
		Public.tip('请选择要移动的数据!');
		return;
	}

	UICtrl.showFrameDialog({
				url : operateCfg.showMoveAction,
				title : operateCfg.showMoveTitle,
				param : {
					item : EBaseDataItem.TransactionDefine
				},
				width : 350,
				height : 400,
				ok : doMoveTransactionDefine,
				close : onDialogCloseHandler
			});
}

function doMoveTransactionDefine() {
	var data = this.iframe.contentWindow.getSelectedTreeNodeData();
	if (!data) {
		return;
	}
	var ids = DataUtil.getSelectedIds({
				gridManager : gridManager,
				idFieldName : "transactionDefineId"
			});

	if (!ids) {
		return;
	}

	var _self = this;
	var params = {};
	params.parentId = data.transactionDefineId;
	params.ids = $.toJSON(ids);
	Public.ajax(operateCfg.moveAction, params, function() {
				refreshFlag = true;
				_self.close();

				reloadGrid();
			});
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
				idFieldName : 'transactionDefineId',
				title : '事务定义分类',
				onClick : function(node) {
					if (!node || !node.data)
						return;
					parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
					gridManager.options.parms.fullId = node.data.fullId;

					if (node.data.nodeId == 0) {
						$('.l-layout-center .l-layout-header').html("事务定义列表");
					} else {
						$('.l-layout-center .l-layout-header')
								.html(	"<font style=\"color:Tomato;font-size:13px;\">["
												+ node.data.name
												+ "]</font>事务定义列表");
					}
					reloadGrid2();
				},
				onFormInit : function() {
					$('#timeLimit').parent().parent().parent().hide();
					$('#timeLimit').val(0);
				}
			});
}