var relationTaskGridManager = null;
$(document).ready(function() {
	initRelationPlan();
});

function initRelationPlan(){
	relationTaskGridManager = UICtrl.grid('#relationTaskGrid', {
		columns: [
		{ display: "计划名称", name: "taskName", width: 300, minWidth: 60, type: "string", align: "left" },	
		//{ display: "计划类别", name: "taskKindName", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "级别", name: "taskLevel", width: 60, minWidth: 60, type: "string", align: "left",render:function(item){
			var _nm = "";
			var _val = item.taskLevel;
			if(_val=='hza')
				_nm = '核重A';
			else if(_val=='hz')
				_nm = '核重';
			else if(_val=='5a')
				_nm = '5A';
			else if(_val=='4a')
				_nm = '4A';
			else if(_val=='3a')
				_nm = '3A';
			else if(_val=='c')
				_nm = 'C';
			
			return _nm;
		}},		   
		{ display: "计划开始时间", name: "startDate", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "计划结束时间", name: "finishDate", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "责任人", name: "ownerName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "责任部门", name: "dutyDeptName", width: 180, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/planTaskManagerAction!getRelationTasks.ajax',
        parms: {
        	owningObjectId: $("#owningObjectId").val(),
        	managerType: $("#managerType").val()
        },
		usePager : false,
//		pageSize : 20,		
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'id',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox : true
	});
	
	//UICtrl.setSearchAreaToggle(relationGridManager);
}


//查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(relationTaskGridManager, param);
}

//刷新表格
function reloadGrid() {
	relationTaskGridManager.loadData();
}

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}



