var participateGrid = null,attendanceGrid = null,meetingTopicGrid = null,
availableMeetingRoomGrid = null,selectedMeetingRoomGrid = null,
taskRequire = false,meetingLeaveGrid = null,meetingCheckGrid=null,meetingSummaryGrid = null,
attendanceFlgData={},
meetingBulidTaskGrid = null,yesOrNo = {1:'是',0:'否'},meetingRoomManager=null,
signInFlagData = {},
signOutFlagData = {};
//var handlerArray=new Array();//处理人
var leaveHandlerArray=new Array();//请假审批人
var noticeHandlerArray=new Array();//通知人
var stime="";//打开页面开始时间
var etime="";//打开页面结束时间
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	setTimeout(function() {
		setEnableEdit();
	}, 0);
	stime = $('#startTime').val();
	etime = $('#endTime').val();
	setEnableGridEdit();
	attendanceFlgData = $("#attendanceFlg").combox("getJSONData");
	var fileTable=$('#meetingFileList').fileList();
	fileTable.find('table').css({borderTopWidth:0});
	if(!Public.isReadOnly&&isVerifyProcUnit()){
		$("#infoPromulgate").attr("disabled",false);
	}
	else{
		$("#infoPromulgate").attr("disabled",true);
	}
	bindEvents();
	queryMeetingHandler();
	initKindTree();
	initSerchBox();
	initTab();
	participateGridInit();
	initIsVideo();
	initMeetingRoom();
	hidePersonLink();
});

var tools = [{ id: 'createTask', name: '重发通知', icon: 'refresh',event: createMeetingNotice}];
var tool = [{ id: 'createSummary', name: '纪要报批', icon: 'turn',event: createMeetingSummary},
            {line:true,id:'transfer_line'},
            { id: 'bulidQRCode', name: '生成二维码', icon: 'down',event: bulidQRCode}];

