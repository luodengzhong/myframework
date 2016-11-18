try{window.onerror=function(){return false;};}catch(e){}
$(document).ready(function() {
	initializeUI();
	bindEvent();
	//根据参数自动影藏发起人信息
	var autoHide = Public.getQueryStringByName("autoHide") ||'false';
	if(autoHide==='true'){
		toggleSubject();
	}
	//预览时反馈信息不只读可看效果
	var isPreviewInfo=Public.getQueryStringByName("isPreviewInfo") ||'false';
	if(isPreviewInfo==='true'){
		var div=$('#feedBackContentShowDiv');
		if(div.length>0){
			setTimeout(function(){
				UICtrl.setEditable($('#feedBackContentShowDiv'));
			},0);
		}
	}
	//isWebPush弹屏显示，反馈信息科编辑
	var isWebPush=Public.getQueryStringByName("isWebPush") ||'false';
	if(isWebPush==='true'){
		var div=$('#feedBackContentShowDiv');
		if(div.length>0&&businessJudgmentUnit()){//允许反馈
			setTimeout(function(){
				var div=$('#feedBackContentShowDiv');
				UICtrl.setEditable();
				var feedBackPersonAttachment=$('#feedBackPersonAttachment');
				if(feedBackPersonAttachment.length>0){
					feedBackPersonAttachment.fileList('enable');
				}
				//添加提交按钮
				div.append('<div style="text-align:center;padding-top: 5px;"><a href="javascript:void(0);" onclick="doSubmitTask()" hidefocus class="orangeBtn"><span>提交反馈</span></a></div>');
			},0);
		}
	}
});

function bindEvent(){
	var div=$('#infoPromulgateHandleFeedBackContent');
	if(div.length>0){
		div.on('scroll', function () {
		    try {$.closeCombox();} catch (e) {}
		    try {$.datepicker.close();} catch (e) {}
		});
	} 
}

//控制页面不被初始化为只读模式
function businessJudgmentUnit(){
	var infoFeedbackId=$('#infoFeedbackId').val();
	var feedBackStatus=$('#feedBackStatus').val();
	var isAllowMultiFeedback=$('#isAllowMultiFeedback').val();
	if(infoFeedbackId!=''&&feedBackStatus==1){//已提交的反馈信息
		if(isAllowMultiFeedback==0){//不允许多次反馈
			return false;//不允许编辑
		}
	}
	return true;
}

