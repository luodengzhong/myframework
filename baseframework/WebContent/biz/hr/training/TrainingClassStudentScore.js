var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveHandler:saveHandler,
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		saveImpHandler:saveImpHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
            { display: "班级", name: "className", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "学员姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" },
            { display: "单位名称", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "岗位名称", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "行政级别", name: "posLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "培训考试成绩", name: "examScore", width: 100, minWidth: 60, type: "string", align: "left" ,
             editor: { type: 'spinner', mask : 'nnnnnn'}}
        ],
		dataAction : 'server',
		url: web_app.name+'/trainingClassStudentAction!slicedQuery.ajax',
        parms:{trainingSpecialClassId:$("#trainingSpecialClassId").val()},
		pageSize : 20,
		enabledEdit : true,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'classStudentId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
function saveHandler(){
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	});
	Public.ajax(web_app.name+'/trainingClassStudentAction!saveExamScore.ajax',
			    {extendedData:$.toJSON(extendedData)},
			      function(){
			    		reloadGrid();
			    		}
			    	);
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

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}


//批量导入培训员工
function saveImpHandler(){
	var serialId=$("#trainingSpecialClassId").val();
	if(!serialId){
		Public.tip('未找到对应班级id！');
		return false;
	}
	UICtrl.showAssignCodeImpDialog({title:'导入培训员工考试成绩数据',serialId:serialId,templetCode:'impTrainingStudentExamScore'});
}
