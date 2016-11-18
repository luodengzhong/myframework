var gridManager = null , refreshFlag = false;
var dataSource={
		yesOrNo:{1:'是',0:'否'}
	};
$(document).ready(function() {
	var resultTask=$('#resultTask').val();
	if(resultTask==1){
		//隐藏除了保存和提交的所有按钮
		hiddenOtherButton();
	}
	 showOrHideRankTR();
	 $('#staffName').searchbox({ type:"hr", name: "resignationChoosePerson",manageType:'hrReshuffleManage',
			back:{
				ognId:"#fromOrganId",ognName:"#fromOrganName",centreId:"#fromCenterId",employedDate:"#employedDate",
				centreName:"#fromCenterName",dptId:"#fromDeptId",dptName:"#fromDeptName",posDesc:"#fromPosDesc",
				staffName:"#staffName",archivesId:"#archivesId",personId:"#personId",fullId:'#personFullId',
				wageCompany:"#fromPayOrganId",companyName:"#fromPayOrganName",staffKind:"#staffKind",staffingLevel:"#staffingLevel",
				wageOrgId:"#fromWageOrgId",wageOrgName:"#fromWageOrgName"
			    },
	        
			  onChange:function(){
			  	 /*$('#toPayOrganName').val($('#fromPayOrganName').val());
	        	 $('#toPayOrganId').val($('#fromPayOrganId').val());
	        	 $('#toWageOrgName').val($('#fromWageOrgName').val());
	        	 $('#toWageOrgId').val($('#fromWageOrgId').val());*/
	        	 $("#fromPositionId").val('');
	        	 $("#fromPositionName").val('');
	        	 $("#fromPersonMemberId").val('');
	        	 $("#fromPosLevel").val('');
	        	 $("#fromPosLevel").combox('setValue');
	        	 $("#rank").val('');
	        	 var archivesId =  $("#archivesId").val();
	     		 Public.ajax(web_app.name + '/reshuffleAction!queryLatestPerformanceRank.ajax?',{archivesId:archivesId}, function(data){
	    			 if(null!=data.effectiveRank){
	    				 $("#rank").val(data.effectiveRank);
	    				 $('#rank').combox('setValue');
	    			 }
	    		 });
	     		showOrHideAssessResult();
	          }
	 });
	 $('#fromPositionName').searchbox({ type:"hr", name: "staffPosSelect",manageType:'hrReshuffleManage',
			getParam:function(){
				var personId=$('#personId').val();
				if(!personId){
					Public.tip("请先选择异动员工");
					return false;
				}
			  return {searchQueryCondition:"person_Id='"+personId+"'"};
			},
			back:{
				  positionId:"#fromPositionId",positionName:"#fromPositionName",personMemberId:"#fromPersonMemberId",posLevel:"#fromPosLevel",
			      staffingPostsRank:"#fromStaffingPostsRank",responsibilitiyName:"#fromResponsibilitiyName",staffingPostsRankSequence:"#fromPostsRankSequence"
				  },
			    onChange:function(){
					 $("#fromPosLevel").combox('setValue');
					 $("#fromStaffingPostsRank").combox('setValue');
			    }    
	 });	 
	 showOrHideAssessResult();
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
	 posNameSelect($('#toPositionName'));
	 $('#reshuffleFileList').fileList();
	 if(!Public.isReadOnly){
	 	setTimeout(function(){$('#reshuffleFileList').fileList('enable');},0);
		 if(isApplyProcUnit()){//申请环节修改异动类别选择方式
		 	$('#type_text').treebox({treeLeafOnly: true, name: 'reshuffleTypeChoose',tree:{delay:function(){alert(1);}},onChange:function(values,nodeData){
		 			$('#type_text').val(nodeData.name);
		 			$('#type').val(nodeData.shortCode);
		 			reshuffleTypeOnchange();
		 	}});
		 }
	 }
	 	//职级选择
	 $('#toStaffingPostsRank').combox({onChange:function(){
		$('#toPostsRankSequence').val('');
	 }});
	  //职级序列的选择
	  $('#toPostsRankSequence').searchbox({
		type:'hr',name:'postsRankSequenceByFullId',checkboxIndex:'code',
		showToolbar:true,pageSize:100,checkbox:true,
		maxHeight:200,
		getViewWidth:function(){
			return 180;
		},
		getParam:function(){
			var organId=$('#toOrganId').val();
			var staffingPostsRank=$('#toStaffingPostsRank').val();
			if(staffingPostsRank!=''){
				return {organId:organId,searchQueryCondition:"staffing_posts_rank='"+staffingPostsRank+"'"};
			}else{
				return {organId:organId,searchQueryCondition:""};
			}
		},
		back:{code:$('#toPostsRankSequence')}
	});	
	//职能选择
	$('#toResponsibilitiyName').treebox({
		name:'responsibilitiy',
		checkbox:true,
		back:{text:$('#toResponsibilitiyName'),value:$('#toResponsibilitiyId')}
	});
	 
	 setEditable();
	 UICtrl.autoGroupAreaToggle();
});

