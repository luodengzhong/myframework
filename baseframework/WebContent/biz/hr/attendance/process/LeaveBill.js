
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	bindEvents();
	changeTotalCaption();
	checkFuneral();
	cancelIsReadHandleResult();
	// 处理哺乳假
	$("#leaveKindId").combox({
		onChange : function() {
			changeTotalCaption();
			computeTotal("apply");
			changeFileListTitle();
			//判断是否丧假
			checkFuneral();
		}
	});

	// 缓存登录人信息，用于代理请假
	$("#deputyIdTemp").val($("#personMemberId").val());
	$("#deputyFullIdTemp").val($("#fullId").val());
	$("#deputyNameTemp").val($("#personMemberName").val());
	$("#personMemberName").searchbox({type : "sys", name : "orgSelect",
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_id = '" + getOrganId() + "'  and  org_kind_id ='psm' and instr(full_id, '.prj') = 0 "};
		},
		back : {
			personMemberName : "#personMemberName",
			fullId : "#fullId",
			positionId : "#positionId",
			centerId : "#centerId",
			centerName : "#centerName",
			deptId : "#deptId",
			positionName : "#positionName",
			deptName : "#deptName",
			personMemberId : "#personMemberId"
		},
		onChange : function() {
			$("#deputyName").val($("#deputyNameTemp").val());
			//重新计算时间
			computeTotal("apply");
		}
	});

	setTimeout(function() {
		setVerifyProcUnitEnable();
		setEnableFiletable();
	}, 0);

	var fileTable=$('#leaveFileList').fileList();
	fileTable.find('table').css({borderTopWidth:0});
    if(UICtrl.isApplyProcUnit()){
    	changeFileListTitle();
    }
});

function checkFuneral(){
	var leaveKindId=$("#leaveKindId").val();
	if(leaveKindId=="Funeral"){
		showFuneralReason();
	}
	else{
		hideFuneralReason();
	}
}
function hideFuneralReason(){
	$('#funeralLeaveSpan').hide();
	$('#funeralLeaveReasonSpan').hide();
}

function showFuneralReason(){
	$('#funeralLeaveSpan').show();
	$('#funeralLeaveReasonSpan').show();
}

function setEnableFiletable(){
	if(!Public.isReadOnly){
		$('#leaveFileList').fileList('enable');
	}
}


function computeTotal(kindId) {
	if (computeTotalTimer) {
		clearTimeout(computeTotalTimer);
	}
	computeTotalTimer = setTimeout(function() {
		getTotalTime(kindId);
	}, 2000);
}
function changeFileListTitle(){
	var leaveKindId=$("#leaveKindId").val();
	var titleDiv=$('#fileListTitle').hide();
	if(leaveKindId=='MatureageMarry'||leaveKindId=='NotMatureageMarry'){
		titleDiv.html('请上传结婚证复印件!(保存表单后即可上传文件)').show();
	}else if(leaveKindId=='Sick'){
		titleDiv.html('病假三天以上需要提供病假证明!(保存表单后即可上传文件)').show();
	}
}
function changeTotalCaption() {
	if ("Breastfeeding" == $("#leaveKindId").val()) {
		$("#totalTimeSpan").html("合计(小时)  :");
		$("#totalTime").attr("label", "合计(小时)");
		$("#verificationTotalTimeSpan").html("合计(小时)  :");
		$("#verificationTotalTime").attr("label", "合计(小时)");
	} else {
		$("#totalTimeSpan").html("合计(天数)  :");
		$("#totalTime").attr("label", "合计(天数)");
		$("#verificationTotalTimeSpan").html("合计(天数) :");
		$("#verificationTotalTime").attr("label", "合计(天数)");
	}
}

function getTotalTime(procUnitId) {
	var startTime, endTime, kindId, elId;
	var personMemberId=$('#personMemberId').val();
	kindId = getLeaveKindId();
	if (procUnitId == "apply") {
		startTime = getStartTime();
		endTime = getEndTime();
		elId = "#totalTime";
	} else {
		startTime = getVerifyStartTime();
		endTime = getVerifyEndTime();
		elId = "#verificationTotalTime";
	}
	if (!kindId || !startTime || !endTime||!personMemberId){
		return;
	}
	if (getTotalTimeparam.startTime == startTime
			&& getTotalTimeparam.endTime == endTime
			&& getTotalTimeparam.kindId == kindId
			&& getTotalTimeparam.getTotalTimeparam == personMemberId){
		return;
	}
	$(elId).val('');
	getTotalTimeparam.kindId='';
	Public.ajax(web_app.name + "/attLeaveAction!getTotalLeaveTime.ajax", {
		leaveKindId : kindId,
		startDate : startTime,
		endDate : endTime,
		personMemberId : personMemberId
		},
		function(data) {
			getTotalTimeparam.startTime = startTime;
			getTotalTimeparam.endTime = endTime;
			getTotalTimeparam.kindId = kindId;
			getTotalTimeparam.personMemberId = personMemberId;
			$(elId).val(data);
	});
}

function getId() {
	return $("#leaveId").val();
}

function setId(value) {
	$("#leaveId").val(value);
	$('#leaveFileList').fileList({
		bizId : value
	});
}

function getLeaveKindId() {
	return $("#leaveKindId").val();
}

function getOrganId() {
	return $("#organId").val();
}

function getCenterId() {
	return $("#centerId").val();
}

function getExtendedData(){
	var leaveKindId=$("#leaveKindId").val();
	if(leaveKindId=="Funeral"){
		if($("#funeralLeaveReason").val()==""){
			Public.tip("丧假事由不能为空");
			return false;
		}
	}
	return true;
}