//修改页面按钮
//flag==true 表示存在反馈信息
function changeToolBar(flag){
	$('#toolBar').toolBar('removeItem');
	if(Public.isReadOnly){//只读进入
		$('#toolBar').toolBar('addItem',[ {id:'stop',name:'关闭',icon:'stop',event: closeWindow},{line:true}]);
		return;
	}
	if(flag){//存在反馈栏目增加保存按钮
		$('#toolBar').toolBar('addItem',[{ id:'save',name:'保存',icon:'save',event:doSave}, {line:true}]);
	}
	$('#toolBar').toolBar('addItem',[
	     {id:'turn',name:'确认',icon:'turn',event: doSubmitTask},
	     {line:true,id:"turn_line"},
	     {id:'stop',name:'关闭',icon:'stop',event: closeWindow},
	     {line:true},
	     {id:'collect',name:'收藏信息',icon:'collect', event:saveCollect},
	     {line:true},	 
	     {id:'deleteCollect',name:'取消收藏',icon:'un_collect', event:deleteCollect},
		 {line:true}     		     
	 ]);
	 var isInfoManager=$('#isInfoManager').val();
	 if(isInfoManager=='true'){
	 	$('#toolBar').toolBar('addItem',[
			  {id:'viewReader',name:'阅读情况',icon:'query',event: viewReader},
			  {line:true}
		]);
		var hasFeedBack=$('#hasFeedBack').val();
		//根据是否还有反馈信息判断是否增加按钮
		if(hasFeedBack=='1'){
			$('#toolBar').toolBar('addItem',[
				 {id:'viewFeedback',name:'反馈情况',icon:'chart',event:viewFeedback},
				 {line:true}
		    ]);
		}
	 }
}
function initializeUI(){
	var layout=$('#InfoPromulgateHandleLayout');
	if(layout.length>0){//存在反馈信息需要重新构造页面
		$('#jobPageLayout > div.l-layout-center').css({'border':'0px none'});
		$('#jobPageCenter').css({'overflowY':'hidden','paddingRight':'2px'});
		var feedbackWidth=parseInt($('#feedbackWidth').val(),10);
		feedbackWidth=isNaN(feedbackWidth)?350:feedbackWidth;
		feedbackWidth=feedbackWidth<350?350:feedbackWidth;
		UICtrl.layout(layout, { 
			rightWidth :feedbackWidth, 
			heightDiff : -8,
			onSizeChanged:function(){
				var middleHeight=$('#infoPromulgateHandleCenter').height();
				$('#feedBackContentShowDiv').height(middleHeight-2);
				setTextBodyPictureSize();//图片大小调整
			}
		});
		var middleHeight=$('#infoPromulgateHandleCenter').height();
		$('#feedBackContentShowDiv').height(middleHeight-2);
	}
	changeToolBar(layout.length);
	//处理附件显示
	var showInfoAttachment=$('#showInfoAttachment');
	if(showInfoAttachment.find('div.file').length>0){
		var infoAttachment=$('#previewInfoAttachment').fileList();
		showInfoAttachment.show();
	}
	var businessFlag=businessJudgmentUnit();
	var feedBackPersonAttachment=$('#feedBackPersonAttachment');
	if(feedBackPersonAttachment.length>0){
		var readOnly=!businessFlag;//不允许多次反馈 附件编辑状态设置
		feedBackPersonAttachment.fileList({readOnly:readOnly});
	}
	//iframe 显示大小设置
	initIFrameBusinessSize();
	//图片显示大小设置
	initTextBodyPictureSize();
}
function initIFrameBusinessSize(){
	if($('#iFrameBusinessDiv').length>0){
		var converUrl=$('#iFrameBusinessURL').val();
		if($('#iFrameBusinessURL').length>0&&converUrl!=''){
			AttachmentUtil.addConvertPreviewFileIFrame($('#iFrameBusinessDiv'),converUrl);
		}
		setIFrameBusinessHeight();
		 $(window).bind("resize", function (e){
		 	setIFrameBusinessHeight();
		 });
	}
}
//设置等比例缩放图片
function initTextBodyPictureSize(){
	var pic=$('#showTextBodyPicture');
	if(pic.length>0){
		setTextBodyPictureSize();
		$(window).bind("resize", function (e){
			setTextBodyPictureSize();
		 });
	}
}

function setTextBodyPictureSize(){
	var pic=$('#showTextBodyPicture');
	if(!pic.length) return;
	var div=$('#infoPromulgateHandleCenter');
	if(!div.length){
		div=$('#jobPageCenter');
	}
	if(!div.length){
		div=$('body');
	}
	var maxWidth=div.width();
	UICtrl.autoResizeImage(pic,maxWidth);
}
function setIFrameBusinessHeight(){
	if($('#iFrameBusinessDiv').length>0){
		var pageHeight = UICtrl.getPageSize().h;
		var titleHeight=$('#previewTitleDiv').height();
		var length=$('#InfoPromulgateHandleLayout').length;
		var toolBar=$('#toolBar').length;
		var diffHeight=0;
		if(length>0){
			diffHeight=27;
		}
		if(toolBar>0){
			diffHeight+=48;
		}else{
			diffHeight+=6;
		}
		$('#iFrameBusinessDiv').height(pageHeight-titleHeight-diffHeight);
	}
}
//显示或隐藏标题
function toggleSubject(){
	var div=$('#toggleTitleDiv');
	var visible=div.is(':visible');
	$('#navTitleIcon').addClass(visible?'email':'emailOpen').removeClass(visible?'emailOpen':'email');
	$('#navTitleLink').toggleClass('togglebtn-down');
	div.toggle();
	setIFrameBusinessHeight();
}


