var gridManager = null, refreshFlag = false,query_period_id=null, sumGridManager;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
 	initializeUI();
	initializeGrid();
	initializeSumGrid();
	//默认不是工资主体
	$("#isWageUnit").val(0);
	
	 
});

function initializeUI(){
	$('#isWageUnit').combox({onChange:function(){
		$('#organId').val("");
		$('#organName').val("");
	}});
	$('#organName').orgTree({filter:'ogn,dpt,pos,psm',param:{searchQueryCondition:"org_kind_id in('ogn','dpt','pos','psm')"},
		manageType:'hrPayChange,hrBaseAttManage',
		beforeChange:function(data){
				var flag=false,fullId=data.fullId, fullName = data.fullName;//是否是工资主体
				$("#fullName").val(fullName)
				Public.authenticationWageOrg('',fullId,false,function(f){
					flag=f;
					var isWageUnit = $("#isWageUnit").val();
					if(isWageUnit=="1"){
						if(f===false){
							Public.tip('选择的单位不是工资主体！');
						}
					}
					else{
						flag = true;
					}
				});
				return flag;
		},
		back:{
			text:'#organName',
			value:'#organId',
			id:'#organId',
			name:'#organName',
			fullName: '#fullName'
		}
	});
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler:function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
				{ display: "姓名", name: "staffName", width: 80, minWidth: 80, type: "string", align: "center",frozen: true },
				{ display: "开始时间", name: "startDate", width: 80, minWidth: 80, type: "date", align: "left",frozen: true },
				{ display: "结束时间", name: "endDate", width: 80, minWidth: 80, type: "date", align: "left",frozen: true },
				{ display: "忘记打卡次数", name: "withoutCard", width: 80, minWidth: 80, type: "string", align: "center" },	
				{ display: "打卡异常次数", name: "exceptionNumber", width:80, minWidth: 80, type: "string", align: "center" },	
				{ display: "病假天数", name: "sickLeave", width: 80, minWidth: 80, type: "string", align: "center" },
				{ display: "事假天数", name: "personalAffair", width: 80, minWidth: 80, type: "string", align: "center" },
				{ display: "工伤假天数", name: "industrialInjury", width: 80, minWidth: 80, type: "string", align: "center" },
				{ display: "产检假天数", name: "prenatalLeave", width: 80, minWidth: 80, type: "string", align: "center"},
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
				{ display: "延时加班（小时）", name: "delayOvertime", width: 150, minWidth: 150, type: "string", align: "center" },
				{ display: "食堂员工加班", name: "canteenStaff", width: 150, minWidth: 150, type: "string", align: "center" },
				{ display: "搬运工加班", name: "porterOvertime", width: 150, minWidth: 150, type: "string", align: "center" },
				{ display: "迟到次数（15分钟内）", name: "late15", width: 80, minWidth: 80, type: "string", align: "center",sortField:'late_15' },
				{ display: "迟到次数（16－30分钟）", name: "late1630", width: 150, minWidth: 150, type: "string", align: "center",sortField:'late_16_30' },
				{ display: "迟到次数（31－60分钟）", name: "late3160", width: 150, minWidth: 150, type: "string", align: "center",sortField:'late_31_60'},
				{ display: "迟到次数（60分钟以上）", name: "late61", width: 150, minWidth: 150, type: "string", align: "center",sortField:'late_61'},
				{ display: "早退次数（15分钟内）", name: "leaveEarly15", width: 150, minWidth: 150, type: "string", align: "center",sortField:'leave_early_15'},
				{ display: "早退次数（16－30分钟）", name: "leaveEarly1630", width: 150, minWidth: 80, type: "string", align: "center",sortField:'leave_early_16_30'},
				{ display: "早退次数（31－60分钟）", name: "leaveEarly3160", width: 150, minWidth: 80, type: "string", align: "center",sortField:'leave_early_31_60' },	
				{ display: "早退次数（60分钟以上）", name: "leaveEarly61", width: 150, minWidth: 150, type: "string", align: "center",sortField:'leave_early_61' },
				{ display: "出勤天数", name: "attendance", width: 150, minWidth: 150, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!queryPersonalBatchAttStatistics.ajax',
		pageSize : 20,
		width : '99.9%',
		height : '100%',
		sortName:'startDate',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		delayLoad:true,
		toolbar: toolbarOptions,
		rowHeight : 25,
		enabledEdit: true, 
		usePager: true, 
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		 onDblClickRow: function (data, rowindex, rowobj) {
                showAttendancePersonalDetail(data);
            }
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
function initializeSumGrid() {
	sumGridManager = UICtrl.grid('#sumMaingrid', {
		columns: [
				{ display: "时间", name: "startDate", width: 80, minWidth: 80, type: "date", align: "left",frozen: true,
	      			render: function (item) {
	      				return $("#startDate").val();
	      			} 
	      		},
				{ display: "机构", name: "fullName", width: 150, minWidth: 80, type: "date", align: "left",frozen: true,
	      			render: function (item) {
	      				return $("#fullName").val();
	      			} 
	      		},
				{ display: "忘记打卡人数", name: "withoutCard", width: 80, minWidth: 80, type: "string", align: "center" },	
				{ display: "打卡异常人数", name: "exceptionNumber", width:80, minWidth: 80, type: "string", align: "center" },
				{ display: "年休假人数", name: "annualLeave", width: 80, minWidth: 80, type: "string", align: "center"},	
				{ display: "事假人数", name: "personalAffair", width: 80, minWidth: 80, type: "string", align: "center" },
				{ display: "病假人数", name: "sickLeave", width: 80, minWidth: 80, type: "string", align: "center" },
				{ display: "婚假人数", name: "marriageLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "产假人数", name: "maternityLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "产检假人数", name: "prenatalLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "陪产假人数", name: "accompanyMaternityLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "丧假人数", name: "funeralLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "考试假人数", name: "examination", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "工伤假人数", name: "industrialInjury", width: 80, minWidth: 80, type: "string", align: "center" },
		  		{ display: "周末加班人数", name: "weekendOvertime", width: 150, minWidth: 150, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!querySumPersonalBatchAttStatistics.ajax',
		pageSize : 20,
		width : '99.9%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		delayLoad:true,
		rowHeight : 25,
		enabledEdit: false, 
		usePager: false, 
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledSort: false
	});
	UICtrl.setSearchAreaToggle(sumGridManager);
}

function showAttendancePersonalDetail(data){
	var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			var archiviesId=data.archiviesId;
			var periodId=data.periodId;
			var name=data.staffName;
			UICtrl.showFrameDialog({
				title:'['+name+']期间详细',
				url: web_app.name + '/attStatisticsAction!forwardAttAttendancePersonal.do', 
				param:{archiviesId:archiviesId,periodId:periodId},
				height:400,
				width:getDefaultDialogWidth(),
				resize:true,
				ok:false,
				cancel:true
			});
	
	
}

// 统计
function statistics(obj) {
	var startDate =  $("#startDate").val();
	if(!startDate){
		Public.tip('请选择日期')	;	
		return;
	}
	var endDate =  startDate;
	$("#endDate").val(startDate);
	
	var organId =  $("#organId").val();
	if(!organId){
		Public.tip('请选择机构')	;	
		return;
	}
	var isWageUnit=$('#isWageUnit').val();
	
	Public.ajax(web_app.name + '/attStatisticsAction!saveAttStatisticsByTime.ajax', 
		{organId:organId,isWageUnit: isWageUnit, startDate:startDate,endDate:endDate}, 
			function(data){
				if(data == 0){
					UICtrl.gridSearch(sumGridManager,{startDate:startDate,endDate:endDate,organId:organId});
				 }
				 else {
					checkRunning(organId,isWageUnit,startDate,endDate);
				}
	});
}

function checkRunning(organId,isWageUnit,startDate,endDate,tip){
	if(tip) tip.remove();
	tip=Public.tips({content:'&nbsp;数据操作中，请稍候......',autoClose:false});
	Public.ajax(web_app.name + '/attStatisticsAction!checkStatisticsByTime.ajax', 
		{organId:organId,isWageUnit: isWageUnit, startDate:startDate,endDate:endDate}, function(data){
			if(data==-1){//执行中
				setTimeout(function(){
					checkRunning(organId,isWageUnit,startDate,endDate,tip);
				},3000);
			}else if(data==0){//执行完成
				tip.remove();
				UICtrl.gridSearch(sumGridManager,{startDate:startDate,endDate:endDate,organId:organId});
			}else{
				tip.remove();
				UICtrl.alert(data);
			}
	});
}

//重置表单
function resetForm(obj) {
	$(obj).formClean();
} 

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}


