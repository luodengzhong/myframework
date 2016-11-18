$(document).ready(function() {
	$('#staffingLevel').combox({onChange:function(o){
		changeEntryDataTr(o.value);
	}});
	var staffKindV=$('#staffingLevel').val();
	function changeEntryDataTr(value){
		var tr=$('#entryNoId');
		var teacherTr=$('#teacherTr');
		if(value==4){
			$('#teacher').removeAttr('required');
		    $('div,span',tr).add(tr).hide();
		    $('div,span',teacherTr).add(teacherTr).hide();

		}else{
			$('#teacher').attr('required',true);
			 $('div,span',tr).add(tr).show();
			 $('div,span',teacherTr).add(teacherTr).show();

		}
	}
	changeEntryDataTr(staffKindV);
}
	
);
	

function save(){
	
		$('#submitForm').ajaxSubmit({url: web_app.name + '/entryCheckAction!insert.ajax',
			success : function(data) {
				$('#entryId').val(data);
			}
		});
}

function advance(){
	
		$('#submitForm').ajaxSubmit({url: web_app.name + '/entryCheckAction!submit.ajax',
			success : function() {
				UICtrl.closeAndReloadTabs("TaskCenter", null);
			}
		});
			
	
}


