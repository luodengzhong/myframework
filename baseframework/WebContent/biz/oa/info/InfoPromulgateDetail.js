var feedbackItemGridManager=null;
var dataTypeData={'text':'文本','number':'数值','date':'时间'};
var editStyleData={'text':'文本','number':'数值','date':'时间','radio':'单项选择','checkbox':'多项选择'};
var yesOrNo={'1':'是','0':'否'};
var promptMessage={
	receiver:'哪些人员允许阅读该条信息;',
	handler:'选择后系统自动生成处理待办任务;',
	feedbacker:'选择后系统自动生成反馈待办任务;(该任务为计时待办)',
	feedbackViewer:'信息管理人可以查询反馈信息接收人及处理人列表;'
};
/******人员信息保存变量*******/
var receiverArray=new Array();//接收人
var handlerArray=new Array();//处理人
var feedbackerArray=new Array();//反馈接收人
var feedbackViewerArray=new Array();//反馈查看人
//页面初始化
$(document).ready(function() {
	//发送方式选择对话框
	//$('#remindSendKind').combox({data:$('#remindSendKindList').combox('getJSONData'),checkbox:true});
	initByInfoKind();
	queryInfoPromulgateHandler();
	initializeUI();
	bindEvent();
	initFeedBackSetUpView();
	changeToolBar();
});
function getId(){
	return $('#infoPromulgateId').val();
}
function setId(id){
	$('#infoPromulgateId').val(id);
	$('#infoAttachment').fileList({bizId:id});
	$('#infoTextBody').fileList({bizId:id});
	$("#toolBar").toolBar("enable", "delete");
	$("#toolBar").toolBar("enable", "turn");
	$("#toolBar").toolBar("enable", "assist");
	$("#toolBar").toolBar("enable", "view");
	$("#toolBar").toolBar("enable", "webPush");
}
//控制页面不被初始化为只读模式
function businessJudgmentUnit(){
	var status=$('#status').val();
	if(status==1){//已发布数据单据处理为不可编辑
	    //这里不允许再次选择人员信息
		$.each(promptMessage,function(p,o){
			$('#'+p+'ChooseLink').hide();
			$('#'+p+'ClearLink').hide();
		});
		$('#setFeedbackItemLink').hide();
		//关键字允许编辑 附件允许修改
		setTimeout(function(){
			UICtrl.enable('#keywords');
			UICtrl.enable('#effectiveTime');
			UICtrl.enable('#invalidTime');
			UICtrl.enable('#priority');
			UICtrl.enable('#ownOrganName');
			UICtrl.enable('#hasFeedBack1');
			UICtrl.enable('#isAllowMultiFeedback1');
			UICtrl.enable('#hasFeedBackAttachment1');
			UICtrl.enable('#isHideReceiver1');
			UICtrl.enable('#feedbackWidth');
			//UICtrl.enable('#isCreateReadTask1');
			if(isFinalizeFun()){//未定稿的可以修改正文
				$("#toolBar").toolBar("removeItem", "save");
			}else{
				$('#infoTextBody').fileList('enable');
				$('#infoAttachment').fileList('enable');
			}
		},0);
		return false;
	}else if(status==-1){//作废的全部不能编辑
		$.each(promptMessage,function(p,o){
			$('#'+p+'ChooseLink').hide();
			$('#'+p+'ClearLink').hide();
		});
		$('#setFeedbackItemLink').hide();
		$('#chooseMnagerLink').hide();
		$('#clearMnagerLink').hide();
		return false;
	}
	return true;
}
//是否已定稿
function isFinalizeFun(){
	var isFinalize=parseInt($('#isFinalize').val(),10);
	if(!isNaN(isFinalize)&&isFinalize==1){
		 return true;
	}
	var isExceedTimeLimit=parseInt($('#isExceedTimeLimit').val(),10);
	if(!isNaN(isExceedTimeLimit)&&isExceedTimeLimit==1){
		 return true;
	}
	return false;
}
//改变原有的toolbar按钮
function changeToolBar(){
	$('#toolBar').toolBar('removeItem');
	var status=$('#status').val();
	if(status==0){
		$('#toolBar').toolBar('addItem',[
			 {id:'save',name:'保存',icon:'save',event:saveInfoPromulgate},
		     {line:true},
		     {id:'delete',name:'删除',icon:'deleteProcessInstance',event: doDelete},
		     {line:true},
		     {id:'turn',name:'发布',icon:'turn',event:publishInfoPromulgate},
		     {line:true},
		     {id:'assist',name:'定稿',icon:'assist',event: finalizeAndPublishInfoPromulgate},
		     {line:true},
		     {id:'view',name:'预览',icon:'view',event: previewInfo},
		     {line:true},
		     {id:'webPush',name:'申请弹屏',icon:'tables',event: webPushApply},
		     {line:true}
		 ]);
		 checkReceiver();
	}else if(status==1){
		$('#toolBar').toolBar('addItem',[
			 {id:'save',name:'保存',icon:'save',event:saveInfoPromulgate},
		     {line:true},
		     {id:'assist',name:'定稿',icon:'assist',event: finalizeAndPublishInfoPromulgate},
		     {line:true},
		     {id:'view',name:'预览',icon:'view',event: previewInfo},
		     {line:true},
		     {id:'webPush',name:'申请弹屏',icon:'tables',event: webPushApply},
		     {line:true}
		 ]);
	}else if(status==-1){
		$('#toolBar').toolBar('addItem',[
			 {id:'stop',name:'关闭',icon:'stop',event: closeWindow},
	   	     {line:true}
		 ]);
	}
	 if(!canEidt()){
	 	$("#toolBar").toolBar("disable", "delete");
	 	$("#toolBar").toolBar("disable", "turn");
	 	$("#toolBar").toolBar("disable", "assist");
	 	$("#toolBar").toolBar("disable", "view");
	 	$("#toolBar").toolBar("disable", "webPush");
	}else{
		var isInfoManager=$('#isInfoManager').val();
		if(status!=0&&isInfoManager=='true'){//已发布数据单据增加按钮
			$('#toolBar').toolBar('addItem',[
			     {id:'viewReader',name:'阅读情况',icon:'query',event: viewReader},
			     {line:true}
			 ]);
			var hasFeedBack=$('#hasFeedBack1').is(':checked');
			//根据是否还有反馈信息判断是否增加按钮
			if(hasFeedBack){
				$('#toolBar').toolBar('addItem',[
					 {id:'viewFeedback',name:'反馈情况',icon:'chart',event:viewFeedback},
				     {line:true}
				 ]);
				 if(status==1){//发布的单据可修改反馈项
				 	$('#toolBar').toolBar('addItem',[
				 	   {id:'modifFeedback',name:'修改反馈项',icon:'transfer',event:modifFeedback},
				       {line:true}
				   ]);
				 }
			}
		}
	}
}
function initializeUI(){
	//$('#infoPromulgateTab').tab();
	$('#infoContent').toAreaEdit({width:'99.9%'});
	$('#infoAttachment').fileList();//普通附件
	$('#infoTextBody').fileList();//正文附件
	if(!canEidt()){//设置默认数据
		$('#status').val(0);
	}
	//$('#status').combox('disable');
	//信息类别选择框
	$('#kindName').treebox({
		name:'infoKindTree',
		treeLeafOnly:true,
		changeNodeIcon:function(node){
			if(Public.isBlank(node['hasChildren'])) return;
			var url=web_app.name + "/themes/default/images/org/";
			var hasChildren=node.hasChildren;
			url += hasChildren>0?'org.gif':'dataRole.gif';
			node['nodeIcon']=url;
		},
		beforeChange:function(node){
			var infoKindId=node.infoKindId;
			//进行权限校验，判断用户是否可以使用该类别
			Public.ajax(web_app.name + '/infoKindAction!checkAuthorityAndGetPriority.ajax', {infoKindId:infoKindId}, function(data){
				if(data.authority){//返回TRUE代表具有权限
					$('#kindName').val(node.name);
					$('#infoKindId').val(infoKindId);
					$('#isNeedDispatchNo').val(data.isNeedDispatchNo);
					$('#isCanCreateTask').val(data.isCanCreateTask);
					$('#isNeedSendMessage').val(data.isNeedSendMessage);
					$('#isSendClientMessage').val(data.isSendClientMessage);
					$('#kindPriorityCoefficient').val(node.priorityCoefficient);//类型优先级系数
					$('#senderPriorityCoefficient').val(data.senderPriorityCoefficient);//发送人优先级系数
					initByInfoKind();
					checkReceiver();
					$.closeCombox();//关闭选择框
				}
			});
			return false;
		}
	});
	$('#kindName').attr('readonly',true);//不允许输入
	
	if(canEidt()){
		$('#editSubject').html($('#subject').val());
	}
}
function initByInfoKind(){
	var isNeedDispatchNo=$('#isNeedDispatchNo').val();
	var isCanCreateTask =$('#isCanCreateTask').val();
    var isNeedSendMessage=$('#isNeedSendMessage').val();
    if(isNeedDispatchNo==1){
    	initGetDispatchNoBtn();
    	$('#getDispatchNoBtn').show();
    }else{//不能选择发文号
    	$('#getDispatchNoBtn').hide();
    }
   if(isCanCreateTask==1){
    	$('#handlerShowTr').show();
    	$('#handlerShowTr').find('span').show();
    	$('#isCreateReadTask1').removeAttr('disabled',true);
    }else{//不能创建任务
    	$('#handlerShowTr').hide();
    	$('#handlerShowTr').find('span').hide();
    	$('#isCreateReadTask1').setValue(0);
    	handlerArray=new Array();//处理人
    	$('#isCreateReadTask1').attr('disabled',true);
    }
    if(isNeedSendMessage==1){
    	//UICtrl.enable($('#remindSendKind'));
    	if(!getId()){
    		//默认发送客户端消息 2015-03-23 屏幕默认发送客户端消息
    		//$('#remindSendKind').combox('setValue','client');
	    	//默认发送客户端消息
		   // var isSendClientMessage=$('#isSendClientMessage').val();
		    if(isSendClientMessage==1){
		    //	$('#remindSendKind').combox('setValue','client');
		    }
    	}
    }else{//不能发送消息
    	//$('#remindSendKind').combox('setValue','');
    	//UICtrl.disable($('#remindSendKind'));
    }
  
}
//初始化提示信息
function initPromptMessage(){
	$.each(promptMessage,function(p,o){
		var array=window[p+'Array'];
	    var div=$('#'+p+'ShowDiv');
	    if(array.length==0){//没有数据显示提示信息
	    	div.html('<font color="#9999a8">'+o+'</font>');
	    }
	});
}
function bindEvent(){
	//标题编辑事件
	$('#editSubject').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('input')){
			return false;
		}
		var style="width:300px;height:25px;font-size:16px;border: 0px;border-bottom: 2px solid #d6d6d6;";
		var subject=$.trim($(this).text()),html=[];
		html.push('<input type="text" style="',style,'" value="',subject,'" maxlength="100" id="editSubjectInput">');
		$(this).html(html.join(''));
		setTimeout(function(){
			$('#editSubject').find('input').focus();
		},0);
	});
	$('#editSubject').on('focus','input',function(){
		var text=$(this).val();
		if(text=='请在此处录入标题'){
			$(this).val('');
		}
	}).on('blur','input',function(){
		var text=$(this).val();
		if(text==''){
			text='请在此处录入标题';
		}
		$('#subject').val($(this).val());
		$('#editSubject').html(text);
	});
	$('#hasFeedBack1').on('click',function(){
		setTimeout(initFeedBackSetUpView,0);
	});
}
//初始化反馈信息设置显示状态
function initFeedBackSetUpView(){
	var flag=$('#hasFeedBack1').is(':checked');
	var fnName=flag?'show':'hide';
	$('#chooseHasFeedBackAttachmentSpan')[fnName]();
	$('#chooseFeedbackerTd')[fnName]();
	$('#chooseFeedbackerTd').find('span')[fnName]();
	$('#isAllowMultiFeedbackSpan')[fnName]();
}
//加载已存在的处理人信息
function queryInfoPromulgateHandler(){
	if(!canEidt()){//新增的数据不用查询
		initPromptMessage();
		return;
	}
	Public.ajax(web_app.name + '/oaInfoAction!queryInfoPromulgateHandler.ajax', {infoPromulgateId:getId()}, function(data){
		var kindId=null;
		$.each(data,function(i,d){
			kindId=d['kindId'];
			if($.isArray(window[kindId+'Array'])){
				window[kindId+'Array'].push(d);
			}
		});
		$.each(promptMessage,function(k,o){
			initShowDivText(k);
		});
		initPromptMessage();
	});
}
function canEidt(){
	var infoPromulgateId=$('#infoPromulgateId').val();
	return !(infoPromulgateId=='');
}
//打开机构选择对话框
function showChooseOrgDialog(personKind){
	var personArray=window[personKind+'Array'];
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='ogn,dpt,pos,psm,system';
	var options = { params: selectOrgParams,title : "选择组织",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			//清空数组
			personArray.splice(0,personArray.length);
			var flag=true
			$.each(data,function(i,o){
				o['orgUnitId']=o['id'];
				o['orgUnitName']=o['name'];
				o['kindId']=personKind;
				if(personKind!='receiver'){
					var fullId=o.fullId;//不允许选择顶级节点
					if(fullId.split('/').length==2){
						Public.tip("不允许选择["+o['name']+"]!");
						flag=false;
						return false;
					}
				}
				personArray.push(o);
			});
			if(!flag) return false;
			initShowDivText(personKind);
			this.close();
		},
		initHandler:function(){
			var addFn=this.iframe.contentWindow.addDataOneNode;
			if($.isFunction(addFn)){//初始化已选择列表
				$.each(personArray,function(i,d){
					addFn.call(window,d);
				});
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
	var html=new Array(),fullId=null;
	$.each(personArray,function(i,o){
		html.push('<span title="',o['fullName'],'">');
		html.push(o['name']);
		html.push('</span">;');
	});
	if(personKind=='receiver'){
		checkReceiver();
	}
	showDiv.html(html.join(''));
}
//接收人如果选择了 顶级节点不允许选择生成任务
function checkReceiver(){
	var isCanCreateTask =$('#isCanCreateTask').val();
	if(isCanCreateTask==1){
		$('#isCreateReadTask1').removeAttr('disabled',true);
		var flag=true,fullId=null;
		$.each(receiverArray,function(i,o){
			fullId=o.fullId;
			if(fullId.split('/').length==2){//选择生成任务
				$('#isCreateReadTask1').setValue(0);
	    		$('#isCreateReadTask1').attr('disabled',true);
	    		flag=false;
	    		return false;
			}
		});
	}
}
//清空已选择列表
function clearChooseArray(personKind){
	var personArray=window[personKind+'Array'];
	$('#'+personKind+'ShowDiv').html('');
	//清空数组
	personArray.splice(0,personArray.length);
}

function saveInfoPromulgate(){
	doSave('/oaInfoAction!saveInfoPromulgate.ajax',null,function(id){
		setId(id);
	});
}

//保存
function doSave(action,title,fn){
	var subject=$('#subject').val();
	if(subject==''){
		Public.tip('请输入标题!');
		return false;
	}
	//缓存接收人
	$('#receiverName').val($('#receiverShowDiv').text());
	var personsArray=new Array();
	personsArray.push.apply(personsArray,receiverArray);
	personsArray.push.apply(personsArray,handlerArray);
	personsArray.push.apply(personsArray,feedbackerArray);
	personsArray.push.apply(personsArray,feedbackViewerArray);
	var toDo=function(){
		$('#submitForm').ajaxSubmit({url: web_app.name + action,
			param:{detailData:encodeURI($.toJSON(personsArray)),taskId:taskId?taskId:''},
			success : function(data) {
				if($.isFunction(fn)){
					fn.call(window,data);
				}
			}
		});
	}
	if(!title){
		toDo();
	}else{
		var receiverLength=receiverArray.length;
		if(receiverLength==0){
			Public.tip('请选择接收人!');
			return false;
		}
		UICtrl.confirm(title,function(){toDo();});
	}
}

//删除信息
function doDelete(){
	if(!canEidt()){
		return false;
	}
	var status=$('#status').val();
	if(status!=0){
		Public.tip('该信息不是草稿状态，不能执行该操作!');
		return false;
	}
	
	var infoPromulgateId=$('#infoPromulgateId').val();
	UICtrl.confirm('确定删除该条信息吗?',function(){
		Public.ajax(web_app.name + '/oaInfoAction!deleteInfoPromulgate.ajax', {infoPromulgateId:infoPromulgateId,taskId:taskId?taskId:''}, closeAndReloadParent);
	});
}
//设置反馈信息
//flag==true允许增加删除反馈栏目
function setFeedbackItem(flag){
	if(!canEidt()){
		Public.tip('请先保存信息数据!');
		return false;
	}
	var infoPromulgateId=$('#infoPromulgateId').val();
	UICtrl.showFrameDialog({
		url :web_app.name + "/oaInfoAction!showInfoFeedbackItem.do",
		param : {
			infoPromulgateId : infoPromulgateId,
			modifFlag:flag
		},
		title : "编辑反馈项",
		width : 850,
		height : getDefaultDialogHeight(),
		cancelVal: '关闭',
		okVal:'保存',
		button: [{
			id : 'viewItem',
			name : '预览',
			callback:function(){
				var isChangedDetail=this.iframe.contentWindow.isChangedDetail();
				if(isChangedDetail){
					Public.tip('栏目数据已被修改,请先保存后预览!');
					return false;
				}
				UICtrl.showAjaxDialog({
					title:'预览反馈模板',
					url: web_app.name + '/oaInfoAction!viewFeedBackItem.load', 
					param:{infoPromulgateId:infoPromulgateId},
					width:350,
					height:300,
					ok: false
				});
				return false
			}
		}],
		ok:function(){
			var _self=this;
			var detailData=this.iframe.contentWindow.getDetailData();
			if(!detailData) return false;
			detailData['infoPromulgateId']=infoPromulgateId;
			Public.ajax(web_app.name + '/oaInfoAction!saveFeedBackItem.ajax', detailData, function(){
				_self.close();
			});
			return false;
		},
		cancel:true
	});
}
//预览
function previewInfo(){
	/*UICtrl.showAjaxDialog({
		url: web_app.name + '/oaInfoAction!previewInfo.load',
		param:{infoPromulgateId:$('#infoPromulgateId').val()},
		title: "信息预览",
		width:750,
		ok: false, 
		init:function(){
			$('#previewMainDiv').css({height:$(window).height()-130,overflowY:'auto'});
			var showInfoAttachment=$('#showInfoAttachment');
			if(showInfoAttachment.find('div.file').length>0){
				var infoAttachment=$('#previewInfoAttachment').fileList();
				showInfoAttachment.show();
			}
		}
	});*/
	var id=$('#infoPromulgateId').val();
	if(id==''){
		return;
	}
	var url=web_app.name + '/oaInfoAction!toHandleInfoPromulgate.job?useDefaultHandler=0&isPreviewInfo=true&isReadOnly=true&infoPromulgateId='+id;
	parent.addTabItem({ tabid: 'previewInfo'+id, text: '信息发布预览', url:url});
}

function publishInfoPromulgate(){
	doSave('/oaInfoAction!publishInfoPromulgate.ajax','确定发布该条信息吗?',closeAndReloadParent);
}

function finalizeAndPublishInfoPromulgate(){
	doSave('/oaInfoAction!finalizeAndPublishInfoPromulgate.ajax','信息确定要定稿吗?',closeAndReloadParent);
}
//查询反馈信息
function viewFeedback(){
	showInfoFeedbackDialog($('#infoPromulgateId').val());
}
//查询阅读情况
function viewReader(){
	showInfoReaderDialog($('#infoPromulgateId').val());
}
//修改反馈项
function modifFeedback(){
	//设置为false不允许新增删除栏目
	setFeedbackItem(false);
}
function closeWindow(){
	UICtrl.closeCurrentTab();
}
function closeAndReloadParent(){
	if(taskId){
		UICtrl.closeAndReloadTabs("TaskCenter", null);
	}else{
		UICtrl.closeAndReloadParent("InfoCenter", null);
	}
}
//获取发文号
function getDispatchNo(){
	var infoPromulgateId=$('#infoPromulgateId').val();
	if(infoPromulgateId==''){
		Public.tip('请先保存表单后再获取发文号');
		return false;
	}
	UICtrl.getDispatchNo({
		bizId:infoPromulgateId,
		bizUrl:'oaInfoAction!toHandleInfoPromulgate.job?useDefaultHandler=0&infoPromulgateId='+infoPromulgateId,
		title:$('#subject').val(),
		callback:function(param){
			var _self=this;
			param['infoPromulgateId']=infoPromulgateId;
			var url=web_app.name + '/oaInfoAction!updateInfoDispatchNo.ajax';
			Public.ajax(url,param,function(data){
				$('#dispatchNo').val(param['dispatchNo']);
				initGetDispatchNoBtn();
				_self.close();
			});
		}
   });
}
//初始化获取发文号按钮
function initGetDispatchNoBtn(){
	var dispatchNo=$('#dispatchNo').val();
	var fn=dispatchNo==''?'show':'hide';
	$('#getDispatchNoBtn')[fn]();
}
//打开申请弹屏对话框
function webPushApply(){
	var infoPromulgateId=$('#infoPromulgateId').val();
	var url=web_app.name + '/infoWebPushAuditAction!showInsert.job?infoPromulgateId='+infoPromulgateId;
	url+='&infoSubject='+encodeURI(encodeURI($('#subject').val()));
	parent.addTabItem({tabid: 'webPushApply', text: '信息弹屏申请 ', url: url});
}