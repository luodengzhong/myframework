var computeTotalTimer = null;

var getTotalTimeparam = {
	startTime : "",
	endTime : "",
	kindId : "",
	personMemberId : ""
};

var detailEmptyTip = "";

var getTotalTimeAction = "";

function setVerifyProcUnitEnable() {
	if (procUnitId == "Verify" && activityModel == "do") {
		UICtrl.enable("#verificationReason");
		UICtrl.enable("#verificationStartDate");
		UICtrl.enable("#verificationEndDate");
		UICtrl.enable("#verificationTotalTime");

		$("#verificationStartDate").attr("required", "true");
		$("#verificationEndDate").attr("required", "true");
		// $("#verificationTotalTime").attr("required", "true");
		$("#verificationTotalTime").attr("readonly", "true");

		if (!$("#verificationTotalTime").val()) {
			$("#verificationStartDate").val($("#startDate").val());
			$("#verificationEndDate").val($("#endDate").val());
			$("#verificationTotalTimeContent").val($("#totalTimeContent").val());
			$("#verificationTotalTimeHour").val($("#totalTimeHour").val());
		}

	} else {
		UICtrl.disable("#verificationReason");
		UICtrl.disable("#verificationStartDate");
		UICtrl.disable("#verificationEndDate");
		UICtrl.disable("#verificationTotalTimeContent");
	}
}
function bindEvents() {
	$("#startDate,#endDate").datepicker({
		workTime : true,
		afterWrite : function() {
			calcTotalTime("apply");
		}
	}).blur(function() {
		if ($(this).hasClass('textReadonly'))
			return;
		calcTotalTime("apply");
	});

	$("#verificationStartDate,#verificationEndDate").datepicker({
		workTime : true,
		afterWrite : function() {
			calcTotalTime("verify");
		}
	}).blur(function() {
		if ($(this).hasClass('textReadonly'))
			return;
		calcTotalTime("verify");
	});
}

function getTotalTimeContent(kindId) {
	var elId;
	if (kindId == "apply") {
		startTime = getStartTime();
		endTime = getEndTime();
		elId = "#totalTimeHour";
	} else {
		startTime = getVerifyStartTime();
		endTime = getVerifyEndTime();
		elId = "#verificationTotalTimeHour";
	}

	var totalHours = $(elId).val();
	var daysContent = "";
	var hoursContent = "";
	var mark = "";
	if (totalHours > 0) {
		var hours = totalHours % 8;
		var days = (totalHours - hours) / 8;
		if (days > 0)
			daysContent = days + "天";
		if (hours > 0)
			hoursContent = hours + "小时";
		mark = "(共" + totalHours + "小时)";
	}
	return daysContent + hoursContent + mark;
}

function calcTotalTime(kindId) {
	if (computeTotalTimer) {
		clearTimeout(computeTotalTimer);
	}
	computeTotalTimer = setTimeout(function() {
		getTotalTime(kindId);
	}, 2000);
}

function getOrganId() {
	return $("#organId").val();
}

function getStartTime() {
	var value = $("#startDate").val();
	if (!Public.isDateTime(value)) {
		return false;
	}
	return value;
}

function getEndTime() {
	var value = $("#endDate").val();
	if (!Public.isDateTime(value)) {
		return false;
	}
	return value;
}

function getVerifyStartTime() {
	var value = $("#verificationStartDate").val();
	if (!Public.isDateTime(value)) {
		return false;
	}
	return value;
}

function getVerifyEndTime() {
	var value = $("#verificationEndDate").val();
	if (!Public.isDateTime(value)) {
		return false;
	}
	return value;
}

function isApproveProcUnit() {
	return procUnitId == "Approve" || procUnitId == "Check";
}

function checkDuplicate() {
	gridManager.endEdit();
	var data = gridManager.getData();
	var list = [];
	var item = {};
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < list.length; j++) {
			if (data[i].personMemberId.substr(0, 32) == list[j].personMemberId.substr(0, 32)) {
				Public.tip("人员“" + data[i].personMemberName + "”，重复填写。");
				return false;
			}
		}
		item.personMemberId = data[i].personMemberId;
		list.push(item);
	}
	return true;
}

function getExtendedData() {
	if (!checkDuplicate()) {
		return false;
	}
	var extendedData = {};

	var detailData = DataUtil.getGridData({
		gridManager : gridManager
	});
	if (!detailData) {
		return false;
	}

	if (gridManager.getData().length == 0) {
		Public.tip(detailEmptyTip);
		return false;
	}

	extendedData.detailData = encodeURI($.toJSON(detailData));

	return extendedData;
}

function reLoadJobTaskExecutionList(bizId, procUnitId) {
	procUnitId = procUnitId || 'Approve';
	var handlerListId = "";
	if (procUnitId == "Approve") {
		handlerListId = "approverList";
	} else if (procUnitId == "Check") {
		handlerListId = "checkerList";
	}
	if (!handlerListId) {
		return;
	}

	$("#" + handlerListId).load(web_app.name + "/common/TaskExecutionList.jsp", {
		bizId : bizId,
		procUnitId : procUnitId,
		taskId : taskId
	}, function() {
		Public.autoInitializeUI($("#" + handlerListId));
	});
}
