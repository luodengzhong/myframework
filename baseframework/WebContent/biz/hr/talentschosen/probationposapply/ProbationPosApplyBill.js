$(document).ready(function() {
	   $('#probationPosApplyFileList').fileList();
	    posNameSelect($('#beformalPosName'));
	     $('#staffName').searchbox({ type:"hr",name: "resignationChoosePerson",
			back:{
				ognId:"#orgnizationId",ognName:"#orgnizationName",centreId:"#centerId",sex:"#sex",birthdate:"#birthday",
				centreName:"#centerName",dptId:"#departmentId",dptName:"#departmentName",employedDate:"#employedDate",
				posId:"#posId",posName:"#posName",staffName:"#staffName",archivesId:"#archivesId",education:"#education",campus:'#campus',
				specialty:'#specialty',jobTitleName:'#jobTitleName'},
		onChange:function(){
			        	 $('#education').combox('setValue');
			        	 
		 	          }
		
	 });
	  	//职级选择
	 $('#staffingPostsRank').combox({onChange:function(){
		$('#staffingPostsRankSequence').val('');
	 }});
	  //职级序列的选择
	  $('#staffingPostsRankSequence').searchbox({
		type:'hr',name:'postsRankSequenceByFullId',checkboxIndex:'code',
		showToolbar:true,pageSize:100,checkbox:true,
		maxHeight:200,
		getViewWidth:function(){
			return 180;
		},
		getParam:function(){
			var organId=$('#orgnizationId').val();
			var staffingPostsRank=$('#staffingPostsRank').val();
			if(staffingPostsRank!=''){
				return {organId:organId,searchQueryCondition:"staffing_posts_rank='"+staffingPostsRank+"'"};
			}else{
				return {organId:organId,searchQueryCondition:""};
			}
		},
		back:{code:$('#staffingPostsRankSequence')}
	});	
	//职能选择
	$('#responsibilitiyName').treebox({
		name:'responsibilitiy',
		checkbox:true,
		back:{text:$('#responsibilitiyName'),value:$('#responsibilitiyId')}
	});
   setEditable(); 
});

function setEditable(){
	
	if(isApproveProcUnit()){//是审核中
        setTimeout(function(){
				$('#probationPosApplyFileList').fileList('enable');

		},0);
	}

}
 function posNameSelect($el){
	$el.orgTree({filter:'pos',manageType:'noControlAuthority',
		searchName :'hrPosSelect',
		searchType :'hr',
		onChange:function(values,nodeData){
			if(this.mode=='tree'){
				Public.ajax(web_app.name + "/hrSetupAction!loadPosTier.ajax", {posId: $('#beformalPosId').val()}, function(data) {
					$.each(data,function(i,id){if(i=='posLevel'){
							$('#posLevel').val(id);
						}});
				});
				$('#beformalOrganName').val(nodeData.orgName);
	        	$('#beformalOrganId').val(nodeData.orgId);
	        	$('#beformalDeptName').val(nodeData.deptName);
	        	$('#beformalDeptId').val(nodeData.deptId);
	        	$('#beformalCenterId').val(nodeData.centerId);
	        	$('#beformalCenterName').val(nodeData.centerName);
			}else{
				$('#posLevel').combox('setValue');
			}
       	 
		},
		back:{
			text:$el,
			value:'#beformalPosId',
			id:'#beformalPosId',
			name:$el,
			posLevel:'#posLevel',
			orgName:'#beformalOrganName',
			orgId:'#beformalOrganId',
			centerId:'#beformalCenterId',
			centerName:'#beformalCenterName',
			deptName:'#beformalDeptName',
			deptId:'#beformalDeptId'
		}
	});
}
function getId() {
	return $("#posBeformalId").val() || 0;
}

function setId(value){
	$("#posBeformalId").val(value);
    $('#probationPosApplyFileList').fileList({bizId:value});

}