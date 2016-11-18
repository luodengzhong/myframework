var defaultTitle = "投标保证金退款申请单";
var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initUI();
	initSerchBox();
});

function initUI(){
	$('#tenderBondBackIdAttachment').fileList();
}

function initSerchBox(){
	$("#fillinPersonName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},back:{personId:"#fillinPersonId",personMemberName:"#fillinPersonName",fullName:"#fillinPersonLongName"}
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
	$("#tenderBondBackId").val(value);
	$('#tenderBondBackIdAttachment').fileList({bizId:value});
}

function getId(){
	return $("#tenderBondBackId").val();
}

