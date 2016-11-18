$(document).ready(function() {
	var teacherTr=$('#teacherTr');
	 $('#staffName').searchbox({type:'hr',name:'entryCheckArchivesSelect',
		 	onChange:function(){
					$('#staffingLevel').combox('setValue');
					changeEntryDataTr($('#staffingLevel').val());
				var postRankSequenceId=$('#postRankSequenceId').val();
				var fullIdOneself=$('#fullIdOneself').val();
				var posId=$('#posId').val();
				var url=web_app.name+'/hrSetupAction!checkExistInSpecialPostsRank.ajax';
				Public.ajax(url,{postRankSequenceId:postRankSequenceId,fullId:fullIdOneself,positionId:posId},function(data){
					if(data=="true"){
					 $('#teacher').removeAttr('required');
		             $('div,span',teacherTr).add(teacherTr).hide();
					}else{
					 $('#teacher').attr('required',true);
			        $('div,span',teacherTr).add(teacherTr).show();
					}
				});
			
		 	},
			back:{archivesId:'#archivesId',ognId:'#ognId',dptId:'#dptId',
				centreId:'#centreId',posId:'#posId',staffingLevel:'#staffingLevel',
				staffKind:'#staffKind',dptName:'#dptName',posName:'#posName',fullId:'#fullIdOneself',
				staffingPostsRankSequence:'#postRankSequenceId',
				staffName:'#staffName',ognName:'#ognName',centreName:'#centreName'}
		});
	$('#staffingLevel').combox({onChange:function(o){
		changeEntryDataTr(o.value);
	}});
	var isExistsInSpecial=$('#isExistsInSpecial').val();
	   if(isExistsInSpecial=="true"){
					 $('#teacher').removeAttr('required');
		             $('div,span',teacherTr).add(teacherTr).hide();
					}else{
					 $('#teacher').attr('required',true);
			        $('div,span',teacherTr).add(teacherTr).show();
					}
	var staffKindV=$('#staffingLevel').val();
	function changeEntryDataTr(value){
		var tr=$('#entryNoId');
		if(value==4){
			$('#teacher').removeAttr('required');
		    $('div,span',tr).add(tr).hide();
		    $('div,span',teacherTr).add(teacherTr).hide();
		    
		}else{
			 $('div,span',tr).add(tr).show();
			 if(isExistsInSpecial=="true"){
			    $('#teacher').removeAttr('required');
			     $('div,span',teacherTr).add(teacherTr).hide();
			    }else{
			    $('#teacher').attr('required',true);
			     $('div,span',teacherTr).add(teacherTr).show();
			    }
		}
	}
	changeEntryDataTr(staffKindV);
	
	 $('#teacher').searchbox({type:'sys',name:'orgSelect',
			back:{personMemberId:'#teacherId',name:'#teacher'},
			param:{a:1,b:1,searchQueryCondition: " org_kind_id ='psm'  and instr(full_id, '.prj') = 0  and exists (select 0  from hr_archives s where s.person_id = person_id and s.state=1 and nvl(s.is_probation,0)=0) "}
		});
	
	   
});


function getId() {
	return $("#entryId").val() || 0;
}

function setId(value){
	$("#entryId").val(value);

}
function afterSave(){
	reloadGrid();
}

function reloadGrid() {
} 
