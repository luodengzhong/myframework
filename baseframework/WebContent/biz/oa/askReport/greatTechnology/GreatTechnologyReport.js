var gridManager = null, refreshFlag = false;
var processDefinitionFile = "config/bpm/oa/askReport/greatTechnologyReport.bpmn";
var defaultTitle = "重大技术方案报审表";
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initUI();
	initSerchBox();
});

function initUI(){
	$('#greatTechnologReportIdAttachment').fileList();
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
	$("#greatTechnologyReportId").val(value);
	$('#greatTechnologReportIdAttachment').fileList({bizId:value});
}

function getId(){
	return $("#greatTechnologyReportId").val();
}
