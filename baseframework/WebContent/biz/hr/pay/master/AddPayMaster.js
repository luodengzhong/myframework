$(document).ready(function() {
	initializeUI();
});

function initializeUI(){
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodName').searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		return {paramValue:$('#year').val(),organId:$('#organId').val()};
	},back:{periodId:'#periodId',periodName:'#periodName',periodBeginDate:'#periodBeginDate',periodEndDate:'#periodEndDate'}});
	
	$('#orgUnitName').orgTree({filter:'ogn,dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		manageType:'hrPayChange,HRArchivesWage',needAuth:false,
		beforeChange:function(data){
				var flag=false,fullId=data.fullId;//是否是工资主体
				Public.authenticationWageOrg('hrPayChange,HRArchivesWage,hrPayOrgChoose',fullId,false,function(f){
					flag=f;
					if(f===false){
						Public.tip('选择的单位没有权限或不是工资主体！');
					}
				});
				return flag;
		},
		back:{
			text:'#orgUnitName',
			value:'#orgUnitId',
			id:'#orgUnitId',
			name:'#orgUnitName'
		}
	});
}

function closeWindow(){
	UICtrl.closeCurrentTab();
}
//创建薪资表
function createPay(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/paymasterAction!insert.ajax',
		success : function(data) {
			var url=DataUtil.composeURLByParam('paymasterAction!showUpdate.job',data);
			window.location.replace(url);
		}
	});
}