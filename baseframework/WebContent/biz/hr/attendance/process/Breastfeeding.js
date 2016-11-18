var gridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	cancelIsReadHandleResult();
});

function getId() {
	return $("#breastfeedingApplyId").val() || 0;
}

function setId(value){
	$("#breastfeedingApplyId").val(value);
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
		{ display: "开始时间", name: "startDate", width: 180, minWidth: 60, type: "datetime", align: "left",
			editor: { type: 'dateTime', required: true}
		},		   
		{ display: "结束时间时间", name: "endDate", width: 180, minWidth: 60, type: "datetime", align: "left",
			editor: { type: 'dateTime', required: true}	
		}
		],
		dataAction : 'server',
		url: web_app.name+'/attBreastfeedingAction!slicedQueryDetail.ajax',
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
	DataUtil.delSelectedRows({ action:'attBreastfeedingAction!delete.ajax', 
		gridManager: gridManager, idFieldName: 'leaveId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}

function addDateFast(){
	//取下午下班时间
	var startTime='17:00',endTime='18:00';
	try{
		var ondutyTime=ContextUtil.getOperator('ondutyTime');
		if(!Public.isBlank(ondutyTime)){
			var workTime=ondutyTime.split(',');
			if(workTime.length==4){
				endTime=workTime[3];
				startTime=parseInt(endTime,10)-1+':00';
			}
		}
	}catch(e){
	}
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
    html.push("<dt style='width:40px'>时间<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:60px'>");
    html.push("<input type='text' class='text' name='fastStartTime' required='true' maxlength='20' mask='29:59' value='",startTime,"' label='开始时间'/>");
    html.push("</dd>");
    html.push("</dl><dl>");
    html.push("<dt style='width:25px'>至<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:60px'>");
    html.push("<input type='text' class='text' name='fastEndTime' required='true' maxlength='20' mask='29:59' value='",endTime,"' label='结束时间'/>");
    html.push("</dd>");
    html.push("</dl></div>");
	html.push('</form>','</div>');
	UICtrl.showDialog( {
		width:270,
		top:100,
		title : '快速日期时间选择',
		height:120,
		content:html.join(''),
		ok : function(){
			var param=$('#addDateFastForm').formToJSON();
			if(!param) return;
			if(Public.compareDate(param['fastStartDate'],param['fastEndDate'])){
				Public.tip("开始日期不能大于结束日期!");
				return;
			}
			if(Public.compareDate(param['fastStartTime'],param['fastEndTime'])){
				Public.tip("开始时间不能大于结束时间!");
				return;
			}
			//时间不能超过一个月
			var dateDiff=Public.dateDiff('day',param['fastEndDate'],param['fastStartDate']);
			if(dateDiff>31){
				Public.tip("时间不能超过一个月!");
				return;
			}
			//判断时间不能大于1个小时
			var temp1=Public.parseDate(param['fastStartDate']+' '+param['fastStartTime'],'%Y-%M-%D %H:%I');
			var temp2=Public.parseDate(param['fastStartDate']+' '+param['fastEndTime'],'%Y-%M-%D %H:%I');
			var mius=temp2.getTime()-temp1.getTime();
			mius=mius/(1000*60);
			if(mius>60){//大于60分钟
				Public.tip("哺乳假每天不能超过1小时!");
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
		    			startDate:Public.formatDate(tempDate)+' '+param['fastStartTime'],
		    			endDate:Public.formatDate(tempDate)+' '+param['fastEndTime']
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
	return {detailData:encodeURI($.toJSON(detailData))};
}