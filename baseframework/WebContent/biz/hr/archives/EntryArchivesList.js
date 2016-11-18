var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveHandler:saveHandler,
		  exportExcelHandler: function(){
				UICtrl.gridExport(gridManager);
			}
		});
	gridManager = UICtrl.grid('#maingrlistid', {
		columns: [
		{ display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left",
		 editor : {
				type : 'text',
				required : false
			}},	
		{ display: "AD用户名", name: "f07", width: 100, minWidth: 60, type: "string", align: "left",
		 editor : {
				type : 'text',
				required : false
			}},	
		{ display: "综管默认账号", name: "loginName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "入职时间", name: "employedDate", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "路径", name: "fullName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "通讯号码", name: "phoneNumber", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "邮箱", name: "f02", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "督导师", name: "teacher", width: 150, minWidth: 60, type: "string", align: "left",
			editor: { type: 'select', required: false, data: { type:"sys", name: "orgSelect", 
				getParam: function(){
					return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm' and instr(full_id, '.prj') = 0  "};
				},
				back:{personMemberId: "teacherId", personMemberName: "teacher" }
		}}}
		],
		dataAction : 'server',
		url: web_app.name+'/hrArchivesAction!queryEntryList.ajax',
		manageType:'hrArchivesManage',
		autoAddRowByKeydown:false,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		pageSize : 20,
		headerRowHeight : 25,
		toolbar: toolbarOptions,
		rowHeight : 25,
		enabledEdit: true,
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

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
function  saveHandler(){
	var extendedData=getExtendedData();
	
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/entryCheckAction!saveTeacher.ajax',
		param : {extendedData:$.toJSON(extendedData)},
		success : function() {	
			parent.Public.successTip("保存成功！");
			reloadGrid();
		}
	});

}

function getExtendedData() {
	var extendedData = DataUtil.getGridData({gridManager: gridManager});
	if(!extendedData){
		return false;
	}
	return extendedData;
}
