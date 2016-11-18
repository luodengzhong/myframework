var gridManager, refreshFlag = false, nodeKindId, projectNodeId = 0, bizKindId = 0, bizId = 0, lastSelectedId = 0, parentId = -1, operateCfg = {}, canOperate;

$(function() {
	getQueryParameters();
	initializeOperateCfg();
	bindEvents();
	loadTree();
	initializeUI();
	initializeGrid();

	function getQueryParameters() {
		bizKindId = Public.getQueryStringByName("bizKindId") || 0;
		bizId = Public.getQueryStringByName("bizId") || 0;
		// parentId = bizId;
	}

	/**
	 * 初始化参数配置
	 */
	function initializeOperateCfg() {
		var actionPath = web_app.name + "/projectNodeAction!";
		operateCfg.queryAction = actionPath + 'slicedQueryProjectNode.ajax';
		operateCfg.showInsertAction = actionPath
				+ "showInsertProjectNodePage.load";
		operateCfg.showUpdateAction = actionPath
				+ 'showUpdateProjectNodePage.load';
		operateCfg.showSelectTemplateDialog = actionPath
				+ 'showSelectTemplateDialog.do';
		operateCfg.showMoveAction = actionPath + "showMoveProjectNodePage.do";
		operateCfg.showNodeDefine = actionPath + "showNodeDefinePage.do";
		operateCfg.showNodeManage = web_app.name
				+ "/nodeDefineAction!showNodeManagePage.do";

		operateCfg.insertProjectNodeByNodeDefineAction = actionPath
				+ 'insertProjectNodeByNodeDefine.ajax';
		operateCfg.insertAction = actionPath + 'insertProjectNode.ajax';
		operateCfg.updateAction = actionPath + 'updateProjectNode.ajax';
		operateCfg.deleteAction = actionPath + 'deleteProjectNode.ajax';
		operateCfg.queryAll = actionPath + "queryAllProjectNode.ajax";
		operateCfg.updateSequenceAction = actionPath
				+ "updateProjectNodeSequence.ajax";
		operateCfg.moveAction = actionPath + "moveProjectNode.ajax";
		operateCfg.synchronizedProjectByTemplate = actionPath
				+ "synchronizedProjectByTemplate.ajax";

		operateCfg.showInsertTitle = "添加项目节点";
		operateCfg.showUpdateTitle = "修改项目节点";
		operateCfg.showMoveTitle = "移动项目节点对话框";
		operateCfg.showNodeDefineTitle = "节点选择器";
		operateCfg.showSelectTemplateTitle = "选择项目模板";
	}

	function initializeUI() {
		UICtrl.initDefaulLayout();
	}

	function bindEvents() {
		$("#btnQuery").click(function() {
			var params = $(this.form).formToJSON();
			UICtrl.gridSearch(gridManager, params);
		});

		$("#btnGraphic").click(function() {
			$('#divTablePanel').hide();
		});

		$("#btnSelectTemplate").click(function() {
			if(!PAUtil.checkProjectOperateRight(bizId, 0, false)){
				PAUtil.tipNoRightOperate();
				return ;
			}

			showSelectTemplateDialog();
		});
	}

	function initializeGrid() {
		UICtrl.autoSetWrapperDivHeight();
		var toolbarparam = {
			addHandler : showInsertBatchDialog,
			updateHandler : showUpdateDialog,
			deleteHandler : deleteProjectNode,
			saveSortIDHandler : updateProjectNodeSequence,
			moveHandler : moveProjectNode
		};
		var toolbarOptions = UICtrl.getDefaultToolbarOptions(toolbarparam);

		if (bizKindId == ENodeConfigBizKind.ProjectTemplate) {
			canOperate = true;
			$('#btnSelectTemplate').hide();
		} else {
			canOperate = PAUtil.checkProjectOperateRight(bizId, 0, false);
		}

		gridManager = UICtrl
				.grid(
						"#maingrid",
						{
							columns : [
									{
										display : '编码',
										name : 'code',
										width : 100,
										minWidth : 60,
										type : "string",
										align : "left"
									},
									{
										display : '名称',
										name : 'name',
										width : 150,
										minWidth : 60,
										type : "string",
										align : "left"
									},
									{
										display : '简称',
										name : 'shortName',
										width : 100,
										minWidth : 60,
										type : "string",
										align : "left"
									},
									{
										display : '图标',
										name : 'iconUrl',
										width : 60,
										minWidth : 60,
										type : "string",
										align : "center",
										isAutoWidth : 0,
										render : function(item) {
											if (item.iconUrl)
												return DataUtil
														.getFunctionIcon(item.iconUrl);
											else
												return "";
										}
									},
									{
										display : '启动方式',
										name : 'startModeName',
										sortName : "startMode",
										width : 70,
										minWidth : 60,
										type : "string",
										align : "left"
									},
									{
										display : '执行次数',
										name : 'executionNum',
										width : 80,
										minWidth : 60,
										type : "string",
										align : "right"
									},
									{
										display : '时限(天)',
										name : 'timeLimit',
										width : 80,
										minWidth : 60,
										type : "string",
										align : "right"
									},
									{
										display : '描述',
										name : 'description',
										width : 150,
										minWidth : 60,
										type : "string",
										align : "left"
									},
									{
										display : "排序号",
										name : "sequence",
										width : 60,
										minWidth : 60,
										type : "int",
										align : "left",
										render : function(item) {
											return "<input type='text' id='txtSequence_"
													+ item.projectNodeId
													+ "' class='textbox' value='"
													+ item.sequence + "' />";
										}
									},
									{
										display : '状态',
										name : 'statusName',
										sortName : "status",
										width : 60,
										minWidth : 60,
										type : "string",
										align : "center"
									},
									{
										display : "操作",
										width : 80,
										minWidth : 80,
										isAllowHide : false,
										render : function(item) {
											return "<a class='GridStyle' href='javascript:void(null);' onclick=\"doShowNodeManageDialog("
													+ item.projectNodeId
													+ ",'"
													+ item.shortName
													+ "')\">节点管理</a>";
										}
									}

							],
							dataAction : 'server',
							url : operateCfg.queryAction,
							parms : {
								parentId : -1,
								nodeKindId : ENodeKind.Data,
								bizKindId : bizKindId,
								bizId : bizId
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
								/*
								 * if (!canOperate) {
								 * PAUtil.tipNoRightOperate(); return; }
								 */
								doShowUpdateDialog(data.projectNodeId);
							}
						});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function getId() {
	return parseInt($("#projectNodeId").val() || 0);
}

function doShowNodeManageDialog(nodeId, name) {
	var nodeBizKindId = ENodeBizKind.ProjectTemplateNode;

	if (bizKindId == ENodeConfigBizKind.Project
			&& !PAUtil.checkProjectOperateRight(bizId, nodeId, true)) {
		PAUtil.tipNoRightOperate();
		return;
	}

	var url = "";
	if (bizKindId == ENodeConfigBizKind.ProjectTemplate) {
		nodeBizKindId = ENodeBizKind.ProjectTemplateNode;
		url = operateCfg.showNodeManage + '?bizId=' + nodeId + '&bizKindId='
				+ nodeBizKindId;
	} else if (bizKindId == ENodeConfigBizKind.Project) {
		nodeBizKindId = ENodeBizKind.ProjectNode;
		url = operateCfg.showNodeManage + '?bizId=' + nodeId + '&bizKindId='
				+ nodeBizKindId;
		url += '&projectId=' + bizId;
	}

	parent.addTabItem({
		tabid : 'NodeManage' + nodeId,
		text : '[' + name + ']节点管理',
		url : url
	});
}

function showInsertDialog() {
	if (parentId == bizId || parentId == -1) {
		Public.tip("请选择分类！");
		return;
	}

	UICtrl.showAjaxDialog({
		url : operateCfg.showInsertAction,
		title : operateCfg.showInsertTitle,
		param : {
			parentId : parentId,
			nodeKindId : ENodeKind.Data,
			bizId : bizId,
			bizKindId : bizKindId,
			nodeDefineId : 0
		},
		width : 400,
		ok : doSaveProjectNode,
		close : reloadGrid
	});
}

function showInsertBatchDialog() {
	if (!canOperate) {
		PAUtil.tipNoRightOperate();
		return;
	}

	if (parentId == bizId || parentId == -1) {
		Public.tip("请选择分类！");
		return;
	}

	UICtrl.showFrameDialog({
		url : operateCfg.showNodeDefine,
		title : operateCfg.showNodeDefineTitle,
		param : {},
		width : PAUtil.dialogWidth,
		height : PAUtil.dialogHeight,
		ok : doBatchSaveProjectNode,
		close : onDialogCloseHandler
	});
	return;
}

function doShowUpdateDialog(projectNodeId) {
	UICtrl.showAjaxDialog({
		url : operateCfg.showUpdateAction,
		param : {
			id : projectNodeId
		},
		title : operateCfg.showUpdateTitle,
		width : 400,
		ok : doSaveProjectNode,
		close : reloadGrid
	});
}

function showUpdateDialog() {

	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}

	if (bizKindId == ENodeConfigBizKind.Project
			&& !PAUtil.checkProjectOperateRight(bizId, row.projectNodeId, true)) {
		PAUtil.tipNoRightOperate();
		return;
	}

	doShowUpdateDialog(row.projectNodeId);
}

function doBatchSaveProjectNode() {
	if (!this.iframe || !this.iframe.contentWindow)
		return;

	var data = this.iframe.contentWindow.getSelectedData();
	if (!data)
		return;

	var nodeDefineIds = [];
	for (var i = 0; i < data.length; i++) {
		if (data[i].nodeDefineId)
			nodeDefineIds[nodeDefineIds.length] = data[i].nodeDefineId;
	}

	var params = {
		bizId : bizId,
		bizKindId : bizKindId,
		parentId : parentId,
		nodeDefineIds : $.toJSON(nodeDefineIds)
	};

	var _self = this;
	Public.ajax(web_app.name + '/'
			+ operateCfg.insertProjectNodeByNodeDefineAction, params, function(
			data) {
		refreshFlag = true;
		_self.close();
	});

}

function doSaveProjectNode() {
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

function deleteProjectNode() {
	if (!canOperate) {
		PAUtil.tipNoRightOperate();
		return;
	}

	var rows = gridManager.getSelecteds();
	if (!rows || rows.length < 1) {
		Public.tip('请选择要删除的数据!');
		return;
	}

	var action = operateCfg.deleteAction;
	DataUtil.del({
		action : action,
		gridManager : gridManager,
		onSuccess : reloadGrid,
		idFieldName : "projectNodeId"
	});
}

function updateProjectNodeSequence() {
	var action = operateCfg.updateSequenceAction;
	DataUtil.updateSequence({
		action : action,
		gridManager : gridManager,
		onSuccess : reloadGrid,
		idFieldName : 'projectNodeId',
		seqFieldName : 'sequence'
	});
}

function moveProjectNode() {
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
			item : EBaseDataItem.ProjectNode,
			bizId : bizId,
			bizKindId : bizKindId
		},
		width : 350,
		height : 400,
		ok : doMoveProjectNode,
		close : onDialogCloseHandler
	});
}

