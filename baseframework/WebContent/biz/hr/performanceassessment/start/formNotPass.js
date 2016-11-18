var gridManager = null,perStatus={};
$(document).ready(function() {
	perStatus=$('#perStatusQuery').combox('getJSONData');
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
			{ display: "姓名", name: "personName", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "排名单位", name: "orgnName", width: 180, minWidth: 60, type: "string", align: "left" },
			{ display: "考核表", name: "templetName", width: 260, minWidth: 60, type: "string", align: "left" },
			{ display: "类别", name: "periodName", width: 60, minWidth: 60, type: "string", align: "left"},
			{ display: "评分人状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
				render : function(item) {
					return perStatus[item.status];
				}
			},
			{ display: "考核表状态", name: "formStatus", width:100, minWidth: 60, type: "string", align: "left",
				render : function(item) {
					return perStatus[item.formStatus];
				}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/performassessAction!slicedQueryFormotPass.ajax',
		parms:{periodCode:$('#mainPeriodCode').val(),fullId:$('#mainFullId').val()},
		pageSize : 20,
		width :860,
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		sortName:'personName',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
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
	onFolderTreeNodeClick();
}