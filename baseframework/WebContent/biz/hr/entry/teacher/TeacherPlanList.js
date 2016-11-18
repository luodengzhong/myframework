var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI() ;
	initializeGrid();
});
function initializeUI() {
	UICtrl.layout("#layout", {
		leftWidth : 200,
		heightDiff : -5
	});
	$('#maintree').commonTree(
			{
				loadTreesAction : 'orgAction!queryOrgs.ajax',
				parentId : 'orgRoot',
				manageType : 'hrBaseRecruitData',
				getParam : function(e) {
					if (e) {
						return {
							showDisabledOrg : 0,
							displayableOrgKinds : "ogn,dpt"
						};
					}
					return {
						showDisabledOrg : 0
					};
				},
				changeNodeIcon : function(data) {
					data[this.options.iconFieldName] = OpmUtil.getOrgImgUrl(
							data.orgKindId, data.status);
				},
				IsShowMenu : false,
				onClick : onFolderTreeNodeClick
			});
}

function onFolderTreeNodeClick(data) {

	var html = [], fullId = '', fullName = '';
	if (!data) {
		html.push('督导师计划表列表');
	} else {
		fullId = data.fullId, fullName = data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[', fullName,
				']</font>督导师计划表列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager && fullId != '') {
		UICtrl.gridSearch(gridManager, {
			fullId : fullId
		});
	} else {
		gridManager.options.parms['fullId'] = '';
	}

}
// 初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		// deleteHandler: deleteHandler
		viewHandler : function() {
			viewHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns : [ {
			display : "生成时间",
			name : "fillinDate",
			width : 100,
			minWidth : 60,
			type : "date",
			align : "left"
		}, {
			display : "员工所在机构",
			name : "ognName",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "员工所在部门",
			name : "dptName",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "员工岗位",
			name : "posName",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "督导师",
			name : "teacher",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "新员工姓名",
			name : "staffName",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "状态",
			name : "statusTextView",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "状态时间",
			name : "approveDate",
			width : 100,
			minWidth : 60,
			type : "date",
			align : "left"
		},
         {
			display : "次数",
			name : "sendTimes",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}
		],
		dataAction : 'server',
		url : web_app.name + '/teacherPlanAction!slicedQuery.ajax',
		manageType : 'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName : 'fillinDate',
		sortOrder : 'desc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		toolbar : toolbarOptions,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.teacherPlanId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

// 刷新表格
function reloadGrid() {
	gridManager.loadData();
}

// 重置表单
function resetForm(obj) {
	$(obj).formClean();
}

// 编辑按钮
function viewHandler(teacherPlanId) {
	if (!teacherPlanId) {
		var row = gridManager.getSelectedRow();
		if (!row) {
			Public.tip('请选择数据！');
			return;
		}
		teacherPlanId = row.teacherPlanId;
	}
	parent.addTabItem({
		tabid : 'HRTeacherPlan' + teacherPlanId,
		text : '督导师计划表',
		url : web_app.name + '/teacherPlanAction!showUpdate.job?bizId='
				+ teacherPlanId + '&isReadOnly=true'
	});

}

// 关闭对话框
function dialogClose() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}