function doMoveProjectNode() {
	var fn = this.iframe.contentWindow.getSelectedTreeNodeData;
	var data = fn();
	if (!data) {
		return;
	}
	var ids = DataUtil.getSelectedIds({
		gridManager : gridManager,
		idFieldName : "projectNodeId"
	});

	if (!ids)
		return;

	var _self = this;
	var params = {};
	params.parentId = data.projectNodeId;
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
		idFieldName : 'projectNodeId',
		bizKindId : bizKindId,
		bizId : bizId,
		rootIs0 : false,
		title : '项目节点分类',
		onClick : function(node) {
			if (!node || !node.data)
				return;
			parentId = node.data.nodeId == 0 ? -1 : node.data.nodeId;
			gridManager.options.parms.fullId = node.data.fullId;

			if (node.data.nodeId == bizId) {
				$('#divTablePanel').show();
				$('.l-layout-center .l-layout-header').html("项目节点列表");
			} else {
				$('.l-layout-center .l-layout-header').html(
						"<font style=\"color:Tomato;font-size:13px;\">["
								+ node.data.name + "]</font>项目节点列表");

				document.getElementById('mainiframe').src = web_app.name
						+ "/pa/nodePic/nodeDesigner.jsp?bizId=" + bizId
						+ '&bizKindId=' + bizKindId + '&parentId=' + parentId;

				$('#divTablePanel').hide();
			}
			reloadGrid2();
		},
		onFormInit : function() {
			$('#iconUrl').parent().parent().parent().hide();
			$('#startMode1').parent().parent().hide();
			$('#executionNum').parent().parent().parent().hide();
			$('#timeLimit').parent().parent().parent().hide();
			$('#startTime').parent().parent().parent().hide();
			$('#endTime').parent().parent().parent().hide();

			$('#executionNum').val(0);
			$('#timeLimit').val(0);
			$('#nodeDefineId').val(0);
		}
	});
}

