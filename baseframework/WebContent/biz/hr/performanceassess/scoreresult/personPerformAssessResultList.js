var gridManager = null, refreshFlag = false,performanceLevelData=null,archivesState=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	archivesState=$('#tempArchivesState').combox('getJSONData');
    performanceLevelData=$('#mainPerformanceLevel').combox('getJSONData');
    $('#periodIndex').combox({checkbox:true,data:{}});
	$('#periodCode').combox({
			onChange:function(obj){
				var value = obj.value;
				setPriodIndex(value);
			}
	}).combox('setValue','quarter');
	var value =$('#periodCode').combox().val(); 
	setPriodIndex(value);	 
	initializeGrid();
});
function setPriodIndex(value){
	if("month"==value){
		$('#periodIndex').combox('setData',{
			1:'1月',
			2:'2月',
			3:'3月',
			4:'4月',
			5:'5月',
			6:'6月',
			7:'7月',
			8:'8月',
			9:'9月',
			10:'10月',
			11:'11月',
			12:'12月'
		});
	}else if("quarter"==value){
		$('#periodIndex').combox('setData',{
			1:'1季度',
			2:'2季度',
			3:'3季度',
			4:'4季度'
		});
	}else {
		$('#periodIndex').combox('setData',{});					
	}				
}
//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		  		{ display: "员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left"},
		  		{ display: "考核年", name: "year", width: 100, minWidth: 60, type: "string", align: "left" },
		  		{ display: "考核周期", name: "periodCodeName", width: 100, minWidth: 60, type: "string", align: "left" },
		  		{ display: "绩效排名等级", name: "effectiveRank", width: 100, minWidth: 60, type: "string", align: "left",
		  		render: function (item) { 
	 					return performanceLevelData[item.effectiveRank];
	 			    } 	 		},
		  		{ display: "员工所在单位", name: "organizationName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "员工所在部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		  		{ display: "员工所在岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" }		      
		  		],
		dataAction : 'server',
		url: web_app.name+'/performAssessResultAction!slicedPersonPerformAssessResultQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'rankSequence',
		sortOrder:'desc',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
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

