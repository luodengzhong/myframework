var learnGridManager = null, refreshFlag = false;
var familyGridManager =null,trainGridManager=null,workGridManager=null,workDetailGridM=null;
$(document).ready(function() {
	initializeUI();
	
});

function initializeUI(){
	var sourceType=$('#sourceType').val();
	var hunterId=$('#hunterId').val();
	var isInnerUpdate=$('#isInnerUpdate').val();
	
	var el=$('#sourceType');
	var xl=$('#isBackflowTr');
	var organId=$('#organId').val();
	$.getFormButton([{name:'保存/下一步 ',event:saveNext}]);
	$('#idCardNo').on('blur',function(){
		parseIdCard($(this).val());
	});
    $('#workPlaceFirst').remotebox({ name:'choicePlace', checkbox: true});
    
    
    if(isInnerUpdate==1){
    	 $('#applyPosName').searchbox({type:'hr',name:'recruitPosChoose',
 			back:{name:'#applyPosName',jobApplyId:'#jobApplyId',jobPosId:'#applyPosId',organId:'#applyOrganId',
 			   	deptName:'#applyDeptName',organName:'#applyOrganName',deptId:'#applyDeptId'}
 	 });
    }else {
    if(sourceType==3){
    	//社会招聘
    	UICtrl.disable(el);
    	 $('#applyPosName').searchbox({type:'hr',name:'recruitPosChoose',
 			back:{name:'#applyPosName',jobApplyId:'#jobApplyId',jobPosId:'#applyPosId',organId:'#applyOrganId',
 			   	deptName:'#applyDeptName',organName:'#applyOrganName',deptId:'#applyDeptId'}
 	 });
    }
    else if(sourceType==4){
    	//猎头推荐
    	UICtrl.disable(el);
    	$('#isBackflow').removeAttr('required');
	    $('div,span',xl).add(xl).hide();
        $('#applyPosName').searchbox({type:'hr',name:'recruitPosChooseByHeadHunter',
		back:{name:'#applyPosName',jobApplyId:'#jobApplyId',jobPosId:'#applyPosId',organId:'#applyOrganId',
		   	deptName:'#applyDeptName',organName:'#applyOrganName',deptId:'#applyDeptId'},
		   	getParam:function(){
		   		return{searchQueryCondition:"hunter_id ="+hunterId};
		   		}
	  });
    }else{
    	 $('#applyPosName').searchbox({type:'hr',name:'recruitPosChoose',manageType:'hrBaseRecruitData',
    	 back:{name:'#applyPosName',jobApplyId:'#jobApplyId',jobPosId:'#applyPosId',organId:'#applyOrganId',
    			   	deptName:'#applyDeptName',organName:'#applyOrganName',deptId:'#applyDeptId'}
    	 });
    }
    }
}


//身份证解析
function parseIdCard(idCard){
	if(Public.isBlank(idCard)) return;
	if(!/^\d{6}((?:19|20)(?:(?:\d{2}(?:0[13578]|1[02])(?:0[1-9]|[12]\d|3[01]))|(?:\d{2}(?:0[13456789]|1[012])(?:0[1-9]|[12]\d|30))|(?:\d{2}02(?:0[1-9]|1\d|2[0-8]))|(?:(?:0[48]|[2468][048]|[13579][26])0229)))\d{2}(\d)[xX\d]$/.test(idCard)){
		Public.tip('身份证号非法.');
	    return;
	}
	
	var birthdate=RegExp.$1,sex=RegExp.$2;
	var year=birthdate.substr(0,4),month=birthdate.substr(4,2),day=birthdate.substr(6,4);
	var y=new Date().getFullYear();   
	$('#birthdate').val(year+'-'+month+'-'+day);
    $('#sex').combox('setValue',parseInt(sex)%2==0?'2':'1');
    $('#age').val(y-parseInt(year));
    
    Public.ajax(web_app.name + '/personregisterAction!isOnlyByIdCardNo.ajax', {idCardNo:idCard}, function(data){
		if(data!=0){
			Public.tip('应聘人员已存在.不能重复添加');
			$('#idCardNo').val(" ");
			return;
		}
	});
}
// 保存/下一步
function saveNext() {
	var sourceType=$('#sourceType').val();
	var employedDate=$('#employedDate').val();
	if(!Public.isDate(employedDate)){
		Public.tip('预期到岗时间输入错误格式如:[2015-05-01]!');
		return false;
	}
		//执行插入操作
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!insertPersonRegister.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#writeId').val(data);
			var writeId=$('#writeId').val();
			 window.location.href = web_app.name + '/personregisterAction!showInsertPersonRegisterOther.do?writeId=' 
				+ data+'&sourceType='+sourceType;
			
		}
	});
	
}


//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}



//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
