var gridManager, refreshFlag = false, projectId = 0, lastSelectedId = 0, parentId = -1, operateCfg = {};

$(function() {
	getQueryParameters();
	initializeOperateCfg();
	bindEvents();
	loadTree();
	initializeUI();
	initializeGrid();

	function getQueryParameters() {
	}

	/**
	 * 初始化参数配置
	 */
	function initializeOperateCfg() {
		var actionPath = web_app.name + "/projectConfigAction!";
		operateCfg.queryAction = actionPath + 'slicedQueryProject.ajax';
		operateCfg.showNodeConfigAction = actionPath
				+ "showNodeConfigDialog.do";
		operateCfg.showEventConfigAction = web_app.name + "/nodeEventAction.do";
		operateCfg.showVariableConfigAction = web_app.name
				+ "/projectVariableAction.do";
		operateCfg.startAction = "projectMainAction!startProject.ajax";

	}

	function initializeUI() {
		UICtrl.initDefaulLayout();
	}

	function bindEvents() {

	}

	function initializeGrid() {
		UICtrl.autoSetWrapperDivHeight();
		var toolbarOptions = {
			items : []
		};
		toolbarOptions.items[toolbarOptions.items.length] = {
			id : 'StartProject',
			text : '启动',
			img : web_app.name + '/themes/default/images/icons/note.gif',
			click : startProject
		};
		toolbarOptions.items[toolbarOptions.items.length] = {
			id : "line",
			line : true
		};

		gridManager = UICtrl
				.grid(
						"#maingrid",
						{
							columns : [
									{
										display : "名称",
										name : "name",
										width : 100,
										minWidth : 60,
										type : "string",
										align : "left",
										frozen : true
									},
									{
										display : "编码",
										name : "code",
										width : 100,
										minWidth : 60,
										type : "string",
										align : "left",
										frozen : true
									},
									{
										display : "状态",
										name : "phaseStatus",
										width : 60,
										minWidth : 60,
										type : "string",
										align : "center",
										render : function(item) {
											return EProjectStatus
													.getStatusName(item.phaseStatus);
										},
										frozen : true
									},
									{
										display : "所属组织机构",
										name : "logicAreaName",
										width : 100,
										minWidth : 60,
										type : "string",
										align : "left"
									},
									{
										display : "所属区域",
										name : "orgName",
										width : 100,
										minWidth : 60,
										type : "string",
										align : "left"
									},
									{
										display : "项目负责人",
										name : "managerName",
										width : 100,
										minWidth : 60,
										type : "String",
										align : "left"
									},
									{
										display : "总面积(㎡)",
										name : "area",
										width : 100,
										minWidth : 60,
										type : "number",
										align : "left"
									},
									{
										display : "创建人",
										name : "createByName",
										width : 100,
										minWidth : 60,
										type : "String",
										align : "left"
									},
									{
										display : "创建时间",
										name : "createDate",
										width : 100,
										minWidth : 60,
										type : "date",
										align : "left"
									},
									{
										display : "排序号",
										name : "sequence",
										width : 60,
										minWidth : 60,
										type : "string",
										align : "left",
										render : function(item) {
											return "<input type='text' mask='nnn' id='txtSequence_"
													+ item.projectId
													+ "' class='textbox' value='"
													+ item.sequence + "' />";
										}
									},
									{
										display : "操作",
										width : 180,
										minWidth : 180,
										isAllowHide : false,
										frozen : true,
										render : function(item) {
											return "<a class='GridStyle' href='javascript:void(null);' onclick=\"doShowNodeConfigDialog("
													+ item.projectId
													+ ",'"
													+ item.name
													+ "')\">节点配置</a>"
													+ "&nbsp;&nbsp;<a class='GridStyle' href='javascript:void(null);' onclick=\"doShowDialog("
													+ item.projectId
													+ ",'"
													+ item.name
													+ "',1)\">项目事件</a>"
													+ "&nbsp;&nbsp;<a class='GridStyle' href='javascript:void(null);' onclick=\"doShowDialog("
													+ item.projectId
													+ ",'"
													+ item.name
													+ "',2)\">项目变量</a>";
										}
									} ],
							dataAction : 'server',
							url : web_app.name
									+ '/projectAction!slicedQueryProject.ajax',
							parms : {
								parentId : lastSelectedId || 1
							},
							rownumbers : false,
							usePager : true,
							sortName : "code",
							SortOrder : "asc",
							toolbar : toolbarOptions,
							width : '100%',
							height : '100%',
							heightDiff : -10,
							headerRowHeight : 25,
							rowHeight : 25,
							alternatingRow : true,
							tree : {
								columnId : 'name',
								isExtend : false
							},
							checkbox : true,
							fixedCellHeight : true,
							selectRowButtonOnly : true,
							onDblClickRow : function(data, rowindex, rowobj) {
								
							}
						});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

// 重置表单
function resetForm(obj) {
	$(obj).formClean();
}

function getId() {
	return parseInt($("#projectId").val() || 0);
}

function doShowDialog(id, name, kindId) {
	if (!PAUtil.checkProjectOperateRight(id, 0, false)) {
		PAUtil.tipNoRightOperate();
		return;
	}

	switch (kindId) {
	case 1:
		doShowEventConfigDialog(id, name);
		break;
	case 2:
		doShowVariableConfigDialog(id, name);
		break;
	}
}

function doShowNodeConfigDialog(id, name) {
	/*
	if (!PAUtil.checkProjectOperateRight(id, 0, false)) {
		PAUtil.tipNoRightOperate();
		return;
	}
	*/
	parent.addTabItem({
		tabid : 'nodeConfig' + id,
		text : "项目[" + name + "]节点配置",
		url : operateCfg.showNodeConfigAction + '?bizKindId='
				+ ENodeConfigBizKind.Project + '&bizId=' + id
	});
}

function doShowEventConfigDialog(id, name) {
	parent.addTabItem({
		tabid : 'projectEvent' + id,
		text : "项目[" + name + "]事件配置",
		url : operateCfg.showEventConfigAction + '?bizKindId='
				+ ENodeBizKind.Project + '&bizId=' + id
	});
}

function doShowVariableConfigDialog(id, name) {
	parent.addTabItem({
		tabid : 'projectVariable' + id,
		text : "项目[" + name + "]变量配置",
		url : operateCfg.showVariableConfigAction + '?bizKindId='
				+ ENodeBizKind.Project + '&bizId=' + id
	});
}

function startProject() {
	var rows = new Array();
	var action = operateCfg.startAction;
	rows = gridManager.getSelectedRows();
	for (var i = 0; i < rows.length; i++)
		if (rows[i].phaseStatus != EProjectStatus.Reserve) {
			Public.tip("【" + rows[i].name + "】项目已经启动！");
			return;
		}
	DataUtil.updateById($.extend({
		message : '您确定启动选中的项目吗?'
	}, {
		action : action,
		gridManager : gridManager,
		onSuccess : reloadGrid,
		idFieldName : "projectId"
	}));
}

function reloadGrid(id) {
	var params = $("#queryMainForm").formToJSON();
	params['parentId'] = lastSelectedId || 1;
	UICtrl.gridSearch(gridManager, params);
	if (!id) {
		$("#maintree").commonTree('refresh', lastSelectedId || 1);
	}
}

function loadTree() {
	$('#maintree').commonTree({
		loadTreesAction : "/projectAction!queryProject.ajax",
		idFieldName : 'projectId',
		parentIDFieldName : 'parentId',
		parentId : 0,
		textFieldName : "name",
		iconFieldName : "nodeIcon",
		sortName : 'sequence',// 排序列名
		sortOrder : 'asc',// 排序方向
		isLeaf : function(data) {
			return data.hasChildren == 0;
		},
		onClick : function(data) {
			lastSelectedId = data.projectId;
			lastSelectedData = data;
			if (data&& data.hasChildren > 0) {
				reloadGrid(data.projectId);
			}
		},
		IsShowMenu : false
	});
}