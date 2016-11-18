$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	UICtrl.autoGroupAreaToggle();
	 $('#interviewerName').searchbox({ type:"hr", name: "resignationChoosePerson",
			back:{
				archivesId:"#interviewerId",staffName:"#interviewerName"
			    }
	 });
	 setEditable();
	$('#periodIndex').combox({checkbox:false,data:{1:'1季度',
			2:'2季度',
			3:'3季度',
			4:'4季度'}});
	var value =$('#periodCode').combox().val(); 
	setPriodIndex(value);	 
	$('#periodCode').combox({
			onChange:function(obj){
				var value = obj.value;
				$('#periodIndex').combox().html('');
				setPriodIndex(value);
			}
		});	
		
});


function setPriodIndex(value){
	if("month"==value){
		$('#periodIndex').combox('setData',{
			1:'1月',
			2:'2月',
			3:'3月',
			4:'4月',
			5:'5月',
			6:'6月',
			7:'7月',
			8:'8月',
			9:'9月',
			10:'10月',
			11:'11月',
			12:'12月'
		});
	}else if("quarter"==value){
		$('#periodIndex').combox('setData',{
			1:'1季度',
			2:'2季度',
			3:'3季度',
			4:'4季度'
		});
	}else {
		$('#periodIndex').combox('setData',{});					
	}				
}
function  setEditable() {
	if(isApproveProcUnit()){//是审核中
		setTimeout(function(){
			UICtrl.enable('#interviewTime');
			UICtrl.enable('#interviewLocation');
			UICtrl.enable('#interviewRecord');
			//UICtrl.enable('#yearImprovePlan');
		},0);
	}
}


function getExtendedData(){
	var  al=$('#advantage');
	var  il=$('#improve');
	var advantageExtendedData = getAdvantageData(al);
	var improveExtendedData = getAdvantageData(il);
	if (!advantageExtendedData) {
		return false;
	}
	if (!advantageExtendedData) {
		return false;
	}
	return {
		advantageExtendedData : encodeURI($.toJSON(advantageExtendedData)),
		improveExtendedData : encodeURI($.toJSON(improveExtendedData))
	};

}

function getAdvantageData(el){
	var values=[], detailType,auditId,interviewDetailId,item,content,target;
	el.find('tr').each(function(){
		detailType=$(this).find('input[name="detailType"]').val();
		auditId=$(this).find('input[name="auditId"]').val();
		interviewDetailId=$(this).find('input[name="interviewDetailId"]').val();
		item=$(this).find('input[name="item"]').val();
		content=$(this).find('input[name="content"]').val();
		target=$(this).find('input[name="target"]').val();

		values.push({detailType:detailType,auditId:auditId,interviewDetailId:interviewDetailId,item:item,content:content,target:target});
		
		
	});
	return values;
}



function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
    $('#advantage').find('tr').each(function(){
        $(this).find('input[name="auditId"]').val(value);
       });
  
	 $('#improve').find('tr').each(function(){
        $(this).find('input[name="auditId"]').val(value);
       });
   
}
