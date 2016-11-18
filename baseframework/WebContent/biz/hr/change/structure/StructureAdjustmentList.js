var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){
			updateHandler();
		},
		updateEffectDateHandler:{id:'updateEffectDateHandler',text:'修改生效时间',img:'page_settings.gif',click:function(){
				updateEffectDateHandler();
			}
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [		   
		  		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "center" },		   
				{ display: "单据号码", name: "billCode", width: 140, minWidth: 140, type: "string", align: "center" },
				{ display: "公司", name: "organName", width: 100, minWidth: 60, type: "string", align: "center" },	
				{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "center" },	
				{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "lecenterft" },	
				{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "状态", name: "statusTextView", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "生效时间", name: "effectiveDate", width:80, minWidth: 100, type: "string", align: "left"},
				{display: "原因", name: "reason", width:300, minWidth: 200, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/structureAdjustmentAction!slicedQueryUnusualChange.ajax',
		parms:{billCodeNotnull:1},//不查询出导入数据
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.auditId);
		}
		
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.auditId;
	}else{
		auditId=id;
	}
	
	parent.addTabItem({
		tabid: 'HRStructureAdjustmentList'+auditId,
		text: '组织架构调整查询',
		url: web_app.name + '/structureAdjustmentAction!showUpdate.job?bizId=' 
			+ auditId+'&isReadOnly=true'
	}
	);
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
}

//修改生效时间按钮
function  updateEffectDateHandler(){
	
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var auditId=row.auditId;
	UICtrl.showAjaxDialog({
		title : "生效时间修改",
		width : 400,
		url : web_app.name + '/reshuffleAction!forwardEffectDateChange.load',
		ok : function(){
			var _self=this;
			$('#effectDateChangeForm').ajaxSubmit({
				url : web_app.name + '/reshuffleAction!insertEffectDateChangeLog.ajax',
				param:{auditId:auditId,unusualType:1},
				success : function() {
					_self.close();
					reloadGrid();	
				}
			});
		}
	});

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
