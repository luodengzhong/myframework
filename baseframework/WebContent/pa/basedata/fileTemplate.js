var gridManager, refreshFlag = false, nodeKindId, templateKindId = 0, fileTemplateId = 0, title = '', lastSelectedId = 0, parentId = -1, bizCode = 'FileTemplate', operateCfg = {};

$(function() {
	getQueryParameters();
	initializeOperateCfg();
	bindEvents();
	loadTree();
	initializeUI();
	initializeGrid();

	function getQueryParameters() {
		templateKindId = Public.getQueryStringByName("TemplateKindId")
				|| EFileTemplate.Default;

		title = EFileTemplate.getFileTemplateText(templateKindId);
	}

	function initializeOperateCfg() {
		var actionPath = web_app.name + "/fileTemplateAction!";
		operateCfg.queryAction = actionPath + 'slicedQueryFileTemplate.ajax';
		operateCfg.showInsertAction = actionPath + "showInsertFileTemplatePage.load";
		operateCfg.showUpdateAction = actionPath
				+ 'showUpdateFileTemplatePage.load';
		operateCfg.showMoveAction = actionPath + "showMoveFileTemplatePage.do";

		operateCfg.insertAction = actionPath + 'insertFileTemplate.ajax';
		operateCfg.updateAction = actionPath + 'updateFileTemplate.ajax';
		operateCfg.deleteAction = actionPath + 'deleteFileTemplate.ajax';
		operateCfg.queryAll = actionPath + "queryAllFileTemplate.ajax";
		operateCfg.updateSequenceAction = actionPath
				+ "updateFileTemplateSequence.ajax";
		operateCfg.moveAction = actionPath + "moveFileTemplate.ajax";

		operateCfg.showInsertTitle = "添加" + title;
		operateCfg.showUpdateTitle = "修改" + title;
		operateCfg.showMoveTitle = "移动" + title + "对话框";
	}

	function initializeUI() {
		UICtrl.initDefaulLayout();

		$('.l-layout-header-inner').html(title + '树');
		$('.l-layout-header').html(title + '列表');
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
			deleteHandler : deleteFileTemplate,
			saveSortIDHandler : updateFileTemplateSequence,
			moveHandler : moveFileTemplate
		};
		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

		gridManager = UICtrl.grid("#maingrid", {
					columns : [{
								display : '标题',
								name : 'title',
								width : 150,
								minWidth : 60,
								type : "string",
								align : "left"
							}, {
								display : '文件业务编码',
								name : 'bizCode',
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
											+ item.fileTemplateId
											+ "' class='textbox' value='"
											+ item.sequence + "' />";
								}
							}, {
								display : '状态',
								name : 'status',
								width : 60,
								minWidth : 60,
								type : "int",
								align : "left",
								render : function(item) {
									return "<div class='"
											+ (item.status ? "Yes" : "No")
											+ "'/>";
								}
							}],
					dataAction : 'server',
					url : operateCfg.queryAction,
					parms : {
						parentId : -1,
						nodeKindId : ENodeKind.Data,
						templateKindId : templateKindId
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
						doShowUpdateDialog(data.fileTemplateId);
					}
				});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function getId() {
	return parseInt($("#fileTemplateId").val() || 0);
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
					fileTemplateId : 0,
					parentId : parentId,
					nodeKindId : ENodeKind.Data,
					bizCode : bizCode,
					templateKindId : templateKindId
				},
				init : function() {
					$('#fileTemplateList').fileList();
				},
				width : 400,
				ok : doSaveFileTemplate,
				close : reloadGrid
			});
}

function doShowUpdateDialog(fileTemplateId) {
	UICtrl.showAjaxDialog({
				url : operateCfg.showUpdateAction,
				param : {
					id : fileTemplateId
				},
				title : operateCfg.showUpdateTitle,
				width : 400,
				init : function() {
					$('#fileTemplateList').fileList();
				},
				ok : doSaveFileTemplate,
				close : reloadGrid
			});
}

function showUpdateDialog() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}
	doShowUpdateDialog(row.fileTemplateId);
}

function doSaveFileTemplate() {
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

function deleteFileTemplate() {
	var action = operateCfg.deleteAction;
	DataUtil.del({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : "fileTemplateId"
			});
}

function updateFileTemplateSequence() {
	var action = operateCfg.updateSequenceAction;
	DataUtil.updateSequence({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : 'fileTemplateId',
				seqFieldName : 'sequence'
			});
}

function moveFileTemplate() {
	var rows = gridManager.getSelecteds();
	if (!rows || rows.length < 1) {
		Public.tip('请选择要移动的数据!');
		return;
	}

	UICtrl.showFrameDialog({
				url : operateCfg.showMoveAction,
				title : operateCfg.showMoveTitle,
				param : {
					item : EBaseDataItem.FileTemplate,
					templateKindId : templateKindId
				},
				width : 350,
				height : 400,
				ok : doMoveFileTemplate,
				close : onDialogCloseHandler
			});
}

function doMoveFileTemplate() {
	var fn = this.iframe.contentWindow.getSelectedTreeNodeData;
	var data = fn();
	if (!data) {
		return;
	}
	var ids = DataUtil.getSelectedIds({
				gridManager : gridManager,
				idFieldName : "fileTemplateId"
			});

	if (!ids)
		return;

	var _self = this;
	var params = {};
	params.parentId = data.fileTemplateId;
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
				templateKindId : templateKindId,
				idFieldName : 'fileTemplateId',
				title : title + '分类',
				onClick : function(node) {
					if (!node || !node.data)
						return;
					parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
					gridManager.options.parms.parentId = parentId;
					gridManager.options.parms.fullId = node.data.fullId;

					if (node.data.nodeId == 0) {
						$('.l-layout-center .l-layout-header')
								.html(EFileTemplate
										.getFileTemplateText(templateKindId)
										+ "列表");
					} else {
						$('.l-layout-center .l-layout-header')
								.html("<font style=\"color:Tomato;font-size:13px;\">["
										+ node.data.title
										+ "]</font>"
										+ EFileTemplate
												.getFileTemplateText(templateKindId)
										+ "列表");
					}
					reloadGrid2();
				},
				onFormInit : function() {
					$('#status1').parent().parent().hide();
					$('#fileTemplateList').hide();
					$('#templateKindId').val(templateKindId);
					$('#bizCode').val(bizCode);
				}
			});
}