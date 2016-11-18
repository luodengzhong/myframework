

$(document).ready(function() {
	 $('#staffName').searchbox({ type:"hr", name: "secondmentDetailSelect",
			back:{
				auditId:"#auditId",fromOrganName:"#fromOrganName",beginDate:"#beginDate",fromPosLevel:"#fromPosLevel",
				fromCenterName:"#fromCenterName",fromDeptName:"#fromDeptName",fromPosName:"#fromPosName",
				toCenterName:"#toCenterName",toDeptName:"#toDeptName",toOrganName:"#toOrganName",
				toPosName:"#toPosName",toPosLevel:"#toPosLevel",endDate:'#endTimeAdd',
				fromOrganId:"#fromOrganId",fromCenterId:"#fromCenterId",fromDeptId:"#fromDeptId",fromPosId:"#fromPosId",
				toOrganId:"#toOrganId",toCenterId:"#toCenterId",toDeptId:"#toDeptId",toPosId:"#toPosId",
				staffName:"#staffName",archivesId:"#archivesId"
			},
     
	  		onChange:function(){
	  				 $('#toPosLevel').combox('setValue');
			         $('#fromPosLevel').combox('setValue');
      		}	 
	 });
	  hideTrAndUnEdit();
	 $("#isContinueSecond").combox({
		onChange : function() {
			hideTrAndUnEdit();
		}
	});
	
});


function  hideTrAndUnEdit(){
	var isContinueSecond=$('#isContinueSecond').val();
	var tr=$('#hideTr');
	if(isContinueSecond==0){
	  $('#isHandoverNeeded').attr('required',true);
      $('div,span',tr).add(tr).show();

	}else{
	$('#isHandoverNeeded').removeAttr('required');
      $('div,span',tr).add(tr).hide();

	}

}


function getId() {
	return $("#endApplyId").val() || 0;
}

function setId(value){
	$("#endApplyId").val(value);
}



