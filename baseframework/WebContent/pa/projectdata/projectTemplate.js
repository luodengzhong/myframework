var gridManager, refreshFlag = false, projectTemplateId = 0, lastSelectedId = 0, operateCfg = {}, nodeKindId, parentId = -1;

$(function() {
	initializeOperateCfg();
	bindEvents();
	loadTree();
	initializeUI();
	initializeGrid();

	/**
	 * 初始化参数配置
	 */
	function initializeOperateCfg() {
		var actionPath = web_app.name + "/projectTemplateConfigAction!";
		operateCfg.queryAction = actionPath + 'slicedQueryProjectTemplate.ajax';
		operateCfg.showInsertAction = actionPath
				+ "showInsertProjectTemplatePage.load";
		operateCfg.showUpdateAction = actionPath
				+ 'showUpdateProjectTemplatePage.load';
		operateCfg.showMoveAction = actionPath
				+ 'showMoveProjectTemplatePage.do';

		operateCfg.showNodeConfigAction = actionPath
				+ "showNodeConfigDialog.do";

		operateCfg.insertAction = actionPath + 'insertProjectTemplate.ajax';
		operateCfg.updateAction = actionPath + 'updateProjectTemplate.ajax';
		operateCfg.deleteAction = actionPath + 'deleteProjectTemplate.ajax';
		operateCfg.queryAll = actionPath + "queryAllProjectTemplate.ajax";
		operateCfg.updateSequenceAction = actionPath
				+ "updateProjectTemplateSequence.ajax";
		operateCfg.moveAction = actionPath + 'moeveProjectTemplate.ajax';

		operateCfg.showInsertTitle = "添加项目模板";
		operateCfg.showUpdateTitle = "修改项目模板";
		operateCfg.showMoveTitle = "移动项目模板对话框";
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
			deleteHandler : deleteProjectTemplate,
			saveSortIDHandler : updateProjectTemplateSequence,
			moveHandler : moveProjectTemplate
		};
		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);
		toolbarOptions.items[toolbarOptions.items.length] = {
			id : 'NodeManage',
			text : '节点配置',
			img : web_app.name + '/themes/default/images/icons/note.gif',
			click : nodeConfig
		};
		toolbarOptions.items[toolbarOptions.items.length] = {
			id : "line",
			line : true
		};
		gridManager = UICtrl.grid("#maingrid", {
			columns : [{
						display : '编码',
						name : 'code',
						width : 100,
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
									+ item.projectTemplateId
									+ "' class='textbox' value='"
									+ item.sequence + "' />";
						}
					}, {
						display : "操作",
						width : 80,
						minWidth : 80,
						isAllowHide : false,
						render : function(item) {
							return "<a class='GridStyle' href='javascript:void(null);' onclick=\"doShowNodeConfigDialog("
									+ item.projectTemplateId
									+ ",'"
									+ item.name
									+ "')\">节点配置</a>";
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
				doShowUpdateDialog(data.projectTemplateId);
			}
		});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function getId() {
	return parseInt($("#projectTemplateId").val() || 0);
}

function showInsertDialog() {
	if (parentId < 0) {
		Public.tip("请选择分类");
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
				ok : doSaveProjectTemplate,
				close : reloadGrid
			});
}

function doShowUpdateDialog(projectTemplateId) {
	UICtrl.showAjaxDialog({
				url : operateCfg.showUpdateAction,
				param : {
					id : projectTemplateId
				},
				title : operateCfg.showUpdateTitle,
				width : 400,
				ok : doSaveProjectTemplate,
				close : reloadGrid
			});
}

function showUpdateDialog() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}
	doShowUpdateDialog(row.projectTemplateId);
}

function doSaveProjectTemplate() {
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

function deleteProjectTemplate() {
	var action = operateCfg.deleteAction;
	DataUtil.del({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : "projectTemplateId"
			});
}

function updateProjectTemplateSequence() {
	var action = operateCfg.updateSequenceAction;
	DataUtil.updateSequence({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : 'projectTemplateId',
				seqFieldName : 'sequence'
			});
}

function moveProjectTemplate() {
    var rows = gridManager.getSelecteds();
    if (!rows || rows.length < 1) {
        Public.tip('请选择要移动的数据!');
        return;
    }

    UICtrl.showFrameDialog({
        url: operateCfg.showMoveAction,
        title: operateCfg.showMoveTitle,
        param: {
            item: EBaseDataItem.ProjectTemplate
        },
        width: 350,
        height: 400,
        ok: doMoveProjectTemplate,
        close: onDialogCloseHandler
    });
}

function doMoveProjectTemplate() {
    var fn = this.iframe.contentWindow.getSelectedTreeNodeData;
    var data = fn();
    if (!data) {
        return;
    }
    var ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "projectTemplateId"
    });

    if (!ids)
        return;

    var _self = this;
    var params = {};
    params.parentId = data.projectTemplateId;
    params.ids = $.toJSON(ids);
    Public.ajax(operateCfg.moveAction, params, function () {
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
	var params = $("#queryMainForm").formToJSON();
	UICtrl.gridSearch(gridManager, params);
}

function nodeConfig() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}
	doShowNodeConfigDialog(row.projectTemplateId, row.name);

}

function doShowNodeConfigDialog(id, name) {
	parent.addTabItem({
				tabid : 'nodeConfig' + id,
				text : "项目模板[" + name + "]节点配置",
				url : operateCfg.showNodeConfigAction + '?bizKindId='
						+ ENodeConfigBizKind.ProjectTemplate + '&bizId=' + id
			});
}

function loadTree() {
    PACommonTree.createTree({
        loadAction: operateCfg.queryAll,
        showAddAction: operateCfg.showInsertAction,
        showUpdateAction: operateCfg.showUpdateAction,
        deleteAction: operateCfg.deleteAction,
        updateAction: operateCfg.updateAction,
        insertAction: operateCfg.insertAction,
        updateSequenceAction: operateCfg.updateSequenceAction,
        treeId: "#maintree",
        parentId: parentId,
        idFieldName: 'projectTemplateId',
        title: '项目模板分类',
        onClick: function (node) {
            if (!node || !node.data)
                return;

            parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
            gridManager.options.parms.fullId = node.data.fullId;

            if (node.data.nodeId == 0) {
                $('.l-layout-center .l-layout-header').html("项目模板列表");
            } else {
                $('.l-layout-center .l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">["
                        + node.data.name + "]</font>项目模板列表");
            }
            reloadGrid();
        },
        onFormInit : function() {
					$('#nodeKindId').val(ENodeKind.Classification);
        }
    });
}