function createMeetingSummary(){
	if(!getId()) return;
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='psm';
	selectOrgParams['multiSelect']=false;
	var options = { params: selectOrgParams,title : "请选择会议记录人员",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			var personId=data[0]['personId'];
			var personMemberId=data[0]['id'];
			var personName=data[0]['name'];
			var url=web_app.name+'/meetingAction!createAskReport.ajax';
			var _self=this;
			Public.ajax(url, 
				{meetingId:getId(),personMemberId:personMemberId},
				function(data){
					if(data=="true"){
						UICtrl.reloadParentTab('main_tab');//首页tab
						Public.successTip("生成会议纪要流程待办成功!");		
					}
					else{
						UICtrl.alert("当前会议存在纪要审批流程处理中，不能再次发起！");
					}
					_self.close();
			 });
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

function bulidQRCode(){
	if(!getId()) return;
	var url = web_app.name+'/meetingAction!bulidQRCode.do?meetingId='+getId();
	window.open(url);
}

function createMeetingNotice(){
	if(!Public.isReadOnly){
		Public.ajax(web_app.name+'/meetingAction!checkBefore.ajax', 
				{meetingId:getId()},
				function(data){
					if(data=="true"){
						//createMeetingAttendance
						//createMeetingNotice
						Public.ajax(web_app.name+'/meetingAction!createMeetingAttendance.ajax',
						{meetingId:getId()},
						function(){
							reloadMeetingRoom();
							planParticipateGrid.loadData();
							if(planAttendanceGrid!=null)
								planAttendanceGrid.loadData();
							if(participateGrid!=null)
								participateGrid.loadData();
							if(attendanceGrid!=null)
								attendanceGrid.loadData();
							UICtrl.reloadParentTab('main_tab');//首页tab
							Public.successTip("任务重建成功!");							
						});
					}
					else{
						UICtrl.alert("会议开始后不能重新发起会议通知单!");
					}
		});
	}
}

function hidelLink(){
	$.each(['leaveHandler'],function(i,p){
		$('#'+p+'ChooseLink').hide();
		$('#'+p+'ClearLink').hide();
	});
}

function hidenLink(){
	$.each(['noticeHandler'],function(i,p){
		$('#'+p+'ChooseLink').hide();
		$('#'+p+'ClearLink').hide();
	});
}

function hideLink(){
	hidelLink();
	hidenLink();
}

function bindEvents(){
	$('#chooseLeaveHandlerTd').show();
	$('#chooseNoticeHandlerTd').show();
	if(!Public.isReadOnly){
		if(isApply()){
			
		}
		else if(isVerifyProcUnit()){
			hidelLink();
			$('#toolBar').toolBar('addItem',tools);
		}
		else if(isCheckProcUnit()){
			$('#abort,#abort_line').hide();
			$('#toolBar').toolBar('changeEvent','back',function(){
			    specialBack();
			});
			hideLink();
		}
		else{
			hideLink();
		}
	}
	else{
		hideLink();
	}
	
	$("#startTime").datepicker({
		workTime : true,
		afterWrite : function() {
			checkTime();
			//checkApplyAheadDays();
			if(isVerifyProcUnit()){//核销环节，延后会议开始时间，不需要重新刷新会议室
				if(checksTime()){
					return;
				}
			}
			refreshMeetingRoom();
		}
	}).blur(function() {
		if ($(this).hasClass('textReadonly'))
			return;
		checkTime();
		//checkApplyAheadDays();
		refreshMeetingRoom();
	});
	$("#endTime").datepicker({
		workTime : true,
		afterWrite : function() {
			checkTime();
			if(isVerifyProcUnit()){//核销环节，提前会议结束时间，不需要重新刷新会议室
				if(checkeTime()){
					return;
				}
			}
			refreshMeetingRoom();
		}
	}).blur(function() {
		if ($(this).hasClass('textReadonly'))
			return;
		checkTime();
		refreshMeetingRoom();
	});
	
	$('#toolBar').toolBar('addItem',tool);
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		refreshFlag=false;
	}
	//明细页面附件弹出层删除
	$('div.ui-attachment-pop-div').remove();
}

function specialBack(){
	  var approvalRuleId = $("#currentApprovalRuleId").val();
	  var groupId = $("#currentHandleGroupId").val();
	  var procInstId = Public.getQueryStringByName("procInstId");
	  UICtrl.showFrameDialog({
	     title: '回退确认',
	     width: 500,
	     height: 400,
	     url: web_app.name + '/meetingAction!showCheckBackQuery.do',
	     param: { procInstId: procInstId, approvalRuleId: approvalRuleId, groupId: groupId },
	     ok: doCheckBack,
	     close: true
	  });
}

function doCheckBack(){
	var fn = this.iframe.contentWindow.getCheckBackProcUnitData;
	var data = fn();
	if (!data || data.length == 0) {
		return;
	}
	
	var _self = this;

	var approvalParams = getApprovalParams();
	var extendedData = getExtendedData();
    if (!approvalParams.handleResult) {
        Public.errorTip("没有选择处理意见，不能提交。");
        return;
    }
    if (approvalParams.handleResult == HandleResult.Disagree && !$.trim(approvalParams.handleOpinion)) {
        Public.errorTip("您选择的处理结果为“不同意”，请输入处理意见。");
        return;
    }
	var params = $.extend({}, { destActivityId: data[0].taskDefKey, groupId: data[0].groupId },
			approvalParams,extendedData);

	$('#submitForm').ajaxSubmit({
		url: web_app.name + '/workflowAction!back.ajax',
		param: params,
		success: function () {
			_self.close();
			UICtrl.closeAndReloadTabs("TaskCenter", null);
		}
	});
}

function createMeetingInfo(){
	if(!Public.isReadOnly){
		/*UICtrl.showAjaxDialog({url: web_app.name + '/meetingKindAction!showMeetingNotice.load', 
			param:{meetingId:getId()}, ok: noticeTaskCreate, okval:"通知",close: dialogClose,
			title:'设置会议通知人',width:650,height : 390});*/
		/*Public.ajax(web_app.name+'/meetingAction!createInfoPromulgate.ajax', 
			{meetingId:getId()},
			function(data){
				Public.successTip("已生成待办任务，请进入任务中心处理!");
		});*/
	}
}

/*function createMeetingAttendanceTask(){//TODO
	if(!Public.isReadOnly){
		Public.ajax(web_app.name+'/meetingAction!checkBefore.ajax', 
				{meetingId:getId()},
				function(data){
					if(data=="true"){
						Public.ajax(web_app.name+'/meetingAction!createMeetingAttendance.ajax',
						{meetingId:getId()},
						function(){
							reloadMeetingRoom();
							participateGrid.loadData();
							if(attendanceGrid!=null)
								attendanceGrid.loadData();
							Public.successTip("任务重建成功!");							
						});
					}
					else{
						UICtrl.alert("会议开始后不能重新发起参会通知单!");
					}
		});
	}
}*/

//是否延后会议开始时间
function checksTime(){
	var startTime = $('#startTime').val();
	if(startTime){
		var re = /-/g;
		var rs = / /g;
		var ra = /:/g;
		var sdate=startTime.replace(re,"");
		sdate=sdate.replace(rs,"");
		sdate=sdate.replace(ra,"");
		var sstime=stime.replace(re,"");
		sstime=sstime.replace(rs,"");
		sstime=sstime.replace(ra,"");
		if(sstime<=sdate){
			return true;
		}
	}
}

//是否减小会议结束时间
function checkeTime(){
	var endTime = $('#endTime').val();
	if(endTime){
		var re = /-/g;
		var rs = / /g;
		var ra = /:/g;
		var edate=endTime.replace(re,"");
		edate=edate.replace(rs,"");
		edate=edate.replace(ra,"");
		var eetime=etime.replace(re,"");
		eetime=eetime.replace(rs,"");
		eetime=eetime.replace(ra,"");
		if(eetime>=edate){
			return true;
		}
	}
}

function checkTime(){
	var startTime = $('#startTime').val();
	var endTime = $('#endTime').val();
	var nextMonthDate = $('#nextMonthDate').val();
	if(endTime){
		var re = /-/g;
		var rs = / /g;
		var ra = /:/g;
		var edate=endTime.replace(re,"");
		edate=edate.replace(rs,"");
		edate=edate.replace(ra,"");
		var ndate=nextMonthDate.replace(re,"");
		ndate=ndate.replace(rs,"");
		ndate=ndate.replace(ra,"");
		if(ndate<edate.substring(0,8)){
			Public.tip("会议预订时间不能提前超过一个月!");
			//$('#endTime').val("");
			return false;
		}
		else if(startTime){
			var sdate=startTime.replace(re,"");
			sdate=sdate.replace(rs,"");
			sdate=sdate.replace(ra,"");
			if(sdate>edate){
				Public.tip("开始时间不能大于结束时间!");
				//$('#startTime').val("");
				return false;
			}
		}
	}
}

function initIsVideo(){
	$('#isVideo').combox({onChange:function(){
			if ($(this).hasClass('textReadonly'))
			return;
			refreshMeetingRoom();
		}});
}

function getSignIn(){
	return $('#signIn').val();
}

function initKindTree(){
	$('#meetingKindName').treebox({
		treeLeafOnly: true,name:"meetingKind",
		beforeChange:function(data){
			if(data.nodeType=='f'){
				return false;
			}
			$('#aheadDays').val(data.aheadDays);
			$('#freeFlow').val(data.freeFlow);
			//checkApplyAheadDays();
			return true;
		},
		beforClose:function(){
			if($('#meetingKindId').val()==''){
				$('#aheadDays').val('');
			}
		},
		back:{text:'#meetingKindName',value:'#meetingKindId'}
    });
}

function checkApplyAheadDays(){
	var aheadDays = $('#aheadDays').val();
	var startTime = $('#startTime').val();
	if(aheadDays&&startTime){
		//获取后端时间校验
		Public.ajax(web_app.name+'/meetingAction!checkApplyAheadDays.ajax', 
				{aheadDays:aheadDays,startTime:startTime},
				function(data){
					if(data=="false"){
						UICtrl.alert("必须提前"+aheadDays+"天开始本会议,建议您更换会议开始时间,您也可以继续提交该会议,系统将会对未按规范时间提交的会议进行记录");
					}
			});
	}
}

function getIsVideo(){
	return $('#isVideo').val();
}

function getStartTime(){
	return $('#startTime').val();
}

function getEndTime(){
	return $('#endTime').val();
}

function initMeetingRoom(){

	availableMeetingRoomGrid = UICtrl.grid('#availableMeetingRoomGrid', {
		columns: [   
			{ display: "名称", name: "name", width: 246, minWidth: 120,type: "string", align: "left"},	   	   
			{ display: "地点", name: "place", width: 60, minWidth: 60, type: "string", align: "left"}			
		],
		dataAction : 'server',
		url: web_app.name+'/meetingAction!getMeetingRoom.ajax',
		parms:{isVideo:getIsVideo(),startTime:getStartTime(),endTime:getEndTime(),meetingId:getId()},
		title:'可选会议室',
		width : "100%",
		height : 230,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		usePager: false,
		onLoadData :function(){
   			return (getId()!='');
   		}
	});
	selectedMeetingRoomGrid = UICtrl.grid('#selectedMeetingRoomGrid', {
		columns: [   
			{ display: "名称", name: "name", width: 254, minWidth: 120, type: "string", align: "left"},	   	   
			{ display: "地点", name: "place", width: 60, minWidth: 60, type: "string", align: "left"},
			{ display: "联系人", name: "contactPersonName", width: 120, minWidth: 100, type: "string", align: "left",
		    	editor: { type: 'select', required: false, data: { type:"sys", name: "orgSelect", 
					getParam: function(){
						return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm'" };
					}, back:{personId: "contactPersonId", personMemberName: "contactPersonName" }
			}}}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingAction!getChooseMeetingRoom.ajax',
		parms:{meetingId:getId()},
		title:'已选会议室',
		width : "99%",
		height : 230,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		usePager: false,
		enabledEdit: true,
		autoAddRowByKeydown:false,
		onLoadData :function(){
   			return (getId()!='');
   		}
	});
	UICtrl.createGridQueryBtn('#availableMeetingRoomGrid',function(value){
		clearSelectedRows();
		var param = $.extend({},{q:encodeURI(value),isVideo:getIsVideo(),meetingId:getId(),startTime:getStartTime(),endTime:getEndTime()});
		UICtrl.gridSearch(availableMeetingRoomGrid, param);
	});
	
}

function refreshMeetingRoom(){
	//删除已预订会议室
	if(!getId()) return;
	var params = {meetingId:getId()};
	Public.syncAjax(web_app.name+'/meetingAction!deleteAllMeetingRoom.ajax', 
			params,
			function(data){
				var param = $.extend({},{isVideo:getIsVideo(),meetingId:getId(),startTime:getStartTime(),endTime:getEndTime()});
				UICtrl.gridSearch(availableMeetingRoomGrid,param);
				selectedMeetingRoomGrid.loadData();
		});
}

function clearSelectedRows(){
	var rows = availableMeetingRoomGrid.getSelectedRows();
	if(rows.length>0){
		for(var i=0;i<rows.length;i++){
			availableMeetingRoomGrid.unselect(rows[i]);
		}
	}
}

function reloadMeetingRoom(){
	if(getStartTime()&&getEndTime()){
		var param = $.extend({},{isVideo:getIsVideo(),meetingId:getId(),startTime:getStartTime(),endTime:getEndTime()});
		clearSelectedRows();
		UICtrl.gridSearch(availableMeetingRoomGrid,param);
		//UICtrl.gridSearch(selectedMeetingRoomGrid,param);
		//availableMeetingRoomGrid.loadData();
		selectedMeetingRoomGrid.loadData();
	}
}

function checkMeetingId(){
	if(getId()==""){
		return false;
	}
	return true;
}
function chooseMeetingRoom(){
	if(!checkMeetingId()) {Public.tip('请先保存表单！'); return;}
	var rows = availableMeetingRoomGrid.getSelectedRows();
	if (rows.length < 1) {Public.tip('请选择数据！'); return; }
	//var meetingRoomIds = new Array([rows.length]);
	//TODO 
	var sdrows=DataUtil.getGridData({gridManager:selectedMeetingRoomGrid});
	//var sdrows=selectedMeetingRoomGrid.rows;
	if(!getStartTime()||!getEndTime()){
		Public.tip('请选择会议时间段！');
		return;
	}
	var addRows = [];
	for(var i=0;i<rows.length;i++){
		//meetingRoomIds[i] = rows[i].meetingRoomId;
		//availableMeetingRoomGrid.deleteRow(rows[i]);
		rows[i].meetingId = getId();
		var flg = true;
		for(var j=0;j<sdrows.length;j++){
			if(sdrows[j].meetingRoomId==rows[i].meetingRoomId){
				flg = false;
				break;
			}	
		}
		if(flg) addRows.push(rows[i]);
	}
	if(addRows.length>0){
		selectedMeetingRoomGrid.addRows(addRows);
	}
	//selectedMeetingRoomGrid.addRows(rows);
	/*var params = {meetingId:getId(),startTime:getStartTime(),endTime:getEndTime()};
	params['meetingRoomIds'] = $.toJSON(meetingRoomIds);
	//预订会议室
	Public.ajax(web_app.name+'/meetingAction!addMeetingRoom.ajax', 
			params,
			function(data){
				reloadMeetingRoom();
		});*/
}

function unchooseMeetingRoom(){
	var rows = selectedMeetingRoomGrid.getSelectedRows();
	if (rows.length < 1) {Public.tip('请选择数据！'); return; }
	var meetingUseDetailIds = new Array();
	if(rows.length>0)
	for(var i=0;i<rows.length;i++){
		if(rows[i].meetingUseDetailId){
			meetingUseDetailIds.push(rows[i].meetingUseDetailId);
		}
		    selectedMeetingRoomGrid.deleteRow(rows[i]);
	}
	var params = {};
	params['meetingUseDetailIds'] = $.toJSON(meetingUseDetailIds);
	Public.ajax(web_app.name+'/meetingAction!deleteMeetingRoom.ajax', 
			params,
			function(data){
				reloadMeetingRoom();
		});
}

function initSerchBox(){
	$("#managerName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},back:{id:"#managerId",personMemberName:"#managerName"}
	});
	$("#dutyName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},back:{id:"#dutyId",personMemberName:"#dutyName"}
	});
	$("#recorderName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},back:{id:"#recorderId",personMemberName:"#recorderName"}
	});
	$("#attManagerName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},back:{id:"#attManagerId",personMemberName:"#attManagerName"}
	});
}

