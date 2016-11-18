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
		   
		{ display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "center",
	    	 render: function (item) { 
			     return UICtrl.sequenceRender(item,'welfareCommodityId');
      	   }},
		{display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return getStatusInfo(item.status);
			}}
		],
		dataAction : 'server',
		url: web_app.name+'/welfareCommodityAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.welfareCommodityId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
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
	UICtrl.showAjaxDialog({url: web_app.name + '/welfareCommodityAction!showInsert.load',
		ok: insert, 
		width:300,
		title:'添加福利类型',
		close: dialogClose});
}

//编辑按钮
function updateHandler(welfareCommodityId){
	if(!welfareCommodityId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		welfareCommodityId=row.welfareCommodityId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/welfareCommodityAction!showUpdate.load', 
		param:{welfareCommodityId:welfareCommodityId}, 
		ok: update, 
		width:300,
		title:'修改福利类型',
		close: dialogClose});
}



//新增保存
function insert() {
	var welfareCommodityId=$('#welfareCommodityId').val();
	if(welfareCommodityId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/welfareCommodityAction!insert.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#welfareCommodityId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/welfareCommodityAction!update.ajax',
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
	var action = "welfareCommodityAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager, onSuccess: function(){
		reloadGrid();
	}});	
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'welfareCommodityAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'welfareCommodityId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'welfareCommodityAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'welfareCommodityId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

