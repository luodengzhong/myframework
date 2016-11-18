$(document).ready(function() {
	initializeGrid();
	//设置审批页面中字段为可读写
	setEditable();
});
function setEditable(){
	if(isApproveProcUnit()){//是审核中
		setTimeout(function(){
			UICtrl.enable('#isInterRecommend');
			UICtrl.enable('#isHeadhunter');
			UICtrl.enable('#isSchoolrecruit');
		},0);
	}
}
function initializeGrid(){
	var $al=$('#recDptName');
		$al.orgTree({filter:'dpt',
			manageType:'hrBasePersonquatoData',
			getParam:function(){
				var ognId=$('#organId').val();
				var mode=this.mode;
				if(mode=='tree'){//更改树的根节点
					return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
				}else{
					var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
					if(ognId!=''){//增加根查询参数
						condition.push(" and full_id like '%/"+ognId+"%'");
					}
					param['searchQueryCondition']=condition.join('');
					return param;
				}
			},
			onChange:function(values){
			 $('#recPosName').val('');
    		 $('#recPosId').val('');
			 var recDptId=values.value;
				if(recDptId!=''){
					//查询该选择部门的编制人数,已占编制人数,见习生,实习生人数，已占见习,实习生人数
					var url=web_app.name+'/hRPersonnelQuotaAction!showOrganNumber.ajax';
					Public.ajax(url,{dptId:recDptId},function(data){
						$('#organNumDes').val(data);
					});
				}
				
			},
			back:{
				text:$al,
				value:'#recDptId',
				id:'#recDptId',
				name:$al
			}
		});
	    
	
    var $el=$('#recPosName');
	$el.orgTree({filter:'pos',
	    manageType:'hrBasePersonquatoData',
		getParam:function(){
			var ognId=$('#organId').val(),
				dptId=$('#recDptId').val(),
				root='orgRoot';
			if(ognId!=''){
				root=ognId;
			}
			if(dptId!=''){
				root=dptId;
			}
		  return {a:1,b:1,orgRoot:root,searchQueryCondition:"org_kind_id in('ogn','dpt','pos')"};
		},
		onChange:function(){
			var posId=$('#recPosId').val();
			if(posId!=''){
				var url=web_app.name+'/recruitApplyAction!queryPosDeclare.ajax';
				Public.ajax(url,{posId:posId},function(data){
					$('#inputQueryTable').find('input').val('');
					$.each(data,function(p,o){
						if(p=='posLevel'){
						$('#'+p).val(o).combox('setValue');
						}else{
							$('#'+p).val(o);
						}
					});
				});
			}
		},
		back:{
			text:$el,
			value:'#recPosId',
			id:'#recPosId'
		}
	});
}
