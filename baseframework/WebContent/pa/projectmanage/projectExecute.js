var gridManager, refreshFlag = false, projectId = 0, view = 0, lastSelectedId = 0, parentId = -1, operateCfg = {}, status;

$(function() {
	getQueryParameters();
	initializeOperateCfg();
	bindEvents();
	loadTree();
	initializeUI();
	initializeGrid();

	function getQueryParameters() {
		view = Public.getQueryStringByName("view") || 0;
	}

	/**
	 * 初始化参数配置
	 */
	function initializeOperateCfg() {
		var actionPath = web_app.name + "/projectExecuteAction!";
		operateCfg.queryAction = actionPath + 'slicedQueryProject.ajax';
		operateCfg.showProjectManageAction = actionPath
				+ "showProjectMainPage.do";
		operateCfg.showProjectViewAction = actionPath
				+ "showProjectViewPage.do";

		if (view == 1)
			status = EProjectStatus.View;
		else
			status = EProjectStatus.Execute;
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

		gridManager = UICtrl
				.grid(
						"#maingrid",
						{
							columns : [
									{
										display : "状态",
										frozen : true,
										width : 30,
										minWidth : 30,
										type : "string",
										align : "center",
										render : function(item) {
											if (item.nodeTimeOutStatus == EProjectNodeTimeOutStatus.TimeOut)
												return "<img src='images/dp_red.png' title='项目有已超过期限的节点' style='margin-top:3px;width:20px;height:20px;'>";
											else if (item.nodeTimeOutStatus == EProjectNodeTimeOutStatus.Warning)
												return "<img src='images/dp_yellow.png' title='项目有即将过期的节点' style='margin-top:3px;width:20px;height:20px;'>";
											else
												return "<img src='images/dp_green.png' title='项目运行正常' style='margin-top:3px;width:20px;height:20px;'>";
										}
									},
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
										align : "left"
									},
									{
										display : "操作",
										width : 50,
										minWidth : 50,
										frozen : true,
										isAllowHide : false,
										render : function(item) {
											if (view == 1) {
												return "<a class='GridStyle' href='javascript:void(null);' onclick=\"doShowProjectViewDialog("
														+ item.projectId
														+ ",'"
														+ item.name
														+ "')\">查看</a>";
											} else
												return "<a class='GridStyle' href='javascript:void(null);' onclick=\"doShowManageDialog("
														+ item.projectId
														+ ",'"
														+ item.name
														+ "',"
														+ item.phaseStatus
														+ ")\">办理</a>";
										}
									} ],
							dataAction : 'server',
							url : web_app.name
									+ '/projectConfigAction!slicedQueryProject.ajax',
							parms : {
								parentId : lastSelectedId || 1,
								phaseStatus : '1,3,4'
							},
							rownumbers : true,
							usePager : true,
							sortName : "code",
							SortOrder : "asc",
							width : '100%',
							height : '100%',
							heightDiff : -7,
							headerRowHeight : 25,
							rowHeight : 25,
							checkbox : false,
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

function doShowManageDialog(projectId, name, phaseStatus) {
	if (phaseStatus != EProjectStatus.Construction) {
		Public.errorTip("【" + name + "】项目状态不是建设中！");
	}
	parent.addTabItem({
		tabid : 'project' + projectId,
		text : "项目[" + name + "]导航",
		url : operateCfg.showProjectManageAction + '?projectId=' + projectId
	});
}

function doShowProjectViewDialog(projectId, name) {
	parent.addTabItem({
		tabid : 'projectView' + projectId,
		text : "项目[" + name + "]一览表",
		url : operateCfg.showProjectViewAction + '?projectId=' + projectId
	});
}

function onDialogCloseHandler() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
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
		iconFieldName : "icon",
		sortName : 'sequence',// 排序列名
		sortOrder : 'asc',// 排序方向
		isLeaf : function(data) {
			return data.hasChildren == 0;
		},
		onClick : function(data) {
			lastSelectedId = data.projectId;
			lastSelectedData = data;
			if (data && data.hasChildren > 0) {
				reloadGrid(data.projectId);
			}
		},
		IsShowMenu : false
	});
}