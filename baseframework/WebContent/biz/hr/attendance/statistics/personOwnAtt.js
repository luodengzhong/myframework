var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodName').searchbox({
		type:'hr',name:'chooseOperationPeriod',getParam:function(){
			return {paramValue:$('#year').val()};
		},back:{periodId:'#periodId',yearPeriodName:'#periodName'}
	});	
	$('#statKind').combox({
		onChange:function(obj){
			statKindChange(obj.value);
		}
	});
	statKindChange($('#statKind').val());
}
function statKindChange(kind){
	switch (parseInt(kind,10)) {
		case 1://年
			$.each(['periodName','dateBegin','dateEnd'],function(i,p){
				$('#'+p).parents('dl').hide();
			});
			$('#year').parents('dl').show();
			break;
    	case 2://期间
    		$.each(['dateBegin','dateEnd'],function(i,p){
				$('#'+p).parents('dl').hide();
			});
    		$('#periodName').parents('dl').show();
    		$('#year').parents('dl').show();
    		break;
    	case 3://时间
    		$.each(['dateBegin','dateEnd'],function(i,p){
				$('#'+p).parents('dl').show();
			});
    		$('#periodName').parents('dl').hide();
    		$('#year').parents('dl').hide();
    		break;
	}
}

//初始化表格
function initializeGrid(columns) {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
				{ display: "姓名", name: "staffName", width: 80, minWidth: 80, type: "string", align: "center",frozen: true },
				{ display: "期间", name: "periodName", width: 200, minWidth: 80, type: "string", align: "left",frozen: true },
				{ display: "未打卡次数", name: "withoutCard", width: 80, minWidth: 80, type: "string", align: "center" },	
				{ display: "打卡异常次数", name: "exceptionNumber", width:80, minWidth: 80, type: "string", align: "center" },	
				{ display: "病假天数", name: "sickLeave", width: 80, minWidth: 80, type: "string", align: "center" },
				{ display: "事假天数", name: "personalAffair", width: 80, minWidth: 80, type: "string", align: "center" },
				{ display: "产假天数", name: "maternityLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "婚假天数", name: "marriageLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "丧假天数", name: "funeralLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "年休假天数", name: "annualLeave", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "考试假天数", name: "examination", width: 80, minWidth: 80, type: "string", align: "center"},
				{ display: "陪产假天数", name: "accompanyMaternityleave", width: 80, minWidth: 80, type: "string", align: "center"},
		  		{ display: "周末加班天数", name: "weekendOvertime", width: 150, minWidth: 150, type: "string", align: "center" },		   
				{ display: "节假日加班天数", name: "holidayOvertime", width: 150, minWidth: 150, type: "string", align: "center" },	
				{ display: "一般加班天数", name: "commonOvertime", width: 150, minWidth: 150, type: "string", align: "lecenterft" },	
				{ display: "驾驶员晚上", name: "driverNight", width: 150, minWidth: 150, type: "string", align: "center" },
				{ display: "驾驶员夜班车", name: "driverNightBus", width: 150, minWidth: 150, type: "string", align: "center" },
				{ display: "迟到次数（15分钟内）", name: "late15", width: 80, minWidth: 80, type: "string", align: "center" },
				{ display: "迟到次数（16－30分钟）", name: "late1630", width: 150, minWidth: 150, type: "string", align: "center" },
				{ display: "迟到次数（31－60分钟）", name: "late3160", width: 150, minWidth: 150, type: "string", align: "center"},
				{ display: "迟到次数（60分钟以上）", name: "late61", width: 150, minWidth: 150, type: "string", align: "center"},
				{ display: "早退次数（15分钟内）", name: "leaveEarly15", width: 150, minWidth: 150, type: "string", align: "center"},
				{ display: "早退次数（16－30分钟）", name: "leaveEarly1630", width: 150, minWidth: 80, type: "string", align: "center"},
				{ display: "早退次数（31－60分钟）", name: "leaveEarly3160", width: 150, minWidth: 80, type: "string", align: "center" },	
				{ display: "早退次数（60分钟以上）", name: "leaveEarly61", width: 150, minWidth: 150, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/attStatisticsAction!slicedQueryAttPerson.ajax',
		parms:{archivesId:$('#mainArchivesId').val()},
		delayLoad:true,
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'id',
		sortOrder:'desc',
		heightDiff : -10,
		headerRowHeight : 25,
		delayLoad:true,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	query($('#queryGridForm'));
}

//查询
function query(obj) {
	var param = $(obj).formToJSON();
	var statKind=parseInt(param['statKind'],10);
	var parms={};
	if(isNaN(statKind)||statKind==1){
		parms['year']=param['year'];
		parms['periodId']='';
		parms['dateBegin']='';
		parms['dateEnd']='';
	}else if(statKind==2){
		parms['year']=param['year'];
		parms['periodId']=param['periodId'];
		parms['dateBegin']='';
		parms['dateEnd']='';
	}else{
		parms['dateBegin']=param['dateBegin'];
		parms['dateEnd']=param['dateEnd'];
		parms['year']='';
		parms['periodId']='';
	}
	UICtrl.gridSearch(gridManager, parms);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}
