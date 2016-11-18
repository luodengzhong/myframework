$(document).ready(function() {
    $('#specialFamilyVisitFileList').fileList();
});

function getId() {
	return $("#specialId").val() || 0;
}

function setId(value){
	$("#specialId").val(value);
    $('#specialFamilyVisitFileList').fileList({bizId:value});
}
function afterSave(){
	reloadGrid();
}

function reloadGrid() {
} 
