var gridManager, refreshFlag = false, operateCfg = {}, projectId;

$(function() {
	initializeOperateCfg();
	getQueryParameters();
	bindEvents();
	initializeGrid();

	function initializeOperateCfg() {
		var actionPath = web_app.name + "/transactionHandleAction!";
		operateCfg.queryAction = actionPath
				+ "slicedQueryTransactionHandle.ajax";
		operateCfg.showUpdateAction = actionPath
				+ "showUpdateTransactionHandleDialog.ajax";
		operateCfg.loadProjectAction = web_app.name
				+ "/projectMainAction!loadProject.ajax"; 

		operateCfg.showCommentDialog = web_app.name
				+ "/transactionCommentAction.do";
		operateCfg.showInsertCommentDialog = web_app.name
				+ "/transactionCommentAction!showTransactionCommentDetailDialog.ajax";
		operateCfg.insertCommentAction = web_app.name
				+ "/transactionCommentAction!insertTransactionComment.ajax";

		operateCfg.showCommentTitle = "查看评论";

	}

	function getQueryParameters() {
		projectId = Public.getQueryStringByName("projectId") || 0;
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
						display : "事务名称",
						name : "name",
						width : 100,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "办理时限(天)",
						name : "timeLimit",
						width : 80,
						minWidth : 60,
						type : "string",
						align : "right",
						isAutoWidth : 0
					}, {
						display : "内容",
						name : "content",
						width : 150,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "状态",
						name : "statusName",
						sortName : "status",
						width : 60,
						minWidth : 60,
						type : "string",
						align : "center"
					}, {
						display : "启动经办人",
						name : "startCreatorName",
						width : 100,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "启动经办时间",
						name : "startCreationTime",
						width : 100,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "完结经办人",
						name : "endCreatorName",
						width : 100,
						minWidth : 60,
						type : "string",
						align : "left"
					}, {
						display : "完结经办时间",
						name : "endCreationTime",
						width : 100,
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
							return "<a href='javascript:void(null);' class='GridStyle' onclick='showComment("
									+ item.transactionHandleId + ")'>查看评论</a>";
						}
					}

			],
			title : "事务列表",
			dataAction : 'server',
			url : operateCfg.queryAction,
			parms : {
				projectId : projectId
			},
			rownumbers : true,
			usePager : true,
			sortName : "sequence",
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
				showComment(data.transactionHandleId);
			}
		});
		UICtrl.setSearchAreaToggle(gridManager, false);
	}
});

function getId() {
	return parseInt($("#transactionHandleId").val() || 0);
}

function showComment(transactionHandleId) {
	UICtrl.showFrameDialog({
				url : operateCfg.showCommentDialog,
				title : operateCfg.showCommentTitle,
				param : {
					transactionHandleId : transactionHandleId
				},
				ok : function() {
					var _self = this;
					_self.close();
				},
				width : 900,
				height : 450
			});
}

function reloadGrid() {
	gridManager.loadData();
}
