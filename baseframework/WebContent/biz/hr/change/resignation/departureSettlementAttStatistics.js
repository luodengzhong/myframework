var gridManager = null;
var attStatId=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	attStatId=Public.getQueryStringByName("attStatId");
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		queryAttendance:{id:'queryAttendance',text:'期间详细',img:'page_dynamic.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			var archiviesId=data.archiviesId;
			var periodId=data.periodId;
			var name=data.staffName;
			parent.UICtrl.showFrameDialog({
				title:'['+name+']期间详细',
				url: web_app.name + '/attStatisticsAction!forwardAttAttendancePerson.do', 
				param:{archiviesId:archiviesId,periodId:periodId},
				height:400,
				width:getDefaultDialogWidth(),
				resize:true,
				ok:false,
				cancel:true
			});
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
				{ display: "姓名", name: "staffName", width: 80, minWidth: 80, type: "string", align: "center",frozen: true },
				{ display: "开始时间", name: "startDate", width: 80, minWidth: 80, type: "date", align: "left",frozen: true },
				{ display: "结束时间", name: "endDate", width: 80, minWidth: 80, type: "date", align: "left",frozen: true },
				{ display: "未打卡次数", name: "withoutCard", width: 80, minWidth: 80, type: "string", align: "center" },	
				{ display: "打卡异常次数", name: "exceptionNumber", width:80, minWidth: 80, type: "string", align: "center" },	
				{ display: "病假天数", name: "sickLeave", width: 80, minWidth: 80, type: "string", align: "center" },
				{ display: "事假天数", name: "personalAffair", width: 80, minWidth: 80, type: "string", align: "center" },
				{ display: "产假天数", name: "maternityLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "婚假天数", name: "marriageLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "丧假天数", name: "funeralLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "年休假天数", name: "annualLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "考试假天数", name: "examination", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "陪产假天数", name: "accompanyMaternityLeave", width: 80, minWidth: 80, type: "string", align: "center"},
		  		{ display: "周末加班天数", name: "weekendOvertime", width: 150, minWidth: 150, type: "string", align: "center" },		   
				{ display: "节假日加班天数", name: "holidayOvertime", width: 150, minWidth: 150, type: "string", align: "center" },	
				//{ display: "一般加班天数", name: "commonOvertime", width: 150, minWidth: 150, type: "string", align: "center" },	
				{ display: "驾驶员晚上", name: "driverNight", width: 150, minWidth: 150, type: "string", align: "center" },
				{ display: "驾驶员夜班车", name: "driverNightBus", width: 150, minWidth: 150, type: "string", align: "center" },
				{ display: "迟到次数（15分钟内）", name: "late15", width: 80, minWidth: 80, type: "string", align: "center" },
				{ display: "迟到次数（16－30分钟）", name: "late1630", width: 150, minWidth: 150, type: "string", align: "center" },
				{ display: "迟到次数（31－60分钟）", name: "late3160", width: 150, minWidth: 150, type: "string", align: "center"},
				{ display: "迟到次数（60分钟以上）", name: "late61", width: 150, minWidth: 150, type: "string", align: "center"},
				{ display: "早退次数（15分钟内）", name: "leaveEarly15", width: 150, minWidth: 150, type: "string", align: "center"},
				{ display: "早退次数（16－30分钟）", name: "leaveEarly1630", width: 150, minWidth: 80, type: "string", align: "center"},
				{ display: "早退次数（31－60分钟）", name: "leaveEarly3160", width: 150, minWidth: 80, type: "string", align: "center" },	
				{ display: "早退次数（60分钟以上）", name: "leaveEarly61", width: 150, minWidth: 150, type: "string", align: "center" },
				{ display: "出勤天数", name: "attendance", width: 150, minWidth: 150, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!queryPersonalAttStatistics.ajax',
		parms:{attStatId:attStatId},
		pageSize : 20,
		width : '99.9%',
		height : '300',
		sortName:'sequence',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		usePager:false,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onSuccess:function(data){
			var Total=data.Total;
			if(Total==0){
				Public.errorTip('结算的考勤数据已被删除！');
			}
		}
	});
}