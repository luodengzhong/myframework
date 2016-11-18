var gridManager, refreshFlag = false, lastSelectedId = 0, operateCfg = {}, projectId = -1;

$(function() {
	initializeOperateCfg();
	getQueryParameters();
	bindEvents();
	initializeUI();
	initializeGrid();

	function getQueryParameters() {
		projectId = Public.getQueryStringByName("projectId") || 0;
	}

	function initializeOperateCfg() {
		var actionPath = web_app.name + "/projectViewContractAction!";
		operateCfg.queryAction = actionPath + 'slicedQueryContract.ajax';
		operateCfg.showUpdateAction = actionPath
				+ 'showUpdateContractPage.load';

		operateCfg.queryAll = actionPath + "queryAllContract.ajax";
		operateCfg.showUpdateTitle = "查看合同";
	}

	function initializeUI() {
	}

	function bindEvents() {
		$("#btnQuery").click(function() {
					var params = $(this.form).formToJSON();
					UICtrl.gridSearch(gridManager, params);
				});
	}

	function initializeGrid() {
		UICtrl.autoSetWrapperDivHeight();

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
						display : '甲方单位',
						name : 'aunit',
						width : 100,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : '甲方经办人',
						name : 'acreator',
						width : 80,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : '乙方单位',
						name : 'bunit',
						width : 100,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : '乙方经办人',
						name : 'bcreator',
						width : 80,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : '合同价(元)',
						name : 'contractAmount',
						width : 100,
						minWidth : 60,
						type : "string",
						align : "right"
					}, {
						display : '签订日期',
						name : 'signDate',
						width : 80,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : '签订地点',
						name : 'signAddress',
						width : 120,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "操作",
						name : "sequence",
						width : 60,
						minWidth : 60,
						type : "string",
						align : "center",
						render : function(item) {
							return "<a href='javascript:void(null);' class='GridStyle' onclick='doShowUpdateDialog("
									+ item.contractId + ")'>查看详情</a>";
						}
					}],
			dataAction : 'server',
			url : operateCfg.queryAction,
			parms : {
				projectId : projectId
			},
			title : '项目合同列表',
			rownumbers : true,
			usePager : true,
			sortName : "signDate",
			SortOrder : "asc",
			width : '100%',
			height : '100%',
			heightDiff : -7,
			headerRowHeight : 25,
			rowHeight : 25,
			fixedCellHeight : true,
			selectRowButtonOnly : true,
			onDblClickRow : function(data, rowindex, rowobj) {
				doShowUpdateDialog(data.contractId);
			}
		});

		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function doShowUpdateDialog(contractId) {
	UICtrl.showAjaxDialog({
				url : operateCfg.showUpdateAction,
				param : {
					id : contractId
				},
				init : function() {
					$('#ContractFileList').fileList();
				},
				title : operateCfg.showUpdateTitle,
				width : 500,
				ok : false

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