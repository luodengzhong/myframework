var tempGrid = null, gridManagerAdd = null, gridManagerMinus = null, refreshFlag = false, maingridAdd = "#maingridAdd", maingridMinus = "#maingridMinus", typeAdd = "add", typeMinus = 'minus';
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid(maingridAdd, typeAdd, $("#parentId").val());
	initializeGrid(maingridMinus, typeMinus, $("#parentId").val());
});

// 初始化表格
function initializeGrid(gridName, type, parentId) {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addHandler : function() {
		},
		deleteHandler : function() {
			deleteHandler(gridName);
		},
		enableHandler : function() {
			enableHandler(gridName);
		},
		disableHandler : function() {
			disableHandler(gridName);
		}
	});

	tempGrid = UICtrl.grid(gridName, {
		columns : [ {
			display : "栏目名称",
			name : "salaryItemDisplay",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "归属",
			name : "wageAffiliationTextView",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "栏目代码",
			name : "salaryItemName",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "状态",
			name : "status",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left",
			render : function(item) {
				return UICtrl.getStatusInfo(item.status);
			}
		} ],
		dataAction : 'server',
		url : web_app.name
				+ '/salarySubjectDetailAction!slicedQuery.ajax?type=' + type
				+ '&parentId=' + parentId,
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName : 'salaryItemName',
		sortOrder : 'asc',
		toolbar : toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	if (type == typeAdd)
		gridManagerAdd = tempGrid;
	else
		gridManagerMinus = tempGrid;
	$(gridName + ' #toolbar_menuAdd').comboDialog({
		type : 'hr',
		name : 'chooseSalaryItem',
		width : 290,
		dataIndex : 'id',
		checkbox : true,
		manageType : '',
		onShow : function() {
			var parentId = $("#parentId").val();
			var setbookId = $("#setbookId").val();
			var wageAffiliation = $("#wageAffiliation").val();
			if (!parentId || !setbookId || !wageAffiliation) {
				Public.errorTip('请先选择归属!');
				return false;
			}
			return true;
		},
		getParam : function() {
			/* return {receptionUnvisitAuditId:getId()}; */
		},
		onChoose : function() {
			var rows = this.getSelectedRows();
			var salaryItems = [], addRow;
			$.each(rows, function(i, o) {
				addRow = $.extend({}, o);
				addRow['salaryItemId'] = o['id'];
				addRow['salaryItemName'] = o['name'];
				addRow['salaryItemDisplay'] = o['display'];
				addRow['columnName'] = o['columnName'];
				addRow['type'] = type;
				addRow['parentId'] = $("#parentId").val();
				addRow['setbookId'] = $("#setbookId").val();
				addRow['wageAffiliation'] = $("#wageAffiliation").val();
				salaryItems.push(addRow);

			});
			var url = web_app.name + '/salarySubjectDetailAction!insert.ajax';
			Public.ajax(url, {
				detailData : encodeURI($.toJSON(salaryItems))
			}, function(data) {
				if (data)
					UICtrl.alert(data);
				$("#wageAffiliation_text").val('');
				$("#wageAffiliation").val('');
				reloadGrid(gridName);
			});
			return true;
		}
	});

	// UICtrl.setSearchAreaToggle(gridManager);
}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

// 刷新表格
function reloadGrid(gridName) {
	if (gridName == maingridAdd)
		gridManagerAdd.loadData();
	else
		gridManagerMinus.loadData();
}

// 重置表单
function resetForm(obj) {
	$(obj).formClean();
}

// 添加按钮
function addHandler() {
	UICtrl.showAjaxDialog({
		url : web_app.name + '/salarySubjectDetailAction!showInsert.load',
		ok : insert,
		close : dialogClose
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
		url : web_app.name + '/salarySubjectDetailAction!showUpdate.load',
		param : {},
		ok : update,
		close : dialogClose
	});
}

// 删除按钮
function deleteHandler(gridName) {
	if (gridName == maingridAdd)
		var row = gridManagerAdd.getSelectedRow();
	else
		var row = gridManagerMinus.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！');
		return;
	}
	UICtrl.confirm('确定删除吗?', function() {
		// 所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/salarySubjectDetailAction!delete.ajax', {
			salarySubjectDetailId : row.salarySubjectDetailId
		}, function() {
			reloadGrid(gridName);
		});
	});
	/*
	 * DataUtil.del({action:'salarySubjectDetailAction!delete.ajax',
	 * gridManager:gridManager,idFieldName:'id', onCheck:function(data){ },
	 * onSuccess:function(){ reloadGrid(); } });
	 */
}

// 新增保存
function insert() {
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/salarySubjectDetailAction!insert.ajax',
		success : function(data) {
		}
	});
}
// 启用
function enableHandler(gridName) {
	var gridManager = null;
	if (gridName == maingridAdd) {
		gridManager = gridManagerAdd;
	} else {
		gridManager = gridManagerMinus;
	}
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！');
		return;
	}
	DataUtil.updateById({
		action : 'salarySubjectDetailAction!updateStatus.ajax',
		gridManager : gridManager,
		idFieldName : 'salarySubjectDetailId',
		param : {
			status : 1,
			parentId : row.parentId,
			salaryItemName : row.salaryItemName,
			setbookId : $("#setbookId").val(),
			type : row.type,
			wageAffiliation : row.wageAffiliation,
			salaryItemDisplay : row.salaryItemDisplay
		},
		message : '确实要启用选中数据吗?',
		onSuccess : function(data) {
			// Public.tip(data);
			if (data)
				UICtrl.alert(data);
			reloadGrid(gridName);
		}
	});
}
// 禁用
function disableHandler(gridName) {
	var gridManager = null;
	if (gridName == maingridAdd)
		gridManager = gridManagerAdd;
	else
		gridManager = gridManagerMinus;
	DataUtil.updateById({
		action : 'salarySubjectDetailAction!updateStatus.ajax',
		gridManager : gridManager,
		idFieldName : 'salarySubjectDetailId',
		param : {
			status : -1
		},
		message : '确实要禁用选中数据吗?',
		onSuccess : function() {
			reloadGrid(gridName);
		}
	});
}
// 编辑保存
function update() {
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/salarySubjectDetailAction!update.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

//关闭对话框
function dialogClose() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}
/*
 //保存扩展字段排序号
 function saveSortIDHandler(){
 var action = "salarySubjectDetailAction!updateSequence.ajax";
 DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
 reloadGrid(); 
 }});
 return false;
 }


 */
