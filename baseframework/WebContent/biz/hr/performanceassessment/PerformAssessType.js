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
		deleteHandler: deleteHandler,
		saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
	    { display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "center",
	    	 render: function (item) { 
			     return "<input type='text' id='txtSequence_" + item.typeId + "' class='textbox' value='" + item.sequence + "' />";
       	   }},
		{ display: "名称", name: "name", width: 200, minWidth: 60, type: "string", align: "left" },	  
		{ display: "编码", name: "code", width: 200, minWidth: 60, type: "string", align: "left" },
		{ display: "所属类别", name: "paTypeTextView", width: 200, minWidth: 60, type: "string", align: "left" }

		],
		dataAction : 'server',
		url: web_app.name+'/performassessAction!slicedQueryPerformAssessType.ajax',
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
			updateHandler(data.typeId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
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
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!showInsertPerformAssessType.load', 
		ok: insert, 
		width:300,
		title:"新增绩效考核类别",
		init:initDialog,
		close: dialogClose});
}

function initDialog(){
	//姓名转拼音
	$('#name').on('blur',function(){
		$('#code').val($.chineseLetter($(this).val()));
	});
}
//编辑按钮
function updateHandler(typeId){
	if(!typeId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		typeId=row.typeId;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!showUpdatePerformAssessType.load', 
		param:{typeId:typeId}, 
		ok: update, 
		init:initDialog,
		width:300,
		title:"修改绩效考核类别",
		close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/performassessAction!deletePerformAssessType.ajax', {typeId:row.typeId}, 
				function(){
			     reloadGrid();
		});
	});

}

//新增保存
function insert() {
	var typeId=$('#typeId').val();
	if(typeId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performassessAction!insertPerformAssessType.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#typeId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/performassessAction!updatePerformAssessType.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}
   //保存排序号
function saveSortIDHandler(){
	var action = "performassessAction!updatePerformAssessTypeSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager, idFieldName:'typeId', onSuccess: function(){
		reloadGrid();
	}});
}
//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

