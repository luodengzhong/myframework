var gridManager=null,overtimeKind={};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	overtimeKind=$('#overtimeKindId').combox('getJSONData');
	initializeGrid();
	cancelIsReadHandleResult();
});

function getId() {
	return $("#batchOvertimeId").val() || 0;
}

function setId(value){
	$("#batchOvertimeId").val(value);
	gridManager.options.parms['parentId'] = value;
}

function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addDateFast:{id:'addDateFast',text:'快速选择时间',img:'page_dynamic.gif',click:addDateFast},
		addHandler: addHandler, 
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "加班时间", name: "startDate", width: 180, minWidth: 60, type: "date", align: "left",
			editor: { type: 'date', required: true}
		},		   
		{ display: "加班类型", name: "overtimeKindId", width: 180, minWidth: 60, type: "datetime", align: "left",
			editor: { type:'combobox',data:overtimeKind,required: true},
			render: function (item) { 
				return overtimeKind[item.overtimeKindId];
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/attBatchOvertimeAction!slicedQueryDetail.ajax',
		parms:{ parentId: getId(),pagesize:1000},
		usePager: false,
		width : '98.8%',
		sortName:"startDate",
		sortOrder: "asc",
		height : 400,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRowByKeydown:false,
		autoAddRow:{parentId:""},
		enabledEdit: true,
		checkbox: true,
		onLoadData: function(){
			return (getId() > 0);
		}
	});
}

function addHandler() {
	UICtrl.addGridRow(gridManager);
}

function reloadGrid() {
	gridManager.loadData();
} 

function deleteHandler(){
	DataUtil.delSelectedRows({ action:'attBatchOvertimeAction!delete.ajax', 
		gridManager: gridManager, idFieldName: 'overtimeId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}

function addDateFast(){
	var html=['<div class="ui-form">','<form method="post" action="" id="addDateFastForm">'];
	html.push("<div class='row'><font color=red>","选择的日期自动排除周末，如有特殊日期请单独添加!","</font></div>");
	html.push("<div class='row'><dl>");
    html.push("<dt style='width:75px'>开始日期<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' name='fastStartDate' required='true' maxlength='20'  date='true' label='开始日期'/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<div class='row'><dl>");
    html.push("<dt style='width:75px'>结束日期<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' name='fastEndDate' required='true' maxlength='20' date='true' label='结束日期'/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<div class='row'><dl>");
    html.push("<dt style='width:75px'>加班类型<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' name='fastOvertimeKindId' id='fastOvertimeKindId' required='true' label='加班类型'/>");
    html.push("</dd>");
    html.push("</dl></div>");
	html.push('</form>','</div>');
	UICtrl.showDialog( {
		width:270,
		top:100,
		title : '快速日期时间选择',
		height:120,
		content:html.join(''),
		init:function(){
			$('#fastOvertimeKindId').combox({data:overtimeKind});
		},
		ok : function(){
			var param=$('#addDateFastForm').formToJSON();
			if(!param) return;
			/*if(Public.compareDate(param['fastStartDate'],param['fastEndDate'])){
				Public.tip("开始日期不能大于结束日期!");
				return;
			}*/
			if(!Public.compareDate(param['fastEndDate'],param['fastStartDate'])){
				Public.tip("开始日期不能大于结束日期!");
				return;
			}
			//时间不能超过一个月
			var dateDiff=Public.dateDiff('day',param['fastEndDate'],param['fastStartDate']);
			if(dateDiff>31){
				Public.tip("时间不能超过一个月!");
				return;
			}
			//初始化时间
			var startDate=Public.parseDate(param['fastStartDate'],'%Y-%M-%D');
			var endDate=Public.parseDate(param['fastEndDate'],'%Y-%M-%D');
			var tempDate=startDate,datas=[];
			//循环添加日期
		    while(Public.compareDate(Public.formatDate(endDate),Public.formatDate(tempDate))){
		    	if(tempDate.getDay()!=6 && tempDate.getDay()!=0){//排除周末
		    		datas.push({
		    			startDate:Public.formatDate(tempDate)+' '+'17:00',
		    			endDate:Public.formatDate(tempDate)+' '+'23:00',
		    			overtimeKindId:param['fastOvertimeKindId']
		    		});
		    	}
		    	tempDate=Public.dateAdd('d',1,tempDate);
		    }
			if(datas.length>0){
				gridManager.addRows(datas);
			}
			return true;
		}
	});
}

function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	var startDate=null,endDate=null;
	$.each(detailData,function(i,o){
		endDate=o['endDate'];
		startDate=o['startDate'];
		if(Public.isBlank(endDate)){
			o['startDate']=startDate+' '+'17:00';
			o['endDate']=startDate+' '+'23:00';
		}
	});
	return {detailData:encodeURI($.toJSON(detailData))};
}