function getId(){
	return $('#infoPromulgateId').val();
}
//保存方法用于反馈信息
function doSave(){
	var param=getExtendedData(false);
	if(!param) return false;
	Public.ajax(web_app.name + '/oaInfoAction!saveHandleInfoPromulgate.ajax',param,function(data){
		if(data!='ok'){//返回ok表示没有保存反馈信息
			//重新设置个人反馈信息Id
			$('#infoFeedbackId').val(data);
			$('#feedBackStatus').val(0);
		}
	});
}

//获取反馈信息 checkFlag 保存时是否验证必输
function getExtendedData(checkFlag){
	var content=$('#feedBackContent');
	var flag=businessJudgmentUnit();//判断是否允许编辑
	if(content.length>0&&flag){//存在反馈信息且允许编辑
		var form= $('#infoFeedbackItemsForm'),param={};
		if(form.length>0){//存在反馈项
			param=$('#infoFeedbackItemsForm').formToJSON({check:checkFlag});
			if(!param) return false;
		}
		var infoFeedbackId=$('#infoFeedbackId').val();
		var feedBackStatus=$('#feedBackStatus').val();
		var isAllowMultiFeedback=$('#isAllowMultiFeedback').val();
		if(isAllowMultiFeedback==1&&feedBackStatus==1){
			//允许多次反馈将已反馈信息ID设置为空，表示新增
			infoFeedbackId='';
		}
		return {
			feedbackItems:encodeURI($.toJSON(param)),
			infoPromulgateId:$('#infoPromulgateId').val(),//信息ID
			feedBackContent:encodeURI(content.val()),//反馈内容
			infoFeedbackId:infoFeedbackId,
			hasFeedBack:1,
			isAllowMultiFeedback:isAllowMultiFeedback//是否允许多次反馈
		}
	}else{
		return {infoPromulgateId:$('#infoPromulgateId').val()};
	}
}

function doSubmitTask(){
	var param=getExtendedData(true);
	if(!param) return false;
	if(window['taskId']){
		param['taskId']=taskId;
	}
	UICtrl.confirm('您是否提交当前信息？',function(){
		Public.ajax(web_app.name + '/oaInfoAction!saveSubmitInfoPromulgate.ajax',param,function(){
				//通过open打开的窗口
			   if(!parent.tab){
			 		Public.closeWebPage();
			 		return;
			   }
			   if(window['taskId']){
					UICtrl.closeAndReloadTabs("TaskCenter", null);
			   }else{
					UICtrl.closeAndReloadParent("InfoCenter", null);
			   }
		});
	});
}

function closeWindow(){
	 if(!parent.tab){
	 	Public.closeWebPage();
	}else{
		UICtrl.closeCurrentTab();
	}
}

//收藏
function saveCollect(){
	Public.ajax(web_app.name + '/personOwnAction!insertInfoCollect.ajax',{ infoId: $('#infoPromulgateId').val() }, function(){
			Public.successTip("收藏任务信息成功！");
	});
}
//取消收藏
function deleteCollect(){
	UICtrl.confirm("您是否要取消收藏当前的信息？", function() {	
	       Public.ajax(web_app.name + '/personOwnAction!deleteInfoCollect.ajax', 
			{ infoId: $('#infoPromulgateId').val()}, 
			function(){
				Public.successTip("您已成功取消收藏当前任务！");
			});
	});
}

//查询反馈信息
function viewFeedback(){
	showInfoFeedbackDialog($('#infoPromulgateId').val());
}
//查询阅读情况
function viewReader(){
	showInfoReaderDialog($('#infoPromulgateId').val());
}