var gridManager = null;
var dataSource={
		resignationType:{'主动':'1','被动':'2'}
	};
$(document).ready(function() {
	 $('#staffName').searchbox({ type:"hr",manageType:'hrReshuffleManage', name: "resignationChoosePerson",
			back:{
				ognId:"#orgnizationId",ognName:"#orgnizationName",centreId:"#centerId",sex:"#sex",birthdate:"#birthday",
				centreName:"#centerName",dptId:"#departmentId",dptName:"#departmentName",employedDate:"#employedDate",posLevel:"#posLevel",
				posId:"#posId",posName:"#posName",staffName:"#staffName",archivesId:"#archivesId",education:"#education"},
		onChange:function(){
			             $('#posLevel').combox('setValue');
			        	 $('#sex').combox('setValue');
			        	 $('#education').combox('setValue');
		 	          }
		
	 });
	 $('#resignationFileList').fileList();
	  var procUnitId=$('#procUnitId').val();
	   var taskKindId=$('#taskKindId').val();
	  var tr=$('#typeSelectTr');
	  $('div,span',tr).add(tr).hide();
	  $('#type').removeAttr('required');
	  if(taskKindId=="makeACopyFor"){
	  	  $('div,span',tr).add(tr).show();
	  	  $('#type').attr('required',true);
	  }else if(taskKindId=="nosee"){
	  	 $('div,span',tr).add(tr).hide();
	  	 $('#type').removeAttr('required');
	  }
	
	 setEditable();
	 showResume();
	
});


function showResume(){
	 var posLevel = $("#posLevel").val();
	 var staffingPostsRank=$("#staffingPostsRank").val();
	 if(posLevel && posLevel<3.3||staffingPostsRank>=4){//总助以上的要处理离职意见表
		 $("#personalResume").show();
		 $("#companyResume").show();
	 }else{
		 $("#personalResume").hide();
		 $("#companyResume").hide();		 
	 }	
}

function setEditable(){
	 var tr=$('#typeSelectTr');
	    var taskKindId=$('#taskKindId').val();
	if(isApproveProcUnit()){//是审核中
		
		
		setTimeout(function(){
			
			if(taskKindId=="nosee"){
				 $('div,span',tr).add(tr).hide();
			}else{
			 $('div,span',tr).add(tr).show();
			  $('#type').attr('required',true);
			}
			UICtrl.enable('#type');
			UICtrl.enable('#accountDeadlineDate');
			UICtrl.enable('#attendanceDeadlineDate');
			UICtrl.enable('#resignationReason');

			setEnableFiletable();
		},0);
	}else{
		setTimeout(function(){
			
//			UICtrl.disable('#accountDeadlineDate');
//			UICtrl.disable('#attendanceDeadlineDate');
		},0);
	}
}

function setEnableFiletable(){
	if(!Public.isReadOnly){
		$('#resignationFileList').fileList('enable');
	}
	
	 $('#type_text').treebox({treeLeafOnly: true, name: 'resignationTypeChoose',tree:{delay:function(){alert(1);}},onChange:function(values,nodeData){
		 			$('#type_text').val(nodeData.name);
		 			$('#type').val(nodeData.shortCode);
		 	}});
}


function isApproveProcUnit(){
	return procUnitId == "Approve";
}

function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
	$('#resignationFileList').fileList({bizId:value});
}

/**
 * queryResignationInterview 查看离职面谈记录
 */
function queryResignationInterview(){
	 var archivesId=$('#archivesId').val();
	 var name=$('#staffName').val();
		parent.addTabItem({
			tabid: 'showResignationInterview'+archivesId,
			text: '【'+name+'】部门离职面谈',
			url: web_app.name + '/personalInterviewAction!showUpdateResInv.do?archivesId=' 
				+ archivesId+'&resInvType=1&isReadOnly=true'
		});
	
}
//打印功能
function print(){
	var  auditId=$('#auditId').val();
	var  staffName=$('#staffName').val();
	window.open(web_app.name + '/resignationAction!createPdf.load?auditId='+auditId+'&staffName='+encodeURI(encodeURI(staffName)));	
}
//function save(){
//	$('#submitForm').ajaxSubmit({url: web_app.name + '/resignationAction!saveOrUpdateResignations.ajax',
//		success : function(data) {
//			refreshFlag = true;
//		}
//	});
//}

