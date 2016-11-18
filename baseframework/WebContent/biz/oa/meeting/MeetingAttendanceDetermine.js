var meetingTopicGrid = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	$('#agentPersonName').searchbox({ type:"sys", name: "orgSelect",
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},
		back:{
			personMemberName:"#agentPersonName",id:"#agentPersonMemberId",
			personId:"#agentPersonId"
		}
	});
	initMeetingTopicGrid();
	initAttendanceFlg();
	attendanceCtl();
	var fileTable=$('#meetingFileList').fileList({readOnly:true});
	fileTable.find('table').css({borderTopWidth:0,borderBottomWidth:0});
	changeJobEvent();
});

function changeJobEvent(){
	$('#toolBar').toolBar('changeEvent','save',function(){
		specialSave();
	});
	$('#toolBar').toolBar('changeEvent','advance',function(){
		specialAdvance();
	});
}

function specialSave(){
	if(beforeSave()){
		$('#submitForm').ajaxSubmit({url: web_app.name + '/meetingAction!updateMeetingPlanAttendance.ajax',
			success : function() {
			}
		});
	}
}

function specialAdvance(){
	if(beforeSave()){
		$('#submitForm').ajaxSubmit({url: web_app.name + '/meetingAction!specialAdvance.ajax',
			success : function() {
				UICtrl.closeAndReloadTabs("TaskCenter", null);
			}
		});
	}
}

function getOrganId(){
	return $('#organId').val();
}

function initAttendanceFlg(){
	$('#agentPersonName').attr('disable',true);
	$('#attendanceFlag').combox({onChange:function(){
		attendanceCtl();
	}});
}

function attendanceCtl(){
	var obj = $('#agentPersonName');
	//需要代理人
	if($('#attendanceFlag').val()=="2"){
		UICtrl.enable(obj);
	}
	else{
		$('#agentPersonName').val("");
		$('#agentPersonId').val("");
		$('#agentPersonMemberId').val("");
		UICtrl.disable(obj);
	}
	if($('#attendanceFlag').val()=="1"){
		$('#refuseReason').attr('readonly',true);
		$('#refuseReason').val("");
	}
	else{
		$('#refuseReason').removeAttr('readonly');
	}
}

function beforeSave(){
	var attendanceFlg = $('#attendanceFlag').val();
	if(attendanceFlg=="2"){
		if($('#agentPersonId').val()==""){
			Public.tip("请选择代理人！");
			return false;
		}
	}
	if(attendanceFlg=="3"){
		if($('#refuseReason').val()==""){
			Public.tip("请说明不参会的原因！");
			return false;
		}
	}
	//保存业务数据
	return true;
}


function getId() {
	return $("#meetingId").val();
}

function setId(value) {
	$("#meetingId").val(value);
}

function initMeetingTopicGrid(){
	meetingTopicGrid = UICtrl.grid('#meetingTopicGrid', {
		columns: [    	   	
			{ display: "会议议题", name: "subject", width: 280, minWidth: 180, type: "string", align: "left"},	
			{ display: "时长(分钟)", name: "duration", width: 260, minWidth: 180, type: "string", align: "left"},	
			{ display: "负责人", name: "topicManagerName", width: 180, minWidth: 120, type: "string", align: "left"}
		],
		//title:"会议议题",
		dataAction : 'server',
		url: web_app.name+'/meetingAction!slicedQueryMeetingTopic.ajax',
		parms:{meetingId:getId()},
		width : "99%",
		height : 160,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit: false,
		usePager: false
	});
}

//提交扩展属性
function getExtendedData(){
	beforeSave();
}
