$(document).ready(function() {
	initializeUI();
});

function initializeUI(){
	initializeDefaultUI();
	$('#periodYear').spinner({countWidth:80}).mask('nnnn');
	$('#orgUnitName').orgTree({filter:'ogn,dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		manageType:'hRPayManage',
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
function create(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/payPerformanceAction!insertPayPerformanceMain.ajax',
		param:{year:$('#periodYear').val()},
		success : function(data) {
			var url=DataUtil.composeURLByParam('payPerformanceAction!showUpdatePayPerformance.do',{performanceMainId:data});
			window.location.replace(url);
		}
	});
}