function showSelectTemplateDialog() {
	if (bizId <= 0) {
		Public.tip("未知的bizId:" + bizId);
		return;
	}
	parent.UICtrl.showFrameDialog({
		url : operateCfg.showSelectTemplateDialog,
		title : operateCfg.showSelectTemplateTitle,
		param : {},
		width : PAUtil.dialogWidth,
		height : PAUtil.dialogHeight,
		ok : doSaveTemplateData,
		close : reloadPage
	});
}

function reloadPage() {
	location.reload();
}

function doSaveTemplateData() {
	if (!this.iframe || !this.iframe.contentWindow)
		return;

	var data = this.iframe.contentWindow.getSelectedData();
	if (!data)
		return;

	var projectTemplateId = data.projectTemplateId;

	var params = {
		projectId : bizId,
		projectTemplateId : projectTemplateId
	};

	var _self = this;
	Public.ajax(operateCfg.synchronizedProjectByTemplate, params,
			function(data) {
				refreshFlag = true;
				_self.close();
			});
}

// 选择功能点图标
function chooseImg() {
	var imgUrl = '/desktop/images/functions/';
	var nowChooseImg = $('#iconUrl').val(), display = nowChooseImg == '' ? "none"
			: "";
	var html = [ '<div id="showImgMain">' ];
	html.push('<div id="showFunctionImgs"></div>');
	html.push('<div id="showChooseOk">');
	html.push('<input type="hidden" value="', nowChooseImg,
			'" id="nowChooseValue">');
	html.push('<p><img src="', web_app.name, nowChooseImg, '" style="display:',
			display, '" width="68" height="68" id="nowChooseImg"/></p>');
	html
			.push(
					'<p><input type="button" value="确 定" class="buttonGray" style="display:',
					display, '" id="nowChooseBut"/></p>');
	html.push('</div>');
	html.push('</div>');
	Public.dialog({
		title : '选择功能图片',
		content : html.join(''),
		width : 540,
		opacity : 0.1,
		onClick : function($clicked) {
			if ($clicked.is('img')) {
				var icon = $clicked.parent().attr('icon');
				$('#nowChooseImg').attr('src', web_app.name + imgUrl + icon)
						.show();
				$('#nowChooseBut').show();
				$('#nowChooseValue').val(imgUrl + icon);
			} else if ($clicked.is('input')) {// 点击按钮
				$('#iconUrl').val($('#nowChooseValue').val());
				this.close();
			}
		}
	});
	setTimeout(function() {
		$('#showFunctionImgs').scrollLoad(
				{
					url : web_app.name
							+ '/permissionAction!getFunctionImgList.ajax',
					itemClass : 'functionImg',
					size : 20,
					scrolloffset : 70,
					onLoadItem : function(obj) {
						var imgHtml = [ '<div class="functionImg" icon="', obj,
								'">' ];
						imgHtml.push('<img src="', web_app.name, imgUrl, obj,
								'"  width="64" height="64"/>');
						imgHtml.push('</div>');
						return imgHtml.join('');
					}
				});
	}, 0);
}