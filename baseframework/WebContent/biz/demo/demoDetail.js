$(document).ready(function() {
	$.getFormButton([{name:'aaaa',event:function(){
		alert(222);
	}},{name:'哈哈'}]);
	//abc();
	//UICtrl.autoGroupAreaToggle();
	var fileTable=$('#testTableFileList').fileList();
	fileTable.find('table').css({borderTopWidth:0});
	$('#testTableFileListInTable').fileList();
	
    $("a.togglebtn").click(function () {
    	   $(".tableInput").hide();

    	  	var hideTable=$(this).attr('hideTable');
    	    if(!Public.isBlank(hideTable)){
    		$.each(hideTable.split(','),function(i,expr){
    			$(expr).toggle();
    		 });
    	 }
    	 
    	 $(this).toggleClass('togglebtn-down');
    });
});
