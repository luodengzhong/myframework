var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
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
		html.push('更换督导师流程列表');
	} else {
		fullId = data.fullId, fullName = data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[', fullName,
				']</font>更换督导师流程列表');
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
			display : "员工姓名",
			name : "personMemberName",
			width : 80,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "填表日期",
			name : "fillinDate",
			width : 80,
			minWidth : 60,
			type : "date",
			align : "left"
		}, {
			display : "现任督导师",
			name : "oldTeacher",
			width : 80,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "现任督导师所在部门",
			name : "oldTeacherDptNam",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "现任导师所在岗位",
			name : "oldTeacherPosName",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "新任督导师",
			name : "newTeacher",
			width : 80,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "新任督导师所在部门",
			name : "newTeacherDptName",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "新任督导师所在岗位",
			name : "newTeacherPosName",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "更换原因",
			name : "reason",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "申请状态",
			name : "statusTextView",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "审批时间",
			name : "approveDate",
			width : 100,
			minWidth : 60,
			type : "date",
			align : "left"
		} ],
		dataAction : 'server',
		url : web_app.name + '/changeTeacherAction!slicedQuery.ajax',
		manageType : 'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName : 'fillinDate',
		sortOrder : 'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		toolbar : toolbarOptions,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.changeTeacherId);
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

// 添加按钮
function addHandler() {
	UICtrl.showAjaxDialog({
		url : web_app.name + '/changeTeacherAction!showInsert.load',
		ok : insert,
		close : dialogClose
	});
}

// 编辑按钮
function viewHandler(changeTeacherId) {
	if (!changeTeacherId) {
		var row = gridManager.getSelectedRow();
		if (!row) {
			Public.tip('请选择数据！');
			return;
		}
		changeTeacherId = row.changeTeacherId;
	}
	parent.addTabItem({
		tabid : 'HRChangeTeacherApply' + changeTeacherId,
		text : '更换督导师',
		url : web_app.name + '/changeTeacherAction!showUpdate.job?bizId='
				+ changeTeacherId + '&isReadOnly=true'
	});

}

// 删除按钮
function deleteHandler() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！');
		return;
	}
	UICtrl.confirm('确定删除吗?', function() {
		// 所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/changeTeacherAction!delete.ajax', {},
				function() {
					reloadGrid();
				});
	});
	/*
	 * DataUtil.del({action:'changeTeacherAction!delete.ajax',
	 * gridManager:gridManager,idFieldName:'id', onCheck:function(data){ },
	 * onSuccess:function(){ reloadGrid(); } });
	 */
}

// 新增保存
function insert() {
	/*
	 * var id=$('#detailId').val(); if(id!='') return update();
	 */
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/changeTeacherAction!insert.ajax',
		success : function(data) {
			// 如果不关闭对话框这里需要对主键赋值
			// $('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

// 编辑保存
function update() {
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/changeTeacherAction!update.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

// 关闭对话框
function dialogClose() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}
