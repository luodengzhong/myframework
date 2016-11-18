var defaultTitle="定向议标报告表"
var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initUI();
	initSerchBox();
	textareaInit();
});

function initUI(){
	$('#negotiatTenderingIdAttachment').fileList();
}

function initSerchBox(){
	$("#fillinPersonName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},back:{personId:"#fillinPersonId",personMemberName:"#fillinPersonName",fullName:"#fillinPersonLongName"}
	});

}

function beforeSave(){
	//设置默认标题
	var subject = $("#subject").val();
	if(subject ==""){
		subject = defaultTitle;
	}
	$("#subject").val(subject);
	
	//判断定向议标单位原因是否以选
	if($("input:checked").length ==0){
		Public.tip("定向议标单位原因不能为空！");
		return false;
	}
	return true;
}

function setId(value){
	$("#negotiatTenderingId").val(value);
	$('#negotiatTenderingIdAttachment').fileList({bizId:value});
}

function getId(){
	return $("#negotiatTenderingId").val();
}


/** **********textarea高度自适应***************** */
var observe;
initObserve();
function initTeatareaAutoHeight() {
	textareaInit();
}
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

function textareaInit() {
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
				if (maxHeight <= this.scrollHeight) {
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
		observe(text, 'change', resize);
		observe(text, 'cut', delayedResize);
		observe(text, 'paste', delayedResize);
		observe(text, 'drop', delayedResize);
		observe(text, 'keydown', delayedResize);
		resize();
	});

}
/** ***************end****************** */
