var gridManager, refreshFlag = false, operateCfg = {}, bizKindId, bizId, canOperate, heightDiff = -12, viewSource, parentId = -1, fullId;

$(function() {
	getQueryParameters();
	initializeOperateCfg();
	initializeUI();
	bindEvents();
	initializeGrid();
	loadTree();

	function getQueryParameters() {
		bizKindId = parseInt(Public.getQueryStringByName("bizKindId")) || 0;
		bizId = Public.getQueryStringByName("bizId") || 0;
	}

	function initializeOperateCfg() {
		var actionPath = web_app.name + "/projectVariableAction!";
		operateCfg.queryAction = actionPath + "slicedQueryProjectVariable.ajax";
		operateCfg.insertAction = actionPath + "insertProjectVariable.ajax";
		operateCfg.updateAction = actionPath + "updateProjectVariable.ajax";
		operateCfg.deleteAction = actionPath + "deleteProjectVariable.ajax";
		operateCfg.updateSequenceAction = actionPath
				+ "updateProjectVariableSequence.ajax";
		operateCfg.showInsertAction = actionPath
				+ "showVariableDefineDialog.do";

		operateCfg.nodeEventAction = web_app.name + "/nodeEventAction!";

		operateCfg.queryAllProjectVariableClass = actionPath
				+ "queryAllProjectVariableClass.ajax";
		operateCfg.showInsertProjectVariableClassAction = actionPath
				+ "showInsertProjectVariableClass.load";
		operateCfg.showUpdateProjectVariableClassAction = actionPath
				+ "showUpdateProjectVariableClass.load";
		operateCfg.updateProjectVariableClassAction = actionPath
				+ "updateProjectVariableClass.ajax";
		operateCfg.insertProjectVariableClassAction = actionPath
				+ "insertProjectVariableClass.ajax";

		operateCfg.showMoveAction = actionPath
				+ "showMoveProjectVariableClass.do";
		operateCfg.moveAction = actionPath + "moveProjectVariableClass.ajax";

		operateCfg.showInsertTitle = "选择变量";
		operateCfg.showMoveTitle = "移动" + getTitle() + "对话框";
	}

	function initializeUI() {
		UICtrl.initDefaulLayout();

		$('.l-layout-left .l-layout-header').html(getTitle() + "树");
		$('.l-layout-center .l-layout-header').html(getTitle() + "列表");
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
			addHandler : insertVariable,
			saveHandler : updateProjectVariable,
			deleteHandler : deleteProjectVariable,
			moveHandler : moveProjectVariableClass
		};
		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

		if (bizKindId === ENodeBizKind.Project) {
			canOperate = PAUtil.checkProjectOperateRight(bizId, 0, false);
		} else
			canOperate = true;

		gridManager = UICtrl.grid("#maingrid", {
			columns : [{
						display : '变量名称',
						name : 'variableName',
						width : 150,
						minWidth : 60,
						type : "string",
						align : "left",
						editor : {
							type : 'select',
							beforeChange : function(item, editParm) {
								var data = editParm.record;
								data['variableValue'] = "";
								data['variableText'] = "";
								gridManager.reRender({
											rowdata : data
										});
							},
							data : {
								type : "pa",
								name : "variableDefine",
								getParam : function() {
								},
								back : {
									code : "variableCode",
									name : "variableName",
									dataSourceConfig : "dataSourceConfig",
									description : "description",
									variableDefineId : "variableDefineId"
								}
							},
							required : true
						}
					}, {
						display : '值',
						name : 'variableText',
						width : 150,
						minWidth : 60,
						type : "string",
						align : "left",
						editor : {
							type : "dynamic",
							getEditor : function(row) {
								var dataSourceConfig = row['dataSourceConfig']
										|| "";
								if (!dataSourceConfig)
									return {};
								var editor = (new Function("return "
										+ dataSourceConfig))();
								return editor;
							}
						}
					}, {
						display : '值ID',
						name : 'variableValue',
						width : 150,
						minWidth : 60,
						type : "string",
						align : "left",
						editor : {
							type : 'text',
							required : true
						}
					}, {
						display : "排序号",
						name : "sequence",
						width : 60,
						minWidth : 60,
						type : "int",
						align : "left",
						editor : {
							type : 'spinner',
							min : 1,
							max : 100,
							mask : 'nnn'
						}
					}, {
						display : "操作",
						width : 70,
						minWidth : 70,
						isAllowHide : false,
						render : function(item) {
							return "<a class='GridStyle' href='javascript:void(null);' onclick=\"showVariableEventPage("
									+ item.projectVariableId
									+ ",'"
									+ item.variableName + "')\">变量事件</a>";
						}
					}],
			dataAction : 'server',
			url : operateCfg.queryAction,
			parms : {
				bizKindId : bizKindId,
				bizId : bizId
			},
			rownumbers : true,
			usePager : true,
			enabledEdit : true,
			sortName : "sequence",
			SortOrder : "asc",
			toolbar : toolbarOptions,
			width : '100%',
			height : '100%',
			heightDiff : heightDiff,
			headerRowHeight : 25,
			rowHeight : 25,
			checkbox : true,
			fixedCellHeight : true,
			selectRowButtonOnly : true,
			onAfterEdit : function(editParm) {
				var c = editParm.column, data = editParm.record;
				if (c.name == 'variableValueText') {// 启用的数据value 不能编辑
					gridManager.reRender({
								rowdata : data
							});
				}
			},
			autoAddRow : {
				variableName : "",
				variableCode : "",
				description : "",
				dataSourceConfig : "",
				bizId : bizId,
				bizKindId : bizKindId
			}
		});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function getId() {
	return parseInt($("#projectVariableId").val() || 0);
}

function insertVariable() {
	if (!canOperate) {
		PAUtil.tipNoRightOperate();
		return;
	}

	UICtrl.addGridRow(gridManager, {
				sequence : gridManager.getData().length + 1,
				parentId : parentId,
				fullId : fullId,
				kindId : ENodeKind.Data
			});
}

function showInsertDialog() {
	parent.UICtrl.showFrameDialog({
				url : operateCfg.showInsertAction,
				title : operateCfg.showInsertTitle,
				param : {},
				width : PAUtil.dialogWidth,
				height : PAUtil.dialogHeight,
				ok : doSaveProjectVariable,
				close : reloadGrid
			});
}

function doSaveProjectVariable() {
	var data, variableDefineIds = [];
	if (!this.iframe || !this.iframe.contentWindow)
		return;

	data = this.iframe.contentWindow.getSelectedData();
	if (!data)
		return;

	for (var i = 0; i < data.length; i++) {
		if (data[i].variableDefineId)
			variableDefineIds[variableDefineIds.length] = data[i].variableDefineId;
	}

	var params = {
		parentId : parentId,
		bizId : bizId,
		bizKindId : bizKindId,
		variableDefineIds : $.toJSON(variableDefineIds)
	};

	var _self = this;
	Public.ajax(operateCfg.insertAction, params, function(data) {
				refreshFlag = true;
				_self.close();
			});
}

function checkItemDuplicate(grid, idFieldName, nameFiledName, message) {
	grid.endEdit();
	var data = grid.getData();
	var ids = [];
	var id;
	for (var i = 0; i < data.length; i++) {
		id = parseInt(data[i][idFieldName]);
		if ($.inArray(id, ids) > -1) {
			Public.tip(message + "[" + data[i][nameFiledName] + "]重复。");
			return false;
		}
		ids.push(id);
	}
	return true;
}

function updateProjectVariable() {
	/***************************************************************************
	 * if (!canOperate) { PAUtil.tipNoRightOperate(); return; }
	 **************************************************************************/

	if (!checkItemDuplicate(gridManager, "variableCode", "variableName", "变量"))
		return;

	var data = DataUtil.getGridData({
				gridManager : gridManager
			});
	if (!data)
		return false;
	Public.ajax(operateCfg.updateAction, {
				data : encodeURI($.toJSON(data))
			}, function() {
				gridManager.loadData();
			});
}

function deleteProjectVariable() {
	if (!canOperate) {
		PAUtil.tipNoRightOperate();
		return;
	}

	var action = operateCfg.deleteAction;
	DataUtil.del({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : "projectVariableId"
			});
}

function updateProjectVariableSequence() {
	var action = operateCfg.updateSequenceAction;
	DataUtil.updateSequence({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : 'projectVariableId',
				seqFieldName : 'sequence'
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

function getTitle() {
	var title = "";
	if (bizKindId === ENodeBizKind.ProjectNode) {
		title = "项目节点";
	} else if (bizKindId === ENodeBizKind.Project) {
		title = "项目";
	}
	title += "变量";
	return title;
}

function showVariableEventPage(id, name) {
	if (id == null || id <= 0) {
		Public.tip("没有保存！");
		return;
	}
	var url = operateCfg.nodeEventAction + '.do?bizKindId='
			+ ENodeBizKind.ProjectVariableEvent + '&bizId=' + id;

	top.addTabItem({
				tabid : 'NodeManage' + id,
				text : '[' + name + ']变量事件',
				url : url
			});
}

function moveProjectVariableClass() {
	if (!canOperate) {
		PAUtil.tipNoRightOperate();
		return;
	}

	var rows = gridManager.getSelecteds();
	if (!rows || rows.length < 1) {
		Public.tip('请选择要移动的数据!');
		return;
	}

	UICtrl.showFrameDialog({
				url : operateCfg.showMoveAction,
				title : operateCfg.showMoveTitle,
				param : {
					item : EBaseDataItem.ProjectVariableClass,
					bizId : bizId,
					bizKindId : bizKindId
				},
				width : 350,
				height : 400,
				ok : doMoveProjectVariableClass,
				close : onDialogCloseHandler
			});
}

function doMoveProjectVariableClass() {
	var fn = this.iframe.contentWindow.getSelectedTreeNodeData;
	var data = fn();
	if (!data) {
		return;
	}
	var ids = DataUtil.getSelectedIds({
				gridManager : gridManager,
				idFieldName : "projectVariableId"
			});

	if (!ids)
		return;

	var _self = this;
	var params = {};
	params.parentId = data.projectVariableId;
	params.ids = $.toJSON(ids);
	Public.ajax(operateCfg.moveAction, params, function() {
				refreshFlag = true;
				_self.close();
			});
	reloadGrid();
}

function loadTree() {
	PACommonTree.createTree({
				loadAction : operateCfg.queryAllProjectVariableClass,
				showAddAction : operateCfg.showInsertProjectVariableClassAction,
				showUpdateAction : operateCfg.showUpdateProjectVariableClassAction,
				deleteAction : operateCfg.deleteAction,
				updateAction : operateCfg.updateProjectVariableClassAction,
				insertAction : operateCfg.insertProjectVariableClassAction,
				updateSequenceAction : operateCfg.updateSequenceAction,
				treeId : "#maintree", 
				parentId : parentId,
				bizKindId : bizKindId,
				bizId : bizId,
				idFieldName : 'projectVariableId',
				title : getTitle() + '分类',
				onClick : function(node) {
					if (!node || !node.data)
						return;

					parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
					if (parentId < 0)
						fullId = "/";
					gridManager.options.parms.fullId = node.data.fullId;
					if (node.data.nodeId == 0) {
						$('.l-layout-center .l-layout-header').html(getTitle()
								+ "列表");
					} else {
						$('.l-layout-center .l-layout-header')
								.html("<font style=\"color:Tomato;font-size:13px;\">["
										+ node.data.variableText
										+ "]</font>"
										+ getTitle() + "列表");
					}
					reloadGrid();
				},
				onFormInit : function() {
					$('#variableDefineId').val(0);
					$('#bizKindId').val(bizKindId);
					$('#bizId').val(bizId);
					//$('#parentId').val(parentId);
					$('#kindId').val(ENodeKind.Classification);
				}
			});
}