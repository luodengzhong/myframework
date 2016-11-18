$(document).ready(function() {
	 $('#staffName').searchbox({ type:"hr", name: "resignationChoosePerson",
	// manageType:'hrReshuffleManage',
			back:{
				ognId:"#fromOrganId",ognName:"#fromOrganName",centreId:"#fromCenterId",employedDate:"#employedDate",residence:"#residence",
				centreName:"#fromCenterName",dptId:"#fromDeptId",dptName:"#fromDeptName",posDesc:"#fromPosDesc",posLevel:"#fromPosLevel",
				posId:"#fromPositionId",posName:"#fromPositionName",staffName:"#staffName",archivesId:"#archivesId",
				wageCompany:"#fromPayOrganId",companyName:"#fromPayOrganName",staffKind:"#staffKind",staffingLevel:"#staffingLevel"	
			    },
	        
			  onChange:function(){
	        	 $('#fromPosLevel').combox('setValue');
			  	 $('#toPayOrganName').val($('#fromPayOrganName').val());
	        	 $('#toPayOrganId').val($('#fromPayOrganId').val());
	          }
	 });
	 $('#toPayOrganName').searchbox({ type:"hr",manageType:'hrReshuffleManage', name: "businessRegistration",
			back:{id:"#toPayOrganId",companyName:"#toPayOrganName"}
	 });
	 fromPosNameSelect($('#fromPositionName'));
	 posNameSelect($('#toPositionName'));
	$('#OffsiteAllowanceFileList').fileList();
	 UICtrl.autoGroupAreaToggle();
});

function getId() {
	return $("#offsiteAllowanceId").val() || 0;
}

function setId(value){
	$("#offsiteAllowanceId").val(value);
	$('#OffsiteAllowanceFileList').fileList({bizId:value});
}

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

function fromPosNameSelect($el){
	
	$el.orgTree({filter:'pos',manageType:'noControlAuthority',
		searchName :'hrPosSelect',
		searchType :'hr',
		onChange:function(values,nodeData){
			if($('#fromPositionId').val()==''){
				$('#fromPosLevel').combox('setValue','');
				return;
			}
			if(this.mode=='tree'){
				Public.ajax(web_app.name + "/hrSetupAction!loadPosTier.ajax", {posId: $('#fromPositionId').val()}, function(data) {
					$.each(data,function(i,id){
						if(i=='posLevel'){
							$('#fromPosLevel').combox('setValue',id);
						}
					});
				});
				$('#fromOrganName').val(nodeData.orgName);
	        	$('#fromOrganId').val(nodeData.orgId);
	        	$('#fromCenterName').val(nodeData.centerName);
	        	$('#fromCenterId').val(nodeData.centerId);
	        	$('#fromDeptName').val(nodeData.deptName);
	        	$('#fromDeptId').val(nodeData.deptId);
			}else{
				$('#fromPosLevel').combox('setValue');
			}
		},
		back:{
			text:$el,
			value:'#fromPositionId',
			id:'#fromPositionId',
			name:$el,
			posLevel:'#fromPosLevel',
			orgName:'#fromOrganName',
			orgId:'#fromOrganId',
			centerName:'#fromCenterName',
			centerId:'#fromCenterId',
			deptName:'#fromDeptName',
			deptId:'#fromDeptId'
		}
	});

}
//选择岗位
function posNameSelect($el){
	$el.orgTree({filter:'pos',manageType:'noControlAuthority',
		searchName :'hrPosSelect',
		searchType :'hr',
		onChange:function(values,nodeData){
			if($('#toPositionId').val()==''){
				$('#toPosLevel').combox('setValue','');
				return;
			}
			if(this.mode=='tree'){
				Public.ajax(web_app.name + "/hrSetupAction!loadPosTier.ajax", {posId: $('#toPositionId').val()}, function(data) {
					$.each(data,function(i,id){
						if(i=='posLevel'){
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
			value:'#toPositionId',
			id:'#toPositionId',
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