var gridManager = null, refreshFlag = false;
var teacherLevelMap = null,teacherCriterias=null,teacherHolidayCriterias=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	teacherLevelMap = $("#TLevel").combox("getJSONData");
	teacherCriterias = $("#teacherCriterias").combox("getJSONData");
	teacherHolidayCriterias = $("#teacherHolidayCriterias").combox("getJSONData");
});
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addBatchHandler:addHandler,
		addOuterTeacherHandler:{id:'addOuterTeacher',text:'添加外部讲师',img:'page_user.gif',click:addOuterTeacherHandler},
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{display: "讲师姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center"},
			{
				display: "讲师级别",
				name: "TLevel",
				width: 100,
				minWidth: 60,
				type: "string",
				align: "center",
				render: function (item) {
					return teacherLevelMap[item.TLevel];
				}
			},
		    {display: "讲师类别", name: "teacherTypeTextView", width: 100, minWidth: 60, type: "string", align: "center"},
			{
				display: "课时费标准", name:"normalCriteria",width: 200, minWidth: 60, type: "string", align: "center", render: function (item) {
				return item.normalCriteria+"元/小时";
			}
			},
			{
				display: "节假日课时费标准",name:"holidayCriteria",
				width: 300,
				minWidth: 60,
				type: "string",
				align: "center",
				render: function (item) {
					return item.holidayCriteria+"元/小时";
				}
			},
		    {display: "所属机构", name: "ognName", width: 200, minWidth: 60, type: "string", align: "center"},
		    {display: "上课次数", name: "num", width: 60, minWidth: 60, type: "string", align: "center"},
		    {display: "平均分", name: "avgScore", width: 60, minWidth: 60, type: "string", align: "center"}
		],
		dataAction : 'server',
		url: web_app.name+'/trainingTeacherArchiveAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'trainingTeacherId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
		}
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

//添加外部讲师
function addOuterTeacherHandler(){
		UICtrl.showAjaxDialog({url: web_app.name + '/trainingTeacherArchiveAction!showInsert.load',
		width:400,title:"新增讲师",
		ok: insertOutTeacher, close: dialogClose})
}
//添加按钮 
function addHandler() {
	$("#toolbar_menuAddBatch").comboDialog({type:'hr',name:'personArchiveSelect',width:635,
		dataIndex:'archivesId',
		checkbox:true,onChoose:function(){
			var rows=this.getSelectedRows();
			var addRows = [], addRow;
			$.each(rows, function(i, o){
				addRow = {};
				addRow["archivesId"]=o["archivesId"];
				addRow["archivesName"] = o["staffName"];
				addRow["ognName"] = o["ognName"];
				addRows.push(addRow);
			});
			Public.ajax(web_app.name+"/trainingTeacherArchiveAction!insert.ajax", {teachers:$.toJSON(addRows)},function(retVal){
				reloadGrid();
			});
			return true;
		}});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingTeacherArchiveAction!showUpdate.load',
	param:{trainingTeacherId:row.trainingTeacherId}, ok: update, close: dialogClose,title:"修改讲师级别",width:400});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/trainingTeacherArchiveAction!delete.ajax', {trainingTeacherId:row.trainingTeacherId}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'trainingTeacherArchiveAction!delete.ajax',
		gridManager:gridManager,idFieldName:'id',
		onCheck:function(data){
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});*/
}

//新增保存
function insertOutTeacher() {
	var id=$('#trainingTeacherId').val();
	if(id!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingTeacherArchiveAction!insertOutTeacher.ajax',
		success : function(data) {
			$('#trainingTeacherId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingTeacherArchiveAction!update.ajax',
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
	var action = "trainingTeacherArchiveAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'trainingTeacherArchiveAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'trainingTeacherArchiveAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
