var gridManager, refreshFlag = false, operateCfg = {}, projectId, projectNodeId, source, canOperate = true, bizId = 0;

$(function() {
	initializeOperateCfg();
	getQueryParameters();
	bindEvents();
	initializeGrid();

	function initializeOperateCfg() {
		var actionPath = web_app.name + "/transactionHandleAction!";
		operateCfg.queryAction = actionPath
				+ "slicedQueryTransactionHandle.ajax";
		operateCfg.insertAction = actionPath + "insertTransactionHandle.ajax";
		operateCfg.deleteAction = actionPath + "deleteTransactionHandle.ajax";
		operateCfg.showUpdateAction = actionPath
				+ "showUpdateTransactionHandleDialog.ajax";
		operateCfg.showInsertDialog = actionPath
				+ "showInsertTransactionHandleDialog.load";
		operateCfg.updateAction = actionPath + "updateTransactionHandle.ajax";
		operateCfg.updateSequenceAction = actionPath
				+ "updateTransactionHandleSequence.ajax";
		operateCfg.loadProjectAction = web_app.name
				+ "/projectMainAction!loadProject.ajax"; 
		operateCfg.updateTransactionHandleStatus = actionPath
				+ "updateTransactionHandleStatus.ajax";

		operateCfg.showCommentDialog = web_app.name
				+ "/transactionCommentAction.do";
		operateCfg.showInsertCommentDialog = web_app.name
				+ "/transactionCommentAction!showTransactionCommentDetailDialog.ajax";
		operateCfg.insertCommentAction = web_app.name
				+ "/transactionCommentAction!insertTransactionComment.ajax";

		operateCfg.showInsertTitle = "随手记";
		operateCfg.showUpdateTitle = "处理事务";
		operateCfg.showCommentTitle = "评论";
		operateCfg.showInsertCommentTitle = "查看评论";
	}

	function getQueryParameters() {
		projectId = Public.getQueryStringByName("projectId") || 0;
		projectNodeId = Public.getQueryStringByName("projectNodeId") || 0;
		bizId = Public.getQueryStringByName("bizId") || 0;
		source = Public.getQueryStringByName("source") || 'execute';

		if (source != 'execute')
			canOperate = false;

		if (bizId > 0) {
			projectNodeId = bizId;
		}
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
			deleteHandler : deleteProjectTransactionHandle,
			saveSortIDHandler : updateProjectTransactionHandleSequence
		};

		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);
		toolbarOptions.items[toolbarOptions.items.length] = {
			id : 'StartProject',
			text : '启动',
			img : web_app.name + '/themes/default/images/icons/note.gif',
			click : function() {
				updateTransactionHandleStatus(
						ETransactionHandleStatus.Untreated,
						ETransactionHandleStatus.Treatment);
			}
		};
		toolbarOptions.items[toolbarOptions.items.length] = {
			id : 'endProject',
			text : '办结',
			img : web_app.name + '/themes/default/images/icons/note.gif',
			click : function() {
				updateTransactionHandleStatus(
						ETransactionHandleStatus.Treatment,
						ETransactionHandleStatus.Processed);
			}
		};
		toolbarOptions.items[0].text = operateCfg.showInsertTitle;

		gridManager = UICtrl.grid("#maingrid", {
			columns : [{
						display : "事务名称",
						name : "name",
						width : 100,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "办理时限(天)",
						name : "timeLimit",
						width : 80,
						minWidth : 60,
						type : "string",
						align : "right",
						isAutoWidth : 0
					}, {
						display : "内容",
						name : "content",
						width : 150,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "状态",
						name : "statusName",
						statusName : "status",
						width : 60,
						minWidth : 60,
						type : "string",
						align : "center"
					}, {
						display : "启动经办人",
						name : "startCreatorName",
						width : 100,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "启动经办时间",
						name : "startCreationTime",
						width : 100,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "完结经办人",
						name : "endCreatorName",
						width : 100,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "完结经办时间",
						name : "endCreationTime",
						width : 100,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "排序号",
						name : "sequence",
						width : 60,
						minWidth : 60,
						type : "string",
						align : "left",
						render : function(item) {
							return "<input type='text' id='txtSequence_"
									+ item.transactionHandleId
									+ "' class='textbox' value='"
									+ item.sequence + "' />";
						}
					}, {
						display : "操作",
						name : "sequence",
						width : 120,
						minWidth : 120,
						type : "string",
						align : "center",
						render : function(item) {
							return "<a href='javascript:void(null);' onclick='showInsertComment("
									+ item.transactionHandleId
									+ ")'>评论</a>"
									+ "&nbsp;&nbsp;"
									+ "<a href='javascript:void(null);' onclick='showComment("
									+ item.transactionHandleId + ")'>查看评论</a>";
						}
					}

			],
			dataAction : 'server',
			url : operateCfg.queryAction,
			parms : {
				projectId : projectId,
				projectNodeId : projectNodeId
			},
			title : PAUtil.loadProjectNavTitle(projectNodeId, '事务列表'),
			rownumbers : true,
			usePager : true,
			sortName : "sequence",
			SortOrder : "asc",
			toolbar : toolbarOptions,
			width : '100%',
			height : '100%',
			heightDiff : -9,
			headerRowHeight : 25,
			rowHeight : 25,
			checkbox : true,
			fixedCellHeight : true,
			selectRowButtonOnly : true,
			onDblClickRow : function(data, rowindex, rowobj) {
				doShowUpdateDialog(data.transactionHandleId);
			}
		});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function updateProjectTransactionHandleSequence() {
	var action = operateCfg.updateSequenceAction;
	DataUtil.updateSequence({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : 'transactionHandleId',
				seqFieldName : 'sequence'
			});
}

function showInsertDialog() {
	UICtrl.showAjaxDialog({
				url : operateCfg.showInsertDialog,
				title : operateCfg.showInsertTitle,
				param : {
					projectId : projectId,
					projectNodeId : projectNodeId,
					transactionDefineId : 0,
					timeLimit : 0
				},
				width : 400,
				ok : doProjectTransactionHandle,
				close : reloadGrid
			});			
}

function doProjectTransactionHandle() {
	$("#source").val(source);
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

function getId() {
	return parseInt($("#transactionHandleId").val() || 0);
}

function showUpdateDialog() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}
	doShowUpdateDialog(row.transactionHandleId);
}

