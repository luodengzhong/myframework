var gridManager = null;
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
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "名称", name: "name", width: 200, minWidth: 60, type: "string", align: "left" },		   
			{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left"},		   
			{ display: "起征额", name: "startTax", width: 150, minWidth: 60, type: "string", align: "left"},		   
			{ display: "是否默认", name: "isDefault", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.isDefault);
			}}
		],
		dataAction : 'server',
		url: web_app.name+'/paySetupAction!slicedMainPersontaxrateQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox:true,
		autoAddRow:{},
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.mainId);
		}
	});
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'paySetupAction!deleteMainPersontaxrate.ajax',
		gridManager:gridManager,
		idFieldName:'mainId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/paySetupAction!showInsertMainPersontaxrate.load',width:320, ok: save});
}

//编辑按钮
function updateHandler(mainId){
	debugger;
	if(!mainId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		mainId=row.mainId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/paySetupAction!showUpdateMainPersontaxrate.load',width:320, param:{mainId:mainId}, ok: save});
}

//新增保存
function save() {
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/paySetupAction!saveMainPersontaxrate.ajax',
		success : function(data) {
			_self.close();
			reloadGrid();		  
		}
	});
}