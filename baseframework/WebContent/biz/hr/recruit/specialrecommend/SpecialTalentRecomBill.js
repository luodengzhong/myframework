$(document).ready(function() {
	 $('#personMemberName').searchbox({type:'sys',name:'orgSelect',
			back:{personMemberId:'#personMemberId',name:'#personMemberName',orgName:'#organName',
			orgId:'#organId',positionId:'#positionId',positionName:'#positionName',deptName:'#deptName',deptId:'#deptId',fullId:'#fullId'},
			param:{a:1,b:1,searchQueryCondition: " org_kind_id ='psm' and instr(full_id, '.prj') = 0 "}
});
	$('#HRSpecialTalentRecomFileList').fileList();
	setEditable();
});

function setEditable(){
	if(isApproveProcUnit()){//是审核中
		setTimeout(function(){
	      if(!Public.isReadOnly){
		    $('#HRSpecialTalentRecomFileList').fileList('enable');
        }
		},0);
	}
}
function getId() {
	return $("#recomId").val() || 0;
}

function setId(value){
	$("#recomId").val(value);
	 $('#HRSpecialTalentRecomFileList').fileList({bizId:value});

}
function afterSave(){
	reloadGrid();
}

function reloadGrid() {
} 