function deleteProjectTransactionHandle() {
	var rows = gridManager.getSelectedRows();
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].status != ETransactionHandleStatus.Untreated) {
			Public.tip("[" + rows[i].name + "]" + "状态为" + rows[i].statusName
					+ "不能删除");
			return;
		}
	}

	var action = operateCfg.deleteAction;
	DataUtil.del({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : "transactionHandleId"
			});
}
/**
 * oldStatus 用于判断用于判断的状态类型
 */
function updateTransactionHandleStatus(oldStatus, newStatus) {
	if (!canOperate) {
		PAUtil.tipExecuteNodeError();
		return;
	}

	var params = {}, ids = [];
	ids = DataUtil.getSelectedIds({
				gridManager : gridManager,
				idFieldName : 'transactionHandleId'
			});
	var rows = gridManager.getSelectedRows();
	if (!rows.length) {
		Public.tip("请选择数据！");
		return;
	}

	for (var i = 0; i < rows.length; i++) {
		if (rows[i].status != oldStatus) {
			Public.tip("[" + rows[i].name + "]" + "状态[" + rows[i].statusName
					+ "]不正确");
			return;
		}
		ids[ids.length] = rows[i].transactionHandleId;
	}

	params.status = newStatus;
	params.ids = $.toJSON(ids);

	Public.ajax(operateCfg.updateTransactionHandleStatus, params, function() {
				reloadGrid();
			});
}

function doShowUpdateDialog(transactionHandleId) {
	if (!canOperate) {
		PAUtil.tipExecuteNodeError();
		return;
	}

	UICtrl.showAjaxDialog({
				url : operateCfg.showUpdateAction,
				param : {
					id : transactionHandleId
				},
				title : operateCfg.showUpdateTitle,
				width : 400,
				ok : doProjectTransactionHandle,
				close : reloadGrid
			});
}

function showInsertComment(transactionHandleId) {
	if (!canOperate) {
		PAUtil.tipExecuteNodeError();
		return;
	}

	UICtrl.showAjaxDialog({
				url : operateCfg.showInsertCommentDialog,
				title : operateCfg.showCommentTitle,
				param : {
					transactionHandleId : transactionHandleId
				},
				width : 400,
				ok : insertComment
			});
}

function insertComment() {
	var _self = this;
	$('#submitForm').ajaxSubmit({
				url : operateCfg.insertCommentAction,
				success : function() {
					refreshFlag = true;
					_self.close();
				}
			});
}

function showComment(transactionHandleId) {
	UICtrl.showFrameDialog({
				url : operateCfg.showCommentDialog,
				title : operateCfg.showCommentTitle,
				param : {
					transactionHandleId : transactionHandleId
				},
				ok : function() {
					var _self = this;
					_self.close();
				},
				width : 900,
				height : 450
			});
}

function reloadGrid() {
	gridManager.loadData();
}
