var defaultTitle = "房地产开发资质证书办理申请表";
var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initGetDispatchNoBtn();
	initUI();
	initTextarea();
});

function initUI(){
	$('#qualificationIdAttachment').fileList();
}

//初始化获取发文号按钮
function initGetDispatchNoBtn(){
	var dispatchNo=$('#dispatchNo').val();
	var fn='show';
	//已存在文号或在只读审核状态下不能修改文号
	if(Public.isReadOnly||!UICtrl.isApplyProcUnit()){
		fn='hide';
	}
	$('#getDispatchNoBtn')[fn]();
}


//获取发文号
function getDispatchNo(){
	var qualificationId=getId();
	if(qualificationId==''){
		Public.tip('请先保存表单后再获取发文号');
		return false;
	}
	UICtrl.getDispatchNo({
		bizId: qualificationId,
		bizUrl: 'realtyQualificationAction!showUpdate.job?isReadOnly=true&bizId='+qualificationId,
		title: defaultTitle,
		callback: function(param){
			var _self = this;
            $("#dispatchNo").val(param['dispatchNo']).removeClass('grayColor');
            $("#titleDispatchNo").val(param['dispatchNo']);
            _self.close();
		}
	});
}


/**
* 检查约束
* 
*/
function checkConstraints() {
	var dispatchNo=$('#dispatchNo').val();
	if(dispatchNo==''){
		Public.tips({type:1,content:'发起流程前,请先获取文件编号!',time:4000});
		return false;
	}
    return true;
}

function getExtendedData(){
	if($("input:checked").length==0){
		Public.tip("申办类别及内容不能为空！");
		return false;
	}
	var subject = $("#subject").val();
	if (subject == "") {
		subject = defaultTitle;
	}
	return {subject:subject};
}

function setId(value){
	$("#qualificationId").val(value);
	$('#qualificationIdAttachment').fileList({bizId:value});
}

function getId(){
	return $("#qualificationId").val();
}


/** **********textarea高度自适应***************** */
var observe;
initObserve();

function initObserve() {
	if (window.attachEvent) {
		observe = function(element, event, handler) {
			element.attachEvent('on' + event, handler);
		};
	} else {
		observe = function(element, event, handler) {
			element.addEventListener(event, handler, false);
		};
	}
}
function initTextarea() {
	var textarea = $("textarea");
	$(textarea).each(function() {
		var text = this;
		function resize() {
			text.style.height = 'auto';
			text.style.height = text.scrollHeight + 'px';
		}
		/* 0-timeout to get the already changed text */
		function delayedResize() {
			window.setTimeout(resize, 0);
		}
		observe(text, 'change', resize);
		observe(text, 'cut', delayedResize);
		observe(text, 'paste', delayedResize);
		observe(text, 'drop', delayedResize);
		observe(text, 'keydown', delayedResize);
		resize();
	});

}
/** ***************end****************** */