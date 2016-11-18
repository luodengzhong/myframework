var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   
		{ display: "名称", name: "periodName", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "周期天数", name: "periodDay", width: 100, minWidth: 60, type: "string", align: "left" },		   
//		{ display: "向上浮动值", name: "upRange", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "向下浮动值", name: "downRange", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "模式", name: "modelTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "center",
	    	 render: function (item) { 
			     return "<input type='text' id='txtSequence_" + item.periodId + "' class='textbox' value='" + item.sequence + "' />";
      	   }},
		{display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return getStatusInfo(item.status);
			}}
		],
		dataAction : 'server',
		url: web_app.name+'/performancePeriodAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.periodId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}


function getStatusInfo(sts) {
    switch (parseInt(sts)) {
        case -1:
            return "<div class='No' title='禁用'/>";
            break;
        case 0:
            return "<div class='tmp' title='草稿'/>";
            break;
        case 1:
            return "<div class='Yes' title='启用'/>";
            break;
    }
}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/performancePeriodAction!showInsert.load',
		ok: insert, 
		width:300,
		title:'添加考核类别',
		close: dialogClose});
}

//编辑按钮
function updateHandler(periodId){
	if(!periodId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		periodId=row.periodId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/performancePeriodAction!showUpdate.load', 
		param:{periodId:periodId}, 
		ok: update, 
		width:300,
		title:'修改考核类别',
		close: dialogClose});
}



//新增保存
function insert() {
	var periodId=$('#periodId').val();
	if(periodId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performancePeriodAction!insert.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#periodId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performancePeriodAction!update.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "performancePeriodAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'periodId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'performancePeriodAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'periodId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'performancePeriodAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'periodId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

