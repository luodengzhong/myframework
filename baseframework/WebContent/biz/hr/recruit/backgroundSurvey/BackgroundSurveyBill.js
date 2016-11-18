$(document).ready(function() {
	var organId=$('#organId').val();
	$('#surveyName').searchbox({type:'hr',name:'backGroundSelect',manageType:'hrBaseRecruitData',
		back:{writeId:'#writeId', employDeptId:'#employDeptId',employDept:'#employDept',
		   university:'#university',specialty:'#specialty',idCardNo:'#idCardNo',applyDeptName:'#employDept',
			education:'#education',staffName:'#surveyName',applyPosName:'#employPos'}});
	$('#backgroundSurveyFileList').fileList();

});



function getId() {
	return $("#surveyId").val() || 0;
}

function setId(value){
	$("#surveyId").val(value);
    $('#backgroundSurveyFileList').fileList({bizId:value});

}

