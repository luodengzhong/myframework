var gridManager, refreshFlag = false, operateCfg = {}, bizKindId, bizId, executionNodeList, canOperate;

$(function() {
	getQueryParameters();
	initializeOperateCfg();
	bindEvents();
	initializeUI();
	initializeGrid();

	function getQueryParameters() {
		bizKindId = Public.getQueryStringByName("bizKindId") || 0;
		bizId = Public.getQueryStringByName("bizId") || 0;
	}

	function initializeOperateCfg() {
		var actionPath = web_app.name + "/nodeEventAction!";
		operateCfg.queryAction = actionPath + "slicedQueryNodeEvent.ajax";
		operateCfg.insertAction = actionPath + "insertNodeEvent.ajax";
		operateCfg.deleteAction = actionPath + "deleteNodeEvent.ajax";
		operateCfg.updateExecutionNodeAction = actionPath
				+ "updateNodeEventExecutionNode.ajax";
		operateCfg.updateSequenceAction = actionPath
				+ "updateNodeEventSequence.ajax";
		operateCfg.showInsertAction = actionPath + "showInsertNodeEventPage.do";
		operateCfg.showNodeVariableDialogAction = actionPath
				+ "showNodeVariableDialog.do";
		operateCfg.showInsertTitle = "选择事件";
	}

	function initializeUI() {
		UICtrl.initDefaulLayout();
		executionNodeList = $("#executionNodeId").combox("getFormattedData");
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
			deleteHandler : deleteNodeEvent,
			saveSortIDHandler : updateNodeEventSequence
		};
		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

		toolbarOptions.items[toolbarOptions.items.length] = {
			id : 'updateNodeEventExecutionNode',
			text : '保存执行节点',
			img : web_app.name + '/themes/default/images/icons/note.gif',
			click : updateNodeEventExecutionNode
		};
		toolbarOptions.items[toolbarOptions.items.length] = {
			id : "line",
			line : true
		};
		
		if (bizKindId == ENodeBizKind.Project) {
			canOperate = PAUtil.checkProjectOperateRight(bizId, 0, false);
		} else
			canOperate = true;

		gridManager = UICtrl.grid("#maingrid", {
			columns : [{
						display : '编码',
						name : 'eventCode',
						width : 150,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : '事件名称',
						name : 'eventName',
						width : 150,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : 'URL',
						name : 'url',
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
									+ item.nodeEventId
									+ "' class='textbox' value='"
									+ item.sequence + "' />";
						}
					}, {
						display : "执行节点",
						name : "executionNode",
						width : 100,
						minWidth : 100,
						type : "int",
						align : "left",
						render : function(item) {
							var executionNodeControl = "";
							if (executionNodeList != null
									&& executionNodeList.length > 0) {
								executionNodeControl = "<select id='slExecutionNode_"
										+ item.nodeEventId
										+ "' style='width:100%;height:22px; margin-top:1px;'>";
								for (var i = 0; i < executionNodeList.length; i++) {
									var selected = (executionNodeList[i].value == item.executionNode
											? 'selected="true"'
											: '');
									executionNodeControl += '<option value="'
											+ executionNodeList[i].value + '" '
											+ selected + '>'
											+ executionNodeList[i].text
											+ '</option>';
								}
								executionNodeControl += "</select>";
							}
							return executionNodeControl;
						}
					}, {
						display : "操作",
						width : 60,
						minWidth : 60,
						isAllowHide : false,
						render : function(item) {
							return "<a class='GridStyle' href='javascript:void(null);' onclick=\"doShowNodeEventDialog("
									+ item.nodeEventId
									+ ",'"
									+ item.eventName
									+ "')\">事件变量</a>";
						}
					}],
			dataAction : 'server',
			url : operateCfg.queryAction,
			parms : {
				bizKindId : bizKindId,
				bizId : bizId
			},
			rownumbers : true,
			title : getGridManagerTitle(),
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
			selectRowButtonOnly : true
		});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function showInsertDialog() {
	if (!canOperate) {
		PAUtil.tipNoRightOperate();
		return;
	}

	parent.UICtrl.showFrameDialog({
				url : operateCfg.showInsertAction,
				title : operateCfg.showInsertTitle,
				param : {},
				width : PAUtil.dialogWidth,
				height : PAUtil.dialogHeight,
				ok : doSaveNodeEvent,
				close : reloadGrid
			});
}

function doSaveNodeEvent() {
	var data, eventDefineIds = [];
	if (!this.iframe || !this.iframe.contentWindow)
		return;

	data = this.iframe.contentWindow.getSelectedData();
	if (!data)
		return;

	for (var i = 0; i < data.length; i++) {
		if (data[i].eventDefineId)
			eventDefineIds[eventDefineIds.length] = data[i].eventDefineId;
	}

	var params = {
		bizId : bizId,
		bizKindId : bizKindId,
		eventDefineIds : $.toJSON(eventDefineIds)
	};

	var _self = this;
	Public.ajax(operateCfg.insertAction, params, function(data) {
				refreshFlag = true;
				_self.close();
			});
}

function deleteNodeEvent() {
	if (!canOperate) {
		PAUtil.tipNoRightOperate();
		return;
	}

	var action = operateCfg.deleteAction;
	DataUtil.del({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : "nodeEventId"
			});
}

function updateNodeEventSequence() {
	if (!canOperate) {
		PAUtil.tipNoRightOperate();
		return;
	}

	var action = operateCfg.updateSequenceAction;
	DataUtil.updateSequence({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : 'nodeEventId',
				seqFieldName : 'sequence'
			});
}

function updateNodeEventExecutionNode() {
	var data = gridManager.getData();
	if (!data || data.length < 1) {
		Public.tip("没有数据，无法保存!");
		return;
	}
	var updateRowCount = 0;
	var idFieldName = "nodeEventId";
	var fieldName = "executionNode";
	var params = new Map();
	for (var i = 0; i < data.length; i++) {
		var slExecutionNode = "#slExecutionNode_" + data[i][idFieldName];
		var executionNodeValue = $.trim($(slExecutionNode).val());
		if (executionNodeValue == "") {
			Public.tip("请输入执行节点.");
			$(slExecutionNode).focus();
			return;
		}
		if (data[i][fieldName] != executionNodeValue) {
			params.put(data[i][idFieldName], executionNodeValue);
			updateRowCount++;
		}
	}

	if (updateRowCount == 0) {
		Public.tip("没有数据修改!");
		return;
	}
	Public.ajax(operateCfg.updateExecutionNodeAction, {
				data : params.toString()
			}, function(data) {
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
	var params = $("#queryMainForm").formToJSON();
	UICtrl.gridSearch(gridManager, params);
}

function doShowNodeEventDialog(nodeEventId, name) {
	var variableBizKindId = 0;

	if (!canOperate) {
		PAUtil.tipNoRightOperate();
		return;
	}

	if (bizKindId == ENodeBizKind.Project) {
		variableBizKindId = ENodeBizKind.ProjectEvent;
	} else if (bizKindId == ENodeBizKind.ProjectNode) {
		variableBizKindId = ENodeBizKind.ProjectNodeEvent;
	} else if (bizKindId == ENodeBizKind.ProjectTemplateNode) {
		variableBizKindId = ENodeBizKind.ProjectTemplateNodeEvent;
	}else{
        variableBizKindId = bizKindId;
    }

	if (variableBizKindId == 0) {
		Public.tip("未知分类[" + bizKindId + "]");
		return;
	}

	top.addTabItem({
				tabid : 'eventVariable' + nodeEventId,
				text : "事件[" + name + "]变量管理",
				url : operateCfg.showNodeVariableDialogAction + '?bizId='
						+ nodeEventId + '&bizKindId=' + variableBizKindId
			});
}

function getGridManagerTitle(){
    var gridManagerTitle = "事件列表";
    if (bizKindId == ENodeBizKind.Project) {
        gridManagerTitle = "项目" + gridManagerTitle;
    } else if (bizKindId == ENodeBizKind.ProjectNode) {
        gridManagerTitle = "节点" + gridManagerTitle;
    } else if (bizKindId == ENodeBizKind.ProjectTemplateNode) {
        gridManagerTitle = "项目分类节点" + gridManagerTitle;
    }else{
        gridManagerTitle = "变量" + gridManagerTitle;
    }
    return gridManagerTitle;
}