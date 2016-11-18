var gridManager = null, refreshFlag = false, freeFlowDesiger;
$(document).ready(function() {
	$("#btnSelectPerson").click(function() {
		counterSign();
	});
	projectNewSelect();
});

function getId() {
	return $("#id").val();
}

function setId(value) {
	$("#id").val(value);
}

function getFlowKind(){
	return FlowKind.FULL_FREE;
}
