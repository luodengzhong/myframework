var gridManager = null , refreshFlag = false;
$(document).ready(function() {
	 $('#staffName').searchbox({ type:"hr",manageType:'hrReshuffleManage', name: "resignationChoosePerson",
			back:{
				ognId:"#fromOrganId",ognName:"#fromOrganName",centreId:"#fromCenterId",personId:"#personId",
				centreName:"#fromCenterName",dptId:"#fromDeptId",dptName:"#fromDeptName",posLevel:"#fromPosLevel",
				staffName:"#staffName",archivesId:"#archivesId",wageCompany:"#fromPayOrganId",companyName:"#fromPayOrganName",
				wageOrgId:"#fromWageOrgId",wageOrgName:"#fromWageOrgName"
			},
     
	  		onChange:function(){
			   	 /*$('#toPayOrganName').val($('#fromPayOrganName').val());
			   	 $('#toPayOrganId').val($('#fromPayOrganId').val());
			   	 $('#toWageOrgName').val($('#fromWageOrgName').val());
	        	 $('#toWageOrgId').val($('#fromWageOrgId').val());*/
	        	 $("#fromPosId").val('');
	        	 $("#fromPosName").val('');
	        	 $("#fromPersonMemberId").val('');
      		}	 
	 });
	 
	 $('#toWageOrgName').orgTree({filter:'ogn,dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		onChange:function(){
			$('#toPayOrganName').val('');
			$('#toPayOrganId').val('');
		},
		beforeChange:function(data){
				var flag=false,fullId=data.fullId;//是否是工资主体
				Public.authenticationWageOrg('',fullId,false,function(f){
					flag=f;
					if(f===false){
						Public.tip('选择的单位不是工资主体！');
					}
				});
				return flag;
		},
		back:{
			text:'#toWageOrgName',
			value:'#toWageOrgId',
			id:'#toWageOrgId',
			name:'#toWageOrgName'
		}
	});
	
	 $('#toPayOrganName').searchbox({
	 	type:'hr',name:'businessRegistrationByOrg',
		getParam:function(){
			var orgId=$('#toWageOrgId').val();
			if(orgId==''){
				Public.tip('请选择工资主体单位.');
				return false;
			}
			return {orgId:orgId};
		},
		back:{id:"#toPayOrganId",companyName:"#toPayOrganName"}
	 });
	 
	 
	 $('#fromPosName').searchbox({ type:"hr", name: "staffPosSelect",manageType:'hrReshuffleManage',
			getParam:function(){
				var personId=$('#personId').val();
				if(!personId){
					Public.tip("请先选择异动员工");
					return false;
				}
			  return {searchQueryCondition:"person_Id='"+personId+"'"};
			},
			back:{
				  positionId:"#fromPosId",positionName:"#fromPosName",personMemberId:"#fromPersonMemberId", staffingPostsRank:"#fromStaffingPostsRank"
			    } ,
		   onChange:function(){
					 $("#fromStaffingPostsRank").combox('setValue');
			   }    
	 });	
	 
//     ognNameSelect($('#toOrganName'));
//	 centreNameSelect($('#toCenterName'));
//	 dptNameSelect($('#toDeptName'));
	 //posNameSelect($('#toPosName'));
	 posNameSelect($('#toPosName'));
	 $('#secondmentFileList').fileList();
});




//选择机构
function ognNameSelect($el){
	$el.orgTree({filter:'ogn',param:{searchQueryCondition:"org_kind_id in('ogn')"},
		manageType:'noControlAuthority',
		back:{
			text:$el,
			value:'#toOrganId',
			id:'#toOrganId',
			name:$el
		}
	});
}
//选择中心
function centreNameSelect($el){
	$el.orgTree({filter:'dpt',manageType:'noControlAuthority',
		getParam:function(){
			var ognId=$('#toOrganId').val();
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}else{
				var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
				if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '/"+ognId+"%'");
				}
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		back:{
			text:$el,
			value:'#toCenterId',
			id:'#toCenterId',
			name:$el
		}
	});
}
//选择部门
function dptNameSelect($el){
	$el.orgTree({filter:'dpt',manageType:'noControlAuthority',
		getParam:function(){
			
			var ognId=$('#toOrganId').val();
			var centreId=$('#toCenterId').val();
			root='orgRoot';
			if(ognId!=''){
			   root=ognId;
			}
			if(centreId!=''){
			   root=centreId;
			}
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				return {a:1,b:1,orgRoot:root,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}else{
				var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
				if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '/"+ognId+"%'");
				}
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		back:{
			text:$el,
			value:'#toDeptId',
			id:'#toDeptId',
			name:$el
		}
	});
}
//选择岗位
function posNameSelect($el){
	$el.orgTree({filter:'pos',manageType:'noControlAuthority',
		searchName :'hrPosSelect',
		searchType :'hr',
		onChange:function(values,nodeData){
			if($('#toPosId').val()==''){
				$('#toPosLevel').combox('setValue','');
				return;
			}
			if(this.mode=='tree'){
				Public.ajax(web_app.name + "/hrSetupAction!loadPosTier.ajax", {posId: $('#toPosId').val()}, function(data) {
					$.each(data,function(i,id){
						if(i=='posLevel'){
							$('#toPosLevel').val(id);
							$('#toPosLevel').combox('setValue',id);
						}
					});
				});
				$('#toOrganName').val(nodeData.orgName);
	        	$('#toOrganId').val(nodeData.orgId);
	        	$('#toCenterName').val(nodeData.centerName);
	        	$('#toCenterId').val(nodeData.centerId);
	        	$('#toDeptName').val(nodeData.deptName);
	        	$('#toDeptId').val(nodeData.deptId);
			}else{
				$('#toPosLevel').combox('setValue');
			}
		},
		back:{
			text:$el,
			value:'#toPosId',
			id:'#toPosId',
			name:$el,
			posLevel:'#toPosLevel',
			orgName:'#toOrganName',
			orgId:'#toOrganId',
			centerName:'#toCenterName',
			centerId:'#toCenterId',
			deptName:'#toDeptName',
			deptId:'#toDeptId'
		}
	});
}

function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
	$('#secondmentFileList').fileList({bizId:value});
}

//function save(){
//	$('#submitForm').ajaxSubmit({url: web_app.name + '/secondmentAction!saveOrUpdateSecondments.ajax',
//		success : function(data) {
//			refreshFlag = true;
//		}
//	});
//}

