var gridManager = null, refreshFlag = false;
var defaultTitle = "招标技术要求会审单";
var procUnitId = "";
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	procUnitId = $("#procUnitId").val();
	initGetDispatchNoBtn();
	initUI();
	initTeatareaAutoHeight();// textarea自适应相关
	initInputTable();
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
	var tenderTechRequireReportId=getId();
	if(tenderTechRequireReportId==''){
		Public.tip('请先保存表单后再获取发文号');
		return false;
	}
	UICtrl.getDispatchNo({
		bizId:tenderTechRequireReportId,
		bizUrl:'tenderTechRequireReportAction!showUpdate.job?isReadOnly=true&bizId='+tenderTechRequireReportId,
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


function initInputTable() {
	if(procUnitId != ""){
		if(procUnitId == "Apply") {
			$(".applyInputTable").show();
			$(".approvalInputTable").hide();
			initSearchBox();
		} else {
			$(".approvalInputTable").show();
			setTextareaEnable();
		}
	}
}
/**
 * 当环节为审批时设置相应textarea为可操作
 */
function setTextareaEnable(){
	//因为页面初始化是如果是审批环节，在装饰的js中会在ready()方法设置textarea的readonly属性。所以这里循环去检查。
	//当出现readonly时再去移除才会有效。
	if($(".approvalInputTable textarea").hasClass("textareaReadonly")){
		UICtrl.enable(".approvalInputTable textarea");
		UICtrl.enable(".approvalInputTable input");
		initSearchBox();
	}else{
		setTimeout(function(){
			setTextareaEnable();
		},10)
	}
}

function initUI() {
	$('#tenderTechRequireReportIdAttachment').fileList();
}

//用于初始化table中的负责人搜索框
function initSerchBoxById(id) {
	$(id).searchbox({
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
			personMemberName : id
		}
	});
	
	
}
//初始化搜索框 
function initSearchBox(){
/*	$(".content input").each(function(){
		initSerchBoxById("#"+this.id);//设置table中每一个负责人搜索框
	});*/
	$("#fillinPersonName").searchbox({
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
			personId : "#fillinPersonId",
			personMemberName : "#fillinPersonName",
			fullName : "#fillinPersonLongName"
		}
	});
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
	$("#tenderTechRequireReportId").val(value);
	$('#tenderTechRequireReportIdAttachment').fileList({
		bizId : value
	});
}

function getId() {
	return $("#tenderTechRequireReportId").val();
}

/** **********textarea高度自适应***************** */
var observer;
initObserver();
function initObserver() {
	if (window.attachEvent) {
		observer = function(element, event, handler) {
			element.attachEvent('on' + event, handler);
		};
	} else {
		observer = function(element, event, handler) {
			element.addEventListener(event, handler, false);
		};
	}
}
function initTeatareaAutoHeight() {
	var textarea = $("textarea");
	$(textarea).each(function() {
		var text = this;
		text.style.height = 'auto';
		text.style.height = $(this).parent().height() + "px";
		function resize() {
			var texts = $(text).parent().parent().find("textarea");// 找到同一行的三个textarea。
			var maxHeight = 0;
			// 取出最高的高度
			$(texts).each(function() {
				if (maxHeight < this.scrollHeight) {
					maxHeight = this.scrollHeight;
				}
			});
			// 同一行的三个textarea的高度调整为一样。
			$(texts).each(function() {
				this.style.height = 'auto';
				this.style.height = maxHeight + 'px';
			})
		}
		/* 0-timeout to get the already changed text */
		function delayedResize() {
			window.setTimeout(resize, 0);
		}
		observer(text, 'change', resize);
		observer(text, 'cut', delayedResize);
		observer(text, 'paste', delayedResize);
		observer(text, 'drop', delayedResize);
		observer(text, 'keydown', delayedResize);
		resize();
	});

}
/** ***************end****************** */
