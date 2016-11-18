$(document).ready(function() {
	initializeUI();
});
function initializeUI(){
	//委托人选择
	$("#personMemberName").searchbox({type : "sys", name : "orgSelect",
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " and  org_kind_id ='psm'"};
		},
		back : {
			personMemberName : "#personMemberName",
			fullId : "#fullId",
			deptId : "#deptId",
			deptName : "#deptName",
			personMemberId : "#personMemberId",
			positionId : "#positionId",
			positionName : "#positionName"
		},
		onChange : function() {
			$("#deputyName").val($("#deputyNameTemp").val());
		}
	});
	//受托人选择
	$("#agentPersonMemberName").searchbox({type : "sys", name : "orgSelect",
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " and  org_kind_id ='psm'"};
		},
		back : {
			personMemberName : "#agentPersonMemberName",
			personMemberId : "#agentPersonMemberId",
			positionName : "#agentPositionName"
		}
	});
	//会议类型选择
	var meetingKindName=$("#meetingKindName");
	meetingKindName.searchbox({type : "oa", showToolbar:false,width:250,
		name : "querySpecializedCommitteeMeetingKind",
		back : {
			meetingKindId : "#meetingKindId",
			name :meetingKindName
		}
	});
	initMeetingChoose();
}
function initMeetingChoose(){
	if(Public.isReadOnly){return hideMeetingChoose();}
	if(!isApplyProcUnit()){return hideMeetingChoose();}
	$('#subject_click').comboDialog({type:'oa',name:'chooseMeeting',
		title:'会议选择',
		onShow:function(){
			var meetingKindId=$('#meetingKindId').val();
			if(meetingKindId==''){
				Public.errorTip("请先选择会议类型!");
				return false;
			}
			return true;
		},
		getParam:function(){
			var meetingKindId=$('#meetingKindId').val();
			return {searchQueryCondition:' meeting_kind_id=:meetingKindId',meetingKindId:meetingKindId};
		},
		onChoose:function(){
			var row=this.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			$('#subject').val(row.subject);
			$('#meetingDate').val(row.startTime);
			$('#meetingId').val(row.meetingId);
		    return true;
	    },
	    dialogOptions:{
	    	button: [{
		        name: '未找到对应会议',
		        callback: function(){
		            //打开新的对话框
		           setTimeout(function(){openInputMeetingInfoDialog();},0);
		           return true;
		         },
		         focus: true
		    }]
	   }
   });
}
function hideMeetingChoose(){
	var input=$('#subject'),td=input.parent().parent('td.edit');
	td.addClass('disable');
	input.attr('readonly',true).addClass('textReadonly');
	input.next('span').hide();
	return false;
}
function openInputMeetingInfoDialog(){
	var html=['<div class="ui-form">'];
	html.push('<dl style="height:50px;">','<dt style="width:70px">会议主题<font color="#FF0000">*</font>&nbsp;:</dt>');
	html.push('<dd>','<textarea maxlength="100" id="inputMeetingName" class="textarea" style="height:50px;"></textarea>','</dd>','</dl>');
	html.push('<dl>','<dt style="width:70px">会议时间<font color="#FF0000">*</font>&nbsp;:</dt>');
	html.push('<dd>','<input	 type="text" id="inputMeetingTime" class="text" date="true"/>','</dd>','</dl>');
	html.push('</div></form>');
	UICtrl.showDialog({title:'会议信息',width:300,top:100,
		content:html.join(''),
		ok:function(){
			var subject=$('#inputMeetingName').val();
			if(Public.isBlank(subject)){
				 Public.errorTip("请输入会议主题!");
				return false;
			}
			var meetingTime=$('#inputMeetingTime').val();
			if(Public.isBlank(meetingTime)){
				 Public.errorTip("请输入会议时间!");
				return false;
			}
			$('#subject').val(subject);
			$('#meetingDate').val(meetingTime);
			return true;
		}
   });
}
function getId() {
	return $("#meetingLeaveId").val();
}

function setId(value) {
	$("#meetingLeaveId").val(value);
}

function checkConstraints() {
	var personMemberId=$('#personMemberId').val();
	var agentPersonMemberId=$('#agentPersonMemberId').val();
	if(personMemberId!=''||agentPersonMemberId!=''){
		personMemberId=personMemberId.split('@')[0];
		agentPersonMemberId=agentPersonMemberId.split('@')[0];
		if(personMemberId==agentPersonMemberId){
			 Public.errorTip("委托人与受托人不能相同!");
			 return false;
		}
	}
	return true;
}