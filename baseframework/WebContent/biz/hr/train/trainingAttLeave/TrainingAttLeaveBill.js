$(document).ready(function() {
	var personId=$('#personId').val();
	  $('#trainingCourseName').searchbox({ type:"hr",name: "staffSelectTrainingCourse",
			back:{
				trainingClassCourseId:"#trainingClassCourseId",name:"#trainingCourseName",
				courseStartTime:"#startDate",courseEndTime:'#endDate'
				},
				getParam:function(){
		   		return{searchQueryCondition:"person_id ="+"'"+personId+"'"};
		   		}
	 });
});

function getId() {
	return $("#leaveId").val() || 0;
}
function setId(value){
	$("#leaveId").val(value);
}