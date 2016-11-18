
function getId() {
	return $("#jobApplyId").val() || 0;
}

function setId(value){
	$("#jobApplyId").val(value);
}


function afterSave(data){
	Public.tip(data);
}
