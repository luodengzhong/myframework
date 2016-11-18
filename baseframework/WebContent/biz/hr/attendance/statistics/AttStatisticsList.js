var gridManager = null, refreshFlag = false,query_period_id=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
	
});

function initializeUI(){
	//isWageUnit
	$('#isWageUnit').combox({onChange:function(){
		$('#organId').val("");
		$('#organName').val("");
	}});
	$('#organName').orgTree({filter:'ogn,dpt,pos,psm',param:{searchQueryCondition:"org_kind_id in('ogn','dpt','pos','psm')"},
		manageType:'hrPayChange,hrBaseAttManage',
		beforeChange:function(data){
				var flag=false,fullId=data.fullId;//是否是工资主体
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
			name:'#organName'
		}
	});
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodName').searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		return {paramValue:$('#year').val(),organId:$('#organId').val()};
	},back:{periodId:'#periodId',yearPeriodName:'#periodName'}});
	$('#statisticsKind').combox({data:{
		withoutCard:'未打卡',
		exceptionNumber:'打卡异常',
		sickLeave:'病假',
		personalAffair:'事假',
		maternityLeave:'产假',
		marriageLeave:'婚假',
		funeralLeave:'丧假',
		annualLeave:'年休假',
		examination:'考试假',
		accompanyMaternityleave:'陪产假',
		overtime:'加班',
		late:'迟到',
		leaveEarly:'早退',
		industrialInjury: '工伤假'
	}});
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		queryException:{id:'queryException',text:'异常详情',img:'page_dynamic.gif',click:function(){
				var data = gridManager.getSelectedRow();
				if (!data) {Public.tip('请选择数据！'); return; }
				var archiviesId=data.archiviesId;
				var periodId=data.periodId;
				var name=data.staffName;
				UICtrl.showFrameDialog({
					title:'['+name+']异常详细',
					url: web_app.name + '/attStatisticsAction!forwardListAttCheckExceptionPerson.do', 
					param:{archiviesId:archiviesId,periodId:periodId},
					height:400,
					width:getDefaultDialogWidth(),
					resize:true,
					ok:false,
					cancel:true
				});
		}},
		queryAttendance:{id:'queryAttendance',text:'期间详细',img:'page_dynamic.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			var archiviesId=data.archiviesId;
			var periodId=data.periodId;
			var name=data.staffName;
			UICtrl.showFrameDialog({
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
			  	{ display: "单位名称", name: "ognName", width: 180, minWidth: 180, type: "string", align: "center",frozen: true },
			  	{ display: "中心名称", name: "centreName", width: 180, minWidth: 180, type: "string", align: "center",frozen: true },
			  	{ display: "部门名称", name: "dptName", width: 180, minWidth: 180, type: "string", align: "center",frozen: true },
				{ display: "姓名", name: "staffName", width: 80, minWidth: 80, type: "string", align: "center",frozen: true },
				{ display: "忘记打卡次数", name: "withoutCard",title:"未打卡说明中消除异常原因:忘记打卡", width: 80, minWidth: 80, type: "string", align: "center" },	
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
				{ display: "一般加班天数", name: "commonOvertime", width: 150, minWidth: 150, type: "string", align: "center" },	
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
				{ display: "出勤天数", name: "attendance", width: 150, minWidth: 150, type: "string", align: "center" },
				{ display: "节假日上班天数", name: "holidayOnduty", width: 150, minWidth: 150, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryAttStatistics.ajax',
		parms:{periodId:$('#periodId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'sequence',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		delayLoad:true,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 统计
function statistics(obj) {
	var organId = $("#organId").val();
	if(!organId){
		Public.tip('请选择机构')	;
		return;
	}
	var periodId =  $("#periodId").val();
	if(!periodId){
		Public.tip('请选择期间')	;	
		return;
	}
	var isWageUnit = $("#isWageUnit").val();
	Public.ajax(web_app.name + '/attStatisticsAction!saveAttStatistics.ajax', 
		{organId:organId,periodId:periodId,isWageUnit:isWageUnit}, function(data){
			if(data==0){
				//Public.successTip("执行成功，请稍后查询。");
				checkRunning(organId,periodId,isWageUnit);
			}else if(data==1){
				query_period_id=periodId;
				UICtrl.gridSearch(gridManager,{organId:organId,periodId:periodId,isWageUnit:isWageUnit});
			}else{//上次统计正在执行中
				UICtrl.alert("统计正在执行中，请稍后查询。");
			}
	});
}

function checkRunning(organId,periodId,isWageUnit,tip){
	if(tip) tip.remove();
	tip=Public.tips({content:'&nbsp;数据操作中，请稍候......',autoClose:false});
	Public.ajax(web_app.name + '/attStatisticsAction!checkStatistics.ajax', 
		{organId:organId,periodId:periodId,isWageUnit:isWageUnit}, function(data){
			if(data==-1){//执行中
				setTimeout(function(){
					checkRunning(organId,periodId,isWageUnit,tip);
				},3000);
			}else if(data==0){//执行完成
				tip.remove();
				UICtrl.gridSearch(gridManager,{organId:organId,periodId:periodId,isWageUnit:isWageUnit});
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

function query(obj){
	var organId = $("#organId").val();
	if(!organId){
//		$.tips(请选择机构);
		Public.tip('请选择机构')	;
		return;
	}
	var periodId =  $("#periodId").val();
	if(!periodId){
		Public.tip('请选择期间')	;	
		return;
	}
	var isWageUnit = $("#isWageUnit").val();
	var param = $(obj).formToJSON();
	param['organId']=organId;
	param['periodId']=periodId;
	param['isWageUnit']=isWageUnit;
	UICtrl.gridSearch(gridManager,param);
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


