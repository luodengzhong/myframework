var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "内容", name: "item", width: 250, minWidth: 60, type: "string", align: "left" },	
		 {display: '得分票数', columns:[
		         { display: "1分", name: "one", width: 80, minWidth: 60, type: "string", align: "center"},		   
		         { display: "2分", name: "two", width: 80, minWidth: 60, type: "string", align: "center"},		   
		         { display: "3分", name: "three", width: 80, minWidth: 60, type: "string", align: "center"},		   
		         { display: "4分", name: "four", width: 80, minWidth: 60, type: "string", align: "center"},		   
		         { display: "5分", name: "five", width: 80, minWidth: 60, type: "string", align: "center"},		   
		         { display: "6分", name: "six", width: 80, minWidth: 60, type: "string", align: "center"},		   
		         { display: "7分", name: "seven", width: 80, minWidth: 60, type: "string", align: "center"},		   
		         { display: "8分", name: "eight", width: 80, minWidth: 60, type: "string", align: "center"},		   
		         { display: "9分", name: "night", width: 80, minWidth: 60, type: "string", align: "center"},		   
		         { display: "10分", name: "ten", width: 80, minWidth: 60, type: "string", align: "center"}	   
		 ]},
		{ display: "平均得分", name: "indexAvgScore", width: 100, minWidth: 60, type: "string", align: "center" }		   
		],
		dataAction : 'server',
		url: web_app.name+'/trainingEffectEvaAction!slicedQueryTrainingEvaluateIndex.ajax',
		parms:{trainingClassCourseId:$('#trainingClassCourseId').val()},
		pageSize : 20,
		usePager:false,
		width : '100%',
		height : '99%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'type',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
		
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
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
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingEffectEvaAction!showInsertTrainingEvaluateDetail.load', ok: insert, close: dialogClose});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingEffectEvaAction!showUpdateTrainingEvaluateDetail.load', param:{}, ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/trainingEffectEvaAction!deleteTrainingEvaluateDetail.ajax', {}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'trainingEffectEvaAction!deleteTrainingEvaluateDetail.ajax',
		gridManager:gridManager,idFieldName:'id',
		onCheck:function(data){
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});*/
}

//新增保存
function insert() {
	/*
	var id=$('#detailId').val();
	if(id!='') return update();
	*/
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingEffectEvaAction!insertTrainingEvaluateDetail.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			//$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingEffectEvaAction!updateTrainingEvaluateDetail.ajax',
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
/*
//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "trainingEffectEvaAction!updateTrainingEvaluateDetailSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'trainingEffectEvaAction!updateTrainingEvaluateDetailStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'trainingEffectEvaAction!updateTrainingEvaluateDetailStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
