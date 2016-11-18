var attendanceStatus=null;
var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	attendanceStatus=$('#attendanceStatus').combox('getJSONData');
}


//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			  		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "center" },		   
					{ display: "单据号码", name: "billCode", width: 140, minWidth: 140, type: "string", align: "center" },
					{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "center" },
					{ display: "出差人", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" },
					{ display: "出差人单位", name: "organName", width: 180, minWidth: 180, type: "string", align: "center" },	
				    { display: "出差人中心", name: "centerName", width: 120, minWidth: 120, type: "string", align: "lecenterft" },	
				    { display: "出差地点", name: "address", width: 150, minWidth: 60, type: "string", align: "center" },
				    { display: "开始时间", name: "startDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "结束时间", name: "endDate", width: 130, minWidth: 60, type: "datetime", align: "center" },
				    { display: "状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "center",
				    	render: function (item) { 
							return attendanceStatus[item.status];
						}
				    }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryOwnerBusinessTripList.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'asc',
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.businessTripId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}


function viewHandler(businessTripId){
	if(!businessTripId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		businessTripId=row.businessTripId;
	}
	
	parent.addTabItem({
		tabid: 'attBusinessTrip'+businessTripId,
		text: '出差单明细',
		url: web_app.name + '/attBusinessTripAction!showUpdate.job?bizId=' 
			+ businessTripId+'&isReadOnly=true'
	}
	);
	
}

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}