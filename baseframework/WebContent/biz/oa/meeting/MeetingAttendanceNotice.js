var meetingTopicGrid = null,attendanceFlgData={};
var yesOrNo = {1:'是',0:'否'};
var handlerArray=new Array();//参会人
var handlerArrayTmp=new Array();//参会人
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	queryMeetingHandler();
	attendanceFlgData = $("#attendanceFlg").combox("getJSONData");
	if($("#isAttendance").val()=="true"){
		var fileTable=$('#meetingFileList').fileList({readOnly:true});
		fileTable.find('table').css({borderTopWidth:0,borderBottomWidth:0});
	}
	else{
		$('#meetingFileList').remove();
	}
	//$('#toolBar').toolBar('addItem',tools);
});

//var tools = [{ id: 'createMeetingApply', name: '会议请假', icon: 'turn',event: createMeetingApply}];

function createMeetingLeaveApply(){
	var meetingId = $('#meetingId').val();
	var subject = $('#subject').val();
	var meetingKindId = $('#meetingKindId').val();
	var meetingKindName = $('#meetingKindName').val();
	parent.addTabItem({ tabid: 'createMeetingApply', text: '会议请假申请', 
	url: encodeURI(web_app.name + '/meetingLeaveAction!forwardMeetingLeaveApply.job?meetingId='+meetingId)});
}

function getId() {
	return $("#meetingId").val();
}

function setId(value) {
	$("#meetingId").val(value);
}

//清空已选择列表
function clearChooseArray(personKind){
	//删除参会人数据
	Public.ajax(web_app.name + '/meetingAction!deleteMeetingAttendanceByOper.ajax', 
			{meetingId:getId()}, 
			function(data){
				var personArray=window[personKind+'Array'];
				$('#'+personKind+'ShowDiv').html('');
				//清空数组
				personArray.splice(0,personArray.length);
		});
}

//加载参会人信息
function queryMeetingHandler(){
	Public.ajax(web_app.name + '/meetingAction!queryAttendance.ajax', {meetingId:getId(),attendanceKindId:'participant'}, function(data){
		var kindId=null;
		$.each(data,function(i,d){
			kindId=d['kindId'];
			if($.isArray(window[kindId+'Array'])){
				window[kindId+'Array'].push(d);
			}
		});
		initShowDivText('handler');
		handlerArrayTmp = handlerArray.concat(); 
	});
}


function showChooseHandlerDialog(personKind){
	var personArray=window[personKind+'Array'];
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='psm';
	var options = { params: selectOrgParams,title : "请选择人员",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			//清空数组
			personArray.splice(0,personArray.length);
			$.each(data,function(i,o){
				o['orgUnitId']=o['id'];
				o['orgUnitName']=o['name'];
				o['kindId']=personKind;
				o['sequence']=(i+1);
				personArray.push(o);
			});
			initShowDivText(personKind);
			var detailAddData=new Array();
			var detailDelData=new Array();
			$.each(personArray,function(i,o){
				var flg = false;
				for(var i=0;i<handlerArrayTmp.length;i++){
					if(handlerArrayTmp[i]['id']==o['id']){
						flg = true;
						break;
					}
				}
				if(!flg){
					detailAddData.push(o);
				}
			});
			$.each(handlerArrayTmp,function(i,o){
				var flg = false;
				for(var i=0;i<personArray.length;i++){
					if(personArray[i]['id']==o['id']){
						flg = true;
						break;
					}
				}
				if(!flg){
					detailDelData.push(o);
				}
			});
			Public.ajax(web_app.name + '/meetingAction!saveMeetingAttendance.ajax', 
					{meetingId:getId(),detailAddData:$.toJSON(detailAddData),
					detailDelData:$.toJSON(detailDelData)}, 
					function(data){
						initShowDivText(personKind);
			});
			handlerArrayTmp = personArray.concat(); 
			this.close();
		},
		initHandler:function(){
			var addFn=this.iframe.contentWindow.addDataOneNode;
			if($.isFunction(addFn)){//初始化已选择列表
				this.iframe.contentWindow.isInitializingData = true;
				$.each(personArray,function(i,d){
					addFn.call(window,d);
				});
				this.iframe.contentWindow.isInitializingData = false;
				//刷新列表
				var reloadGrid=this.iframe.contentWindow.reloadGrid;
				reloadGrid.call(window);
			}
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

//初始化显示
function initShowDivText(personKind){
	var personArray=window[personKind+'Array'];
	var showDiv=$('#'+personKind+'ShowDiv');
	var html=new Array();
	if(personArray.length>50){
		for(var i=0;i<50;i++){
			var o = personArray[i];
			html.push('<span title="',o['fullName'],'">');
			html.push(o['orgUnitName']);
			html.push('</span">;&nbsp;');
		}
		html.push('&nbsp;......(查看更多人员请点击选择)');
	}
	else{
		$.each(personArray,function(i,o){
			html.push('<span title="',o['fullName'],'">');
			html.push(o['orgUnitName']);
			html.push('</span">;&nbsp;');
		});	
	}
	showDiv.html(html.join(''));
}


function viewMeetingPsm(){
	 UICtrl.showFrameDialog({
	        title: '参会人员查看',
	        width: 780,
	        height: 460,
	        url: web_app.name+'/meetingAction!forwardMeetingAttendance.do',
	        param: {meetingId:getId()},
	        ok: false,
	        cancelVal: '关闭',
	        cancel: true
	    });
}