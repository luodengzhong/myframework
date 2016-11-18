var gridManager = null, refreshFlag = false;
var  dataSource={
		yesorno:{1:'是',0:'否'}
};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		//deleteHandler: deleteHandler
		viewHandler:function(){
			viewHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "生成时间", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },	
		{ display: "员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "督导师", name: "teacher", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "评分时间", name: "scoreTime", width: 100, minWidth: 60, type: "date", align: "left" },	
        { display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "总分", name: "sumScore", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "员工是否完成督导任务", name: "isFinish", width: 150, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return dataSource.yesorno[item.isFinish];
			} }
		],
		dataAction : 'server',
		url: web_app.name+'/teacherScoreAction!slicedQuery.ajax',
		manageType:'hrBaseRecruitData',
		parms:{type:1},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		toolbar: toolbarOptions,
		rowHeight : 25,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.teacherScoreId);
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
	UICtrl.showAjaxDialog({url: web_app.name + '/teacherScoreAction!showInsert.load', ok: insert, close: dialogClose});
}

//编辑按钮
function viewHandler(teacherScoreId){
	if(!teacherScoreId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		teacherScoreId=row.teacherScoreId;
	}
	parent.addTabItem({
		tabid: 'HRTeacherScore'+teacherScoreId,
		text: '督导师评分表',
		url: web_app.name + '/teacherScoreAction!showUpdate.job?bizId=' 
			+ teacherScoreId
	});

	
	
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/teacherScoreAction!delete.ajax', {}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'teacherScoreAction!delete.ajax',
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
	$('#submitForm').ajaxSubmit({url: web_app.name + '/teacherScoreAction!insert.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			//$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/teacherScoreAction!update.ajax',
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
	var action = "teacherScoreAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'teacherScoreAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'teacherScoreAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
