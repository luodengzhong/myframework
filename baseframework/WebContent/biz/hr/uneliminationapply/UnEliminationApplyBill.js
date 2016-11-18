var gridManager = null , refreshFlag = false;
$(document).ready(function() {
	 $('#staffName').searchbox({ type:"hr", name: "resignationChoosePerson",
			back:{
				ognId:"#orgnizationId",ognName:"#orgnizationName",centreId:"#centerId",sex:"#sex",age:'#age',fullId:'#fullId',
				centreName:"#centerName",dptId:"#departmentId",dptName:"#departmentName",employedDate:"#employedDate",posLevel:"#posLevel",
				posId:"#posId",posName:"#posName",staffName:"#staffName",archivesId:"#archivesId",education:"#education"},
	        
			  onChange:function(){
	        	 $("#rank").val('');
	        	 $('#rank').combox('setValue');
			    $('#posLevel').combox('setValue');
	        	 var archivesId =  $("#archivesId").val();
	     		 Public.ajax(web_app.name + '/reshuffleAction!queryLatestPerformanceRank.ajax',{archivesId:archivesId,unElimination:1}, function(data){
	     			 if(null!=data.effectiveRank){
	    				 $('#rank').combox('setValue',data.effectiveRank);
	    			 }
	    		 });
	          }
	 });
	// $('#depositionFileList').fileList();
});


function getId() {
	return $("#unEliminationApplyId").val() || 0;
}

function setId(value){
	$("#unEliminationApplyId").val(value);
	//$('#depositionFileList').fileList({bizId:value});
}
//打印功能
/*function print(){
	var  unEliminationApplyId=$('#unEliminationApplyId').val();
	var  staffName=$('#staffName').val();
	window.open(web_app.name + '/depositionAction!createPdf.load?auditId='+unEliminationApplyId+'&staffName='+encodeURI(encodeURI(staffName)));	
}*/

