var gridManager = null, refreshFlag = false,checkTimes={"onDuty":'上班', "offDuty":'下班'},notCardKindList=null,levelsAll={};
$(document).ready(function() {
	notCardKindList=$('#notCardKindId').combox('getJSONData');
	delete notCardKindList['Other'];
	//排班班次
	getWorkShift();
	//行政班
	levelsAll["onDuty"]="上午上班";
	levelsAll["offDuty"]="下午下班";
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

function getWorkShift(){
	//获取机构排班班次
	 $.ajax({
    	async: false,
			type: "post",
			url: web_app.name+'/attNotCardCertificateAction!queryPersonDuty.ajax',
			success: function (data) {
				var resultData = data.data;
				$.each(resultData, function (index, data) {
					levelsAll[data.id] = data.name;
               });
			},
			dataType: 'json'
    });
}

//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			  		{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "center" },		   
					{ display: "单据号码", name: "billCode", width: 140, minWidth: 140, type: "string", align: "center" },
					{ display: "制表人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "center" },
					{ display: "单位", name: "organName", width: 180, minWidth: 180, type: "string", align: "center" },	
				    { display: "中心", name: "centerName", width: 120, minWidth: 120, type: "string", align: "lecenterft" },	
				    { display: "未打卡日期", name: "fdate", width: 100, minWidth: 60, type: "date", align: "center" },
				    { display: "未打卡时间", name: "checkTime", width: 100, minWidth: 60, type: "string", align: "center",
						render: function (item) { 
							//return checkTimes[item.checkTime];
							return levelsAll[item.checkTime];
						}		
	
				    },
				    { display: "未打卡类别", name: "kindId", width: 100, minWidth: 60, type: "string", align: "center",
						render: function (item) { 
							return notCardKindList[item.kindId];
						}
				    },
				    { display: "状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "center"}
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryOwnerNotCardList.ajax',
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
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
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