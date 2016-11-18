var handlerArray=new Array();//处理人
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initHandler();
	initKind();
	var fileTable=$('#meetingLeaveFileList').fileList();
	fileTable.find('table').css({borderTopWidth:0});
	$('#nMeeting').css({borderTopWidth:0,borderBottomWidth:0});
	$('#hMeeting').css({borderTopWidth:0,borderBottomWidth:0});
	$('#sMeeting').css({borderTopWidth:0,borderBottomWidth:0});
	$('#lMeeting').css({borderTopWidth:0});
	queryMeetingLeaveHandler();
	$('#meetingName').searchbox({ type:"oa", name: "chooseMeeting",
		back:{
			subject:"#subject",meetingName:"#meetingName",meetingId:"#meetingId",
			meetingKindId:"#meetingKindId",meetingKindName:"#meetingKindName",
			startTime:"#startTime",endTime:"#endTime",meetingPlace:"#meetingPlace"
		}
	});
	hidePersonLink();
	// 缓存登录人信息，用于代理请假
	$("#deputyIdTemp").val($("#personMemberId").val());
	$("#deputyFullIdTemp").val($("#fullId").val());
	$("#deputyNameTemp").val($("#personMemberName").val());
	$("#personMemberName").searchbox({type : "sys", name : "orgSelect",
		getParam : function() {
			//return {a : 1, b : 1, searchQueryCondition : " org_id = '" + getOrganId() + "'  and  org_kind_id ='psm'"};
			return {a : 1, b : 1, searchQueryCondition : " and  org_kind_id ='psm'"};
		},
		back : {
			personMemberName : "#personMemberName",
			fullId : "#fullId",
			deptId : "#deptId",
			deptName : "#deptName",
			personMemberId : "#personMemberId"
		},
		onChange : function() {
			$("#deputyName").val($("#deputyNameTemp").val());
		}
	});
	$("#agentPersonMemberName").searchbox({type : "sys", name : "orgSelect",
		getParam : function() {
			//return {a : 1, b : 1, searchQueryCondition : " org_id = '" + getOrganId() + "'  and  org_kind_id ='psm'"};
			return {a : 1, b : 1, searchQueryCondition : " and  org_kind_id ='psm'"};
		},
		back : {
			personMemberName : "#agentPersonMemberName",
			personMemberId : "#agentPersonMemberId"
		}
	});
	meetingChooseCheck();
	if(getId()){
		UICtrl.disable($('#businessKindCode'));
		UICtrl.disable($('#isSystemMeeting'));
		//UICtrl.disable($('#meetingKindName'));
	}
	else{//默认是系统会议，不能选择会议类型
		UICtrl.disable($('#meetingKindName'));
	}
});

function meetingChooseCheck(){
	var isSystemMeeting = $('#isSystemMeeting').val();
	if(isSystemMeeting=="1"){
		$('#meetingName').attr('required', true);
		$('#subject').attr('required', false);
		$('#noSystemMeeting').hide();
		$('#systemMeeting').show();
		UICtrl.disable($('#meetingKindName'));
		UICtrl.enable($('#meetingName'));
		clearChooseArray("handler");
	}
	else{
		$('#meetingId').val("");
		$('#meetingName').val("");
		clearChooseArray("handler");
		$('#subject').attr('required', true);
		$('#meetingName').attr('required', false);
		UICtrl.enable($('#meetingKindName'));
		UICtrl.disable($('#meetingName'));
		$('#noSystemMeeting').show();
		$('#systemMeeting').hide();
	}
}

function initKind(){
	$('#isSystemMeeting').combox({onChange:function(){
		meetingChooseCheck();
	}});
	$('#meetingKindName').treebox({
		treeLeafOnly: true,name:"meetingKind",
		beforeChange:function(data){
			if(data.nodeType=='f'){
				return false;
			}
			return true;
		},
		back:{text:'#meetingKindName',value:'#meetingKindId'}
    });
}

function initHandler(){
	if($('#isSystemMeeting').val()=="1"){
		$('#noSystemMeeting').hide();
		$('#systemMeeting').show();
	}
	else{
		$('#noSystemMeeting').show();
		$('#systemMeeting').hide();
	}
}

function getId() {
	return $("#meetingLeaveId").val();
}

function setId(value) {
	$("#meetingLeaveId").val(value);
	$('#meetingLeaveFileList').fileList({
		bizId : value
	});
}

function getOrganId() {
	return $("#organId").val();
}

function getCenterId() {
	return $("#centerId").val();
}

function getExtendedData(){
	var isSystemMeeting = $('#isSystemMeeting').val();
	if(isApply()){
		if(isSystemMeeting=="0"){
			if(handlerArray.length==0){
				Public.tip("请选择处理人");
				return false;
			}
		}
	}
	return {detailData:encodeURI($.toJSON(handlerArray))};
}

function showChooseHandlerDialog(){
	var params = {};
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
				$.each(handlerArray,function(i,d){
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
			handlerArray.splice(0,handlerArray.length);
			$.each(params,function(i,o){
				o['orgUnitId']=o['handlerId'];
				o['orgUnitName']=o['handlerName'];
				o['id']=o['handlerId'];
				o['name']=o['handlerName'];
				o['kindId']='handler';
				//o['groupId']= 10;
				handlerArray.push(o);
			});
			initShowDivText('handler');
			this.close();
        },
        cancelVal: '关闭',
        cancel: true
    });
}

//初始化显示
function initShowDivText(personKind){
	var personArray=window[personKind+'Array'];
	var showDiv=$('#'+personKind+'ShowDiv1');
	var showDiv2=$('#'+personKind+'ShowDiv2');
	var html=new Array();
	$.each(personArray,function(i,o){
		html.push('<span title="',o['fullName'],'">');
		html.push(o['orgUnitName']);
		html.push('</span">;&nbsp;');
	});
	showDiv.html(html.join(''));
	showDiv2.html(html.join(''));
}

//清空已选择列表
function clearChooseArray(personKind){
	var personArray=window[personKind+'Array'];
	$('#'+personKind+'ShowDiv1').html('');
	$('#'+personKind+'ShowDiv2').html('');
	//清空数组
	personArray.splice(0,personArray.length);
}

function isApproveProcUnit(){
	return procUnitId == "Approve" || procUnitId == "Check";
}

//隐藏人员选择链接
function hidePersonLink(){
	if(Public.isReadOnly||isApproveProcUnit()){
		$.each(['handler'],function(i,p){
			$('#'+p+'ChooseLink1').hide();
			$('#'+p+'ClearLink1').hide();
			$('#'+p+'ChooseLink2').hide();
			$('#'+p+'ClearLink2').hide();
		});
	}
}

//加载已存在的纪要处理人信息
function queryMeetingLeaveHandler(){
	Public.ajax(web_app.name + '/meetingLeaveAction!queryMeetingLeaveHandler.ajax', {meetingLeaveId:getId()}, function(data){
		var kindId=null;
		$.each(data,function(i,d){
			kindId=d['kindId'];
			if($.isArray(window[kindId+'Array'])){
				window[kindId+'Array'].push(d);
			}
		});
		initShowDivText('handler');
	});
}

function isApply(){
	return procUnitId == "Apply";
}