function setEnableGridEdit(){
	/*if(getId!=""){
		Public.syncAjax(web_app.name+'/meetingAction!checkBefore.ajax', 
				{meetingId:getId()},
				function(data){
					if(data=="false"){
						//调整实际参会人员信息
						enableAttendance();
					}
					else{
						//调整计划参会人员信息
						enablePlanAttendance();
					}	
			});
	}
	else{
		//调整计划参会人员信息
		enablePlanAttendance();
	}	*/
	//调整参会人员信息
	enableAttendance();
	//调整会议议题内容
	enableTopic();
	//会议议题负责人调整计划
	enableBuildTask();
}

function setEnableEdit(){
	$('input.ui-grid-query-input').each(function(){
		UICtrl.enable(this);
	});
	if(!Public.isReadOnly){
		var titleDiv=$('#fileListTitle').hide();
		if(isApply()){//会议申请人上传会议资料
			$('#meetingFileList').fileList('enable');
			titleDiv.html('请上传会议资料').show();
			$('#toolBar').toolBar('disable','createTask');
			$('#toolBar').toolBar('disable','createInfo');
		}
		else if(isVerifyProcUnit()){//核销关闭会议
			//会议议题负责人上传总结
			$('#meetingFileList').fileList('enable');
			titleDiv.hide();
			//调整会议室时间
			//UICtrl.enable("#startTime");
			//UICtrl.enable("#endTime");
			$('#changeD').show();
			UICtrl.enable("#attManagerName");
			UICtrl.enable("#description");
			$('#toolBar').toolBar('enable','createTask');
			$('#toolBar').toolBar('enable','createInfo');
			//UICtrl.enable("#q");
		}
		else if(isCheckProcUnit()){
			$('#addRoom').attr('disabled',true);
			$('#cancelRoom').attr('disabled',true);
			$('#availableQuery').attr('disabled',true);
			$('#toolBar').toolBar('disable','createTask');
			$('#toolBar').toolBar('enable','createInfo');
		}
		else if(procUnitId == "Approve"){//审批环节,暂时放开会议室选择
			//UICtrl.enable("#q");
			$('#addRoom').attr('disabled',false);
			$('#cancelRoom').attr('disabled',false);
			$('#availableQuery').attr('disabled',false);
			$('#toolBar').toolBar('disable','createTask');
			$('#toolBar').toolBar('disable','createInfo');
		}
		else{//禁用会议室选择按钮
			$('#addRoom').attr('disabled',true);
			$('#cancelRoom').attr('disabled',true);
			$('#availableQuery').attr('disabled',true);
			$('#toolBar').toolBar('disable','createTask');
			$('#toolBar').toolBar('disable','createInfo');
		}
	}
	else{//禁用会议室选择按钮
		$('#addRoom').attr('disabled',true);
		$('#cancelRoom').attr('disabled',true);
		$('#availableQuery').attr('disabled',true);
		$('#toolBar').toolBar('disable','createTask');
		$('#toolBar').toolBar('disable','createInfo');
	}
}

