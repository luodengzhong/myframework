$(document).ready(function() {
	 $('#staffName').searchbox({ type:"hr", name: "resignationChoosePerson",manageType:'hrReshuffleManage',
			back:{
				ognId:"#fromOrganId",ognName:"#fromOrganName",centreId:"#fromCenterId",employedDate:"#employedDate",residence:"#residence",
				centreName:"#fromCenterName",dptId:"#fromDeptId",dptName:"#fromDeptName",posDesc:"#fromPosDesc",posLevel:"#fromPosLevel",
				posId:"#fromPositionId",posName:"#fromPositionName",staffName:"#staffName",archivesId:"#archivesId",
				wageCompany:"#fromPayOrganId",companyName:"#fromPayOrganName",staffKind:"#staffKind",staffingLevel:"#staffingLevel"	
			    },
	        
			  onChange:function(){
	        	 $('#fromPosLevel').combox('setValue');
	        	 $('#toPosLevel').val($('#fromPosLevel').val());
			  	 $('#toPositionName').val($('#fromPositionName').val());
	        	 $('#toPositionId').val($('#fromPositionId').val());
	          }
	 });
     ognNameSelect($('#toOrganName'));
	 centreNameSelect($('#toCenterName'));
	 dptNameSelect($('#toDeptName'));
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
