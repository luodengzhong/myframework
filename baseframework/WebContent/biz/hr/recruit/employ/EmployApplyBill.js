var wageKind=null;
$(document).ready(function() {
	initializeUI();
	$('#teacher').searchbox({type:'sys',name:'orgSelect',
			back:{personMemberId:'#teacherId',name:'#teacher'},
			param:{a:1,b:1,searchQueryCondition: " org_kind_id ='psm'  and instr(full_id, '.prj') = 0  and exists (select 0  from hr_archives s where s.person_id = person_id and s.state=1 and nvl(s.is_probation,0)=0) "}
		});
	//bindEvent();
	//只读模式隐藏薪资数据
	var taskKindId=Public.getQueryStringByName("taskKindId");
	if(Public.isReadOnly||taskKindId=='makeACopyFor'){
		togglePayInfo(false);
	}else{
		var employApplyId=$('#employApplyId').val();
		if(employApplyId!=''){
			togglePayInfo(false);
			PersonalPasswordAuth.showDialog({
				okFun:function(){
					this.close();
					togglePayInfo(true);
				},
				closeFun:function(){
					this.close();
				}
			});
		}
	}
});
function togglePayInfo(flag){
	$('#paymentGroup')[flag?'show':'hide']();
	var table=$('#paymentTable')[flag?'show':'hide']();
	table.find('span')[flag?'show':'hide']();
	table.find('div')[flag?'show':'hide']();
}
function initializeUI(){
	$('#employApplyFileList').fileList();
	    var $el=$('#employPosName');
		$el.orgTree({filter:'pos',
	    manageType:'hrBaseRecruitData',
		searchName :'hrPosSelect',
		searchType :'hr',
		onChange:function(values,nodeData){
			if($('#employPosId').val()==''){
				$('#posLevel').combox('setValue','');
				return;
			}
			if(this.mode=='tree'){
				Public.ajax(web_app.name + "/recruitApplyAction!queryPosDeclare.ajax", {posId: $('#employPosId').val()}, 
				function(data) {
					$.each(data,function(i,id){
						if(i=='posLevel'){
							$('#posLevel').combox('setValue',id);
						}
					});
				});
	            $('#employCenter').val(nodeData.centerName);
	        	$('#employCenterId').val(nodeData.centerId);
	        	$('#employDept').val(nodeData.deptName);
	        	$('#employDeptId').val(nodeData.deptId);
	        	$('#employCompany').val(nodeData.orgName);
	        	$('#employCompanyId').val(nodeData.orgId);
			}
			else{
				$('#posLevel').combox('setValue');
			}
		},
		back:{
			text:$el,
			value:'#employPosId',
			id:'#employPosId',
			name:$el,
			orgId:'#employCompanyId',
			orgName:'#employCompany',
			centerName:'#employCenter',
			centerId:'#employCenterId',
		    deptName:'#employDept',
			deptId:'#employDeptId'
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
			var organId=$('#employCompanyId').val();
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
    $('#staffName').searchbox({type:'hr',name:'resumePersonSelect',manageType:'hrBaseRecruitData',
    	onChange:function(){
			$('#staffKind').combox('setValue');
			$('#staffingLevel').combox('setValue');
			$('#sex').combox('setValue');
			$('#posLevel').combox('setValue');
			$('#education').combox('setValue');

 	},
	    back:{writeId:'#writeId',applyPosId:'#applyPosId',employCompanyId:'#employCompanyId',employCompany:'#employCompany',
			employCenterId:'#employCenterId',
			employCenter:'#employCenter',employDeptId:'#employDeptId',employDept:'#employDept',
			staffKind:'#staffKind',sex:'#sex',posLevel:'#posLevel',staffingLevel:'#staffingLevel',
			height:'#height',age:'#age',university:'#university',specialty:'#specialty',
			education:'#education',phoneNumber:'#phoneNumber',employedDate:'#employDate',
			isBackflow:'#isBackflow',staffName:'#staffName',applyPosName:'#applyPosName',
			employName:'#employPosName',employPosId:'#employPosId'}});
}

//通过writeId  查询招聘信息
function queryRecruitApply(){
	var writeId=$('#writeId').val();
	if(writeId.length>0){
		parent.addTabItem({
			tabid: 'HRRecruitApply'+writeId,
			text: '查看招聘需求',
			url: web_app.name + '/recruitApplyAction!showUpdateByWriteId.job?writeId=' 
				+ writeId+'&isReadOnly=true'
		});
	}else{
		Public.tip('请选择员工'); 
	}
}

function showViewPersonRegister(){
	var writeId=$('#writeId').val();
	 var name=$('#staffName').val();
	if(writeId.length>0){
		parent.addTabItem({
			tabid: 'showViewPersonRegister'+writeId,
			text: '【'+name+'】个人简历',
			url: web_app.name + '/personregisterAction!showViewPersonRegister.do?writeId=' 
				+ writeId+'&isReadOnly=true'
		});
	}else{
		Public.tip('请选择员工'); 
	}
}

function showViewBackground(){
	var writeId=$('#writeId').val();
	 var name=$('#staffName').val();
	if(writeId.length>0){
		parent.addTabItem({
			tabid: 'showViewBackground'+writeId,
			text: '【'+name+'】背景调查',
			url: web_app.name + '/backgroundSurveyAction!showViewBackground.do?writeId=' 
				+ writeId+'&isReadOnly=true'
		});
	}else{
		Public.tip('请选择员工'); 
	}
}
/*
function parseWage(salaryYear){
	if(Public.isBlank(salaryYear)) return;
	var salaryMonth=(int)(salaryYear*0.85)/12;
	var proSalaryYear=(salaryYear*0.85*0.9);
	var proSalaryMonth=(salaryYear*0.85*0.9)/12;
	$('#salaryMonth').val(salaryMonth);
	$('#proSalaryYear').val(proSalaryYear);
	$('#proSalaryMonth').val(proSalaryMonth);
	
}*/

//面试记录
function interviewRecord(){
   var writeId=$('#writeId').val();
   var name=$('#staffName').val();
   if(writeId.length<1){
   	Public.tip('请选择员工');
   	return;
   }
	parent.addTabItem({
		tabid: 'HRInterViewApply'+writeId,
		text: '面试测评记录',
		url: web_app.name + '/interviewApplyAction!forwardListDetail.do?writeId='+writeId+'&status=4'
	});
}

/*function save(){

		$('#submitForm').ajaxSubmit({url: web_app.name + '/employApplyAction!insert.ajax',
			param:{status:0},
			success : function(data) {
				//如果不关闭对话框这里需要对主键赋值
				$('#employApplyId').val(data);
				refreshFlag = true;
			}
		});
	
}

//提交
function  advance(){

	var interviewApplyId=$('#employApplyId').val();
	var writeId=$('#writeId').val();
	if(!interviewApplyId){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/employApplyAction!insert.ajax',
		param:{status:1},
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#interviewApplyId').val(data);
			//并修改登记信息中的应聘结果
			Public.ajax(web_app.name + '/personregisterAction!updateStatusByApply.ajax',
					{writeId:writeId,recruitResult:4},function(){
				reloadGrid();
			});
		}
	});}else{
		$('#submitForm').ajaxSubmit({url: web_app.name + '/employApplyAction!update.ajax',
			param:{status:1},
			success : function() {
				Public.ajax(web_app.name + '/personregisterAction!updateStatusByApply.ajax',
						{writeId:writeId,recruitResult:4},function(){
					reloadGrid();
				});
			}
		});
	}

}

//终止
function jobPageAbortProcess() {
    
    

}*/


function getId() {
	return $("#employApplyId").val() || 0;
}

//打印功能
function print(){
	var  employApplyId=$('#employApplyId').val();
	var  staffName=$('#staffName').val();
	window.open(web_app.name + '/employApplyAction!createPdf.load?employApplyId='+employApplyId+'&staffName='+encodeURI(encodeURI(staffName)));	
}
function setId(value){
	$("#employApplyId").val(value);
    $('#employApplyFileList').fileList({bizId:value});
}
function afterSave(data){
	//计算工资返回
	$.each(data,function(p,v){
		$('#'+p).val(Public.currency(v));
	});
}

function reloadGrid() {
} 