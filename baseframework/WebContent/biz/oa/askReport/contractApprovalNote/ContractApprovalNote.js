var defaultTitle="合同审批笺（综合类）";
var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initUI();
	initSerchBox();
	initTextarea();
});

function initUI(){
	$('#contractApprovalNoteIdAttachment').fileList();
}

function initSerchBox() {
	$("#sponsorName").searchbox({
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
			//personId : "#meetingCompereId",
			personMemberName : "#sponsorName"
		}
	});

}
//获取扩展属性
function getExtendedData(){
	var attachment = [];
	if($(".attachment_list:checked").length ==0){
		//Public.tip("hh！");
		//return false;
	}
	$(".attachment_list:checked").each(function(){
		attachment.push(this.value);
	});
	return {"contractAttachment":attachment.join(",")};
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
	$("#contractApprovalNoteId").val(value);
	$('#contractApprovalNoteIdAttachment').fileList({
		bizId : value
	});
}

function getId() {
	return $("#contractApprovalNoteId").val();
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

