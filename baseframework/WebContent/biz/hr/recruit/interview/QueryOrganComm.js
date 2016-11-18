
$(document).ready(function() {
	ognNameSelect($('#employCompany'));
	centreNameSelect($('#employCenter'));
	dptNameSelect($('#employDept'));

});

function ognNameSelect($el){
	$el.orgTree({filter:'ogn',manageType:'hrBaseRecruitData',
		param:{searchQueryCondition:"org_kind_id in('ogn')"},
		height:200,
		back:{
			text:$el,
			value:'#employCompanyId',
			id:'#employCompanyId',
			name:$el
		}
	});
}

function  centreNameSelect($el){
	$el.orgTree({filter:'dpt',
		manageType:'hrBaseRecruitData',
		getParam:function(){
			var ognId=$('#employCompanyId').val();
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
		height:200,
		back:{
			text:$el,
			value:'#employCenterId',
			id:'#employCenterId',
			name:$el
		}
	});
}
function dptNameSelect($el){
	$el.orgTree({filter:'dpt',
		manageType:'hrBaseRecruitData',
		getParam:function(){
			var ognId=$('#employCompanyId').val();
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
		height:200,
		back:{
			text:$el,
			value:'#employDeptId',
			id:'#employDeptId',
			name:$el
		}
	});
}