//负责人调整实际参会人员信息
function enableAttendance(){
	if (isVerifyProcUnit()) {
		permissionAuthority['participateGrid.addHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['participateGrid.deleteHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['participateGrid.saveImpHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['attendanceGrid.addHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['attendanceGrid.deleteHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['participateGrid.agentPersonName']={authority:'readwrite',type:'1'};
		permissionAuthority['participateGrid.needSign']={authority:'readwrite',type:'1'};
		permissionAuthority['participateGrid.sequence']={authority:'readwrite',type:'1'};
		permissionAuthority['attendanceGrid.agentPersonName']={authority:'readwrite',type:'1'};
		permissionAuthority['attendanceGrid.needSign']={authority:'readwrite',type:'1'};
		permissionAuthority['attendanceGrid.sequence']={authority:'readwrite',type:'1'};
		permissionAuthority['participateGrid.remark']={authority:'readwrite',type:'1'};
		permissionAuthority['attendanceGrid.remark']={authority:'readwrite',type:'1'};
	}
}

//负责人调整会议议题
function enableTopic(){
	if (isVerifyProcUnit()) {
		permissionAuthority['meetingTopicGrid.addHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['meetingTopicGrid.deleteHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['meetingTopicGrid.subject']={authority:'readwrite',type:'1'};
		permissionAuthority['meetingTopicGrid.duration']={authority:'readwrite',type:'1'};
		permissionAuthority['meetingTopicGrid.topicManagerName']={authority:'readwrite',type:'1'};
		permissionAuthority['meetingTopicGrid.sequence']={authority:'readwrite',type:'1'};
	}
}

function computeSign(){
	
}

//负责人,领导调整计划
function enableBuildTask(){
	if (isVerifyProcUnit()||isCheckProcUnit()) {
		permissionAuthority['meetingBulidTaskGrid.addHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['meetingBulidTaskGrid.deleteHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['meetingBulidTaskGrid.taskKindId']={authority:'readwrite',type:'1'};
		permissionAuthority['meetingBulidTaskGrid.code']={authority:'readwrite',type:'1'};
		permissionAuthority['meetingBulidTaskGrid.name']={authority:'readwrite',type:'1'};
		permissionAuthority['meetingBulidTaskGrid.personMemberName']={authority:'readwrite',type:'1'};
		permissionAuthority['meetingBulidTaskGrid.startTime']={authority:'readwrite',type:'1'};
		permissionAuthority['meetingBulidTaskGrid.endTime']={authority:'readwrite',type:'1'};
		permissionAuthority['meetingBulidTaskGrid.sequence']={authority:'readwrite',type:'1'};
		permissionAuthority['meetingBulidTaskGrid.finishStandard']={authority:'readwrite',type:'1'};
		permissionAuthority['meetingBulidTaskGrid.description']={authority:'readwrite',type:'1'};
	}
}

function participateGridInit(){
	var toolbarParticipateOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			if(!checkMeetingId()) {Public.tip('请先保存表单！'); return;}
			//if (!isVerifyProcUnit()) {Public.tip('核销环节才能调整实际参会人员！'); return;}
			showChooseOrgDialog(function(data){
				var addRows=[];
				var countp =  participateGrid.getData().length;
				$.each(data,function(i,o){
					countp = countp + 1;
					var row=$.extend({},o,{personMemberId:o['id'],personId:o['personId'],attendanceFlag:"1",personName:o['name'],needSign:getSignIn(),sequence:countp,meetingId:getId(),attendanceKindId:'participant'});
					addRows.push(row);
				});
				participateGrid.addRows(addRows);
			});
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'meetingAction!deleteMeetingAttendance.ajax',
				gridManager:participateGrid,idFieldName:'attendanceId',
				onSuccess:function(){
					participateGrid.loadData();
				}
			});
		},
		saveImpHandler:saveImpHandler//,
		//computeSign:computeSign
	});
	participateGrid = UICtrl.grid('#participateGrid', {
		columns: [   
		    { display: "参与人", name: "personName", width: 180, minWidth: 120, type: "string", align: "left"},	   	   
		    { display: "代理人", name: "agentPersonName", width: 180, minWidth: 120, type: "string", align: "left",
		    	editor: { type: 'select', required: false, data: { type:"sys", name: "orgSelect", 
					getParam: function(){
						return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm'" };
					}, back:{personId: "agentPersonId", id:"agentPersonMemberId",personMemberName: "agentPersonName" }
			}}},
			{ display: "是否考勤", name: "needSign", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'combobox',data: yesOrNo,required:true},
				render: function (item) { 
					return yesOrNo[item.needSign];
				}},
			{ display: "参与状态", name: "attendanceFlag", width: 80, minWidth: 80, type: "string", align: "left",
				render: function (item) { 
					return attendanceFlgData[item.attendanceFlag];
				}},
		    { display: "最小打卡时间", name: "scheckTime", width: 130, minWidth: 120, type: "string", align: "left"},	   	   
			{ display: "最大打卡时间", name: "echeckTime", width: 130, minWidth: 120, type: "string", align: "left"},	   	   
			{ display: "拒绝原因", name: "refuseReason", width: 180, minWidth: 120, type: "string", align: "left"},
			
			{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left"	,
				editor: { type: 'spinner',mask:"nnn",required:true}
			},
			{ display: "备注", name: "remark", width: 160, minWidth: 60, type: "string", align: "left"	,
				editor: { type: 'text',required:false}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingAction!slicedQueryMeetingAttendance.ajax',
		parms:{meetingId:getId(),attendanceKindId:'participant'},
		width : "99%",
		height : 250,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence,personName',
		sortOrder:'asc',
		toolbar: toolbarParticipateOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		enabledEdit: true,
		usePager: true,
		pageSize : 30,
		onLoadData :function(){
   			return (getId()!='');
   		}
	});
}

function attendanceGridInit(){
	var toolbarAttendanceOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			if(!checkMeetingId()) {Public.tip('请先保存表单！'); return;}
			//if (!isVerifyProcUnit()) {Public.tip('核销环节才能调整实际参会人员！'); return;}
			showChooseOrgDialog(function(data){
				var addRows=[];
				var counta =  attendanceGrid.getData().length;
				$.each(data,function(i,o){
					counta = counta + 1;
					var row=$.extend({},o,{personMemberId:o['id'],attendanceFlag:"1",personId:o['personId'],personName:o['name'],needSign:getSignIn(),sequence:counta,meetingId:getId(),attendanceKindId:'attendance'});
					addRows.push(row);
				});
				attendanceGrid.addRows(addRows);
			});
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'meetingAction!deleteMeetingAttendance.ajax',
				gridManager:attendanceGrid,idFieldName:'attendanceId',
				onSuccess:function(){
					attendanceGrid.loadData();
				}
			});
		}
	});
	attendanceGrid = UICtrl.grid('#attendanceGrid', {
		columns: [   
			{ display: "参与人", name: "personName", width: 180, minWidth: 120, type: "string", align: "left"},
			{ display: "代理人", name: "agentPersonName", width: 180, minWidth: 120, type: "string", align: "left",
		    	editor: { type: 'select', required: false, data: { type:"sys", name: "orgSelect", 
					getParam: function(){
						return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm'" };
					}, back:{personId: "agentPersonId", id:"agentPersonMemberId",personMemberName: "agentPersonName" }
			}}},
			{ display: "是否考勤", name: "needSign", width: 60, minWidth: 60, type: "string", align: "left",
				editor: { type: 'combobox',data: yesOrNo,required:true},
				render: function (item) { 
					return yesOrNo[item.needSign];
				}},
			{ display: "参与状态", name: "attendanceFlag", width: 80, minWidth: 80, type: "string", align: "left",
				render: function (item) { 
					return attendanceFlgData[item.attendanceFlag];
				}},
			{ display: "最小打卡时间", name: "scheckTime", width: 130, minWidth: 120, type: "string", align: "left"},	   	   
			{ display: "最大打卡时间", name: "echeckTime", width: 130, minWidth: 120, type: "string", align: "left"},	   	   
			{ display: "拒绝原因", name: "refuseReason", width: 180, minWidth: 120, type: "string", align: "left"},
			{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left"	,
				editor: { type: 'spinner',mask:"nnn",required:true}
			},
			{ display: "备注", name: "remark", width: 160, minWidth: 60, type: "string", align: "left"	,
				editor: { type: 'text',required:false}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingAction!slicedQueryMeetingAttendance.ajax',
		parms:{meetingId:getId(),attendanceKindId:'attendance'},
		width : "99%",
		height : 250,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence,personName',
		sortOrder:'asc',
		toolbar: toolbarAttendanceOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		enabledEdit: true,
		usePager: true,
		pageSize : 30,
		onLoadData :function(){
   			return (getId()!='');
   		}
	});
}

//导入参会人数据
function saveImpHandler(){
	var serialId=getId();
	if(!serialId){
		Public.tip('请先保存主记录！');
		return false;
	}
	UICtrl.showAssignCodeImpDialog({title:'导入参会人数据',serialId:serialId,
		templetCode:'oaMeetingAttendanceImp',
		onClose:function(){participateGrid.loadData();}});
}

function meetingTopicGridInit(){
	var toolbarMeetingTopicOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			if(!checkMeetingId()) {Public.tip('请先保存表单！'); return;}
            UICtrl.addGridRow(meetingTopicGrid,
                { sequence: meetingTopicGrid.getData().length + 1,meetingId:getId()});
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'meetingAction!deleteMeetingTopic.ajax',
				gridManager:meetingTopicGrid,idFieldName:'meetingTopicId',
				onSuccess:function(){
					meetingTopicGrid.loadData();
				}
			});
		}
	});
	meetingTopicGrid = UICtrl.grid('#meetingTopicGrid', {
		columns: [    	   	
			{ display: "主题", name: "subject", width: 260, minWidth: 180, type: "string", align: "left",
				editor: { type: 'text',required:true}},	
			{ display: "时长(分钟)", name: "duration", width: 260, minWidth: 180, type: "string", align: "left",
				editor: { type: 'text',required:true,mask:"nnn"}},	
			{ display: "负责人", name: "topicManagerName", width: 180, minWidth: 120, type: "string", align: "left",
			    editor: { type: 'select', required: false, data: { type:"sys", name: "orgSelect", 
					getParam: function(){
						return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm'" };
					}, back:{id: "topicManagerId",personId:"personId",personMemberName: "topicManagerName" }
			}}},
			{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left"	,
				editor: { type: 'spinner',mask:"nnn",required:true}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingAction!slicedQueryMeetingTopic.ajax',
		parms:{meetingId:getId(),pagesize:1000},
		width : "99%",
		height : 250,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarMeetingTopicOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		enabledEdit: true,
		usePager: false,
		onLoadData :function(){
   			return (getId()!='');
   		}
	});
}

function meetingBulidTaskGridInit(){
	if(!Public.isReadOnly&&(isVerifyProcUnit()||isCheckProcUnit())){
		taskRequire = true;
	}
	var toolbarMeetingBulidTaskOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			if(!checkMeetingId()) {Public.tip('请先保存表单！'); return;}
            UICtrl.addGridRow(meetingBulidTaskGrid,
                { sequence: meetingBulidTaskGrid.getData().length + 1,meetingId:getId()});
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'meetingAction!deleteMeetingBulidTask.ajax',
				gridManager:meetingBulidTaskGrid,idFieldName:'meetingBulidTaskId',
				onSuccess:function(){
					meetingBulidTaskGrid.loadData();
				}
			});
		}
	});
	meetingBulidTaskGrid = UICtrl.grid('#meetingBulidTaskGrid', {
		columns: [   	   	
			{ display: "名称", name: "name", width: 200, minWidth: 100, type: "string", align: "left",
				editor: { type: 'text',required:true}},
			{ display: "责任人", name: "personMemberName", width: 120, minWidth: 120, type: "string", align: "left",
				editor: { type: 'select', required: taskRequire, data: { type:"sys", name: "orgSelect", 
					getParam: function(){
						return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm'" };
				}, back:{id:"personMemberId", personMemberName: "personMemberName",
					deptId:"deptId",deptName:"deptName" }
			}}},
			{ display: "开始时间", name: "startTime", width: 140, minWidth: 130, type: "date", align: "left",
					editor: { type: 'date',required:taskRequire}},	
			{ display: "结束时间", name: "endTime", width: 140, minWidth: 130, type: "date", align: "left",
					editor: { type: 'date',required:taskRequire}},	
			{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left"	,
				editor: { type: 'spinner',mask:"nnn",required:true}
			},
			{ display: "完成标志", name: "finishStandard", width: 160, minWidth: 120, type: "string", align: "left",
				editor: { type: 'text',required:false}},
			{ display: "描述", name: "description", width: 220, minWidth: 120, type: "string", align: "left",
				editor: { type: 'text',required:false}}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingAction!slicedQueryMeetingBulidTask.ajax',
		parms:{meetingId:getId(),pagesize:30},
		width : "99%",
		height : 250,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarMeetingBulidTaskOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		enabledEdit: true,
		usePager: true,
		pageSize : 30,
		onLoadData :function(){
   			return (getId()!='');
   		}
	});
}

