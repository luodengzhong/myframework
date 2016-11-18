var defaultTitle="评审会议纪要（装饰类）";
var handlerArray=new Array();//处理人
var REVIEW_THREE_TIMES = 3;//评审次数为3次，（0：复议；1：评审第一次；2：评审第二次；N(N>2)：评审第N次）
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initUI();
	initGetDispatchNoBtn();
	initSerchBox();
	initTextarea();
});

function initUI(){
	$('#reviewMeetingSummaryIdAttachment').fileList();
	
	//非申请状态时，设置评审次数和评审结论
	var meetingConclusion = $("#meeting_conclusion").val();
	$("#meetingConclusion"+"_"+meetingConclusion).attr("checked",true);
	
	var reviewTimes = $("#review_times").val();
	//当评审次数大于等于3次时
	if(reviewTimes >= REVIEW_THREE_TIMES){
		$("#reviewTimes_3").attr("checked",true);//选中选项
		$("#times").val(reviewTimes);//设置评审次数
	}else{
		$("#reviewTimes"+"_"+reviewTimes).attr("checked",true);
	}
	
	if(Public.isReadOnly||!UICtrl.isApplyProcUnit()){//只读模式下修改输入框为只读
		var td=$('td.edit');
		if(td.length>0){
			td.addClass('disable');
		}
	}
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
	var reviewMeetingSummaryId=getId();
	if(reviewMeetingSummaryId==''){
		Public.tip('请先保存表单后再获取发文号');
		return false;
	}
	UICtrl.getDispatchNo({
		bizId:reviewMeetingSummaryId,
		bizUrl:'reviewMeetingSummaryAction!showUpdate.job?isReadOnly=true&bizId='+reviewMeetingSummaryId,
		title:defaultTitle,
		callback:function(param){
			var _self = this;
            $('#dispatchNo').val(param['dispatchNo']);
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


function initSerchBox() {
	$("#meetingCompereName").searchbox({
		type : "sys",
		name : "orgSelect",
		getParam : function() {
			return {
				a : 1,
				b : 1,
				searchQueryCondition : " org_kind_id ='psm'"
			};
		},
		back : {
			personId : "#meetingCompereId",
			personMemberName : "#meetingCompereName"
		}
	});
	$('#orgUnitName').orgTree({filter:'ogn,dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		manageType:'hrAccumulationFundImp',
		back:{
			text:'#orgUnitName',
			value:'#orgUnitId',
			id:'#orgUnitId',
			name:'#orgUnitName'
		}
	});
}
//获取扩展属性
function getExtendedData(){
	var param =[];
	//获取评审次数；\
	var $reviewTime = $("input[name=reviewTimes]:checked");
	if($reviewTime.length == 0){
		Public.tip('评审次数不能为空!');
		return false;
	}
	if($reviewTime[0].value == REVIEW_THREE_TIMES){
		var reviewTimes = $("#times").val();
		if(reviewTimes == ""){
			Public.tip('评审次数不能为空!');
			return false;
		}
		param['reviewTimes'] = reviewTimes;
	}else{
		param['reviewTimes'] = $reviewTime[0].value;
	}
	return param;
}
function beforeSave() {
	var subject = $("#subject").val();
	if (subject == "") {
		subject = defaultTitle;
	}
	$("#subject").val(subject);
	return true;
}

function setId(value) {
	$("#reviewMeetingSummaryId").val(value);
	$('#reviewMeetingSummaryIdAttachment').fileList({
		bizId : value
	});
}

function getId() {
	return $("#reviewMeetingSummaryId").val();
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
