var defaultTitle = "通讯业务办理申请表";
var gridManager = null, refreshFlag = false;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
//	bindEvent();
	initUI();
	initGetDispatchNoBtn();
	initSerchBox();
	initTextarea();
});



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
	var communicationId=getId();
	if(communicationId==''){
		Public.tip('请先保存表单后再获取发文号');
		return false;
	}
	UICtrl.getDispatchNo({
		bizId:communicationId,
		bizUrl:'communicationAction!showUpdate.job?isReadOnly=true&bizId='+communicationId,
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


function beforeSave() {
	var subject = $("#subject").val();
	if (subject == "") {
		subject = defaultTitle;
	}
	$("#subject").val(subject);
	
	if($(":checkbox:checked").length == 0 ){
		Public.tip('请选择需办理业务!');
		return false;
	}
	//新安装；
	if($("#install:checked").length >0 && $.trim($("#installCount").val()) == ""){
		Public.tip('安装个数不能为空!');
		return false;
	}
	//拆机；
	if($("#uninstall:checked").length>0 && $.trim($("#uninstallNumber").val()) == ""){
		Public.tip('拆销号码不能为空!');
		return false;
	}
	//ADSL开通；
	if($("#openAdsl:checked").length>0 && $.trim($("#openAdslNumber").val()) == ""){
		Public.tip('ADSL开通号码不能为空!');
		return false;
	}
	//ADSL开通；
	if($("#closeAdsl:checked").length>0 && $.trim($("#closeAdslNumber").val()) == ""){
		Public.tip('ADSL关闭号码不能为空!');
		return false;
	}
	//话费托收；
	if ($("#commFeeTrusteeship:checked").length > 0
			&& ($.trim($("#trusteeshipNumber").val()) == "" || $.trim($(
					"#trusteeshipPersionName").val()) == "")) {
		Public.tip('申请话费托收的手机号和使用人不能为空!');
		return false;
	}
	//集团专网；
	if ($("#groupNetwork:checked").length > 0
			&& ($.trim($("#networkNumber").val()) == "" || $.trim($(
					"#networkPersionName").val()) == "")) {
		Public.tip('申请集团专网的手机号和使用人不能为空!');
		return false;
	}
	//集团专网；
	if ($("#internationalRoaming:checked").length > 0
			&& ($.trim($("#roamingNumber").val()) == "" || $.trim($(
					"#useRoamingPersionName").val()) == "")) {
		Public.tip('申请国际漫游的手机号和使用人不能为空!');
		return false;
	}
	
	$(".service-checkbox").each(function(){
		if(!this.checked){
			$(this).parent().parent().find(".input_text").val("");
		}
	});
	
	return true;
}

function setId(value) {
	$("#communicationId").val(value);
	$('#communicationIdAttachment').fileList({
		bizId : value
	});
}

function getId() {
	return $("#communicationId").val();
}
function initUI(){
	$('#communicationIdAttachment').fileList();
	UICtrl.disable("#deptName");
	if(Public.isReadOnly||!UICtrl.isApplyProcUnit()){//只读模式下修改输入框为只读
		var td=$('td.edit');
		if(td.length>0){
			td.addClass('disable');
		}
	}
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
	if(text==defaultTitle){
//		$(this).val('');
	}
}).on('blur','input',function(){
	var text=$(this).val();
	if(text==''){
		text=defaultTitle;
	}
	$('#subject').val($(this).val());
	$('#editSubject').html(text);
});
}

function initSerchBox() {
	$("#operatorName").searchbox({
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
			personId : "#operatorId",
			personMemberName : "#operatorName"
		}
	});

}
//获取扩展属性
function getExtendedData(){
	var closeServices = [];
	var openServices = [];
	$(".close_comm_services:checked").each(function(){
		closeServices.push(this.value);
	});
	$(".open_comm_services:checked").each(function(){
		openServices.push(this.value);
	});
	var param = {
			"closeServices" : closeServices.join(","),
			"openServices" : openServices.join(",")
		};
	return param;
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