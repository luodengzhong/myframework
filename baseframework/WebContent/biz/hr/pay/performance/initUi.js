function initializeDefaultUI(){
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodName').searchbox({
		type:'hr',name:'chooseOperationPeriod',
		getParam:function(){
			return {paramValue:$('#year').val(),organId:$('#organId').val()};
		},
		back:{periodId:'#periodId',periodName:'#periodName',periodBeginDate:'#periodBeginDate',periodEndDate:'#periodEndDate'}
	});
	$('#periodIndex').combox({data:{}});	
	$('#periodCode').combox({
			onChange:function(obj){
				setPriodIndex(obj.value);
			}
	});
	$('#periodCode').combox('setValue','quarter');
	setPriodIndex('quarter');//默认季度	 
}
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
	$('#periodIndex').combox('setValue','');
}