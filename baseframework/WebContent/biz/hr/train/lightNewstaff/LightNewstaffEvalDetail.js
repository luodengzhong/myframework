$(document).ready(function() {
     /*$('#joinPersonName').searchbox({ type:"hr",name: "resignationChoosePerson",checkbox:true,
              valueIndex:'#joinPersonId',checkboxIndex:'archivesId',
			callBackControls:{archivesId:'#joinPersonId',staffName:'#joinPersonName'}
	 });*/
		$("#joinPersonName").bind("click",
		showJoinPersonNameSelectPage);
	 
	 $("#joinHrPersonName").bind("click",showJoinHrPersonNameSelectPage);

   /*  $('#joinHrPersonName').searchbox({ type:"hr",name: "resignationChoosePerson",checkbox:true,
              valueIndex:'#joinHrPersonId',checkboxIndex:'archivesId',
			callBackControls:{archivesId:'#joinHrPersonId',staffName:'#joinHrPersonName'}
	 });*/

});
function showJoinHrPersonNameSelectPage(){
	var  joinHrPersonId=$('#joinHrPersonId').val();
	var  joinHrPersonName=$("#joinHrPersonName").val();
	
	 var handlers = [];
	
	 var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
	 UICtrl.showFrameDialog({
			title : "选择人员",
			url : web_app.name + "/orgAction!showSelectOrgDialog.do",
			param : selectOrgParams,
			width : 700,
			height : 400,
			ok : function() {
			  var data = this.iframe.contentWindow.selectedData;
			  if(data.length==0){
			  		Public.tip('请选择人员。');
			       return;
			  }
			  var allJoinPersonName = data[0].name;
			  var allJoinPersonId = data[0].personId;
			  for(var i=1;i<data.length;i++){
			  	allJoinPersonName=allJoinPersonName+','+data[i].name;
			  	allJoinPersonId=allJoinPersonId+','+data[i].personId;
			  }
				$("#joinHrPersonId").val(allJoinPersonId);
				$("#joinHrPersonName").val(allJoinPersonName);
				return true;
			},
			close : this.close
		});

}


function showJoinPersonNameSelectPage(){
	 var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
	 
	 UICtrl.showFrameDialog({
			title : "选择人员",
			url : web_app.name + "/orgAction!showSelectOrgDialog.do",
			param : selectOrgParams,
			width : 700,
			height : 400,
			ok : function() {
			  var data = this.iframe.contentWindow.selectedData;
			  if(data.length==0){
			  		Public.tip('请选择人员。');
			       return;
			  }
			  var allJoinPersonName = data[0].name;
			  var allJoinPersonId = data[0].personId;
			  for(var i=1;i<data.length;i++){
			  	allJoinPersonName=allJoinPersonName+','+data[i].name;
			  	allJoinPersonId=allJoinPersonId+','+data[i].personId;
			  }
			
				$("#joinPersonId").val(allJoinPersonId);
				$("#joinPersonName").val(allJoinPersonName);
				return true;
			},
			close : this.close
		});
}




function getId() {
	return $("#evalId").val() || 0;
}
//打印功能
function print(){
	var  evalId=$('#evalId').val();
	var  staffName=$('#staffName').val();
	window.open(web_app.name + '/employApplyAction!createPdf.load?employApplyId='+employApplyId+'&staffName='+encodeURI(encodeURI(staffName)));	
}
function setId(value){
	$("#evalId").val(value);
}

function afterSave(data){
	 $("#standardScoreSumTd").html(data.standardScoreSum);
	  $("#scoreSumTd").html(data.scoreSum);
}
function getExtendedData(){
	var extendedData=getScoreValues();
	if(!extendedData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(extendedData))};
}

function getScoreValues(){
	var values=[], detailId,score,content,totalScore;
	$('#lightNewstaffTbody').find('tr').each(function(){
		detailId=$(this).find('input[name="detailId"]').val();
		score=$(this).find('input[name="score"]').val();
		content=$(this).find('input[name="content"]').val();
		values.push({detailId:detailId,score:score,content:content});
	});
	return values;
}
function reloadGrid() {
} 