var weixinMessageSendDetail=[];
var filetypeMap={
	text:[],
	news:['jpg','png'],
	image:['jpg','png'],
	voice:['amr'],
	video:['mp4'],
	file:[]
};
function initializeMessageSendUI() {
	weixinMessageSendDetail=[];
	$('#weixinMessageSendIdFileList').fileList();
	$("#weixinMessageKindName").searchbox({type : "sys", name : "weixinMessageKind",
		back : {
			weixinMessageKindId : "#detailWeixinMessageKindId",
			name : "#weixinMessageKindName",
			msgType:'#detailMsgType',
			title : "#detailTitle",
			linkUrl : "#detailLinkUrl",
			remark : "#detailRemark"
		},
		onChange:function(o){
			var msgType=o['msgType'];
			$('#detailMsgType').combox('setValue',msgType);
			onMsgTypeChange();
		}
	});
	onMsgTypeChange();
	initWeixinMessageSendDetail();
	$('#detailMsgType').combox('disable');
	var status=$('#detailStatus').val();
	if(status!=0){
		UICtrl.setReadOnly($('#submitForm'));
		$('#weixinMessageSendIdFileList').fileList('disable');
		$('#sendWeixinMessage').hide();
		$('input.ui_state_highlight').val('复制新增');
	}
}

function onMsgTypeChange(){
	var msgType=$('#detailMsgType').val();
	$('#linkUrlTr')[msgType=='news'?'show':'hide']();
	var param={bizId:$('#detailWeixinMessageKindId').val(),bizCode:'weixinMessageKind'};
	param['isWrap']=false;
	param['isWrap']=false;
	Public.load(web_app.name + '/common/attachment.jsp',param,function(data){
		$('#weixinMessageKindFileDiv').html(data);
		$('#attachmentList').fileList({readOnly:true});
	});
	$('#weixinMessageSendIdFileList').fileList({filetype:filetypeMap[msgType]});
}

function initWeixinMessageSendDetail(){
	var weixinMessageSendId=$('#detailWeixinMessageSendId').val();
	if(weixinMessageSendId=='') return;
	Public.ajax(web_app.name + '/weixinMessageSendAction!querySendDetailByBizId.ajax', {weixinMessageSendId:weixinMessageSendId}, function(data){
		initShowDivText(data);
	});
}

//打开机构选择对话框
function showChooseOrgDialog(){
	var personArray=weixinMessageSendDetail;
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='dpt,psm';
	var options = { params: selectOrgParams,title : "请选择...",
		parent:window['ajaxDialog'],
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
				personArray.push(o);
			});
			initShowDivText(personArray);
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

function initShowDivText(personArray){
	weixinMessageSendDetail=personArray;
	var showDiv=$('#sendForShowDiv');
	var html=new Array();
	$.each(personArray,function(i,d){
		html.push('<span title="',d['fullName'],'" style="word-break:keep-all;">');
		html.push('<img src="',OpmUtil.getOrgImgUrl('psm',d['status']),'" width="16" height="16"/>');
		html.push(d['name']);
		html.push('</span>;&nbsp;');
	});
	showDiv.html(html.join(''));
}

function clearChooseArray(){
	initShowDivText([]);
}

function saveMessageSend(fn){
	var status=$('#detailStatus').val();
	var weixinMessageSendId=$('#detailWeixinMessageSendId').val();
	if(status!=0&&weixinMessageSendId!=''){
		saveCopyNew(weixinMessageSendId,fn);
		return;
	}
	var param={};
	param['detailData']=encodeURI($.toJSON(weixinMessageSendDetail));
	$('#submitForm').ajaxSubmit({url: web_app.name + '/weixinMessageSendAction!saveWeixinMessageSend.ajax',
		param:param,
		success : function(data) {
			$('#detailWeixinMessageSendId').val(data);
			$('#weixinMessageSendIdFileList').fileList({bizId:data});
			initWeixinMessageSendDetail();
			if($.isFunction(fn)){
				fn.call(window,data);
			}
		}
	});
}

function sendMessage(fn){
	saveMessageSend(function(){
			var weixinMessageSendId=$('#detailWeixinMessageSendId').val();
			Public.ajax(web_app.name + '/weixinMessageSendAction!saveSendMessage.ajax', {weixinMessageSendId:weixinMessageSendId}, function(data){
				if($.isFunction(fn)){
					fn.call(window,data);
				}
			});
	});
}

function checkChooseArray(){
	var weixinMessageSendId=$('#detailWeixinMessageSendId').val();
	if(weixinMessageSendId==''){
		saveMessageSend();
	}else{
		initWeixinMessageSendDetail();
	}
}

function saveCopyNew(weixinMessageSendId,fn){
	Public.ajax(web_app.name + '/weixinMessageSendAction!saveCopyNew.ajax', {weixinMessageSendId:weixinMessageSendId}, function(data){
		try{window['ajaxDialog'].close();}catch(e){}
		updateHandler(data);
		if($.isFunction(fn)){
			fn.call(window,data);
		}
	});
}