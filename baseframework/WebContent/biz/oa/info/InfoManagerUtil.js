//打开信息阅读情况对话框
function showInfoReaderDialog(id){
	UICtrl.showFrameDialog({
		url :web_app.name + "/oaInfoAction!forwardInfoReadViewPage.do",
		param : {
			infoPromulgateId : id
		},
		title : "信息阅读情况",
		width :900,
		height:getDefaultDialogHeight(),
		cancelVal: '关闭',
		ok:false,
		cancel:true
	});
}

//打开反馈情况对话框
function showInfoFeedbackDialog(id){
	UICtrl.showFrameDialog({
		url :web_app.name + "/oaInfoAction!forwardFeedBackStatPage.do",
		param : {
			infoPromulgateId : id
		},
		title : "信息反馈情况",
		width :900,
		height:getDefaultDialogHeight(),
		cancelVal: '关闭',
		ok:false,
		cancel:true
	});
}
//打开处理人表
function showInfoCommonHandlerDialog(id){
	UICtrl.showFrameDialog({
		url :web_app.name + "/oaInfoAction!forwardInfoCommonHandler.do",
		param : {
			infoPromulgateId : id
		},
		title : "信息处理人",
		width :900,
		height:getDefaultDialogHeight(),
		cancelVal: '关闭',
		ok:function(){
			var saveHandler = this.iframe.contentWindow.saveHandler;
			if($.isFunction(saveHandler)){
				saveHandler.call(this);
			}
			return false;
		},
		cancel:true
	});
}
//打开组织选对话框
function openChooseOrgDialog(title,fn){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='ogn,dpt,pos,psm,system';
	var options = { params: selectOrgParams,title : title,
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			if($.isFunction(fn)){
				fn(data);
			}
			this.close();
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}