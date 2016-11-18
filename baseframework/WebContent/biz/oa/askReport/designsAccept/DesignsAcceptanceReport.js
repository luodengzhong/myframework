var defaultTitle = "设计成果验收确认单";
var gridManager = null, refreshFlag = false;
var procUnitId;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	procUnitId = $("#procUnitId").val();
	initUI();
});


function initUI(){
	$('#designsAcceptanceIdAttachment').fileList();
	initSerchBox();
}

function initSerchBox(){
	$("#fillinPersonName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},back:{personId:"#fillinPersonId",
			personMemberName:"#fillinPersonName",
			fullName:"#fillinPersonLongName",
			deptName:"#fillinUnitName",
			deptId:"#fillinUnitId"
				
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
	$("#designsAcceptanceId").val(value);
	$('#designsAcceptanceIdAttachment').fileList({bizId:value});
}

function getId(){
	return $("#designsAcceptanceId").val();
}