function meetingLeaveGridInit(){
	meetingLeaveGrid = UICtrl.grid('#meetingLeaveGrid', {
		columns: [   	   	
			{ display: "单据编号", name: "billCode", width: 140, minWidth: 100, type: "string", align: "left"},
			{ display: "请假人", name: "personMemberName", width: 140, minWidth: 120, type: "string", align: "left"},
			{ display: "请假原因", name: "reason", width: 520, minWidth: 120, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingLeaveAction!slicedQueryMeetingLeave.ajax',
		parms:{meetingId:getId(),status:5},
		width : "99%",
		height : 250,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: false,
		enabledEdit: false,
		usePager: true,
		pageSize : 30,
		onLoadData :function(){
		   	return (getId()!='');
		   },
		onDblClickRow: function (data, rowIndex, rowObj) {
		    openUrl(data.meetingLeaveId,data.personMemberName+"会议请假单");
		   }
	});
}

function meetingCheckGridInit(){
	meetingCheckGrid = UICtrl.grid('#meetingCheckGrid', {
		columns: [   	   	
			{ display: "组织机构", name: "organName", width: 140, minWidth: 100, type: "string", align: "left"},
			{ display: "打卡人", name: "personName", width: 140, minWidth: 120, type: "string", align: "left"},
			{ display: "打卡时间", name: "ccheckTime", width: 140, minWidth: 120, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingAction!slicedQueryMeetingCheck.ajax',
		parms:{meetingId:getId(),pagesize:50},
		width : "99%",
		height : 250,
		pageSize:50,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'checkTime',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: false,
		enabledEdit: false,
		//usePager: true,
		onLoadData :function(){
		   	return (getId()!='');
		   }
	});
}

function meetingSummaryGridInit(){
	meetingSummaryGrid = UICtrl.grid('#meetingSummaryGrid', {
		columns: [   	   	
			{ display: "单据编号", name: "billCode", width: 140, minWidth: 100, type: "string", align: "left"},
			{ display: "发送人", name: "personMemberName", width: 140, minWidth: 120, type: "string", align: "left"},
			{ display: "纪要标题", name: "subject", width: 520, minWidth: 120, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/meetingAction!slicedQueryMeetingSummary.ajax',
		parms:{meetingId:getId(),pagesize:1000,status:5},
		width : "99%",
		height : 250,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: false,
		enabledEdit: false,
		usePager: false,
		onLoadData :function(){
		   	return (getId()!='');
		   },
		onDblClickRow: function (data, rowIndex, rowObj) {
		    openSummaryUrl(data.askReportId,data.subject);
		   }
	});
}

function openSummaryUrl(bizId,subject){
	var isStatistic = getIsStatistic();
	if(isStatistic){
		return false;
	}
	var url= web_app.name+'/askReportAction!showUpdateAskReport.job?bizId='+bizId+'&isReadOnly=true';
	parent.addTabItem({
		tabid : bizId,
		text : subject,
		url : url
	});
}

function openUrl(bizId,subject){
	var url= web_app.name+'/meetingLeaveAction!showUpdate.job?bizId='+bizId+'&isReadOnly=true';
	parent.addTabItem({
		tabid : bizId,
		text : subject,
		url : url
	});
}

function initTab(){
	$('#meetingAttendanceTab').tab().on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('li')){
			var id=$clicked.attr('id');
			if(id=='attendance'){
				if(attendanceGrid==null){
					attendanceGridInit();
				}
				attendanceGrid._onResize.ligerDefer(attendanceGrid, 50);
			}
			else if(id=='meetingTopic'){
				if(meetingTopicGrid==null){
					meetingTopicGridInit();
				}
				meetingTopicGrid._onResize.ligerDefer(meetingTopicGrid, 50);
			}
			else if(id=='meetingBulidTask'){
				if(meetingBulidTaskGrid==null){
					meetingBulidTaskGridInit();
				}
				meetingBulidTaskGrid._onResize.ligerDefer(meetingBulidTaskGrid, 50);
			}
			else if(id=='participate'){
				if(participateGrid==null){
					participateGridInit();
				}
				participateGrid._onResize.ligerDefer(participateGrid, 50);
			}
			else if(id=='meetingLeave'){
				if(meetingLeaveGrid==null){
					meetingLeaveGridInit();
				}
				meetingLeaveGrid._onResize.ligerDefer(meetingLeaveGrid, 50);
			}
			else if(id=='meetingCheck'){
				if(meetingCheckGrid==null){
					meetingCheckGridInit();
				}
				meetingCheckGrid._onResize.ligerDefer(meetingCheckGrid, 50);
			}
			else if(id=='meetingSummary'){
				if(meetingSummaryGrid==null){
					meetingSummaryGridInit();
				}
				meetingSummaryGrid._onResize.ligerDefer(meetingSummaryGrid, 50);
			}
		}
	});
}

function getId() {
	return $("#meetingId").val();
}

function setId(value) {
	$("#meetingId").val(value);
	availableMeetingRoomGrid.options.parms['meetingId'] =value;
	selectedMeetingRoomGrid.options.parms['meetingId'] =value;
	participateGrid.options.parms['meetingId'] =value;
	if(attendanceGrid!=null){
		attendanceGrid.options.parms['meetingId'] =value;
	}
	if(meetingTopicGrid!=null){
		meetingTopicGrid.options.parms['meetingId'] =value;
	}
	if(meetingBulidTaskGrid!=null){
		meetingBulidTaskGrid.options.parms['meetingId'] =value;
	}
	if(meetingCheckGrid!=null){
		meetingCheckGrid.options.parms['meetingId'] =value;
	}
	if(meetingLeaveGrid!=null){
		meetingLeaveGrid.options.parms['meetingId'] =value;
	}
	$('#meetingFileList').fileList({
		bizId : value
	});
}

function getOrganId() {
	return $("#organId").val();
}

function getCenterId() {
	return $("#centerId").val();
}

//打开机构选择对话框
function showChooseOrgDialog(fn){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='psm';
	var options = { params: selectOrgParams,title : "选择人员",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			if($.isFunction(fn)){
				fn.call(window,data);
			}
			this.close();
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}
//////////////////////////////流程相关////////////////////////////////////////////////////////
function isApply(){
	return procUnitId == "Apply";
}

function isApproveProcUnit(){
	return procUnitId == "Approve" || procUnitId == "Check";
}

function isVerifyProcUnit(){
	return procUnitId == "Verify";
}

function isCheckProcUnit(){
	return procUnitId == "Check";
}

function afterSave(data){
	//保存需刷新Grid
	reloadMeetingRoom();
	participateGrid.loadData();
	if(attendanceGrid!=null)
		attendanceGrid.loadData();
	if(meetingTopicGrid!=null)
		meetingTopicGrid.loadData();
	if(meetingBulidTaskGrid!=null)
		meetingBulidTaskGrid.loadData();
	if(data.psmName&&data.psmName!=""){
		UICtrl.alert(data.psmName+"已经有其它会议安排，请核实！");
	}
}

function reLoadJobTaskExecutionList(bizId, procUnitId) {
	procUnitId = procUnitId || 'Approve';
	var handlerListId = "";
	if (procUnitId == "Approve") {
		handlerListId = "approverList";
	}else if (procUnitId == "Check") {
		handlerListId = "checkerList";
	}
	if (!handlerListId) {
		return;
	}

	$("#" + handlerListId).load(web_app.name + "/common/TaskExecutionList.jsp",
		{ bizId : bizId, procUnitId : procUnitId, taskId: taskId }, function() {
				Public.autoInitializeUI($("#" + handlerListId));
	});
}
//提交扩展属性,流程数据
function getExtendedData(){	
	var startTime = $('#startTime').val();
	var endTime = $('#endTime').val();
	if(endTime&&startTime){
		if(!Public.compareDate(endTime,startTime)){
			Public.tip("开始时间不能大于结束时间!");
			return false;
		}
		var nextMonthDate = $('#nextMonthDate').val();
		var re = /-/g;
		var rs = / /g;
		var ra = /:/g;
		var edate=endTime.replace(re,"");
		edate=edate.replace(rs,"");
		edate=edate.replace(ra,"");
		var ndate=nextMonthDate.replace(re,"");
		ndate=ndate.replace(rs,"");
		ndate=ndate.replace(ra,"");
		if(ndate<edate.substring(0,8)){
			Public.tip("会议预订时间不能提前超过一个月!");
			return false;
		}
	}
	var detailData = $("#submitWfForm").formToJSON();
	var dutyId = $('#dutyId').val();
	if(!dutyId){
		Public.tip("请通过选择设置会议召集人!");
		return false;
	}
	var extendData = {};
	extendData.detailData = encodeURI(detailData);
	if(getId()!=""){
		//会议室更新
		if(selectedMeetingRoomGrid!=null){
			var meetingRoomData=DataUtil.getGridData({gridManager:selectedMeetingRoomGrid});
			if(!meetingRoomData) return false;
			else {
				if(meetingRoomData.length>0){
					extendData.meetingRoomData = $.toJSON(meetingRoomData);
				}
			}
		}
		//实际参会人员保存
		if(participateGrid!=null){
			var participateData=DataUtil.getGridData({gridManager:participateGrid});
			if(!participateData) {
				$('#participate').trigger('click');
				return false;
			}
			else {
				if(participateData.length>0){
					var participate = $.toJSON(participateData);
					if(!participate) {
						$('#participate').trigger('click');
						return false;
					}
					extendData.participateData = participate;
				}
			}
		}
		//实际列席人员保存
		if(attendanceGrid!=null){
			var attendanceData=DataUtil.getGridData({gridManager:attendanceGrid});
			if(!attendanceData) {
				$('#attendance').trigger('click');
				return false;
			}
			else {
				if(attendanceData.length>0){
					var attendance = $.toJSON(attendanceData);
					if(!attendance) {
						$('#attendance').trigger('click');
						return false;
					}
					extendData.attendanceData = attendance;
				}
			}
		}
		//会议议题保存
		if(meetingTopicGrid!=null){
			var meetingTopicData=DataUtil.getGridData({gridManager:meetingTopicGrid});
			if(!meetingTopicData) {
				$('#meetingTopic').trigger('click');
				return false;
			}
			else {
				if(meetingTopicData.length>0){
					var meetingTopic = $.toJSON(meetingTopicData);
					if(!meetingTopic) {
						$('#meetingTopic').trigger('click');
						return false;
					}
					extendData.meetingTopicData = meetingTopic;
				}
			}
		}
		//会议生成计划保存
		if(meetingBulidTaskGrid!=null){
			var meetingBulidTaskData=DataUtil.getGridData({gridManager:meetingBulidTaskGrid});
			if(!meetingBulidTaskData) {
				$('#meetingBulidTask').trigger('click');
				return false;
			}
			else {
				if(meetingBulidTaskData.length>0){
					var meetingBulidTask = $.toJSON(meetingBulidTaskData);
					if(!meetingBulidTask) {
						$('#meetingBulidTask').trigger('click');
						return false;
					}
					extendData.meetingBulidTaskData = meetingBulidTask;
				}
			}
		}
		if(isApply()){
			var arr = new Array();
			extendData.detailData=encodeURI($.toJSON(arr.concat(noticeHandlerArray,leaveHandlerArray)));
		}
		//核销环节处理人
		else if(isVerifyProcUnit()){
			var arr = new Array();
			extendData.detailData=encodeURI($.toJSON(arr.concat(noticeHandlerArray,leaveHandlerArray)));
		}
		else {
			extendData.detailData=[];
		}
	}
	else{
		extendData.detailData=[];
	}
	return extendData;
}

function checkConstraints(){
	if(isApply()){
		if(selectedMeetingRoomGrid==null||selectedMeetingRoomGrid.rows.length<=0){
			alert("没有预定任何会议室，请核实后提交!");
		}
	}
	return true;
}

function showChooseHandlerDialog(personKind){
	var params = {};
    var personArray=window[personKind+'Array'];
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
    params = $.extend({}, params, selectOrgParams);
    UICtrl.showFrameDialog({
        title: '处理人选择',
        width: 800,
        height: 380,
        url: web_app.name + '/workflowAction!showCounterSignDialog.do',
        param: params,
        init:function(){
        	var addFn=this.iframe.contentWindow.addData;
			if($.isFunction(addFn)){//初始化已选择列表
			    this.iframe.contentWindow.isInitializingData = true;
				$.each(personArray,function(i,d){
					addFn.call(window,d);
				});
				this.iframe.contentWindow.isInitializingData = false;
			}
			try{
				var gridManager=this.iframe.contentWindow.gridManager;
				//gridManager.toggleCol('groupId', false);//不用分组
			}catch(e){}
        },
        ok: function(){
        	var fn = this.iframe.contentWindow.getChooseGridData;
		    var params = fn();
		    if (!params) { return;}
		    //清空数组
	    	personArray.splice(0,personArray.length);
	    	$.each(params,function(i,o){
				o['orgUnitId']=o['handlerId'];
				o['orgUnitName']=o['handlerName'];
				o['id']=o['handlerId'];
				o['name']=o['handlerName'];
				o['kindId']=personKind;
				///o['groupId']= 10;
				personArray.push(o);
			});
			initShowDivText(personKind);
			this.close();
        },
        cancelVal: '关闭',
        cancel: true
    });
}

function checkTime2(){
	var startTime = $('#startTime').val();
	var endTime = $('#endTime').val();
	var nextMonthDate = $('#nextMonthDate').val();
	if(endTime){
		var re = /-/g;
		var rs = / /g;
		var ra = /:/g;
		var edate=endTime.replace(re,"");
		edate=edate.replace(rs,"");
		edate=edate.replace(ra,"");
		var ndate=nextMonthDate.replace(re,"");
		ndate=ndate.replace(rs,"");
		ndate=ndate.replace(ra,"");
		if(ndate<edate.substring(0,8)){
			UICtrl.alert("会议预订时间不能提前超过一个月!");
			$('#endTime').val("");
			return false;
		}
		else if(startTime){
			var sdate=startTime.replace(re,"");
			sdate=sdate.replace(rs,"");
			sdate=sdate.replace(ra,"");
			if(sdate>edate){
				UICtrl.alert("开始时间不能大于结束时间!");
				$('#startTime').val("");
				return false;
			}
		}
	}
}

//初始化显示
function initShowDivText(personKind){
	var personArray=window[personKind+'Array'];
	var showDiv=$('#'+personKind+'ShowDiv');
	var html=new Array();
	$.each(personArray,function(i,o){
		html.push('<span title="',o['fullName'],'">');
		html.push(o['orgUnitName']);
		html.push('</span">;&nbsp;');
	});
	showDiv.html(html.join(''));
}

//清空已选择列表
function clearChooseArray(personKind){
	var personArray=window[personKind+'Array'];
	$('#'+personKind+'ShowDiv').html('');
	//清空数组
	personArray.splice(0,personArray.length);
}
//隐藏人员选择链接
function hidePersonLink(){
	/*if(Public.isReadOnly||!isVerifyProcUnit()){
		$.each(['handler'],function(i,p){
			$('#'+p+'ChooseLink').hide();
			$('#'+p+'ClearLink').hide();
		});
	}*/
	if(Public.isReadOnly||!isVerifyProcUnit()&&!isApply()){
		$.each(['leaveHandler'],function(i,p){
			$('#'+p+'ChooseLink').hide();
			$('#'+p+'ClearLink').hide();
		});
		$.each(['noticeHandler'],function(i,p){
			$('#'+p+'ChooseLink').hide();
			$('#'+p+'ClearLink').hide();
		});
	}
}

//加载已存在的纪要处理人、请假审批人信息
function queryMeetingHandler(){
	Public.ajax(web_app.name + '/meetingAction!queryMeetingHandler.ajax', {meetingId:getId()}, function(data){
		var kindId=null;
		$.each(data,function(i,d){
			kindId=d['kindId'];
			if($.isArray(window[kindId+'Array'])){
				window[kindId+'Array'].push(d);
			}
		});
		//initShowDivText('handler');
		initShowDivText('leaveHandler');
		initShowDivText('noticeHandler');
	});
}

//核销环节变更会议时间
function changeMeetingDate(){
	var html=['<div class="ui-form">','<form method="post" action="" id="changeMeetingDateForm">'];
	html.push("<div class='row'><dl>");
    html.push("<dt style='width:75px'>开始日期<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' name='startDate' id='detailStartDate' required='true' maxlength='20'  datetime='true' label='开始日期'/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<div class='row'><dl>");
    html.push("<dt style='width:75px'>结束日期<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' name='endDate' id='detailEndDate' required='true' maxlength='20' datetime='true' label='结束日期'/>");
    html.push("</dd>");
    html.push("</dl></div>");
	html.push('</form>','</div>');
	UICtrl.showDialog( {
		width:270,
		top:100,
		title : '调整会议时间',
		height:120,
		content:html.join(''),
		init:function(){
			$('#detailStartDate').val($('#startTime').val()),
			$('#detailEndDate').val($('#endTime').val())
		},
		ok : function(){
			var _self=this;
			var param=$('#changeMeetingDateForm').formToJSON();
			if(!param) return;
			var re = /-/g;
			var rs = / /g;
			var ra = /:/g;
			var sdate=param['startDate'].replace(re,"");
			sdate=sdate.replace(rs,"");
			sdate=sdate.replace(ra,"");
			var edate=param['endDate'].replace(re,"");
			edate=edate.replace(rs,"");
			edate=edate.replace(ra,"");
			param.meetingId = getId();
			if(sdate>edate){
				Public.tip("结束日期不能小于开始日期!");
				return;
			}
			//执行数据变更
			UICtrl.confirm('确实要变更会议时间吗(存在时间冲突的会议室将被删除)?',function(){
				Public.ajax(web_app.name + '/meetingAction!changeMeetingDate.ajax', param, function(data){
					$('#startTime').val($('#detailStartDate').val());
					$('#endTime').val($('#detailEndDate').val());
					var params = $.extend({},{isVideo:getIsVideo(),startTime:param['startDate'],
						endTime:param['endDate']});
					UICtrl.gridSearch(availableMeetingRoomGrid,params);
					UICtrl.gridSearch(selectedMeetingRoomGrid,params);
					//selectedMeetingRoomGrid.loadData();
					if(data.hasDuplicate=="true"){
						//alert("以下会议室已被取消预订："+data.duplicateRooms);		
					}
					//关闭父窗口
					_self.close();
					return true;
				});
			});
		}
	});
}

function showChooseSecretaryDialog(personKind){
	var params = {};
	params.meetingId=getId();
    var personArray=window[personKind+'Array'];
    UICtrl.showFrameDialog({
        title: '会议秘书选择',
        width: 920,
        height: 380,
        url: web_app.name + '/meetingSecretaryAction!forwardMeetingSecretaryChoose.do',
        param: params,
        init:function(){
        	this.iframe.contentWindow.initializeChooseGrid();
        	var addFn=this.iframe.contentWindow.addData;
			if($.isFunction(addFn)){//初始化已选择列表
			    this.iframe.contentWindow.isInitializingData = true;
				$.each(personArray,function(i,d){
					addFn.call(window,d);
				});
				this.iframe.contentWindow.isInitializingData = false;
			}
			try{
				var gridManager=this.iframe.contentWindow.gridManager;
				//gridManager.toggleCol('groupId', false);//不用分组
			}catch(e){}
        },
        ok: function(){
        	var fn = this.iframe.contentWindow.getChooseGridData;
		    var params = fn();
		    if (!params) { return;}
		    //清空数组
	    	personArray.splice(0,personArray.length);
	    	$.each(params,function(i,o){
				o['orgUnitId']=o['handlerId'];
				o['orgUnitName']=o['handlerName'];
				o['id']=o['handlerId'];
				o['name']=o['handlerName'];
				o['kindId']=personKind;
				//需要转换fullId
				o['fullId']=o['ofullId'];
				///o['groupId']= 10;
				personArray.push(o);
			});
			initShowDivText(personKind);
			this.close();
        },
        cancelVal: '关闭',
        cancel: true
    });
}

function getIsStatistic(){
	return $('#isStatistic').val();
}