function hiddenOtherButton(){
		$('#toolBar').toolBar('changeEvent','save',function(){
	    specialSave();});
		$('#toolBar').toolBar('changeEvent','advance',function(){
	    specialAdvance();
	    });
	    $('#toolBar').toolBar('changeEvent','abort',function(){
	    specialStop();
	    })
}

function specialSave(){
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/reshuffleAction!specialSave.ajax',
		success : function(data) {
         $('#auditId').val(data);
		}
	});
}
function specialAdvance(){
	UICtrl.confirm("点提交按钮将同步员工档案信息和组织架构信息,确定现在同步吗？", function() {
		$('#submitForm').ajaxSubmit({
		url : web_app.name + '/reshuffleAction!specialAdvance.ajax',
		success : function() {
			UICtrl.closeAndReloadTabs("TaskCenter", null);
		}
	});
	});
}

function specialStop(){
	var taskId=$('#taskId').val();
	var auditId=$('#auditId').val();
	Public.ajax(web_app.name + "/reshuffleAction!specialStop.ajax",
			{taskId:taskId,auditId:auditId}, function() {
				UICtrl.closeAndReloadTabs("TaskCenter", null);
	});

}
function setEditable(){

	if(isApproveProcUnit()){//是审核中
		setTimeout(function(){
	 if(!Public.isReadOnly){
		$('#reshuffleFileList').fileList('enable');
	}
		},0);
	}else{
		setTimeout(function(){
			
		},0);
	}
}
function showOrHideAssessResult(){
	 var reshuffleType=$("#type").val(); 
	 if(reshuffleType==4 || reshuffleType==8 ||reshuffleType==1||reshuffleType==10||reshuffleType==11||reshuffleType==23){
		 $("#assessResultText").show();
		 initializeGrid();
	 }else {
		 $("#assessResultText").hide();
	 }
	 $('#type').combox({onChange:function(o){		 
		 reshuffleTypeOnchange();
	 }}); 	
}

function reshuffleTypeOnchange(){
	showOrHideRankTR();
	var reshuffleType=$("#type").val(); 
	if(reshuffleType==4 || reshuffleType==8 ||reshuffleType==1||reshuffleType==10||reshuffleType==11||reshuffleType==23){
		$("#assessResultText").show();
		initializeGrid();
	}else {
		$("#assessResultText").hide();
	 }
}


function showOrHideRankTR(){
	 var rankTR=$("#rankTR");
	 var reshuffleType=$("#type").val();
	 if(reshuffleType==11){
		 rankTR.add(rankTR.find('td')).show();
	 }else {
		 rankTR.add(rankTR.find('td')).hide();
	 }	
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
       	 	if($('#fromPosLevel').combox().val()!=$('#toPosLevel').combox().val()){
       		 	$('#payAdjustmentNeeded').val(1).combox('setValue');
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

function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
	$('#reshuffleFileList').fileList({bizId:value});
}
//打印功能
function print(){
	var  auditId=$('#auditId').val();
	var  staffName=$('#staffName').val();
	window.open(web_app.name + '/reshuffleAction!createPdf.load?auditId='+auditId+'&staffName='+encodeURI(encodeURI(staffName)));	
}


//初始化表格
function initializeGrid() {
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "上级平均分", name: "upLevelAverageScore", width: 150, minWidth: 150, type: "String", align: "center"},	
		{ display: "业务横向平均分", name: "equelLevelAverageScore", width: 150, minWidth: 150, type: "String", align: "center"},	
		{ display: "下级平均分", name: "lowLevelAverageScore", width: 150, minWidth: 150, type: "String", align: "center"},	
		{ display: "合计平均分", name: "totalAverage", width: 150, minWidth: 150, type: "String", align: "center"},
		{ display: "本人自评分", name: "scoreMyself", width: 150, minWidth: 150, type: "String", align: "center"}
		],
		dataAction : 'server',
		url: web_app.name+'/reshuffleAction!slicedQueryPerformAssessResult.ajax',
		parms:{personId:$('#personId').val(),archivesId:$('#archivesId').val()},
		pageSize : 20,
		width : '99%',
		height : 200,
		heightDiff : -5,
		usePager:false,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return true;
		},
		onSuccess:function(data){
			$("#personAnalyze").html(data.personAnalyze);
		}
	});
}


