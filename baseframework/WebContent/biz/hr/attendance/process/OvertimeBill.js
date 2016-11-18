$(document).ready(function() {
	cancelIsReadHandleResult();
	//删除一般加班、食堂员工加班、搬运工加班  移动到action
	var overtimeKindObj=$('#overtimeKindId');
	var overtimeKindValue=overtimeKindObj.val();
	var overtimeKind=overtimeKindObj.combox('getJSONData');
	/*delete overtimeKind['Normal'];
	delete overtimeKind['CanteenStaff'];
	delete overtimeKind['PorterOvertime'];*/
	overtimeKindObj.combox('setData',overtimeKind);
	if(getId()==""){
		$('#purposeId').combox('setValue','2');
	}
	if (isApplyProcUnit()){
		if(overtimeKindValue=='Normal'){
			overtimeKindObj.combox('setValue','DoubleRest');
		}
		overtimeKindObj.combox({
			onChange : function() {
				calcTotalTime('apply');
			}
		});
	}
	UICtrl.autoSetWrapperDivHeight();
	bindEvents();
	
	 setTimeout(function() {
			setVerifyProcUnitEnable();
			//审批、复核可以调整加班结算类型
			if(procUnitId == "Check" || procUnitId == "Approve"){
				UICtrl.enable($('#purposeId'));
			}
	}, 0);
	 //初始化显示总加班时间
	 $("#totalTimeContent").val(getTotalTimeContent("apply"));
	 $("#verificationTotalTimeContent").val(getTotalTimeContent(""));
	 initializeCheckGrid();
    
    $('#showCheckList').bind("click", function () {
        $("#checkList").show();
        $("#showCheckList").hide();
        $("#hideCheckList").show();
    });
    $('#hideCheckList').bind("click", function () {
        $("#checkList").hide();
        $("#hideCheckList").hide();
        $("#showCheckList").show();
    });
});

function getId() {
	return $("#overtimeId").val();
}

function setId(value) {
	$("#overtimeId").val(value);
}

function getOvertimeKindId() {
	return $("#overtimeKindId").val();
}

function getTotalTime(procUnitId) {
	var kindId, startTime, endTime, elId;
	kindId = getOvertimeKindId();
	if (procUnitId == "apply") {
		startTime = getStartTime();
		endTime = getEndTime();
		elId = "#totalTime";
	} else {
		startTime = getVerifyStartTime();
		endTime = getVerifyEndTime();
		elId = "#verificationTotalTime";
	}
	if (!kindId || !startTime || !endTime)
		return;
	
	if (getTotalTimeparam.startTime == startTime
			&& getTotalTimeparam.endTime == endTime
			&& getTotalTimeparam.kindId == kindId)
		return;
	$(elId).val('');
	getTotalTimeparam.kindId='';
	Public.ajax(web_app.name + "/attOvertimeAction!getTotalDays.ajax", {
		startDate : startTime,
		endDate : endTime,
		kindId : kindId
	}, function(data) {
		getTotalTimeparam.startTime = startTime;
		getTotalTimeparam.endTime = endTime;
		getTotalTimeparam.kindId = kindId;
		$(elId + "Hour").val(data);
        $(elId + "Content").val(getTotalTimeContent(procUnitId));
	});
}

function getExtendedData(){
	return {};
}

function initializeCheckGrid(){
	var personName,startDate,endDate;
	personName = $("#personMemberName").val();
	startDate = $("#startDate").val().substring(0, 10);
	endDate = $("#endDate").val().substring(0, 10);
	var gridManager = UICtrl.grid('#checklistmaingrid', {
		columns: [
			{ display: "公司", name: "orgName", width: 120, minWidth: 60, type: "string", align: "left" },
			{ display: "中心", name: "centerName", width: 120, minWidth: 60, type: "string", align: "left" },
			{ display: "部门", name: "deptName", width: 120, minWidth: 60, type: "string", align: "left" },
			{ display: "姓名", name: "personName", width: 80, minWidth: 60, type: "string", align: "left" },		   
			{ display: "打卡时间", name: "checkTime", width: 140, minWidth: 120, type: "datetime", align: "center" },
			{ display: "打卡机器", name: "macName", width: 140, minWidth: 100, type: "string", align: "center" },
			{ display: "打卡地点", name: "macAddress", width: 180, minWidth: 80, type: "string", align: "center" }	
		],
		//dataType: 'local',
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryCheckList.ajax',
		parms : {personName: personName, startDate: startDate, endDate:endDate},
		width : '100%',
		height : 150,
		delayLoad:true,	
		sortName:'checkTime',
		sortOrder:'desc',		
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		async: false,
		usePager: false
	});
	
	if(personName.length > 0 && startDate.length > 0){
		gridManager.loadData();
		for(var i=0; i<gridManager.currentData.Rows.length; i++){
			if (gridManager.currentData.Rows[i].personName != personName){
				gridManager.currentData.Rows.splice(i,1);
				i--;
			}
		}
	}
}

