$(document).ready(function() {
	$('#beFormalApplyFileList').fileList({isCheck:false});
	var posLevel=$('#posLevel').val();
	var staffingPostsRank=$('#staffingPostsRank').val();
	var tr=$('#resultScore');
	var tr1=$('#viewRecordTr');
	var tr2=$('#beformalTypeTr');
    var procUnitId=$('#procUnitId').val();
    var taskKindId=$('#taskKindId').val();
    if(procUnitId=="Approve"||taskKindId=="makeACopyFor"){
		$('#beformalType').attr('required',true);
//		$('#viewRecord').attr('required',true);
		 $('div,span',tr1).add(tr1).show();
		 $('div,span',tr2).add(tr2).show();
    	 $('#leaderHeader').show();
    	 $('div,span',tr).add(tr).hide();
    	 if(posLevel<=4.2||staffingPostsRank>=2){
    		 $('div,span',tr).add(tr).show();
    	 }
    }else{
		$('#beformalType').removeAttr('required');
//		$('#viewRecord').removeAttr('required');
    	 $('#leaderHeader').hide();
    	 $('div,span',tr).add(tr).hide();
    	 $('div,span',tr1).add(tr1).hide();
    	 $('div,span',tr2).add(tr2).hide();

    }
    
  //设置审批页面中字段为可读写
	setEditable();
});
function setEditable(){
	if(isApproveProcUnit()){//是审核中
		setTimeout(function(){
			UICtrl.enable('#beformalType');
			UICtrl.enable('#viewRecord');
			UICtrl.enable('#upLevelAverageScore');
			UICtrl.enable('#equelLevelAverageScore');
			UICtrl.enable('#lowLevelAverageScore');
			UICtrl.enable('#totalAverage');
			UICtrl.enable('#scoreMyself');
			
			setEnableFiletable();
		},0);
	}
}

function setEnableFiletable(){
	if(!Public.isReadOnly){
		$('#beFormalApplyFileList').fileList('enable');
	}
}

function  teacherPlanRecord(){
	var personMemberId=$('#personMemberId').val();
	var personMemberName=$('#personMemberName').val();
	
	parent.addTabItem({ 
		tabid: 'HRTeacherPlan'+personMemberName,
		text: '员工['+personMemberName+']的新员工试用期督导情况表',
		url: web_app.name + '/teacherPlanAction!forwardDetailList.do?personMemberId=' 
			+ personMemberId
		}); 
	
}

function trainRecord(){
	var personMemberId=$('#personMemberId').val();
	var personMemberName=$('#personMemberName').val();
	UICtrl.showFrameDialog({
		title:'员工['+personMemberName+']的培训结果记录',
		url: web_app.name + '/trainResultAction!forwardDetailList.do', 
		param:{personMemberId:personMemberId},
		height:290,
		width:650,
		ok:false,
		cancel:true
	});
}
function teacherScoreRecord(){
	var personMemberId=$('#personMemberId').val();
	var personMemberName=$('#personMemberName').val();
	UICtrl.showFrameDialog({
		title:'员工['+personMemberName+']的督导考核评分表',
		url: web_app.name + '/teacherScoreAction!forwardDetailList.do', 
		param:{personMemberId:personMemberId},
		height:290,
		width:650,
		ok:false,
		cancel:true
	});
}
/*function familyVisitRecord(){
	var personMemberId=$('#personMemberId').val();
	var personMemberName=$('#personMemberName').val();
	UICtrl.showFrameDialog({
		title:'员工['+personMemberName+']的家访记录',
		url: web_app.name + '/visitfamilyAction!forwardListFamilyVisitDetail.do', 
		param:{personMemberId:personMemberId},
		height:290,
		width:650,
		ok:false,
		cancel:true
	});}*/
function proEvaRecord(){
	var personMemberId=$('#personMemberId').val();
	var personMemberName=$('#personMemberName').val();
	UICtrl.showFrameDialog({
		title:'员工['+personMemberName+']的新员工试用期评价表',
		url: web_app.name + '/teacherScoreAction!forwardProEvaDetailList.do', 
		param:{personMemberId:personMemberId},
		height:290,
		width:650,
		ok:false,
		cancel:true
	});
}

function viewZZCPResultDetail(){
	var PSMId=$('#personMemberId').val();
	var personMemberName=$('#personMemberName').val();
	parent.addTabItem({ 
		tabid: 'HRScoreReault',
		text: personMemberName+'测评结果查看',
		url: web_app.name + '/performAssessResultAction!showDetail.do?PSMId=' 
			+ PSMId +'&periodCode='+'zzcp'
		}); 
}
function getId() {
	return $("#beFormalId").val() || 0;
}

function setId(value){
	$("#beFormalId").val(value);
    $('#beFormalApplyFileList').fileList({bizId:value});

}
function afterSave(){
	reloadGrid();
}
function reloadGrid() {
  
} 