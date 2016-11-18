var overtimeKind={}, swapKindId={};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	bindEvents();
	changeTotalCaption();
	overtimeKind=$('#overtimeKindId').combox('getJSONData');
	swapKindId=$('#swapKindId').combox('getJSONData');
	setVerifyProcUnitDetailEnable();
	initializeDetailGrid();
	cancelIsReadHandleResult();
	setTimeout(function() {
		setVerifyProcUnitEnable();
	}, 0);
	var totalTime = $("#totalTime").val();
	$("#swapMark").html("备注：换休 " + totalTime + "天需要" + totalTime * 8 + "小时");
});

function changeTotalCaption() {
	$("#totalTimeSpan").html("合计(天数)  :");
	$("#totalTime").attr("label", "合计(天数)");
	$("#verificationTotalTimeSpan").html("合计(天数) :");
	$("#verificationTotalTime").attr("label", "合计(天数)");
}

function initializeDetailGrid(){
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addDateFast: {id:'addDateFast',text:'活动假换休',img:'page_new.gif',click:addHandlerButton},
		addHandler:{id:'addHandler',text:'加班换休',img:'page_dynamic.gif',click:addHandlerButton},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#detailgrid', {
		columns: [ {
			display : "换休类型",
			name : "swapKindId",
			width : 120,
			minWidth : 60,
			type : "string",
			align : "left",
			hide : true
		},{
			display : "换休类型",
			name : "",
			width : 120,
			minWidth : 60,
			type : "string",
			align : "left",
			render : function(item) {
				return swapKindId[item.swapKindId];
			}
		},{
			display : "单号",
			name : "billCode",
			width : 140,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "加班类别",
			name : "overtimeKindId",
			width : 120,
			minWidth : 60,
			type : "string",
			align : "left",
			render : function(item) {
				return overtimeKind[item.overtimeKindId];
			}
		}, {
			display : "开始日期",
			name : "startDate",
			width : 140,
			minWidth : 60,
			type : "string",
			align : "left",
			render : function(item) {
				//1、加班换休，2、活动假换休
				if(item.swapKindId == 1)
					return item.startDate;
				else
					return "";
			}
		}, {
			display : "结束日期",
			name : "endDate",
			width : 140,
			minWidth : 60,
			type : "string",
			align : "left",
			render : function(item) {
				//1、加班换休，2、活动假换休
				if(item.swapKindId == 1)
					return item.endDate;
				else
					return "";
			}
		}, {
			display : "加班合计(小时)",
			name : "totalTimeHour",
			width : 140,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "可用小时",
			name : "balance",
			width : 140,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "本次冲销小时数",
			name : "useHour",
			width : 140,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : "nnn"
			}
		} ],
		dataAction : 'server',
		url: web_app.name+'/attLeaveAction!querySwapRestDetail.ajax',
		parms:{leaveId: $('#leaveId').val() || 0, pagesize:1000},
		//pageSize : 20,
		width : '98.9%',
		height : 225,
		usePager: false,
		heightDiff : -5,
		headerRowHeight : 25,
		autoAddRowByKeydown:false,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit: true,
		checkbox: true,
		onLoadData: function(){
			return (getId() > 0);
		}
	});
	addHandler();
	addHandlerAH();
}

function addHandlerButton(){}

function addHandler(){
	//加班单选取
	$("#toolbar_menuaddHandler").comboDialog({type: 'hr', name: 'overtimeInfo',dataIndex:'overtimeId',
        getParam: function () {
            return { personMemberId: $('#personMemberId').val()};
        },
		width: 700, checkbox: true,
        title: "选择加班单",
        onChoose: function () {
            var rows = this.getSelectedRows();
            var addRows = [], addRow;
            var erows = gridManager.rows;
            $.each(rows, function (i, o) {
            	var overtimeId = o["overtimeId"];
            	var flg = true;
            	if(erows.length>0){
            		for(var i=0;i<erows.length;i++){
            			if(erows[i]["overtimeId"]==overtimeId){
            				flg = false;
            				break;
            			}
            		}
            	}
            	if(flg){
	                addRow = $.extend({}, o,{overtimeId:o["overtimeId"],billCode:o["billCode"],swapKindId:1,
	                	overtimeKindId:o["overtimeKindId"],startDate:o["startDate"]
	                	,endDate:o["endDate"],totalTime:o["totalTime"],balance:o["balance"]});
	                addRows.push(addRow);
            	}
            });
            gridManager.addRows(addRows);
            return true;
        }});
}

function deleteHandler(){
	var rows = gridManager.getSelectedRows();
	if (rows.length==0) {Public.tip('请选择数据！'); return; }
	DataUtil.delSelectedRows({ action:'attLeaveAction!deleteSwapRestDetail.ajax', 
		gridManager: gridManager, idFieldName: 'swapRestDetailId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}

function addHandlerAH(){
	//加班单选取
	$("#toolbar_menuaddDateFast").comboDialog({type: 'hr', name: 'activityHolidayInfo',dataIndex:'activityHolidayDetailId',
        getParam: function () {
            return { personId: $('#personMemberId').val()};
        },
		width: 700, checkbox: true,
        title: "选择活动假单",
        onChoose: function () {
            var rows = this.getSelectedRows();
            var addRows = [], addRow;
            var erows = gridManager.rows;
            $.each(rows, function (i, o) {
            	var overtimeId = o["activityHolidayDetailId"];
            	var flg = true;
            	if(erows.length>0){
            		for(var i=0;i<erows.length;i++){
            			if(erows[i]["overtimeId"]==overtimeId){
            				flg = false;
            				break;
            			}
            		}
            	}
            	if(flg){
	                addRow = $.extend({}, o,{overtimeId:o["activityHolidayDetailId"],billCode:o["billCode"],
	                	totalTimeHour:o["holidayHour"],swapKindId:2,balance:o["balance"]});
	                addRows.push(addRow);
            	}
            });
            gridManager.addRows(addRows);
            return true;
        }});
}

//核销时出差地点可编辑
function setVerifyProcUnitDetailEnable(){
	if (isVerifyProcUnit()) {
		permissionAuthority['detailgrid.addHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['detailgrid.deleteHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['detailgrid.useDay']={authority:'readwrite',type:'1'};
	}
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

function computeTotal(kindId) {
	if (computeTotalTimer) {
		clearTimeout(computeTotalTimer);
	}
	computeTotalTimer = setTimeout(function() {
		getTotalTime(kindId);
	}, 2000);
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
			$("#swapMark").html("备注：换休 " + data + "天需要" + data * 8 + "小时");
	});
}

function getId() {
	return $("#leaveId").val();
}

function setId(value) {
	$("#leaveId").val(value);
	gridManager.options.parms['leaveId'] =value;
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
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}

//获取用于校验的时间
function getCheckData(){
	if(isApplyProcUnit()){
		return {startDate:getStartTime(),endDate:getEndTime()};
	}
	if(isVerifyProcUnit()){
		return {startDate:getVerifyStartTime(),endDate:getVerifyEndTime()};
	}
	return {};
}

function isVerifyProcUnit(){
	return procUnitId == "Verify" && activityModel == "do";
}
