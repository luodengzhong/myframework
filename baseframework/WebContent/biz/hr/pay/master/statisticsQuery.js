var gridManager = null,queryType=null;
var organId=null,periodId=null,registrationId=null,type=null,serialId=null;
$(document).ready(function() {
	organId = Public.getQueryStringByName("organId");
	periodId = Public.getQueryStringByName("periodId");
	serialId = Public.getQueryStringByName("serialId");
	registrationId= $('#registrationId').val();
	type= $('#type').val();
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	initStatisticsType();
}

function initStatisticsType(){
	var type = $("#type").val();
	if("0"==type || "2"==type || "3"==type){ //按薪资发放单位汇总
		$("#mainRegistrationId").hide();
	}else {//按项目汇总
		$("#mainRegistrationId").show();
	}
	$("#type").combox({onChange:function(){
		var type = $("#type").val();
		if("0"==type || "2"==type || "3"==type){
			$("#mainRegistrationId").hide();
		}else {
			$("#mainRegistrationId").show();
		}
	}});	
}

//初始化表格
function initializeGrid() {
	var url= web_app.name+'/paymasterAction!statisticsQuery.ajax';
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	var columns= [
	   { display: "汇总口径", name: "汇总口径", width: 190, minWidth: 60, type: "string", align: "left" },		   
	   { display: "基本工资", name: "基本工资", width: 80, minWidth: 60, type: "string", align: "left" },		   
	   { display: "绩效工资", name: "绩效工资", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "工龄工资", name: "工龄工资", width: 80, minWidth: 60, type: "date", align: "left" },
	   { display: "独生子女补贴", name: "独生子女补贴", width: 80, minWidth: 60, type: "string", align: "left" },		   
	   { display: "加班补贴", name: "绩加班补贴", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "午餐补贴", name: "工午餐补贴", width: 80, minWidth: 60, type: "date", align: "left" },
	   { display: "其它补贴", name: "其它补贴", width: 80, minWidth: 60, type: "string", align: "left" },		   
	   { display: "异地津贴", name: "异地津贴", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "销售提成", name: "销售提成", width: 80, minWidth: 60, type: "date", align: "left" },
	   { display: "奖励", name: "奖励", width: 80, minWidth: 60, type: "string", align: "left" },		   
	   { display: "补发工资", name: "补发工资", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "生日礼金", name: "工生日礼金", width: 80, minWidth: 60, type: "date", align: "left" },	   
	   { display: "罚款", name: "罚款", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "扣养老保险", name: "扣养老保险", width: 80, minWidth: 60, type: "string", align: "left" },	
	   { display: "扣医疗保险金", name: "扣医疗保险金", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "扣失业保险金", name: "扣失业保险金", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "扣住房公积金", name: "扣住房公积金", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "考勤扣款", name: "考勤扣款", width:80, minWidth: 60, type: "string", align: "left" },
	   { display: "其它扣款", name: "其它扣款", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "税后补发", name: "税后补发", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "税后补扣", name: "税后补扣", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "计税工资", name: "计税工资", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "个人所得税", name: "个人所得税", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "扣款合计", name: "扣款合计", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "应发工资", name: "应发工资", width: 80, minWidth: 60, type: "string", align: "left" },
	   { display: "实发工资", name: "实发工资", width: 80, minWidth: 60, type: "string", align: "left" }
	];
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url:url,
		usePager: true,
		pageSize:20,
		parms:{periodId:periodId,organId:organId,registrationId:registrationId,type:type,currSerialId:serialId},
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		toolbar: toolbarOptions,
		rowHeight : 25,
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
}