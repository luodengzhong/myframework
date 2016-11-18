var gridManager = null , refreshFlag = false;
$(document).ready(function() {
	 $('#staffName').searchbox({ type:"hr",manageType:'hrReshuffleManage', name: "resignationChoosePerson",
			back:{
				ognId:"#orgnizationId",ognName:"#orgnizationName",centreId:"#centerId",employedDate:"#employedDate",staffingPostsRank:"#fromStaffingPostsRank",
				centreName:"#centerName",dptId:"#departmentId",dptName:"#departmentName",posDesc:"#posDesc",posLevel:"#posLevel",
				posId:"#posId",posName:"#posName",depositionPosName:"#depositionPosName",staffName:"#staffName",archivesId:"#archivesId"},
	        
			  onChange:function(){
	        	 $('#depositionPosName').val($('#posName').val());
 	          }
	 });
	 $('#depositionFileList').fileList();
});


function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
	$('#depositionFileList').fileList({bizId:value});
}
//打印功能
function print(){
	var  auditId=$('#auditId').val();
	var  staffName=$('#staffName').val();
	window.open(web_app.name + '/depositionAction!createPdf.load?auditId='+auditId+'&staffName='+encodeURI(encodeURI(staffName)));	
}
//function save(){
//	$('#submitForm').ajaxSubmit({url: web_app.name + '/depositionAction!saveOrUpdateDepositions.ajax',
//		success : function(data) {
//			refreshFlag = true;
//		}
//	});
//}

