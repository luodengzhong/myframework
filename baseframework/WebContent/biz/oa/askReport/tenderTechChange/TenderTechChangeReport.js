var defaultTitle = "招标过程技术变更申请表";
var gridManager = null, refreshFlag = false;
var procUnitId = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	procUnitId = $("#procUnitId").val();
	initUI();
	initSerchBox();
	initInputTable();
	initTextarea();
});

function initUI(){
	$('#tenderTechChangeReportIdAttachment').fileList();
}

function initInputTable() {
	if(procUnitId != ""){
		if (procUnitId == "Apply") {
			UICtrl.disable(".approvalInput");
			$(".approvalInput").remove();
		}else {
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
	if($("input").hasClass("textReadonly")){
		UICtrl.enable(".approvalInput input");
	}else{
		setTimeout(function(){
			setTextareaEnable();
		},20)
	}
}

function initSerchBox(){
	$("#operatorName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},back:{personId:"#operatorId",
			personMemberName:"#operatorName",
			fullName:"#operatorLongName",
			deptId:"#applyDeptId",
			deptName:"#applyDeptName"
				
		}
	});

}



function beforeSave(){
	var subject = $("#subject").val();
	if(subject ==""){
		subject = defaultTitle;
	}
	$("#subject").val(subject);
	return true;
}

function setId(value){
	$("#tenderTechChangeReportId").val(value);
	$('#tenderTechChangeReportIdAttachment').fileList({bizId:value});
}

function getId(){
	return $("#tenderTechChangeReportId").val();
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
