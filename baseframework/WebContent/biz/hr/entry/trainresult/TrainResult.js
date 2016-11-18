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
		html.push('新员工培训结果表');
	} else {
		fullId = data.fullId, fullName = data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[', fullName,
				']</font>新员工培训结果表');
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
		addHandler : addHandler,
		updateHandler : function() {
			updateHandler();
		},
		deleteHandler : deleteHandler,
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns : [ {
			display : "员工姓名",
			name : "staffName",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, 
		{
			display : "培训类型",
			name : "trainTypeTextView",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		},
        {
			display : "培训分数",
			name : "score",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "制度考试时间",
			name : "examTime",
			width : 100,
			minWidth : 60,
			type : "date",
			align : "left"
		}, {
			display : "培训开始时间",
			name : "startTime",
			width : 100,
			minWidth : 60,
			type : "date",
			align : "left"
		}, {
			display : "培训结束时间",
			name : "endTime",
			width : 100,
			minWidth : 60,
			type : "date",
			align : "left"
		},
		{
			display : "培训标识",
			name : "trainStatusTextView",
			width : 100,
			minWidth : 60,
			type : "date",
			align : "left"
		}
		],
		dataAction : 'server',
		url : web_app.name + '/trainResultAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName : 'startTime',
		sortOrder : 'desc',
		toolbar : toolbarOptions,
		checkbox : true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
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
		url : web_app.name + '/trainResultAction!showInsert.load',
		title : "新增培训结果",
		width : 500,
		init : initdialog,
		ok : insert,
		close : dialogClose
	});
}
function initdialog() {
	$('#staffName').searchbox({
		type : 'hr',
		name : 'personArchiveSelect',
		back : {
			archivesId : '#archivesId',
			staffName : '#staffName'
		}
	});

}
// 编辑按钮
function updateHandler(id) {
	if (!id) {
		var row = gridManager.getSelectedRow();
		if (!row) {
			Public.tip('请选择数据！');
			return;
		}
		id = row.id;
	}
	// 所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({
		url : web_app.name + '/trainResultAction!showUpdate.load',
		param : {
			id : id
		},
		title : "修改培训结果",
		width : 500,
		init : initdialog,
		ok : update,
		close : dialogClose
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
		Public.ajax(web_app.name + '/trainResultAction!delete.ajax', {
			id : row.id
		}, function() {
			reloadGrid();
		});
	});
}

// 新增保存
function insert() {
	
	var id=$('#id').val();
	if(id!='') return update();
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/trainResultAction!insert.ajax',
		success : function(data) {
			// 如果不关闭对话框这里需要对主键赋值
			 $('#id').val(data);
			refreshFlag = true;
		}
	});
}

// 编辑保存
function update() {
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/trainResultAction!update.ajax',
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
/*
 * //保存扩展字段排序号 function saveSortIDHandler(){ var action =
 * "trainResultAction!updateSequence.ajax"; DataUtil.updateSequence({action:
 * action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
 * reloadGrid(); }}); return false; }
 * 
 * //启用 function enableHandler(){ DataUtil.updateById({ action:
 * 'trainResultAction!updateStatus.ajax', gridManager:
 * gridManager,idFieldName:'id', param:{status:1}, message:'确实要启用选中数据吗?',
 * onSuccess:function(){ reloadGrid(); } }); } //禁用 function disableHandler(){
 * DataUtil.updateById({ action: 'trainResultAction!updateStatus.ajax',
 * gridManager: gridManager,idFieldName:'id',param:{status:-1}, message:
 * '确实要禁用选中数据吗?', onSuccess:function(){ reloadGrid(); } }); }
 */
