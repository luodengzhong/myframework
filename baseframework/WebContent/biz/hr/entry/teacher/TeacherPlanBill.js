$(document).ready(function() {
	$('#deleteProcessInstance,#deleteProcessInstance_line').hide();
	var sendTimes=$('#sendTimes').val();
	var staffEvaTr=$('#forStaffEvaTr');
	var teacherEvaTr=$('#forTeacherEvaTr');
	if(sendTimes==2){
        $('#forStaffEva').removeAttr('required');
		$('#forTeacherEva').removeAttr('required');
		$('div,span',staffEvaTr).add(staffEvaTr).hide();
		$('div,span',teacherEvaTr).add(teacherEvaTr).hide();
        UICtrl.setReadOnly($('#oneIsFinished').parent());
        UICtrl.setReadOnly($('#twoIsFinished').parent());
        UICtrl.setReadOnly($('#threeIsFinished').parent());	
      }else if(sendTimes==3){
      	$('#forTeacherEva').removeAttr('required');
		$('div,span',teacherEvaTr).add(teacherEvaTr).hide();
		
	  if(isApproveProcUnit()){//是审核中
		setTimeout(function(){
			$('#forTeacherEva').attr('required',true);
			$('div,span',teacherEvaTr).add(teacherEvaTr).show();
			UICtrl.enable('#forTeacherEva');
		},0);
	 }

      }
});

  function getId() {
	return $("#teacherPlanId").val() || 0;
}

function setId(value){
	$("#teacherPlanId").val(value);
}
function afterSave(){
	reloadGrid();
}

function reloadGrid() {
} 