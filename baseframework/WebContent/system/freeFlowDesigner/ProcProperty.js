$(function () {
	setProperties();
	
    function setProperties(){
   	    var description = decodeURI(Public.getQueryStringByName("description"));
    	$("#description").val(description);
   }
});

function getProperties(){
	var result = {};
	result.description = $("#description").val();
	return result;
}
