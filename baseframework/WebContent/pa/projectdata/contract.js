var gridManager, refreshFlag = false, lastSelectedId = 0, operateCfg = {}, projectId = -1, projectNodeId = -1;

$(function() {
			initializeOperateCfg();
			getQueryParameters();
			bindEvents();
			initializeUI();
			initializeGrid();

			function getQueryParameters() {
				projectId = Public.getQueryStringByName("projectId") || 0;
				projectNodeId = Public.getQueryStringByName("projectNodeId")
						|| 0;
			}

			function initializeOperateCfg() {
				var actionPath = web_app.name + "/contractAction!";
				operateCfg.queryAction = actionPath
						+ 'slicedQueryContract.ajax';
				operateCfg.showInsertAction = actionPath
						+ "showInsertContractPage.load";
				operateCfg.showUpdateAction = actionPath
						+ 'showUpdateContractPage.load';

				operateCfg.insertAction = actionPath + 'insertContract.ajax';
				operateCfg.updateAction = actionPath + 'updateContract.ajax';
				operateCfg.deleteAction = actionPath + 'deleteContract.ajax';
				operateCfg.queryAll = actionPath + "queryAllContract.ajax";
				operateCfg.showInsertTitle = "添加合同";
				operateCfg.showUpdateTitle = "修改合同";
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
				var toolbarparam = {
					addHandler : showInsertDialog,
					updateHandler : showUpdateDialog,
					deleteHandler : deleteContract
				};
				var toolbarOptions = UICtrl
						.getDefaultToolbarOptions(toolbarparam);

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
									}],
							title : PAUtil.loadProjectNavTitle(projectNodeId,
									'合同列表'),
							dataAction : 'server',
							url : operateCfg.queryAction,
							parms : {
								projectId : projectId,
								projectNodeId : projectNodeId
							},
							usePager : true,
							sortName : "signDate",
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
								doShowUpdateDialog(data.contractId);
							}
						});

				UICtrl.setSearchAreaToggle(gridManager, false);
			}
		});

function getId() {
	return parseInt($("#contractId").val() || 0);
}

function showInsertDialog() {
	UICtrl.showAjaxDialog({
				url : operateCfg.showInsertAction,
				title : operateCfg.showInsertTitle,
				param : {
					projectId : projectId,
					projectNodeId : projectNodeId,
					contractId : 0
				},
				init : function() {
					$('#ContractFileList').fileList();
				},
				width : 500,
				ok : doSaveContract,
				close : reloadGrid
			});
}

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
				ok : doSaveContract,
				close : reloadGrid
			});
}

function showUpdateDialog() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip("请选择数据！");
		return;
	}
	doShowUpdateDialog(row.contractId);
}

function doSaveContract() {
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

function deleteContract() {
	var action = operateCfg.deleteAction;
	DataUtil.del({
				action : action,
				gridManager : gridManager,
				onSuccess : reloadGrid,
				idFieldName : "contractId"
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