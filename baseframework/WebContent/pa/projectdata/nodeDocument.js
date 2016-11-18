var gridManager, refreshFlag = false, nodeDocumentId = 0, lastSelectedId = 0, bizId = 0, bizKindId = 0, operateCfg = {};

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
		var actionPath = web_app.name + "/nodeDocumentAction!";
		operateCfg.queryAction = actionPath + 'slicedQueryNodeDocument.ajax';
		operateCfg.showInsertAction = actionPath
				+ "showInsertNodeDocumentPage.do";

		operateCfg.insertAction = actionPath + 'insertNodeDocument.ajax';
		operateCfg.deleteAction = actionPath + 'deleteNodeDocument.ajax';
		operateCfg.updateSequenceAction = actionPath
				+ "updateNodeDocumentSequence.ajax";

		operateCfg.showNodeManage = web_app.name
				+ "/nodeDefineAction!showNodeManagePage.do";

		operateCfg.showInsertTitle = "文档选择器";
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
			deleteHandler : deleteNodeDocument,
			saveSortIDHandler : updateNodeDocumentSequence
		};
		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

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
						display : "排序号",
						name : "sequence",
						width : 60,
						minWidth : 60,
						type : "int",
						align : "left",
						render : function(item) {
							return "<input type='text' id='txtSequence_"
									+ item.nodeDocumentId
									+ "' class='textbox' value='"
									+ item.sequence + "' />";
						}
					}
					/*, {
						display : "操作",
						width : 70,
						minWidth : 70,
						isAllowHide : false,
						render : function(item) {
							return "<a class='GridStyle' href='javascript:void(null);' onclick=\"showRightManagePage("
									+ item.nodeDocumentId
									+ ",'"
									+ item.name
									+ "')\">权限管理</a>";
						}
					}*/
					],
			dataAction : 'server',
			url : operateCfg.queryAction,
			parms : {
				bizId : bizId,
				bizKindId : bizKindId
			},
			title : '节点文档列表',
			usePager : true,
			rownumbers : true,
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

			}
		});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function getId() {
	return parseInt($("#nodeDocumentId").val() || 0);
}

function showInsertDialog() {
	if (bizId <= 0) {
		Public.tip("未知的bizId:" + bizId);
		return;
	}
	parent.UICtrl.showFrameDialog({
				url : operateCfg.showInsertAction,
				title : operateCfg.showInsertTitle,
				param : {},
				width : PAUtil.dialogWidth,
				height : PAUtil.dialogHeight,
				ok : doSaveNodeDocument,
				close : reloadGrid
			});
}

function doSaveNodeDocument() {
	if (!this.iframe || !this.iframe.contentWindow)
		return;

	var data = this.iframe.contentWindow.getSelectedData();
	if (!data)
		return;

	var documentClassificationIds = [];
	for (var i = 0; i < data.length; i++) {
		if (data[i].documentClassificationId)
			documentClassificationIds[documentClassificationIds.length] = data[i].documentClassificationId;
	}

	var params = {
		bizId : bizId,
		bizKindId : bizKindId,
		documentClassificationIds : $.toJSON(documentClassificationIds)
	};

	var _self = this;
	Public.ajax(web_app.name + '/' + operateCfg.insertAction, params, function(
					data) {
				refreshFlag = true;
				_self.close();
			});
}

function deleteNodeDocument() {
	var action = operateCfg.deleteAction;
	DataUtil.del({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : "nodeDocumentId"
			});
}

function updateNodeDocumentSequence() {
	var action = operateCfg.updateSequenceAction;
	DataUtil.updateSequence({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : 'nodeDocumentId',
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

function showRightManagePage(id, name) {
	var url = operateCfg.showNodeManage + '?bizId=' + id + '&bizKindId='
			+ ENodeBizKind.NodeFunction;

	top.addTabItem({
				tabid : 'NodeManage' + id,
				text : '[' + name + ']权限管理',
				url : url
			});
}