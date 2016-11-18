var gridManager = null;

$(document).ready(function() {

	 /*$('#oldTeacher').searchbox({type:'sys',name:'orgSelect', 
			back:{id:'#oldTeacherId',name:'#oldTeacher',
			     deptId:'#oldTeacherDptId',deptName:'#oldTeacherDptNam',positionId:'#oldTeacherPosId',positionName:'#oldTeacherPosName'},
			param:{a:1, b:1, searchQueryCondition: " org_kind_id ='psm' and instr(full_id, '.prj') = 0 "}
		});*/
	 
	 $('#newTeacher').searchbox({type:'sys',name:'orgSelect',
			param:{a:1,b:1,searchQueryCondition: " org_kind_id ='psm'  and instr(full_id, '.prj') = 0  and exists (select 0  from hr_archives s where s.person_id = person_id and s.state=1 and nvl(s.is_probation,0)=0 )"},
			back:{id:'#newTeacherId',name:'#newTeacher',
			     deptId:'#newTeacherDptId',deptName:'#newTeacherDptName',positionId:'#newTeacherPosId',positionName:'#newTeacherPosName'}
			  
			    
		});
	
});

function getId() {
	return $("#changeTeacherId").val() || 0;
}

function setId(value){
	$("#changeTeacherId").val(value);
}
function afterSave(){
	reloadGrid();
}

function reloadGrid() {
} 