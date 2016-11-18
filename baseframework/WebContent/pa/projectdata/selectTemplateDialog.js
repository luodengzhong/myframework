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
				+ 'showMoveProjectTemplatePage.load';

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

		gridManager = UICtrl.grid("#maingrid", {
			columns : [ {
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
				align : "left"

			} ],
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
			width : '100%',
			height : '100%',
			heightDiff : -10,
			headerRowHeight : 25,
			rowHeight : 25,
			checkbox : true,
			fixedCellHeight : true,
			selectRowButtonOnly : true,
			onDblClickRow : function(data, rowindex, rowobj) {

			}
		});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function getId() {
	return parseInt($("#projectTemplateId").val() || 0);
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
		idFieldName : 'projectTemplateId',
		title : '项目模板分类',
		onClick : function(node) {
			if (!node || !node.data)
				return;

			parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
			gridManager.options.parms.fullId = node.data.fullId;

			if (node.data.nodeId == 0) {
				$('.l-layout-center .l-layout-header').html("项目模板列表");
			} else {
				$('.l-layout-center .l-layout-header').html(
						"<font style=\"color:Tomato;font-size:13px;\">["
								+ node.data.name + "]</font>项目模板列表");
			}
			reloadGrid();
		},
		onFormInit : function() {
			$('#nodeKindId').val(ENodeKind.Classification);
		}
	});
}

function getSelectedData() {
	var data = gridManager.getSelecteds();
	if (!data || data.length == 0) {
		parent.Public.tip("请选择数据.");
		return;
	}
	if (!data || data.length != 1) {
		parent.Public.tip("请选择一条数据.");
		return;
	}

	return data[0];
}